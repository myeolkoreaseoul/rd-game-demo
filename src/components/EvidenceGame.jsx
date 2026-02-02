import { useState } from 'react'

const stages = [
  {
    id: 1,
    title: '세금계산서 검토',
    difficulty: '초급',
    image: 'invoice',
    errors: [
      { id: 1, x: 15, y: 25, width: 20, height: 8, description: '연구기간 외 거래일자 (2024.01.05 - 연구시작일 2024.02.01 이전)' },
      { id: 2, x: 65, y: 45, width: 25, height: 8, description: '품목명 불명확 (사무용품 → 구체적 품목 필요)' },
      { id: 3, x: 70, y: 65, width: 20, height: 8, description: '부가세 미환급 (과세대상 과제인데 부가세 포함 금액 청구)' },
      { id: 4, x: 15, y: 80, width: 25, height: 8, description: '공급자 사업자등록번호 오류' },
      { id: 5, x: 60, y: 80, width: 20, height: 8, description: '대표자 직인 누락' },
    ]
  },
  {
    id: 2,
    title: '출장보고서 검토',
    difficulty: '중급',
    image: 'travel',
    errors: [
      { id: 1, x: 20, y: 20, width: 25, height: 8, description: '출장 목적 불명확 (연구과제와의 관련성 미기재)' },
      { id: 2, x: 60, y: 30, width: 20, height: 8, description: '출장일자 연구기간 외' },
      { id: 3, x: 15, y: 50, width: 30, height: 8, description: '출장지가 연구수행기관 소재지와 동일 (출장 필요성 불인정)' },
      { id: 4, x: 55, y: 60, width: 25, height: 8, description: '숙박비 단가 초과 (기관 규정 대비)' },
      { id: 5, x: 20, y: 75, width: 20, height: 8, description: '결재권자 서명 누락' },
      { id: 6, x: 60, y: 85, width: 25, height: 8, description: '동일 건 타 과제 중복 청구' },
    ]
  },
  {
    id: 3,
    title: '인건비 지급명세 검토',
    difficulty: '고급',
    image: 'payroll',
    errors: [
      { id: 1, x: 10, y: 25, width: 30, height: 8, description: '참여연구원 IRIS 미등록자 포함' },
      { id: 2, x: 55, y: 25, width: 25, height: 8, description: '인건비계상률 100% 초과 (전체과제 합산)' },
      { id: 3, x: 15, y: 45, width: 25, height: 8, description: '급여대장과 금액 불일치' },
      { id: 4, x: 55, y: 45, width: 30, height: 8, description: '퇴직급여충당금 산정 오류 (1년 미만 근속자 포함)' },
      { id: 5, x: 20, y: 65, width: 20, height: 8, description: '4대보험 기관부담금 과다 계상' },
      { id: 6, x: 55, y: 70, width: 25, height: 8, description: '연구기간 외 급여 포함' },
      { id: 7, x: 35, y: 85, width: 30, height: 8, description: '영리기관 신규인력 인건비 미승인 사용' },
    ]
  }
]

export default function EvidenceGame({ onBack }) {
  const [gameState, setGameState] = useState('select') // select, playing, complete
  const [currentStage, setCurrentStage] = useState(null)
  const [foundErrors, setFoundErrors] = useState([])
  const [hints, setHints] = useState(3)
  const [showHint, setShowHint] = useState(null)
  const [timeLeft, setTimeLeft] = useState(120)
  const [isTimerActive, setIsTimerActive] = useState(false)

  const startStage = (stage) => {
    setCurrentStage(stage)
    setFoundErrors([])
    setHints(3)
    setShowHint(null)
    setTimeLeft(120)
    setIsTimerActive(true)
    setGameState('playing')
  }

  const handleClick = (e) => {
    if (!currentStage) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Check if clicked on an error
    for (const error of currentStage.errors) {
      if (
        x >= error.x &&
        x <= error.x + error.width &&
        y >= error.y &&
        y <= error.y + error.height &&
        !foundErrors.includes(error.id)
      ) {
        setFoundErrors([...foundErrors, error.id])

        // Check if all found
        if (foundErrors.length + 1 === currentStage.errors.length) {
          setIsTimerActive(false)
          setTimeout(() => setGameState('complete'), 500)
        }
        return
      }
    }
  }

  const useHint = () => {
    if (hints <= 0) return

    const notFound = currentStage.errors.filter(e => !foundErrors.includes(e.id))
    if (notFound.length === 0) return

    const randomError = notFound[Math.floor(Math.random() * notFound.length)]
    setShowHint(randomError.id)
    setHints(hints - 1)

    setTimeout(() => setShowHint(null), 2000)
  }

  // Timer effect would go here in real implementation
  // useEffect for timer countdown

  if (gameState === 'select') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white mb-6 flex items-center gap-2"
          >
            ← 홈으로
          </button>

          <h1 className="text-3xl font-bold text-white mb-2">틀린 증빙 찾기</h1>
          <p className="text-white/80 mb-8">스테이지를 선택하세요</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => startStage(stage)}
                className="bg-white rounded-2xl p-6 text-left hover:shadow-xl
                  transform transition-all hover:scale-105"
              >
                <div className="text-4xl mb-4">
                  {stage.id === 1 ? '📄' : stage.id === 2 ? '✈️' : '💰'}
                </div>
                <div className="text-sm text-gray-500 mb-1">Stage {stage.id}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {stage.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    stage.difficulty === '초급' ? 'bg-green-100 text-green-600' :
                    stage.difficulty === '중급' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {stage.difficulty}
                  </span>
                  <span className="text-gray-400 text-sm">
                    오류 {stage.errors.length}개
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'complete') {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            스테이지 클리어!
          </h2>
          <p className="text-gray-500 mb-6">
            모든 오류를 찾았습니다
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-3xl font-bold text-purple-600">
              {currentStage.errors.length} / {currentStage.errors.length}
            </div>
            <div className="text-gray-500 text-sm">발견한 오류</div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setGameState('select')}
              className="flex-1 bg-purple-600 text-white rounded-xl py-3 font-semibold
                hover:bg-purple-700 transition-colors"
            >
              다른 스테이지
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold
                hover:bg-gray-300 transition-colors"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white"
          >
            ← 나가기
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
              🔍 {foundErrors.length} / {currentStage?.errors.length}
            </div>
            <button
              onClick={useHint}
              disabled={hints <= 0}
              className={`rounded-full px-4 py-2 font-semibold ${
                hints > 0
                  ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              💡 힌트 ({hints})
            </button>
          </div>
        </div>

        {/* Document Area */}
        <div className="bg-white rounded-2xl p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {currentStage?.title}
          </h2>

          {/* Clickable Document */}
          <div
            onClick={handleClick}
            className="relative bg-gray-100 rounded-xl aspect-[4/3] cursor-crosshair overflow-hidden"
            style={{ minHeight: '400px' }}
          >
            {/* Simulated Document Content */}
            <div className="absolute inset-0 p-6">
              {currentStage?.image === 'invoice' && (
                <div className="h-full flex flex-col">
                  <div className="text-center text-xl font-bold mb-4 border-b-2 pb-2">
                    세 금 계 산 서
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="border p-2">
                      <div className="text-gray-500">공급자</div>
                      <div>주식회사 OO상사</div>
                      <div className="text-red-500">123-45-67890</div>
                    </div>
                    <div className="border p-2">
                      <div className="text-gray-500">공급받는자</div>
                      <div>OO연구원</div>
                    </div>
                  </div>
                  <div className="mt-4 border p-2">
                    <div className="text-gray-500">작성일자</div>
                    <div className="text-red-500">2024.01.05</div>
                  </div>
                  <div className="mt-4 flex-1 border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="p-2">품목</th>
                          <th className="p-2">수량</th>
                          <th className="p-2">단가</th>
                          <th className="p-2">금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 text-red-500">사무용품</td>
                          <td className="p-2">1</td>
                          <td className="p-2">500,000</td>
                          <td className="p-2">500,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="border p-2">
                      <div>공급가액: 500,000</div>
                      <div className="text-red-500">부가세: 50,000</div>
                      <div>합계: 550,000</div>
                    </div>
                    <div className="border p-2 text-center text-red-500">
                      [인감 누락]
                    </div>
                  </div>
                </div>
              )}

              {currentStage?.image === 'travel' && (
                <div className="h-full flex flex-col text-sm">
                  <div className="text-center text-xl font-bold mb-4 border-b-2 pb-2">
                    출 장 보 고 서
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="border p-2">
                      <span className="text-gray-500">출장자:</span> 김연구원
                    </div>
                    <div className="border p-2 text-red-500">
                      <span className="text-gray-500">출장일:</span> 2023.12.15
                    </div>
                  </div>
                  <div className="border p-2 mb-4 text-red-500">
                    <span className="text-gray-500">출장목적:</span> 업무 협의
                  </div>
                  <div className="border p-2 mb-4 text-red-500">
                    <span className="text-gray-500">출장지:</span> 서울시 강남구 (연구원 소재지)
                  </div>
                  <div className="border p-2 mb-4">
                    <div className="text-gray-500">경비 내역</div>
                    <div>교통비: 50,000원</div>
                    <div className="text-red-500">숙박비: 200,000원 (기준 150,000원 초과)</div>
                    <div>식비: 30,000원</div>
                  </div>
                  <div className="mt-auto grid grid-cols-3 gap-2 text-center">
                    <div className="border p-2 text-red-500">담당: [미서명]</div>
                    <div className="border p-2">팀장: 김OO</div>
                    <div className="border p-2">원장: 박OO</div>
                  </div>
                  <div className="mt-2 text-red-500 text-xs">
                    * 본 출장은 B과제에서도 동일하게 청구됨
                  </div>
                </div>
              )}

              {currentStage?.image === 'payroll' && (
                <div className="h-full flex flex-col text-sm">
                  <div className="text-center text-xl font-bold mb-4 border-b-2 pb-2">
                    인 건 비 지 급 명 세
                  </div>
                  <div className="mb-4">
                    <span className="text-gray-500">과제명:</span> OO기술 개발 연구
                  </div>
                  <div className="mb-4">
                    <span className="text-gray-500">지급월:</span> 2024년 3월
                  </div>
                  <table className="w-full border text-xs">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-1 border">성명</th>
                        <th className="p-1 border">직위</th>
                        <th className="p-1 border">계상률</th>
                        <th className="p-1 border">급여</th>
                        <th className="p-1 border">4대보험</th>
                        <th className="p-1 border">퇴직금</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1 border text-red-500">박OO (IRIS 미등록)</td>
                        <td className="p-1 border">연구원</td>
                        <td className="p-1 border">50%</td>
                        <td className="p-1 border">2,000,000</td>
                        <td className="p-1 border">180,000</td>
                        <td className="p-1 border">166,000</td>
                      </tr>
                      <tr>
                        <td className="p-1 border">김OO</td>
                        <td className="p-1 border">책임</td>
                        <td className="p-1 border text-red-500">120%</td>
                        <td className="p-1 border text-red-500">4,500,000</td>
                        <td className="p-1 border text-red-500">500,000</td>
                        <td className="p-1 border">375,000</td>
                      </tr>
                      <tr>
                        <td className="p-1 border">이OO</td>
                        <td className="p-1 border">선임</td>
                        <td className="p-1 border">30%</td>
                        <td className="p-1 border">1,000,000</td>
                        <td className="p-1 border">90,000</td>
                        <td className="p-1 border text-red-500">83,000 (6개월 근속)</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-4 border p-2 text-red-500">
                    * 2024년 1월분 급여 포함 (연구시작일: 2024.02.01)
                  </div>
                  <div className="mt-2 border p-2 text-red-500">
                    * 영리기관 신규인력 현금 인건비 (승인 미득)
                  </div>
                </div>
              )}
            </div>

            {/* Error Markers */}
            {currentStage?.errors.map((error) => (
              <div
                key={error.id}
                className={`absolute transition-all duration-300 ${
                  foundErrors.includes(error.id)
                    ? 'bg-green-400/50 border-2 border-green-500'
                    : showHint === error.id
                    ? 'bg-yellow-400/50 border-2 border-yellow-500 animate-pulse'
                    : 'bg-transparent'
                }`}
                style={{
                  left: `${error.x}%`,
                  top: `${error.y}%`,
                  width: `${error.width}%`,
                  height: `${error.height}%`,
                  borderRadius: '4px',
                }}
              >
                {foundErrors.includes(error.id) && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Found Errors List */}
        {foundErrors.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">발견한 오류</h3>
            <div className="space-y-2">
              {foundErrors.map((errorId) => {
                const error = currentStage.errors.find(e => e.id === errorId)
                return (
                  <div key={errorId} className="bg-white/20 rounded-lg p-3 text-white text-sm">
                    ✓ {error?.description}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
