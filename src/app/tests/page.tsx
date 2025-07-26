import { getTestMetaList } from '@/lib/data'
import TestList from './TestList'

export const revalidate = 0

export default async function TestsPage() {
  const tests = await getTestMetaList()
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Tests</h1>
      <TestList tests={tests} />
    </div>
  )
}
