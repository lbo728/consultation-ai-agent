import { getServiceSupabase } from '@/lib/supabase';

export interface KnowledgeFile {
  id: string;
  userId: string;
  name: string;
  content: string;
  size: number;
  uploadedAt: Date;
  geminiFileSearchStoreName?: string;
  geminiDocumentName?: string;
}

export interface UserFileSearchStore {
  userId: string;
  storeName: string;
  createdAt: Date;
}

export async function createKnowledgeFile(
  userId: string,
  name: string,
  content: string
): Promise<KnowledgeFile> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('knowledge_files')
    .insert({
      user_id: userId,
      name,
      content,
      size: content.length,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`지식 파일 생성 실패: ${error.message}`);
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    content: data.content,
    size: data.size,
    uploadedAt: new Date(data.uploaded_at),
    geminiFileSearchStoreName: data.gemini_file_search_store_name || undefined,
    geminiDocumentName: data.gemini_document_name || undefined,
  };
}

export async function getKnowledgeFilesByUserId(userId: string): Promise<KnowledgeFile[]> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('knowledge_files')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`지식 파일 조회 실패: ${error.message}`);
  }

  return data.map((file) => ({
    id: file.id,
    userId: file.user_id,
    name: file.name,
    content: file.content,
    size: file.size,
    uploadedAt: new Date(file.uploaded_at),
    geminiFileSearchStoreName: file.gemini_file_search_store_name || undefined,
    geminiDocumentName: file.gemini_document_name || undefined,
  }));
}

export async function getKnowledgeFileById(id: string): Promise<KnowledgeFile | undefined> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('knowledge_files')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return undefined;
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    content: data.content,
    size: data.size,
    uploadedAt: new Date(data.uploaded_at),
    geminiFileSearchStoreName: data.gemini_file_search_store_name || undefined,
    geminiDocumentName: data.gemini_document_name || undefined,
  };
}

export async function deleteKnowledgeFile(id: string, userId: string): Promise<boolean> {
  const supabase = getServiceSupabase();

  const { error } = await supabase
    .from('knowledge_files')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  return !error;
}

export function getKnowledgeFileSafeData(file: KnowledgeFile) {
  return {
    id: file.id,
    name: file.name,
    size: file.size,
    uploadedAt: file.uploadedAt,
  };
}

export async function createUserFileSearchStore(
  userId: string,
  storeName: string
): Promise<UserFileSearchStore> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('file_search_stores')
    .insert({
      user_id: userId,
      store_name: storeName,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`파일 검색 저장소 생성 실패: ${error.message}`);
  }

  return {
    userId: data.user_id,
    storeName: data.store_name,
    createdAt: new Date(data.created_at),
  };
}

export async function getUserFileSearchStore(
  userId: string
): Promise<UserFileSearchStore | undefined> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('file_search_stores')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return undefined;
  }

  return {
    userId: data.user_id,
    storeName: data.store_name,
    createdAt: new Date(data.created_at),
  };
}

export async function updateKnowledgeFileGeminiInfo(
  fileId: string,
  geminiFileSearchStoreName: string,
  geminiDocumentName: string
): Promise<void> {
  const supabase = getServiceSupabase();

  const { error } = await supabase
    .from('knowledge_files')
    .update({
      gemini_file_search_store_name: geminiFileSearchStoreName,
      gemini_document_name: geminiDocumentName,
    })
    .eq('id', fileId);

  if (error) {
    throw new Error(`지식 파일 Gemini 정보 업데이트 실패: ${error.message}`);
  }
}
