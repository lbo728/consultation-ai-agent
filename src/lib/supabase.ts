import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Supabase 클라이언트 생성
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 서버 사이드에서 사용할 Supabase 클라이언트 (service role)
export function getServiceSupabase() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// API Route에서 사용할 Supabase 클라이언트 (쿠키 기반 인증)
export async function getServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Cookie 설정 실패 시 무시 (읽기 전용 모드)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Cookie 삭제 실패 시 무시 (읽기 전용 모드)
          }
        },
      },
    }
  );
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          session_token: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_token: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_token?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
      file_search_stores: {
        Row: {
          id: string;
          user_id: string;
          store_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          store_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          store_name?: string;
          created_at?: string;
        };
      };
      knowledge_files: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          content: string;
          size: number;
          gemini_file_search_store_name: string | null;
          gemini_document_name: string | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          content: string;
          size: number;
          gemini_file_search_store_name?: string | null;
          gemini_document_name?: string | null;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          content?: string;
          size?: number;
          gemini_file_search_store_name?: string | null;
          gemini_document_name?: string | null;
          uploaded_at?: string;
        };
      };
      brand_tones: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          instruction_content: string;
          is_default: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          instruction_content: string;
          is_default?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          instruction_content?: string;
          is_default?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_email_slack_config: {
        Row: {
          user_id: string;
          slack_webhook_url: string | null;
          inbound_email_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          slack_webhook_url?: string | null;
          inbound_email_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          slack_webhook_url?: string | null;
          inbound_email_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inbound_emails: {
        Row: {
          id: string;
          user_id: string;
          from_email: string;
          subject: string | null;
          raw_text: string | null;
          raw_html: string | null;
          extracted_questions: any; // JSONB
          ai_answers: any; // JSONB
          received_at: string;
          processed_at: string | null;
          slack_notified_at: string | null;
          processing_status: 'pending' | 'processing' | 'completed' | 'failed';
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          from_email: string;
          subject?: string | null;
          raw_text?: string | null;
          raw_html?: string | null;
          extracted_questions?: any;
          ai_answers?: any;
          received_at?: string;
          processed_at?: string | null;
          slack_notified_at?: string | null;
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          from_email?: string;
          subject?: string | null;
          raw_text?: string | null;
          raw_html?: string | null;
          extracted_questions?: any;
          ai_answers?: any;
          received_at?: string;
          processed_at?: string | null;
          slack_notified_at?: string | null;
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
