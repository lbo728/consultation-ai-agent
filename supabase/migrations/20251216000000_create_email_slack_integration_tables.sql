-- Migration: Email-Slack Integration Tables
-- Description: Add support for inbound email processing and Slack notifications

-- Create user_email_slack_config table for storing email and Slack integration settings
CREATE TABLE IF NOT EXISTS user_email_slack_config (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slack_webhook_url TEXT,
  inbound_email_address TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE user_email_slack_config IS 'Stores user-specific email and Slack integration settings';
COMMENT ON COLUMN user_email_slack_config.slack_webhook_url IS 'Brand-specific Slack webhook URL for notifications';
COMMENT ON COLUMN user_email_slack_config.inbound_email_address IS 'Unique email address for receiving forwarded customer inquiries (e.g., brandname@inbound.your-saas.ai)';

-- Create inbound_emails table for storing received customer inquiry emails
CREATE TABLE IF NOT EXISTS inbound_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Email metadata
  from_email TEXT NOT NULL,
  subject TEXT,

  -- Raw email content (both formats)
  raw_text TEXT,
  raw_html TEXT,

  -- Processing results
  extracted_questions JSONB DEFAULT '[]'::jsonb,
  ai_answers JSONB DEFAULT '[]'::jsonb,

  -- Timestamps
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  slack_notified_at TIMESTAMPTZ,

  -- Status tracking
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,

  -- Indexes for efficient queries
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_inbound_emails_user_id ON inbound_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_received_at ON inbound_emails(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_processing_status ON inbound_emails(processing_status);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_user_received ON inbound_emails(user_id, received_at DESC);

-- Add comment for documentation
COMMENT ON TABLE inbound_emails IS 'Stores inbound customer inquiry emails for AI processing and Slack notifications';

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
CREATE TRIGGER update_inbound_emails_updated_at
  BEFORE UPDATE ON inbound_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
