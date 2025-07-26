import Link from "next/link";

export const metadata = { title: "IB PYQs" };

export default function IBPage() {
  return (
    <section className="container py-8">
      <h1 className="text-3xl font-bold mb-4">IB ACIO – Previous Year Papers</h1>
      <p className="mb-6">Choose a paper to attempt:</p>

      {/* Placeholder list – we’ll wire these up next */}
      <ul className="list-disc pl-6 space-y-2">
  <li><Link href="/test/2024-01-17-shift-3">Jan 17, 2024 – Shift 3</Link></li>
  <li><Link href="/test/2024-01-17-shift-4">Jan 17, 2024 – Shift 4</Link></li>
  <li><Link href="/test/2024-01-18-shift-1">Jan 18, 2024 – Shift 1</Link></li>
  <li><Link href="/test/2024-01-18-shift-2">Jan 18, 2024 – Shift 2</Link></li>
  <li><Link href="/test/2024-01-18-shift-3">Jan 18, 2024 – Shift 3</Link></li>
</ul>

    </section>
  );
}
