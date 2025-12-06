# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI-powered customer consultation agent built with Next.js, supporting RAG (Retrieval-Augmented Generation) using both OpenAI and Google Gemini APIs. The application provides brand-specific customer support through uploaded knowledge documents.

## Development Commands

### Running the application
```bash
npm run dev        # Start development server on http://localhost:3000
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **AI SDKs**:
  - `@google/genai` (v1.30.0) - Primary RAG implementation using Gemini File Search
  - OpenAI SDK (v6.9.1) - Legacy simple RAG endpoint
- **UI**: React 19, Tailwind CSS 4, lucide-react icons
- **Auth**: Custom cookie-based sessions with bcrypt password hashing

### Data Storage Pattern

**Uses Supabase PostgreSQL** for persistent data storage:
- Users table with custom authentication (username/password_hash)
- Sessions table for cookie-based session management
- Knowledge files table for uploaded documents
- File search stores table for Gemini File Search Store mapping

All database operations use the Supabase client with service role key for server-side operations.

```typescript
// Pattern used in src/lib/auth.ts, src/lib/session.ts, src/lib/knowledge.ts
import { getServiceSupabase } from '@/lib/supabase';

const supabase = getServiceSupabase();
const { data, error } = await supabase.from('users').select('*');
```

### Authentication Flow

1. Custom authentication (not using Supabase Auth)
2. Cookie-based sessions (7-day expiration) stored in `sessions` table
3. Session validation via `getSession(sessionId)` from cookies
4. Admin routes protected by `/admin/layout.tsx` client-side auth check
5. Session management in `src/lib/session.ts`, user management in `src/lib/auth.ts`
6. All auth operations use Supabase service role key for direct database access

### RAG Implementation

The application has **two RAG endpoints** with different approaches:

#### 1. Legacy Simple RAG: `/api/rag-qna` (OpenAI)
- Takes file upload + query in single request
- Reads file content and passes to GPT-4o context
- No persistent knowledge storage
- Uses `BRAND_TONE_INSTRUCTION` for Decozio brand voice

#### 2. Production RAG: `/api/rag-qna-admin` (Google Gemini File Search)
- Uses Google Gemini File Search API for true vector-based RAG
- **File Upload Flow** (`/api/knowledge/upload`):
  1. Creates user-specific File Search Store (one per user)
  2. Writes file to temp location (required by Gemini API)
  3. Uploads to File Search Store via `ai.fileSearchStores.uploadToFileSearchStore()`
  4. Polls operation status until `operation.done === true`
  5. Stores metadata in Supabase `knowledge_files` table
  6. Cleans up temp file
- **Query Flow**:
  1. Retrieves user's File Search Store name from Supabase
  2. Calls `ai.models.generateContent()` with `fileSearch` tool configured
  3. Gemini automatically retrieves relevant chunks from uploaded documents

### Key Files

- `src/lib/supabase.ts` - Supabase client configuration and Database types
- `src/lib/auth.ts` - User management (Supabase users table)
- `src/lib/session.ts` - Session management (Supabase sessions table)
- `src/lib/knowledge.ts` - Knowledge file metadata and File Search Store tracking (Supabase)
- `src/app/api/knowledge/upload/route.ts` - File upload to Gemini File Search
- `src/app/api/rag-qna-admin/route.ts` - RAG queries using Gemini File Search
- `src/app/admin/layout.tsx` - Admin panel wrapper with auth and navigation

### Environment Variables

Required in `.env.local`:
```
OPENAI_API_KEY=sk-...                              # For legacy /api/rag-qna endpoint
GOOGLE_AI_API_KEY=AIza...                          # For Gemini File Search RAG
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co   # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...               # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=eyJ...                   # Supabase service role key (server-side)
```

See `SETUP_SUPABASE.md` for detailed setup instructions.

### Import Aliases

Use `@/*` to import from `src/*`:
```typescript
import { getSession } from '@/lib/session';
import { createKnowledgeFile } from '@/lib/knowledge';
```

### Brand Configuration

Brand tone is defined in `BRAND_TONE_INSTRUCTION` constant in both RAG route files. Current brand: "Decozio" (맞춤제작 커튼 전문업체). Update this constant to change brand voice/guidelines.

## Production Readiness

Current production features:
- ✅ Supabase PostgreSQL database for persistent storage
- ✅ Custom authentication with bcrypt password hashing
- ✅ Cookie-based session management with 7-day expiration
- ✅ User-specific File Search Stores for RAG
- ✅ Knowledge file metadata stored in database

To enhance for production:
1. Add user roles/permissions system
2. Implement Redis-based session store for better scalability
3. Add rate limiting and API request throttling
4. Add file validation, size limits, and virus scanning for uploads
5. Implement proper error boundaries and monitoring (Sentry, etc.)
6. Add automated session cleanup (cron job or Supabase Edge Functions)
7. Implement audit logging for sensitive operations
