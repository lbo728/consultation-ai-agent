'use client';

import { useState } from 'react';

export default function TestPage() {
  const [knowledgeFile, setKnowledgeFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKnowledgeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!knowledgeFile || !query) {
      alert('사전 지식 파일과 문의 내용을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setAnswer('');

    try {
      const formData = new FormData();
      formData.append('file', knowledgeFile);
      formData.append('query', query);

      const response = await fetch('/api/rag-qna', {
        method: 'POST',
        body: formData,
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RAG 기반 QnA 테스트</h1>
        <p className="text-gray-600">사전 지식을 업로드하고 고객 문의에 대한 AI 답변을 테스트하세요</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 파일 업로드 섹션 */}
          <div>
            <label htmlFor="knowledge-file" className="block text-sm font-medium text-gray-700 mb-2">
              사전 지식 업로드 (txt, md, pdf)
            </label>
            <input
              type="file"
              id="knowledge-file"
              accept=".txt,.md,.pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
            {knowledgeFile && (
              <p className="mt-2 text-sm text-gray-600">
                선택된 파일: {knowledgeFile.name}
              </p>
            )}
          </div>

          {/* 문의 입력 섹션 */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              고객 문의
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={6}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3"
              placeholder="고객의 문의 내용을 입력하세요..."
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '답변 생성 중...' : '답변 생성'}
          </button>
        </form>

        {/* 답변 표시 섹션 */}
        {answer && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI 답변</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(answer)}
              className="mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              답변 복사
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
