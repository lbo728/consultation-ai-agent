-- Create file_search_stores table for tracking user-specific Gemini File Search Stores
CREATE TABLE IF NOT EXISTS public.file_search_stores (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.file_search_stores ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own store
CREATE POLICY "Users can view their own file search store"
  ON public.file_search_stores
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own file search store"
  ON public.file_search_stores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file search store"
  ON public.file_search_stores
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file search store"
  ON public.file_search_stores
  FOR DELETE
  USING (auth.uid() = user_id);
