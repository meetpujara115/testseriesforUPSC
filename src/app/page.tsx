import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold">UPSC Test Series — Free trial with PYQs</h1>
      <p className="mt-4 text-gray-600">No login. No payment. Start a test and see your score instantly.</p>
      <div className="mt-8">
        <Link className="btn" href="/tests">Browse Tests</Link>
      </div>
    </section>
  )
}
