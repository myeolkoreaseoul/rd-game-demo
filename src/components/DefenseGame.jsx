import { useState } from 'react'
import { stages, defenseCards, getMonsterById, getCardByName } from '../data/defenseGameData'

// 스테이지 선택 화면
function StageSelect({ onSelectStage, onBack }) {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white flex items-center gap-2 mb-6 text-lg"
        >
          ← 홈으로
        </button>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">정산 디펜스</h1>
          <p className="text-white/80 text-xl">부적정집행 사례를 올바른 카드로 막아보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage)}
              className="bg-white rounded-2xl p-8 text-left hover:scale-[1.02] transition-transform
                hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl font-bold text-purple-600">Stage {stage.id}</span>
                <span className="text-base bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                  {stage.subtitle}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{stage.name}</h3>
              <p className="text-gray-500 text-lg mb-4">{stage.description}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${i < stage.difficulty ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="mt-4 text-base text-gray-400">
                {stage.category} | {stage.monsterIds?.length || 0}문제
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 정답 결과 모달
function ResultModal({ isCorrect, monster, correctCard, onNext }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 my-4">
        {/* 결과 헤더 */}
        <div className="text-center mb-6">
          <div className={`text-6xl mb-3 ${isCorrect ? 'animate-bounce' : ''}`}>
            {isCorrect ? '🎉' : '😅'}
          </div>
          <h2 className={`text-3xl font-bold ${isCorrect ? 'text-green-600' : 'text-orange-500'}`}>
            {isCorrect ? '정답입니다!' : '아쉬워요!'}
          </h2>
        </div>

        {/* 정답 카드 */}
        <div className={`rounded-2xl p-5 mb-5 ${isCorrect ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{correctCard.icon}</span>
            <span className={`text-xl font-bold ${isCorrect ? 'text-green-700' : 'text-yellow-700'}`}>
              {isCorrect ? '사용한 카드' : '정답'}: {correctCard.name}
            </span>
          </div>
          <p className={`text-lg ${isCorrect ? 'text-green-600' : 'text-yellow-600'}`}>
            {correctCard.description}
          </p>
        </div>

        {/* 정산 결과 */}
        <div className="bg-red-50 rounded-2xl p-5 mb-5">
          <h3 className="font-bold text-red-700 text-lg mb-3 flex items-center gap-2">
            📋 정산 결과
          </h3>
          <p className="text-red-600 text-lg leading-relaxed">{monster.result}</p>
        </div>

        {/* 적용 법령 */}
        <div className="bg-purple-50 rounded-2xl p-5 mb-5">
          <h3 className="font-bold text-purple-700 text-lg mb-3 flex items-center gap-2">
            ⚖️ 적용 법령
          </h3>
          <p className="text-purple-800 font-medium text-lg mb-3">{monster.legalBasis}</p>
          {monster.explanation && (
            <p className="text-purple-600 leading-relaxed whitespace-pre-line">
              {monster.explanation}
            </p>
          )}
        </div>

        <button
          onClick={onNext}
          className="w-full bg-purple-600 text-white rounded-2xl py-4 text-xl font-bold
            hover:bg-purple-700 transition-colors"
        >
          다음 문제 →
        </button>
      </div>
    </div>
  )
}

// 게임 결과 화면
function GameComplete({ score, total, onRestart, onBack }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  let grade, message, emoji
  if (percentage === 100) {
    grade = 'S'
    message = '완벽합니다! 정산 마스터!'
    emoji = '🏆'
  } else if (percentage >= 80) {
    grade = 'A'
    message = '훌륭해요! 거의 다 맞혔어요!'
    emoji = '🎉'
  } else if (percentage >= 60) {
    grade = 'B'
    message = '좋아요! 조금 더 연습해볼까요?'
    emoji = '👍'
  } else {
    grade = 'C'
    message = '다시 도전해보세요!'
    emoji = '💪'
  }

  const gradeColors = {
    S: 'from-yellow-400 to-orange-500',
    A: 'from-green-400 to-emerald-500',
    B: 'from-blue-400 to-indigo-500',
    C: 'from-gray-400 to-gray-500'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-10 text-center">
        <div className="text-6xl mb-4">{emoji}</div>

        <div className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br ${gradeColors[grade]}
          flex items-center justify-center mb-6 shadow-lg`}>
          <span className="text-5xl font-bold text-white">{grade}</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-3">스테이지 완료!</h2>
        <p className="text-gray-500 text-xl mb-8">{message}</p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="text-5xl font-bold text-purple-600 mb-2">
            {score} / {total}
          </div>
          <div className="text-gray-500 text-lg">정답 ({percentage}%)</div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onRestart}
            className="flex-1 bg-purple-600 text-white rounded-2xl py-4 text-lg font-bold
              hover:bg-purple-700 transition-colors"
          >
            다시 하기
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 rounded-2xl py-4 text-lg font-bold
              hover:bg-gray-200 transition-colors"
          >
            스테이지 선택
          </button>
        </div>
      </div>
    </div>
  )
}

// 메인 게임 플레이
function GamePlay({ stage, onBack }) {
  // 스테이지의 몬스터들 가져오기
  const allMonsters = (stage.monsterIds || [])
    .map(id => getMonsterById(id))
    .filter(Boolean)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedCard, setSelectedCard] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showStory, setShowStory] = useState(true) // 기본으로 스토리 표시
  const [cardChoices, setCardChoices] = useState([])
  const [gameFinished, setGameFinished] = useState(false)

  const currentMonster = allMonsters[currentIndex]
  const totalQuestions = allMonsters.length
  const progress = totalQuestions > 0 ? ((currentIndex) / totalQuestions) * 100 : 0

  // 카드 선택지 생성
  const generateCardChoices = (monster) => {
    if (!monster) return []
    const correctCard = getCardByName(monster.weakness)
    if (!correctCard) return defenseCards.slice(0, 4)

    const otherCards = defenseCards
      .filter(c => c.id !== correctCard.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    return [correctCard, ...otherCards].sort(() => Math.random() - 0.5)
  }

  // 초기 카드 선택지 설정
  if (cardChoices.length === 0 && currentMonster) {
    setCardChoices(generateCardChoices(currentMonster))
  }

  // 카드 선택 처리
  const handleCardSelect = (card) => {
    if (!currentMonster) return
    setSelectedCard(card)
    const correct = card.id === currentMonster.weakness || card.name === currentMonster.weakness
    setIsCorrect(correct)
    if (correct) {
      setScore(prev => prev + 1)
    }
    setShowResult(true)
  }

  // 다음 문제로
  const handleNext = () => {
    setShowResult(false)
    setSelectedCard(null)
    setShowHint(false)
    setShowStory(true)

    if (currentIndex + 1 >= totalQuestions) {
      setGameFinished(true)
    } else {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCardChoices(generateCardChoices(allMonsters[nextIndex]))
    }
  }

  // 게임 완료
  if (gameFinished || !currentMonster) {
    return (
      <GameComplete
        score={score}
        total={totalQuestions}
        onRestart={() => window.location.reload()}
        onBack={onBack}
      />
    )
  }

  const correctCard = getCardByName(currentMonster.weakness)

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* 상단 헤더 */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white text-lg"
          >
            ← 나가기
          </button>
          <div className="text-white text-lg font-medium">
            {stage.name}
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-bold text-lg">
            {score}점
          </div>
        </div>

        {/* 진행률 */}
        <div className="bg-white/20 rounded-full h-4 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-white/80 text-center mt-2 text-lg">
          {currentIndex + 1} / {totalQuestions} 문제
        </div>
      </div>

      {/* 메인 카드 */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl">
          {/* 몬스터 헤더 */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b">
            <span className="text-5xl">{currentMonster.sprite}</span>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {currentMonster.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {currentMonster.category}
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">{currentMonster.title}</span>
              </div>
            </div>
          </div>

          {/* 스토리/원문 토글 */}
          {currentMonster.story && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowStory(true)}
                className={`px-4 py-2 rounded-xl text-base font-semibold transition-colors ${
                  showStory ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📖 스토리로 보기
              </button>
              <button
                onClick={() => setShowStory(false)}
                className={`px-4 py-2 rounded-xl text-base font-semibold transition-colors ${
                  !showStory ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📋 원문 보기
              </button>
            </div>
          )}

          {/* 상황 설명 */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="text-gray-500 font-semibold mb-3 text-lg">
              {showStory && currentMonster.story ? '📖 상황 스토리' : '📋 상황'}
            </h3>
            <p className="text-gray-800 text-xl leading-relaxed whitespace-pre-line">
              {showStory && currentMonster.story ? currentMonster.story : currentMonster.situation}
            </p>
          </div>

          {/* 힌트 */}
          {showHint ? (
            <div className="bg-yellow-50 rounded-2xl p-5 mb-6 border-2 border-yellow-200">
              <h3 className="text-yellow-700 font-bold mb-2 text-lg">💡 힌트</h3>
              <p className="text-yellow-700 text-lg">
                이 사례는 <strong>{currentMonster.weakness}</strong>로 막을 수 있습니다!
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="text-purple-600 hover:text-purple-700 font-semibold mb-6 text-lg
                flex items-center gap-2 hover:underline"
            >
              💡 힌트가 필요하신가요?
            </button>
          )}

          {/* 질문 */}
          <div className="text-center mb-6 py-4 bg-purple-50 rounded-2xl">
            <p className="text-xl md:text-2xl font-bold text-purple-700">
              🛡️ 이 부적정집행을 막으려면 어떤 카드가 필요할까요?
            </p>
          </div>

          {/* 카드 선택지 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cardChoices.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardSelect(card)}
                disabled={showResult}
                className={`bg-white border-3 rounded-2xl p-5 text-left
                  transition-all hover:shadow-lg hover:scale-[1.01]
                  ${showResult && (card.id === currentMonster.weakness || card.name === currentMonster.weakness)
                    ? 'border-green-500 bg-green-50 ring-4 ring-green-200'
                    : showResult && selectedCard?.id === card.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-purple-400'
                  }
                  disabled:cursor-not-allowed
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{card.icon}</span>
                  <span className="text-xl font-bold text-gray-800">{card.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 모달 */}
      {showResult && correctCard && (
        <ResultModal
          isCorrect={isCorrect}
          monster={currentMonster}
          correctCard={correctCard}
          onNext={handleNext}
        />
      )}
    </div>
  )
}

// 메인 컴포넌트
export default function DefenseGame({ onBack }) {
  const [selectedStage, setSelectedStage] = useState(null)

  if (selectedStage) {
    return (
      <GamePlay
        stage={selectedStage}
        onBack={() => setSelectedStage(null)}
      />
    )
  }

  return (
    <StageSelect
      onSelectStage={setSelectedStage}
      onBack={onBack}
    />
  )
}
