# testseriesforUPSC.in – Simple Start

## Run on your laptop
1) Install Node.js LTS (18+).  
2) Open a terminal inside this folder.  
3) Run:
   ```bash
   npm install
   npm run dev
   ```
4) Open http://localhost:3000

## Add questions
- Put CSV files under `data/` in the subject folder.
- Use `data/template.csv` as a starting row format.
- Each test must have a unique `testSlug`.

## Deploy (easy path)
- Create a GitHub account, upload this folder as a new repo.
- On vercel.com → New Project → Import from GitHub → Deploy.
- Then add your domain in Vercel → Settings → Domains.
