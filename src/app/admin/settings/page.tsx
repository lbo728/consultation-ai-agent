'use client';

import { useEffect, useState } from 'react';
import { Bell, Mail, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EmailSlackConfig {
  slack_webhook_url: string | null;
  inbound_email_address: string | null;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<EmailSlackConfig>({
    slack_webhook_url: null,
    inbound_email_address: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [inboundEmailAddress, setInboundEmailAddress] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/email-slack/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        setSlackWebhookUrl(data.slack_webhook_url || '');
        setInboundEmailAddress(data.inbound_email_address || '');
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/email-slack/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slack_webhook_url: slackWebhookUrl || null,
          inbound_email_address: inboundEmailAddress || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setConfig(data.config);
        setMessage({ type: 'success', text: '설정이 성공적으로 저장되었습니다.' });
      } else {
        setMessage({ type: 'error', text: data.error || '설정 저장에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '설정 저장 중 오류가 발생했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">설정</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            이메일 및 Slack 통합 설정을 관리합니다.
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={
                message.type === 'success'
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-red-800 dark:text-red-300'
              }
            >
              {message.text}
            </p>
          </div>
        )}

        {/* Email Integration Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                이메일 통합
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              고객 문의 이메일을 수신할 브랜드 전용 이메일 주소를 설정합니다.
            </p>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Inbound Email Address
            </label>
            <input
              type="email"
              value={inboundEmailAddress}
              onChange={(e) => setInboundEmailAddress(e.target.value)}
              placeholder="brandname@inbound.your-saas.ai"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                       placeholder-gray-400 dark:placeholder-gray-500"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              오늘의집 문의 알림을 이 주소로 포워딩하면 자동으로 AI 답변이 생성됩니다.
            </p>
          </div>
        </div>

        {/* Slack Integration Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Slack 통합
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              AI가 생성한 답변을 Slack 채널로 전송받을 Webhook URL을 설정합니다.
            </p>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slack Webhook URL
            </label>
            <input
              type="url"
              value={slackWebhookUrl}
              onChange={(e) => setSlackWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                       placeholder-gray-400 dark:placeholder-gray-500"
            />
            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                Slack Webhook URL 생성 방법:
              </p>
              <ol className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
                <li>Slack 워크스페이스에서 새 채널을 만들거나 기존 채널을 선택합니다.</li>
                <li>
                  <a
                    href="https://api.slack.com/messaging/webhooks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-600"
                  >
                    Slack Incoming Webhooks
                  </a>
                  {' '}페이지에서 'Create your Slack app'을 클릭합니다.
                </li>
                <li>앱을 생성하고 'Incoming Webhooks'를 활성화합니다.</li>
                <li>'Add New Webhook to Workspace'를 클릭하여 채널을 선택합니다.</li>
                <li>생성된 Webhook URL을 복사하여 여기에 붙여넣습니다.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700
                     disabled:bg-gray-400 dark:disabled:bg-gray-600
                     text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {isSaving ? '저장 중...' : '설정 저장'}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            이메일-Slack 통합 작동 방식
          </h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                             rounded-full flex items-center justify-center font-semibold text-xs">
                1
              </span>
              <p>오늘의집에서 고객 문의 알림 이메일이 발송됩니다.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                             rounded-full flex items-center justify-center font-semibold text-xs">
                2
              </span>
              <p>해당 이메일을 위에서 설정한 Inbound Email Address로 포워딩합니다.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                             rounded-full flex items-center justify-center font-semibold text-xs">
                3
              </span>
              <p>AI가 이메일에서 고객 질문을 추출하고 브랜드 지식 기반으로 답변을 생성합니다.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                             rounded-full flex items-center justify-center font-semibold text-xs">
                4
              </span>
              <p>생성된 질문과 답변이 Slack 채널로 전송되어 검토할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
