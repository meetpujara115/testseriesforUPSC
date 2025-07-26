import { getTestBySlug } from '@/lib/data'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function TestOverview({ params }: { params: { slug: string }}) {
  try {
    const { meta } = await getTestBySlug(params.slug)
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{meta.title}</h1>
        <ul className="text-gray-700 list-disc pl-6">
          <li>Subject: {meta.subject}{meta.topic ? ` (${meta.topic})` : ''}</li>
          <li>Year: {meta.year}</li>
          <li>Questions: {meta.questionCount}</li>
          <li>Duration: {meta.questionCount * 1.5} minutes (1.5 min per question)</li>
          <li>Marking: +2 correct, −2/3 wrong, 0 unattempted</li>
        </ul>
        <Link className="btn" href={`/test/${meta.slug}/start`}>Start Test</Link>
      </div>
    )
  } catch {
    notFound()
  }
}
