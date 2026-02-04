# 🚀 CareerFlow AI – Smart Career Navigation & Job Matching Platform

CareerFlow AI is a full-stack AI-powered career guidance platform that helps students and job seekers make smarter career decisions using resume analysis, real-time job matching, skill gap detection, and personalized learning roadmaps.

It combines:

• React frontend (modern UI)  
• n8n automation backend (job aggregation engine)  
• Resume-based job matching  
• Skill assessment & adaptive training  

The system automatically analyzes resumes, fetches live jobs, ranks matches, and guides users step-by-step toward their career goals.

---

## ✨ Features

### 🎯 Core Features
- Resume ATS Analyzer
- Role-Based Resume Builder
- Smart Job Matching (resume → ranked jobs)
- Personalized Job Trend Analysis
- Skill Gap & Career Fit Analyzer
- Adaptive Career Roadmaps
- Technical + Soft Skills Training Modules
- Progress Dashboard
- Interview Readiness Module
- Salary & Growth Projection

---

### 🤖 Smart Job Matching
Upload or paste your resume → system:
1. Extracts skills
2. Sends data to n8n workflow
3. Fetches live job listings
4. Scores jobs by skill match
5. Returns ranked opportunities

---

### 🧠 Training Mode
- Adaptive skill tests
- Easy → Medium → Hard progression
- Anti-cheat protection
- Performance analytics

---

## 🏗 Architecture

### System Flow

```

Frontend (React)
↓
POST resume text
↓
n8n Webhook
↓
Extract skills
↓
Fetch jobs API
↓
Score & rank jobs
↓
Return JSON
↓
Frontend renders job cards

```

---

## 🛠 Tech Stack

### Frontend
- React / TypeScript
- Tailwind CSS
- Component-based architecture
- Fetch API

### Backend Automation
- n8n
- Webhooks
- HTTP Request nodes
- Function nodes (JavaScript logic)

### Job Sources
- Arbeitnow API
- Public job APIs

### Tools
- Docker
- Node.js
- REST APIs

---

## 📂 Project Structure

```

careerflow-ai/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── SmartJobMatching.tsx
│   └── App.tsx
│
├── n8n/
│   └── smart-resume-job-matcher-workflow.json
│
├── data/
│   ├── questions/
│   ├── roadmaps/
│   └── aptitude.json
│
└── README.md

````

---

## ⚙️ Setup Guide

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/careerflow-ai.git
cd careerflow-ai
````

---

### 2️⃣ Start Frontend

```bash
npm install
npm run dev
```

Runs at:

```
http://localhost:5173
```

---

### 3️⃣ Start n8n

### Option A — Docker (recommended)

```bash
docker run -it --rm -p 5678:5678 n8nio/n8n
```

Open:

```
http://localhost:5678
```

---

### 4️⃣ Import Workflow

Inside n8n:

1. Import workflow JSON
2. Open "Smart Resume Job Matcher"
3. Click **Publish**

Webhook becomes active at:

```
http://localhost:5678/webhook/resume-job-search
```

---

## 🔗 API Reference

### Smart Job Matching Endpoint

### POST

```
/webhook/resume-job-search
```

### Request

```json
{
  "resumeText": "React Node AWS SQL Docker"
}
```

### Response

```json
{
  "jobs": [
    {
      "title": "Frontend Developer",
      "company": "Company Inc",
      "location": "Remote",
      "url": "https://job-link",
      "score": 3
    }
  ]
}
```

---

## 🧪 Local Testing

```javascript
fetch('http://localhost:5678/webhook/resume-job-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resumeText: "React Node AWS Docker"
  })
})
.then(r => r.json())
.then(console.log)
```

---

## 🧩 How Job Matching Works

### Step 1

Resume text extracted

### Step 2

Skills detected:

```
["react","node","docker","aws"]
```

### Step 3

Fetch live jobs

### Step 4

Score each job:

```
score = number of matched skills
```

### Step 5

Sort & return top 10

---

## 📈 Future Improvements

* PDF resume parsing
* Multi-source job APIs
* AI embeddings matching
* Salary filters
* Location filters
* Cloud deployment
* User authentication
* Saved jobs
* Notifications

---

## 🚀 Why This Project Matters

Most students:

* don’t know what skills they lack
* apply randomly
* waste time

CareerFlow AI:
✔ data-driven
✔ skill-based
✔ personalized
✔ real-time

It replaces guesswork with actionable guidance.

---

## 📸 Demo Use Cases

* Resume optimization
* Skill assessment
* Roadmap generation
* Job matching
* Interview preparation

---

## 👨‍💻 Author

**Ashwin**
Full-stack developer | AI automation builder

---

## 📄 License

MIT License

```

---

# ✅ Done
This README now looks:
✔ professional  
✔ production grade  
✔ recruiter friendly  
✔ GitHub ready  

---

If you want next, I can also generate:
✅ workflow export JSON  
✅ architecture diagram  
✅ deployment guide  
✅ or GitHub badges + screenshots section  

Just say which.
```
