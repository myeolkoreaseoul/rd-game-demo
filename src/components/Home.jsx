export default function Home({ onNavigate }) {
  const menuItems = [
    {
      id: 'defense-game',
      title: '정산 디펜스',
      description: '부적정집행 몬스터를 방어카드로 격퇴하세요!',
      icon: '🛡️',
      color: 'from-purple-500 to-pink-600',
      badge: 'NEW'
    },
    {
      id: 'evidence-game',
      title: '틀린 증빙 찾기',
      description: '증빙서류에서 오류를 찾아보세요',
      icon: '🔍',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'case-db',
      title: '사례 DB 검색',
      description: '105개 부적정집행 사례를 검색하세요',
      icon: '📚',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'dashboard',
      title: '이상거래 탐지',
      description: 'AI 기반 이상거래 탐지 대시보드',
      icon: '📊',
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-2 mb-4">
            <span className="text-white/80 text-sm">정동회계법인</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            연구비 정산 게임센터
          </h1>
          <p className="text-white/80 text-lg">
            재미있게 배우는 국가R&D 연구비 관리
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-left
                transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                active:scale-95 relative overflow-hidden`}
            >
              {item.badge && (
                <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900
                  text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
              <div className="text-5xl mb-4">{item.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
              <p className="text-white/80">{item.description}</p>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            국가R&D 연구비 부적정집행 사례집 기반 | KAIA 2025
          </p>
        </div>
      </div>
    </div>
  )
}
