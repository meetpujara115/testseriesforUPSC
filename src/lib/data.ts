import { promises as fs } from 'fs'
import path from 'path'
import { parse } from 'papaparse'
import { z } from 'zod'
import type { Question, TestMeta, Subject } from './types'

const rowSchema = z.object({
  subject: z.enum(['Polity', 'History', 'Art & Culture', 'Geography']),
  topic: z.string().optional().default(''),
  year: z.coerce.number(),
  testSlug: z.string().min(1),
  qType: z.literal('MCQ_SINGLE'),
  questionText: z.string().min(1),
  choices: z.string().min(3),
  correctIndex: z.coerce.number().min(0).max(3),
  explanation: z.string().optional().default(''),
})

function parseCSV(raw: string): Question[] {
  const { data } = parse<string[]>(raw.trim(), { delimiter: ',', skipEmptyLines: true })
  if (!data.length) return []
  const header = data[0].map(h => h.trim())
  const rows = data.slice(1)
  const idx = (k: string) => header.indexOf(k)
  const questions: Question[] = []
  for (const r of rows) {
    const obj = {
      subject: r[idx('subject')] as any,
      topic: r[idx('topic')] || '',
      year: r[idx('year')] || '',
      testSlug: r[idx('testSlug')] || '',
      qType: r[idx('qType')] || 'MCQ_SINGLE',
      questionText: r[idx('questionText')] || '',
      choices: r[idx('choices')] || '',
      correctIndex: r[idx('correctIndex')] || '',
      explanation: r[idx('explanation')] || '',
    }
    const parsed = rowSchema.safeParse(obj)
    if (!parsed.success) continue
    const row = parsed.data
    const choices = row.choices.split(';').map(c => c.replace(/^([A-D]\)\s*)/, '').trim())
    questions.push({ ...row, choices })
  }
  return questions
}

export async function getTestMetaList(): Promise<TestMeta[]> {
  const dataDir = path.join(process.cwd(), 'data')
  const metas: TestMeta[] = []
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) await walk(full)
      if (e.isFile() && e.name.endsWith('.csv')) {
        const raw = await fs.readFile(full, 'utf-8')
        const questions = parseCSV(raw)
        if (!questions.length) continue
        const { testSlug, subject, topic, year } = questions[0]
        metas.push({
          slug: testSlug,
          subject: subject as Subject,
          topic: topic || '',
          year: Number(year),
          questionCount: questions.length,
          title: `${subject}${topic ? ' — ' + topic : ''} (${year})`,
        })
      }
    }
  }
  await walk(dataDir)
  // unique by slug
  const seen = new Set<string>()
  return metas.filter(m => {
    if (seen.has(m.slug)) return false
    seen.add(m.slug)
    return true
  }).sort((a,b)=> a.title.localeCompare(b.title))
}

export async function getTestBySlug(slug: string): Promise<{ meta: TestMeta, questions: Question[] }> {
  const dataDir = path.join(process.cwd(), 'data')
  const entries = await fs.readdir(dataDir, { withFileTypes: true })
  let found: Question[] | null = null
  async function search(dir: string) {
    const list = await fs.readdir(dir, { withFileTypes: true })
    for (const e of list) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) await search(full)
      if (e.isFile() && e.name.endsWith('.csv')) {
        const raw = await fs.readFile(full, 'utf-8')
        const questions = parseCSV(raw)
        if (questions[0]?.testSlug === slug) { found = questions; return }
      }
    }
  }
  for (const e of entries) {
    const full = path.join(dataDir, e.name)
    if (e.isDirectory()) await search(full)
  }
  if (!found) throw new Error('Test not found')
  const q: Question[] = found!
  const { subject, topic, year, testSlug } = q[0]
  const meta: TestMeta = {
    slug: testSlug,
    subject: subject as Subject,
    topic: topic || '',
    year: Number(year),
    questionCount: q.length,
    title: `${subject}${topic ? ' — ' + topic : ''} (${year})`,
  }
  return { meta, questions: q }
}
