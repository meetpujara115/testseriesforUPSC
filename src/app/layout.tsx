import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'testseriesforUPSC.in',
  description: 'UPSC Test Series — Free trial with PYQs. No login required.',
  openGraph: {
    title: 'testseriesforUPSC.in',
    description: 'UPSC Test Series — Free trial with PYQs. No login required.',
    url: 'https://testseriesforupsc.in',
    siteName: 'testseriesforUPSC.in',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="font-semibold text-lg">testseriesforUPSC.in</Link>
            <nav className="flex gap-5 text-sm">
  <Link href="/">Home</Link>
  <Link href="/tests">Tests</Link>
  <Link href="/ib">IB PYQs</Link>    {/* <— add this line */}
  <Link href="/about">About</Link>
  <Link href="/faq">FAQ</Link>
  <Link href="/privacy">Privacy</Link>
</nav>

          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="border-t">
          <div className="container py-6 text-sm text-gray-600">
            © {new Date().getFullYear()} testseriesforUPSC.in
          </div>
        </footer>
      </body>
    </html>
  )
}
