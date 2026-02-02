import { useState } from 'react'

// Sample anomaly data
const anomalyData = [
  {
    id: 1,
    type: '인건비',
    description: '참여연구원 A의 인건비계상률 합계 115% (전체과제 합산)',
    risk: 'high',
    amount: 4500000,
    date: '2024-03-15',
    detail: '본 과제 50% + B과제 40% + C과제 25% = 115%'
  },
  {
    id: 2,
    type: '연구장비',
    description: '3천만원 이상 장비 구매 예정 - 사전승인 필요',
    risk: 'high',
    amount: 35000000,
    date: '2024-03-12',
    detail: '연구용 분석장비 구매 예정 (3,500만원). 전문기관 사전승인 필요.'
  },
  {
    id: 3,
    type: '연구활동비',
    description: '출장비 중복 청구 의심 - 동일 일자/장소',
    risk: 'medium',
    amount: 150000,
    date: '2024-03-10',
    detail: '3/5 부산 출장 - 본 과제와 타 과제에서 동일 출장 청구'
  },
  {
    id: 4,
    type: '연구수당',
    description: '연구수당 지급비율 직접비 대비 초과 예상',
    risk: 'medium',
    amount: 8000000,
    date: '2024-03-08',
    detail: '현재 직접비 사용률 65%, 연구수당 90% 지급 시 20%p 초과'
  },
  {
    id: 5,
    type: '연구재료',
    description: '동일 거래처 연속 거래 - 분할발주 의심',
    risk: 'low',
    amount: 2800000,
    date: '2024-03-05',
    detail: '(주)OO상사 3회 연속 거래 (각 95만원, 90만원, 95만원)'
  },
  {
    id: 6,
    type: '간접비',
    description: '간접비 조기 사용 - 직접비 대비 집행률 높음',
    risk: 'low',
    amount: 12000000,
    date: '2024-03-01',
    detail: '직접비 35% 집행, 간접비 60% 집행'
  },
]

const summaryStats = {
  totalBudget: 500000000,
  executed: 175000000,
  remaining: 325000000,
  executionRate: 35,
  anomalyCount: {
    high: 2,
    medium: 2,
    low: 2,
  }
}

export default function Dashboard({ onBack }) {
  const [selectedAnomaly, setSelectedAnomaly] = useState(null)
  const [filter, setFilter] = useState('all')

  const filteredAnomalies = filter === 'all'
    ? anomalyData
    : anomalyData.filter(a => a.risk === filter)

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white flex items-center gap-2"
          >
            ← 홈으로
          </button>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            최종 업데이트: 2024-03-15 14:30
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">이상거래 탐지</h1>
        <p className="text-white/80 mb-8">AI 기반 연구비 집행 모니터링</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4">
            <div className="text-gray-500 text-sm mb-1">총 예산</div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(summaryStats.totalBudget)}원
            </div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-gray-500 text-sm mb-1">집행액</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(summaryStats.executed)}원
            </div>
            <div className="text-sm text-gray-400">{summaryStats.executionRate}%</div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-gray-500 text-sm mb-1">잔액</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summaryStats.remaining)}원
            </div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-gray-500 text-sm mb-1">이상 탐지</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">
                {summaryStats.anomalyCount.high}
              </span>
              <span className="text-xl text-yellow-500">
                {summaryStats.anomalyCount.medium}
              </span>
              <span className="text-xl text-gray-400">
                {summaryStats.anomalyCount.low}
              </span>
            </div>
          </div>
        </div>

        {/* Execution Chart Placeholder */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">비목별 집행 현황</h2>
          <div className="space-y-4">
            {[
              { name: '인건비', executed: 45, budget: 150000000 },
              { name: '연구시설·장비비', executed: 20, budget: 80000000 },
              { name: '연구재료비', executed: 35, budget: 50000000 },
              { name: '연구활동비', executed: 55, budget: 70000000 },
              { name: '연구수당', executed: 90, budget: 30000000 },
              { name: '위탁연구개발비', executed: 0, budget: 60000000 },
              { name: '간접비', executed: 60, budget: 60000000 },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="text-gray-800 font-medium">
                    {item.executed}% ({formatCurrency(item.budget * item.executed / 100)}원)
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.executed >= 80 ? 'bg-green-500' :
                      item.executed >= 50 ? 'bg-blue-500' :
                      item.executed >= 30 ? 'bg-yellow-500' :
                      'bg-gray-300'
                    }`}
                    style={{ width: `${item.executed}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly List */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">이상 탐지 항목</h2>
            <div className="flex gap-2">
              {['all', 'high', 'medium', 'low'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                    filter === f
                      ? f === 'high' ? 'bg-red-100 text-red-600' :
                        f === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        f === 'low' ? 'bg-gray-100 text-gray-600' :
                        'bg-purple-100 text-purple-600'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {f === 'all' ? '전체' : f === 'high' ? '고위험' : f === 'medium' ? '중위험' : '저위험'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAnomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                onClick={() => setSelectedAnomaly(anomaly)}
                className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                  anomaly.risk === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                  anomaly.risk === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                  'bg-gray-50 border-l-4 border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        anomaly.risk === 'high' ? 'bg-red-100 text-red-600' :
                        anomaly.risk === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {anomaly.risk === 'high' ? '고위험' : anomaly.risk === 'medium' ? '중위험' : '저위험'}
                      </span>
                      <span className="text-sm text-gray-500">{anomaly.type}</span>
                    </div>
                    <p className="text-gray-800 font-medium">{anomaly.description}</p>
                    <p className="text-gray-500 text-sm mt-1">{anomaly.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">
                      {formatCurrency(anomaly.amount)}원
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Detail Modal */}
        {selectedAnomaly && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAnomaly(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedAnomaly.risk === 'high' ? 'bg-red-100 text-red-600' :
                    selectedAnomaly.risk === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedAnomaly.risk === 'high' ? '고위험' :
                     selectedAnomaly.risk === 'medium' ? '중위험' : '저위험'}
                  </span>
                  <button
                    onClick={() => setSelectedAnomaly(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedAnomaly.description}
                </h2>

                <div className="space-y-4 mt-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">비목</span>
                    <span className="font-medium">{selectedAnomaly.type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">금액</span>
                    <span className="font-medium">{formatCurrency(selectedAnomaly.amount)}원</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">탐지일</span>
                    <span className="font-medium">{selectedAnomaly.date}</span>
                  </div>
                  <div className="py-2">
                    <span className="text-gray-500">상세 내용</span>
                    <p className="mt-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedAnomaly.detail}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedAnomaly(null)}
                    className="flex-1 bg-purple-600 text-white rounded-xl py-3 font-semibold
                      hover:bg-purple-700 transition-colors"
                  >
                    확인 완료
                  </button>
                  <button
                    onClick={() => setSelectedAnomaly(null)}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-3 font-semibold
                      hover:bg-gray-200 transition-colors"
                  >
                    조치 필요
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
