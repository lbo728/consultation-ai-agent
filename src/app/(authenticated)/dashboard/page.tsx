'use client';

import { TrendingUp, MessageSquare, CheckCircle, ThumbsUp } from 'lucide-react';

export default function DashboardPage() {
  // Mock data - 실제로는 API에서 가져올 데이터
  const stats = [
    {
      label: '답변 건수',
      value: '247',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: MessageSquare,
    },
    {
      label: '정확률',
      value: '94.2%',
      change: '+2.3%',
      changeType: 'positive' as const,
      icon: CheckCircle,
    },
    {
      label: '답변 만족도',
      value: '4.8',
      change: '+0.2',
      changeType: 'positive' as const,
      icon: ThumbsUp,
    },
    {
      label: '평균 응답 시간',
      value: '3.2초',
      change: '-0.5초',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
  ];

  const recentActivities = [
    {
      date: '2025-12-03',
      time: '14:32',
      query: '칠십 사이즈 460x230인데, 5장을 구매했지만 6장을 구매해야했나요?',
      status: '답변 완료',
    },
    {
      date: '2025-12-03',
      time: '13:15',
      query: '가로 210에 세로 230인데 몇 장 주문해야 하나요?',
      status: '답변 완료',
    },
    {
      date: '2025-12-03',
      time: '12:48',
      query: '이음선이 생기나요?',
      status: '답변 완료',
    },
    {
      date: '2025-12-03',
      time: '11:22',
      query: '레일 설치는 어떻게 하나요?',
      status: '답변 완료',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">대시보드</h1>
        <p className="text-gray-600 dark:text-gray-400">AI 상담 에이전트 사용 현황을 확인하세요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">일별 답변 건수</h2>
          <div className="h-64 flex items-end justify-around gap-2">
            {[65, 85, 72, 95, 88, 102, 94].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {['월', '화', '수', '목', '금', '토', '일'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">답변 정확도 추이</h2>
          <div className="h-64 flex items-end justify-around gap-2">
            {[92, 91, 93, 94, 93, 95, 94].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500 dark:bg-green-600 rounded-t-lg hover:bg-green-600 dark:hover:bg-green-500 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {['월', '화', '수', '목', '금', '토', '일'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">최근 활동</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  문의 내용
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentActivities.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {activity.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {activity.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-md truncate">
                    {activity.query}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
