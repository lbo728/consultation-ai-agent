'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2 } from 'lucide-react';

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

type TabType = 'knowledge' | 'tone';

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<TabType>('knowledge');
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [brandTones, setBrandTones] = useState<BrandTone[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Brand tone upload states
  const [toneName, setToneName] = useState('');
  const [toneDescription, setToneDescription] = useState('');
  const [toneIsDefault, setToneIsDefault] = useState(false);

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
      }
    } catch (error) {
      console.error('Failed to load brand tones:', error);
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

  const handleToneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!toneName.trim()) {
      setUploadError('브랜드 톤 이름을 입력해주세요.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', toneName);
      if (toneDescription) {
        formData.append('description', toneDescription);
      }
      formData.append('isDefault', String(toneIsDefault));

      const response = await fetch('/api/brand-tones/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '브랜드 톤 업로드에 실패했습니다.');
      }

      // Reset form
      setToneName('');
      setToneDescription('');
      setToneIsDefault(false);
      e.target.value = '';

      // Reload brand tones
      await loadBrandTones();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '브랜드 톤 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToneDelete = async (toneId: string) => {
    if (!confirm('정말 이 브랜드 톤을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch('/api/brand-tones/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toneId }),
      });

      if (!response.ok) {
        throw new Error('브랜드 톤 삭제에 실패했습니다.');
      }

      // Reload brand tones
      await loadBrandTones();
    } catch (error) {
      alert(error instanceof Error ? error.message : '브랜드 톤 삭제 중 오류가 발생했습니다.');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">브랜드 지식 관리</h1>
        <p className="text-gray-600">AI가 참고할 브랜드 정보를 관리하세요</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'knowledge'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            브랜드 지식
          </button>
          <button
            onClick={() => setActiveTab('tone')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'tone'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            브랜드 톤
          </button>
        </div>
      </div>

      {/* Knowledge Tab Content */}
      {activeTab === 'knowledge' && (
        <>
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
            </ul>
          </div>
        </>
      )}

      {/* Brand Tone Tab Content */}
      {activeTab === 'tone' && (
        <>
          {/* Tone Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">새 브랜드 톤 업로드</h2>

            {uploadError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {uploadError}
              </div>
            )}

            <div className="space-y-4 mb-4">
              <div>
                <label htmlFor="tone-name" className="block text-sm font-medium text-gray-700 mb-2">
                  톤 이름 *
                </label>
                <input
                  type="text"
                  id="tone-name"
                  value={toneName}
                  onChange={(e) => setToneName(e.target.value)}
                  placeholder="예: 데코지오 기본 톤"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="tone-description" className="block text-sm font-medium text-gray-700 mb-2">
                  설명 (선택)
                </label>
                <input
                  type="text"
                  id="tone-description"
                  value={toneDescription}
                  onChange={(e) => setToneDescription(e.target.value)}
                  placeholder="예: 친절하고 전문적인 톤"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="tone-default"
                  checked={toneIsDefault}
                  onChange={(e) => setToneIsDefault(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="tone-default" className="text-sm font-medium text-gray-700">
                  기본 톤으로 설정
                </label>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">클릭하여 파일 업로드</p>
              <p className="text-sm text-gray-500">지원 형식: TXT, MD</p>
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleToneUpload}
                disabled={isUploading}
                className="hidden"
                id="tone-upload"
              />
              <label
                htmlFor="tone-upload"
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

          {/* Tones List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">업로드된 브랜드 톤</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {brandTones.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  업로드된 브랜드 톤이 없습니다.
                </div>
              ) : (
                brandTones.map((tone) => (
                  <div key={tone.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{tone.name}</p>
                          {tone.isDefault && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              기본
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {tone.description || '설명 없음'} · {formatDate(tone.createdAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToneDelete(tone.id)}
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
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-2">브랜드 톤 작성 가이드</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• AI가 사용할 답변 스타일과 톤을 정의하세요</li>
              <li>• 인사말, 마무리 문구, 이모지 사용 여부 등을 포함하세요</li>
              <li>• 답변 형식 예시를 제공하면 더 정확한 결과를 얻을 수 있습니다</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
