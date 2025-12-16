import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

/**
 * GET /api/email-slack/config
 *
 * Get current email and Slack integration configuration for the logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceSupabase();

    // Get user's email-Slack config
    const { data: config, error } = await supabase
      .from('user_email_slack_config')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('[Email-Slack Config] Error fetching config:', error);
      return NextResponse.json(
        { error: 'Failed to fetch configuration' },
        { status: 500 }
      );
    }

    // Return empty config if not found
    if (!config) {
      return NextResponse.json({
        slack_webhook_url: null,
        inbound_email_address: null,
      });
    }

    return NextResponse.json({
      slack_webhook_url: config.slack_webhook_url,
      inbound_email_address: config.inbound_email_address,
    });

  } catch (error) {
    console.error('[Email-Slack Config] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/email-slack/config
 *
 * Update email and Slack integration configuration for the logged-in user
 *
 * Request body:
 * {
 *   slack_webhook_url?: string | null,
 *   inbound_email_address?: string | null
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slack_webhook_url, inbound_email_address } = body;

    // Validate inbound_email_address format if provided
    if (inbound_email_address) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inbound_email_address)) {
        return NextResponse.json(
          { error: 'Invalid email address format' },
          { status: 400 }
        );
      }
    }

    // Validate slack_webhook_url format if provided
    if (slack_webhook_url) {
      try {
        const url = new URL(slack_webhook_url);
        if (!url.hostname.includes('hooks.slack.com')) {
          return NextResponse.json(
            { error: 'Invalid Slack webhook URL. Must be from hooks.slack.com' },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid Slack webhook URL format' },
          { status: 400 }
        );
      }
    }

    const supabase = getServiceSupabase();

    // Upsert configuration
    const { data, error } = await supabase
      .from('user_email_slack_config')
      .upsert({
        user_id: user.id,
        slack_webhook_url: slack_webhook_url || null,
        inbound_email_address: inbound_email_address?.toLowerCase() || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[Email-Slack Config] Error updating config:', error);

      // Handle unique constraint violation (duplicate inbound_email_address)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This inbound email address is already in use by another user' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to update configuration' },
        { status: 500 }
      );
    }

    console.log('[Email-Slack Config] Configuration updated successfully for user:', user.id);

    return NextResponse.json({
      success: true,
      config: {
        slack_webhook_url: data.slack_webhook_url,
        inbound_email_address: data.inbound_email_address,
      },
    });

  } catch (error) {
    console.error('[Email-Slack Config] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
