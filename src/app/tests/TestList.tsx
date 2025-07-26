'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { TestMeta } from '@/lib/types'

export default function TestList({ tests }: { tests: TestMeta[] }) {
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [year, setYear] = useState('')
  const [q, setQ] = useState('')

  const filtered = useMemo(()=>{
    return tests.filter(t => {
      return (!subject || t.subject === subject) &&
             (!topic || (t.topic||'').toLowerCase().includes(topic.toLowerCase())) &&
             (!year || String(t.year) === year) &&
             (!q || (t.title + ' ' + t.subject + ' ' + t.topic + ' ' + t.year).toLowerCase().includes(q.toLowerCase()))
    })
  }, [tests, subject, topic, year, q])

  const subjects = Array.from(new Set(tests.map(t=>t.subject)))
  const years = Array.from(new Set(tests.map(t=>t.year))).sort()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select className="border rounded px-3 py-2" value={subject} onChange={e=>setSubject(e.target.value)}>
          <option value="">All Subjects</option>
          {subjects.map(s=>(<option key={s} value={s}>{s}</option>))}
        </select>
        <input className="border rounded px-3 py-2" placeholder="Topic contains..." value={topic} onChange={e=>setTopic(e.target.value)} />
        <select className="border rounded px-3 py-2" value={year} onChange={e=>setYear(e.target.value)}>
          <option value="">Any Year</option>
          {years.map(y=>(<option key={y} value={String(y)}>{y}</option>))}
        </select>
        <input className="border rounded px-3 py-2" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(t => (
          <div key={t.slug} className="border rounded-lg p-4">
            <div className="text-sm text-gray-500">{t.subject}{t.topic ? ` • ${t.topic}` : ''}</div>
            <div className="font-semibold text-lg mt-1">{t.title}</div>
            <div className="text-sm text-gray-600 mt-1">{t.questionCount} questions • Duration {t.questionCount*1.5} min</div>
            <div className="mt-3">
              <Link className="btn" href={`/test/${t.slug}`}>View</Link>
            </div>
          </div>
        ))}
        {!filtered.length && (<div>No tests match your filters.</div>)}
      </div>
    </div>
  )
}
