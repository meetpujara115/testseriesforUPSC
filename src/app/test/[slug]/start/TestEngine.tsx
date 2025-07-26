'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TestMeta } from '@/lib/types'
import { computeScore, formatDuration } from '@/lib/utils'

interface QuestionClient {
  questionText: string
  choices: string[]
  correctIndex: number
  explanation: string
}
interface Props { slug: string; meta: TestMeta; questions: QuestionClient[] }

export default function TestEngine({ slug, meta, questions }: Props) {
  const router = useRouter()
  const durationSec = questions.length * 90
  const [timeLeft, setTimeLeft] = useState(durationSec)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(number|null)[]>(Array(questions.length).fill(null))
  const [marked, setMarked] = useState<boolean[]>(Array(questions.length).fill(false))
  const [touched, setTouched] = useState<boolean[]>(Array(questions.length).fill(false))

  const sessionKey = `attempt:${slug}`

  // restore
  useEffect(()=>{
    const raw = localStorage.getItem(sessionKey)
    if (raw) {
      try {
        const data = JSON.parse(raw)
        setTimeLeft(data.timeLeft ?? durationSec)
        setIdx(data.idx ?? 0)
        setAnswers(data.answers ?? answers)
        setMarked(data.marked ?? marked)
        setTouched(data.touched ?? touched)
      } catch {}
    }
    // warn on close
    const handle = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handle)
    return ()=> window.removeEventListener('beforeunload', handle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // countdown
  useEffect(()=>{
    if (timeLeft <= 0) { submit(true); return }
    const t = setInterval(()=> setTimeLeft((s)=> s-1), 1000)
    return ()=> clearInterval(t)
  }, [timeLeft])

  // autosave
  useEffect(()=>{
    const saver = setInterval(()=> {
      localStorage.setItem(sessionKey, JSON.stringify({ timeLeft, idx, answers, marked, touched, meta }))
    }, 5000)
    return ()=> clearInterval(saver)
  }, [timeLeft, idx, answers, marked, touched, meta, sessionKey])

  function choose(option: number) {
    const next = answers.slice()
    next[idx] = option
    setAnswers(next)
    const t = touched.slice(); t[idx] = true; setTouched(t)
  }
  function clearAns() {
    const next = answers.slice()
    next[idx] = null
    setAnswers(next)
  }
  function toggleMark() {
    const m = marked.slice(); m[idx] = !m[idx]; setMarked(m)
  }
  function go(i: number) { setIdx(i) }

  function submit(auto=false) {
    const attempted = answers.filter((a) => a !== null).length
    
const correct = answers.reduce<number>(
  (acc, a, i) => acc + ((a === questions[i].correctIndex) ? 1 : 0),
  0
)

    const wrong = attempted - correct
    const score = computeScore(correct, wrong)
    const sessionId = `${slug}-${Date.now()}`
    const payload = {
      sessionId, slug, meta,
      attemptedCount: attempted,
      correctCount: correct,
      wrongCount: wrong,
      timeUsed: durationSec - Math.max(0, timeLeft),
      perQuestion: questions.map((q, i)=> ({
        q: q.questionText, user: answers[i], correct: q.correctIndex, explanation: q.explanation
      }))
    }
    localStorage.setItem(`result:${sessionId}`, JSON.stringify(payload))
    localStorage.removeItem(sessionKey)
    router.push(`/results/${encodeURIComponent(sessionId)}`)
  }

  const current = questions[idx]
  const pulse = timeLeft <= 300

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left: Q & controls */}
      <div className="flex-1 space-y-4">
        <div className={`rounded border p-3 text-sm font-medium text-center ${pulse ? 'animate-pulse border-red-300' : ''}`}>
          Time left: <span className="font-semibold">{formatDuration(Math.max(0, timeLeft))}</span>
          <button onClick={()=> submit(false)} className="ml-4 px-3 py-1 rounded bg-red-600 text-white">Submit Test</button>
        </div>

        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500">Question {idx+1} of {questions.length}</div>
          <div className="font-medium mt-2">{current.questionText}</div>
          <div className="mt-3 space-y-2">
            {current.choices.map((c, i)=> (
              <label key={i} className="flex items-center gap-3 border rounded p-2">
                <input type="radio" name="opt" checked={answers[idx]===i} onChange={()=> choose(i)} />
                <span>{['A','B','C','D'][i]}) {c}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={()=> go(Math.max(0, idx-1))} className="px-3 py-2 rounded border">Previous</button>
            <button onClick={()=> go(Math.min(questions.length-1, idx+1))} className="px-3 py-2 rounded border">Next</button>
            <button onClick={toggleMark} className="px-3 py-2 rounded border">{marked[idx] ? 'Unmark Review' : 'Mark for Review'}</button>
            <button onClick={clearAns} className="px-3 py-2 rounded border">Clear</button>
            <button onClick={()=> submit(false)} className="px-3 py-2 rounded bg-primary text-white">Save & Submit</button>
          </div>
        </div>
      </div>

      {/* Right: palette */}
      <aside className="w-full md:w-64">
        <div className="border rounded p-3">
          <div className="font-semibold mb-2">Question Palette</div>
          <div className="grid grid-cols-8 md:grid-cols-6 gap-2">
            {questions.map((_, i)=> {
              const isCurrent = i === idx
              const isAnswered = answers[i] !== null
              const isMarked = marked[i]
              return (
                <button key={i} onClick={()=> go(i)}
                  className={`h-8 w-8 rounded text-sm border focus:ring-2 focus:ring-indigo-600 ${isCurrent ? 'ring-2 ring-indigo-600' : ''} ${isAnswered ? 'bg-green-600 text-white' : ''}`}>
                  <span className="relative">{i+1}{isMarked ? <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-indigo-600"></span> : null}</span>
                </button>
              )
            })}
          </div>
        </div>
      </aside>
    </div>
  )
}
