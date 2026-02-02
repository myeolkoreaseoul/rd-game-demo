import { useState, useEffect } from 'react'
import { cases, categories } from '../data/cases'

export default function OXGame({ onBack }) {
  const [gameState, setGameState] = useState('select') // select, playing, result
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const startGame = (categoryId) => {
    let filteredCases = categoryId === 'all'
      ? [...cases]
      : cases.filter(c => c.category === categoryId)

    // Shuffle and take 10 questions
    const shuffled = filteredCases.sort(() => Math.random() - 0.5).slice(0, 10)
    setQuestions(shuffled)
    setSelectedCategory(categoryId)
    setGameState('playing')
    setCurrentIndex(0)
    setScore(0)
  }

  const handleAnswer = (answer) => {
    if (answered) return

    const isCorrect = answer === questions[currentIndex].isProper
    setSelectedAnswer(answer)
    setAnswered(true)
    setShowExplanation(true)

    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setGameState('result')
    } else {
      setCurrentIndex(currentIndex + 1)
      setAnswered(false)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const currentQuestion = questions[currentIndex]

  if (gameState === 'select') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white mb-6 flex items-center gap-2"
          >
            <span>←</span> 홈으로
          </button>

          <h1 className="text-3xl font-bold text-white mb-2">O/X 판단 게임</h1>
          <p className="text-white/80 mb-8">카테고리를 선택하세요</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => startGame('all')}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white
                hover:bg-white/30 transition-all"
            >
              <div className="text-3xl mb-2">🎲</div>
              <div className="font-semibold">전체 랜덤</div>
              <div className="text-sm text-white/60">{cases.length}개 사례</div>
            </button>

            {categories.map((cat) => {
              const count = cases.filter(c => c.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => startGame(cat.id)}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white
                    hover:bg-white/30 transition-all"
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="font-semibold">{cat.name}</div>
                  <div className="text-sm text-white/60">{count}개 사례</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'result') {
    const percentage = Math.round((score / questions.length) * 100)
    let message = ''
    let emoji = ''

    if (percentage >= 90) { message = '완벽해요!'; emoji = '🏆' }
    else if (percentage >= 70) { message = '훌륭해요!'; emoji = '🎉' }
    else if (percentage >= 50) { message = '좋아요!'; emoji = '👍' }
    else { message = '더 연습해봐요!'; emoji = '💪' }

    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{message}</h2>
          <div className="text-5xl font-bold text-purple-600 mb-2">
            {score} / {questions.length}
          </div>
          <p className="text-gray-500 mb-6">정답률 {percentage}%</p>

          <div className="flex gap-4">
            <button
              onClick={() => setGameState('select')}
              className="flex-1 bg-purple-600 text-white rounded-xl py-3 font-semibold
                hover:bg-purple-700 transition-colors"
            >
              다시 하기
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white"
          >
            ← 나가기
          </button>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
            {currentIndex + 1} / {questions.length}
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
            점수: {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-white/20 rounded-full mb-8">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
              {categories.find(c => c.id === currentQuestion.category)?.name}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {currentQuestion.title}
          </h2>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-gray-700 leading-relaxed">
              {currentQuestion.situation}
            </p>
          </div>

          <p className="text-center text-gray-600 font-semibold">
            이것은 정당한 집행일까요?
          </p>
        </div>

        {/* Answer Buttons */}
        {!showExplanation && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-6 text-2xl font-bold
                transform transition-all hover:scale-105 active:scale-95"
            >
              ⭕ 정당
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-white rounded-2xl py-6 text-2xl font-bold
                transform transition-all hover:scale-105 active:scale-95"
            >
              ❌ 부당
            </button>
          </div>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className={`rounded-2xl p-6 mb-6 ${
            selectedAnswer === currentQuestion.isProper
              ? 'bg-green-100'
              : 'bg-red-100'
          }`}>
            <div className="text-center mb-4">
              {selectedAnswer === currentQuestion.isProper ? (
                <div className="text-green-600">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="text-xl font-bold">정답입니다!</div>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-4xl mb-2">😅</div>
                  <div className="text-xl font-bold">오답입니다</div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="font-semibold text-gray-800 mb-2">
                정답: {currentQuestion.isProper ? '⭕ 정당' : '❌ 부당'}
              </div>
              <p className="text-gray-600 text-sm mb-3">
                {currentQuestion.result}
              </p>
              <div className="border-t pt-3">
                <div className="text-xs text-gray-500 mb-1">적용 근거</div>
                <p className="text-sm text-purple-600">
                  {currentQuestion.regulation}
                </p>
              </div>
            </div>

            <button
              onClick={nextQuestion}
              className="w-full bg-purple-600 text-white rounded-xl py-4 font-bold
                hover:bg-purple-700 transition-colors"
            >
              {currentIndex + 1 >= questions.length ? '결과 보기' : '다음 문제'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
