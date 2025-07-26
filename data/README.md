# Adding Tests via CSV

Each file = one test. Keep header exactly:

```
subject,topic,year,testSlug,qType,questionText,choices,correctIndex,explanation
```

- `subject`: Polity | History | Art & Culture | Geography
- `topic`: short label (Ancient/Medieval/Modern for History) or blank
- `year`: number, e.g. 2020
- `testSlug`: short id (used in URL). Must be unique per test.
- `qType`: MCQ_SINGLE
- `choices`: `A) ...;B) ...;C) ...;D) ...` (semicolon separated)
- `correctIndex`: 0=A, 1=B, 2=C, 3=D
- `explanation`: short reason (optional)

Upload CSVs inside the right subject folder (polity/history/art-culture/geography). Vercel auto‑deploys after you save in GitHub.
