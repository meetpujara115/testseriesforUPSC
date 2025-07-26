// src/app/ib/page.tsx
import { promises as fs } from 'fs';
import path from 'path';

type Entry = { exam: string; date: string; shift: number; slug: string };

async function getIbSets(): Promise<Entry[]> {
  const dir = path.join(process.cwd(), 'data', 'ib');
  let entries: Entry[] = [];
  try {
    const slugs = await fs.readdir(dir);
    for (const slug of slugs) {
      try {
        const raw = await fs.readFile(path.join(dir, slug, 'answers.json'), 'utf-8');
        const j = JSON.parse(raw);
        entries.push({ exam: j.exam, date: j.date, shift: j.shift, slug });
      } catch {
        // ignore folders without answers.json
      }
    }
  } catch {
    // no /data/ib yet
  }
  // newest on top
  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.shift - a.shift));
  return entries;
}

export default async function Page() {
  const sets = await getIbSets();

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">IB ACIO PYQ Answer Keys</h1>
      {sets.length === 0 ? (
        <p>No IB sets found yet.</p>
      ) : (
        <ul className="space-y-4">
          {sets.map((s) => (
            <li key={s.slug} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.exam}</div>
                <div className="text-sm text-gray-600">{s.date} — Shift {s.shift}</div>
              </div>
              <a className="btn" href={`/ib/${s.slug}`}>Open</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
