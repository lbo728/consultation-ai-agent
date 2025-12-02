'use client';

import { Upload, FileText, Trash2 } from 'lucide-react';

export default function KnowledgePage() {
  // Mock data - 실제로는 API에서 가져올 데이터
  const knowledgeFiles = [
    { id: '1', name: 'policy.txt', size: '24 KB', uploadedAt: '2025-12-01' },
    { id: '2', name: 'qna.txt', size: '156 KB', uploadedAt: '2025-12-01' },
    { id: '3', name: 'tone.txt', size: '8 KB', uploadedAt: '2025-12-01' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">브랜드 지식</h1>
        <p className="text-gray-600">AI가 참고할 브랜드 정책, Q&A, 톤앤매너 문서를 관리하세요</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">새 문서 업로드</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">클릭하거나 파일을 드래그하여 업로드</p>
          <p className="text-sm text-gray-500">지원 형식: TXT, MD, PDF</p>
          <input
            type="file"
            accept=".txt,.md,.pdf"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors"
          >
            파일 선택
          </label>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">업로드된 문서</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {knowledgeFiles.map((file) => (
            <div key={file.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {file.size} · {file.uploadedAt}
                  </p>
                </div>
              </div>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
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
