'use client';

import { useState, useEffect } from 'react';

interface KnowledgeFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

interface BrandTone {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
}

export default function AdminTestPage() {
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [brandTones, setBrandTones] = useState<BrandTone[]>([]);
  const [selectedKnowledge, setSelectedKnowledge] = useState('');
  const [selectedBrandTone, setSelectedBrandTone] = useState('');
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadKnowledgeFiles();
    loadBrandTones();
  }, []);

  const loadKnowledgeFiles = async () => {
    try {
      const response = await fetch('/api/knowledge/list');
      if (response.ok) {
        const data = await response.json();
        setKnowledgeFiles(data.files);
        // 첫 번째 파일을 기본 선택
        if (data.files.length > 0) {
          setSelectedKnowledge(data.files[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load knowledge files:', error);
    }
  };

  const loadBrandTones = async () => {
    try {
      const response = await fetch('/api/brand-tones/list');
      if (response.ok) {
        const data = await response.json();
        setBrandTones(data.brandTones);
        // 기본 톤이 있으면 선택, 없으면 첫 번째 톤 선택
        const defaultTone = data.brandTones.find((tone: BrandTone) => tone.isDefault);
        if (defaultTone) {
          setSelectedBrandTone(defaultTone.id);
        } else if (data.brandTones.length > 0) {
          setSelectedBrandTone(data.brandTones[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load brand tones:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedKnowledge) {
      alert('사전 지식을 선택해주세요. 먼저 브랜드 지식 페이지에서 문서를 업로드해주세요.');
      return;
    }

    if (!query) {
      alert('문의 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setAnswer('');

    try {
      const response = await fetch('/api/rag-qna-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          knowledgeId: selectedKnowledge,
          query,
          brandToneId: selectedBrandTone || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '답변 생성에 실패했습니다.');
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error('Error:', error);
      setAnswer(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI 답변 테스트</h1>
        <p className="text-gray-600 dark:text-gray-400">업로드한 브랜드 지식을 기반으로 고객 문의에 대한 AI 답변을 테스트하세요</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 지식 선택 */}
          <div>
            <label htmlFor="knowledge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              사용할 브랜드 지식
            </label>
            {knowledgeFiles.length === 0 ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  업로드된 지식이 없습니다. 먼저 <a href="/admin/knowledge" className="font-medium underline hover:text-yellow-900 dark:hover:text-yellow-300">브랜드 지식 페이지</a>에서 문서를 업로드해주세요.
                </p>
              </div>
            ) : (
              <select
                id="knowledge"
                value={selectedKnowledge}
                onChange={(e) => setSelectedKnowledge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {knowledgeFiles.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 브랜드 톤 선택 */}
          <div>
            <label htmlFor="brandTone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              사용할 브랜드 톤
            </label>
            {brandTones.length === 0 ? (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  등록된 브랜드 톤이 없습니다. 기본 톤이 사용됩니다.
                </p>
              </div>
            ) : (
              <select
                id="brandTone"
                value={selectedBrandTone}
                onChange={(e) => setSelectedBrandTone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">기본 톤 사용</option>
                {brandTones.map((tone) => (
                  <option key={tone.id} value={tone.id}>
                    {tone.name} {tone.isDefault && '(기본)'}
                  </option>
                ))}
              </select>
            )}
            {selectedBrandTone && brandTones.find((t) => t.id === selectedBrandTone)?.description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {brandTones.find((t) => t.id === selectedBrandTone)?.description}
              </p>
            )}
          </div>

          {/* 문의 입력 */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              고객 문의
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={6}
              className="block w-full text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3"
              placeholder="고객의 문의 내용을 입력하세요..."
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading || knowledgeFiles.length === 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '답변 생성 중...' : '답변 생성'}
          </button>
        </form>

        {/* 답변 표시 */}
        {answer && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI 답변</h2>
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{answer}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(answer)}
              className="mt-4 bg-gray-600 dark:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 transition-colors"
            >
              답변 복사
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
