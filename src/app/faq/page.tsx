export const metadata = {
  title: 'FAQ – testseriesforUPSC.in',
  description: 'Frequently asked questions.',
}
const faqs = [
  { q: 'Is it free?', a: 'Yes, this MVP is 100% free.' },
  { q: 'Do I need to log in?', a: 'No login is required.' },
  { q: 'How is time calculated?', a: '1.5 minutes per question.' },
  { q: 'How is marking done?', a: 'Correct +2, Wrong −2/3, Unattempted 0.' },
]
export default function FAQPage(){
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f=>({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
  }
  return (
    <article className="prose">
      <h1>FAQ</h1>
      <ul>{faqs.map((f,i)=>(<li key={i}><strong>{f.q}</strong><br/>{f.a}</li>))}</ul>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
    </article>
  )
}
