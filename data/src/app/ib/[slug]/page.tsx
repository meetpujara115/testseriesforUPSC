// src/app/ib/[slug]/page.tsx
import { promises as fs } from 'fs';
import path from 'path';

type Answer = { qNo: number; answerIndex: number; answerLetter: string };
type Data = { exam: string; date: string; shift: number; answers: Answer[] };

async function load(slug: string): Promise<Data | null> {
  try {
    const p = path.join(process.cwd(), 'data', 'ib', slug, 'answers.json');
    const raw = await fs.readFile(p, 'utf-8');
    return JSON.parse(raw) as Data;
  } catch {
    return null;
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await load(params.slug);
  if (!data) {
    return <main className="container mx-auto px-4 py-10">Not found.</main>;
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-4">
        {data.exam} — {data.date} (Shift {data.shift})
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th className="p-2 border">Q</th>
              <th className="p-2 border">Answer</th>
            </tr>
          </thead>
          <tbody>
            {data.answers.map((a) => (
              <tr key={a.qNo}>
                <td className="p-2 border text-center">{a.qNo}</td>
                <td className="p-2 border text-center">{a.answerLetter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
