import { useState } from 'react'
import { cases, categories } from '../data/cases105'

// 비목별 색상
const categoryColors = {
  '인건비': { bg: 'bg-blue-100', text: 'text-blue-600', icon: '👤' },
  '학생인건비': { bg: 'bg-indigo-100', text: 'text-indigo-600', icon: '🎓' },
  '연구시설장비비': { bg: 'bg-purple-100', text: 'text-purple-600', icon: '🔬' },
  '연구재료비': { bg: 'bg-pink-100', text: 'text-pink-600', icon: '🧪' },
  '연구활동비': { bg: 'bg-green-100', text: 'text-green-600', icon: '✈️' },
  '연구수당': { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: '💰' },
  '위탁연구개발비': { bg: 'bg-orange-100', text: 'text-orange-600', icon: '🤝' },
  '국제공동연구개발비': { bg: 'bg-red-100', text: 'text-red-600', icon: '🌍' },
  '간접비': { bg: 'bg-gray-100', text: 'text-gray-600', icon: '📊' },
  '기타': { bg: 'bg-teal-100', text: 'text-teal-600', icon: '📋' },
}

export default function CaseDB({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCase, setSelectedCase] = useState(null)
  const [showStory, setShowStory] = useState(false)

  const filteredCases = cases.filter(c => {
    const matchCategory = selectedCategory === '전체' || c.category === selectedCategory
    const matchSearch = searchTerm === '' ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.situation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  const getCategoryStyle = (category) => categoryColors[category] || categoryColors['기타']

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
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
            {filteredCases.length}개 사례
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">사례 DB 검색</h1>
        <p className="text-white/80 mb-8">105개 국가R&D 부적정집행 사례를 검색하세요</p>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="키워드로 검색 (예: 인건비, 출장, 장비, 미승인...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white min-w-[180px]"
            >
              <option value="전체">전체 비목</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {categoryColors[cat]?.icon} {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('전체')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedCategory === '전체'
                ? 'bg-white text-purple-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            전체 ({cases.length})
          </button>
          {categories.map(cat => {
            const count = cases.filter(c => c.category === cat).length
            const style = getCategoryStyle(cat)
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {style.icon} {cat} ({count})
              </button>
            )
          })}
        </div>

        {/* Cases List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map(caseItem => {
            const style = getCategoryStyle(caseItem.category)
            return (
              <div
                key={caseItem.id}
                onClick={() => {
                  setSelectedCase(caseItem)
                  setShowStory(false)
                }}
                className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`${style.bg} ${style.text} px-2 py-1 rounded text-xs font-semibold`}>
                    {style.icon} {caseItem.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    caseItem.isProper
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {caseItem.isProper ? '정당' : '부당'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{caseItem.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {caseItem.situation}
                </p>
                {caseItem.enemyName && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">
                      🎮 {caseItem.enemyName}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white/80">검색 결과가 없습니다</p>
          </div>
        )}

        {/* Case Detail Modal */}
        {selectedCase && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCase(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`${getCategoryStyle(selectedCase.category).bg} ${getCategoryStyle(selectedCase.category).text} px-3 py-1 rounded-full text-sm font-semibold`}>
                      {getCategoryStyle(selectedCase.category).icon} {selectedCase.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedCase.isProper
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {selectedCase.isProper ? '⭕ 정당' : '❌ 부당'}
                    </span>
                    {selectedCase.enemyName && (
                      <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                        🎮 {selectedCase.enemyName}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedCase.title}
                </h2>

                {/* 스토리/원문 토글 */}
                {selectedCase.story && (
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setShowStory(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        !showStory ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      📋 원문
                    </button>
                    <button
                      onClick={() => setShowStory(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        showStory ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      📖 스토리
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">
                      {showStory ? '스토리' : '상황'}
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {showStory ? selectedCase.story : selectedCase.situation}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 ${
                    selectedCase.isProper ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">정산 결과</h3>
                    <p className={selectedCase.isProper ? 'text-green-700' : 'text-red-700'}>
                      {selectedCase.result}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">적용 근거</h3>
                    <p className="text-purple-700 font-medium mb-2">
                      {selectedCase.legalBasis}
                    </p>
                    {selectedCase.explanation && (
                      <p className="text-gray-600 text-sm whitespace-pre-line">
                        {selectedCase.explanation}
                      </p>
                    )}
                  </div>

                  {selectedCase.weaknessCard && (
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">
                        🎮 정산 디펜스 정보
                      </h3>
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-xs text-gray-500">적 이름</span>
                          <p className="font-medium text-gray-800">{selectedCase.enemyName}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">약점 카드</span>
                          <p className="font-medium text-gray-800">{selectedCase.weaknessCard}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedCase(null)}
                  className="w-full mt-6 bg-purple-600 text-white rounded-xl py-3 font-semibold
                    hover:bg-purple-700 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
