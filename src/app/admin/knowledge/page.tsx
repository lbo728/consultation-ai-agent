'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2 } from 'lucide-react';

interface KnowledgeFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

export default function KnowledgePage() {
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    loadKnowledgeFiles();
  }, []);

  const loadKnowledgeFiles = async () => {
    try {
      const response = await fetch('/api/knowledge/list');
      if (response.ok) {
        const data = await response.json();
        setKnowledgeFiles(data.files);
      }
    } catch (error) {
      console.error('Failed to load knowledge files:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '파일 업로드에 실패했습니다.');
      }

      // 파일 목록 새로고침
      await loadKnowledgeFiles();

      // 파일 입력 초기화
      e.target.value = '';
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('정말 이 파일을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch('/api/knowledge/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      if (!response.ok) {
        throw new Error('파일 삭제에 실패했습니다.');
      }

      // 파일 목록 새로고침
      await loadKnowledgeFiles();
    } catch (error) {
      alert(error instanceof Error ? error.message : '파일 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">브랜드 지식</h1>
        <p className="text-gray-600">AI가 참고할 브랜드 정책, Q&A, 톤앤매너 문서를 관리하세요</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">새 문서 업로드</h2>

        {uploadError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {uploadError}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">클릭하여 파일 업로드</p>
          <p className="text-sm text-gray-500">지원 형식: TXT, MD, PDF</p>
          <input
            type="file"
            accept=".txt,.md,.pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`inline-block mt-4 px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              isUploading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isUploading ? '업로드 중...' : '파일 선택'}
          </label>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">업로드된 문서</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {knowledgeFiles.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              업로드된 문서가 없습니다.
            </div>
          ) : (
            knowledgeFiles.map((file) => (
              <div key={file.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">문서 업로드 가이드</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>policy.txt</strong>: 브랜드의 공식 정책, 규칙, 가이드라인</li>
          <li>• <strong>qna.txt</strong>: 실제 고객 문의와 답변 사례</li>
          <li>• <strong>tone.txt</strong>: 브랜드 톤앤매너, 인사말, 마무리 문구</li>
        </ul>
      </div>
    </div>
  );
}
