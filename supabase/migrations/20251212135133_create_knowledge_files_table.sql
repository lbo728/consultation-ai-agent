-- Create knowledge_files table for RAG document storage
CREATE TABLE IF NOT EXISTS public.knowledge_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  gemini_file_search_store_name TEXT,
  gemini_document_name TEXT
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_knowledge_files_user_id ON public.knowledge_files(user_id);

-- Enable Row Level Security
ALTER TABLE public.knowledge_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own files
CREATE POLICY "Users can view their own knowledge files"
  ON public.knowledge_files
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own knowledge files"
  ON public.knowledge_files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge files"
  ON public.knowledge_files
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge files"
  ON public.knowledge_files
  FOR DELETE
  USING (auth.uid() = user_id);
