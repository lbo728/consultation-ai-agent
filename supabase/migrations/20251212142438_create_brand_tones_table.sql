-- Create brand_tones table for storing customizable brand tone instructions
CREATE TABLE IF NOT EXISTS public.brand_tones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  instruction_content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_brand_tones_user_id ON public.brand_tones(user_id);

-- Create index for finding default tones
CREATE INDEX IF NOT EXISTS idx_brand_tones_user_default ON public.brand_tones(user_id, is_default);

-- Enable Row Level Security
ALTER TABLE public.brand_tones ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own brand tones
CREATE POLICY "Users can view their own brand tones"
  ON public.brand_tones
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brand tones"
  ON public.brand_tones
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand tones"
  ON public.brand_tones
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand tones"
  ON public.brand_tones
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_brand_tones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER set_brand_tones_updated_at
  BEFORE UPDATE ON public.brand_tones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_brand_tones_updated_at();

-- Function to ensure only one default tone per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_brand_tone()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.brand_tones
    SET is_default = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single default tone constraint
CREATE TRIGGER enforce_single_default_brand_tone
  AFTER INSERT OR UPDATE ON public.brand_tones
  FOR EACH ROW
  WHEN (NEW.is_default = true)
  EXECUTE FUNCTION public.ensure_single_default_brand_tone();
