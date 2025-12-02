// 브랜드 지식 관리 (MVP용 인메모리 저장)

export interface KnowledgeFile {
  id: string;
  userId: string;
  name: string;
  content: string;
  size: number;
  uploadedAt: Date;
}

// 인메모리 지식 저장소
const knowledgeFiles: Map<string, KnowledgeFile> = new Map();

export function createKnowledgeFile(
  userId: string,
  name: string,
  content: string
): KnowledgeFile {
  const file: KnowledgeFile = {
    id: crypto.randomUUID(),
    userId,
    name,
    content,
    size: content.length,
    uploadedAt: new Date(),
  };

  knowledgeFiles.set(file.id, file);
  return file;
}

export function getKnowledgeFilesByUserId(userId: string): KnowledgeFile[] {
  return Array.from(knowledgeFiles.values()).filter((file) => file.userId === userId);
}

export function getKnowledgeFileById(id: string): KnowledgeFile | undefined {
  return knowledgeFiles.get(id);
}

export function deleteKnowledgeFile(id: string, userId: string): boolean {
  const file = knowledgeFiles.get(id);
  if (!file || file.userId !== userId) {
    return false;
  }
  return knowledgeFiles.delete(id);
}

export function getKnowledgeFileSafeData(file: KnowledgeFile) {
  return {
    id: file.id,
    name: file.name,
    size: file.size,
    uploadedAt: file.uploadedAt,
  };
}
