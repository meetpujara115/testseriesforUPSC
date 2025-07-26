'use client'
import { useEffect, useState } from 'react'
import { formatDuration, computeScore } from '@/lib/utils'
import Link from 'next/link'

export default function ResultsPage({ params }: { params: { sessionId: string }}) {
  const [data, setData] = useState<any>(null)

  useEffect(()=>{
    const raw = localStorage.getItem(`result:${params.sessionId}`)
    if (raw) setData(JSON.parse(raw))
  }, [params.sessionId])

  if (!data) return <div>Result not found.</div>

  const attempted = data.attemptedCount
  const correct = data.correctCount
  const wrong = data.wrongCount
  const score = computeScore(correct, wrong)
  const accuracy = attempted ? Math.round((correct/attempted)*100) : 0

  function downloadJSON(){
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${data.sessionId}.json`; a.click()
    URL.revokeObjectURL(url)
  }

function downloadCSV() {
  // Build a typed 2D array: rows of cells
  const rows: (string | number | null | undefined)[][] = [
    ['question', 'userChoice', 'correctChoice', 'isCorrect', 'explanation'],
    ...data.perQuestion.map(
      (r: { q: string; user: number | null; correct: number; explanation: string }) => [
        r.q,
        r.user,
        r.correct,
        r.user === r.correct ? 'true' : 'false',
        (r.explanation ?? '').replace(/\n/g, ' ')
      ]
    ),
  ]

  // Convert to CSV (no TypeScript annotations in arrow params to avoid parser issues)
  const csv = rows
    .map(row =>
      row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
    )
    .join('\n')

  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.sessionId}.csv`
  a.click()
  URL.revokeObjectURL(url)
}


  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Results</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat label="Score" value={String(score)} />
        <Stat label="Attempted" value={String(attempted)} />
        <Stat label="Correct" value={String(correct)} />
        <Stat label="Wrong" value={String(wrong)} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
      </div>
      <div className="text-sm text-gray-600">Time used: {formatDuration(data.timeUsed)}</div>

      <div className="flex gap-3 mt-2">
        <button onClick={downloadJSON} className="px-3 py-2 rounded border">Download Attempt JSON</button>
        <button onClick={downloadCSV} className="px-3 py-2 rounded border">Download Attempt CSV</button>
        <Link className="btn" href="/tests">Back to Tests</Link>
      </div>

      <div className="mt-6">
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border text-left">Question</th>
              <th className="p-2 border">Your</th>
              <th className="p-2 border">Correct</th>
              <th className="p-2 border">Explanation</th>
            </tr>
          </thead>
          <tbody>
            {data.perQuestion.map((r:any, i:number)=>(
              <tr key={i}>
                <td className="p-2 border">{i+1}</td>
                <td className="p-2 border text-left">{r.q}</td>
                <td className={`p-2 border ${r.user===r.correct? 'text-green-700' : 'text-red-700'}`}>{['A','B','C','D'][r.user ?? -1] ?? '-'}</td>
                <td className="p-2 border">{['A','B','C','D'][r.correct]}</td>
                <td className="p-2 border">{r.explanation || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Stat({label, value}:{label:string; value:string}){
  return <div className="border rounded p-3 text-center">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
}
