# Longitudinal Drift Attribution for Large Language Models (LLMs)
## A Subgroup-Aware Framework for Safety, Fairness, and Factuality

An academic AI/ML research platform and experimentation dashboard designed for IEEE publication benchmarking. The system detects and attributes behavioral distribution drift in Large Language Models across repeated evaluation rounds ($R_1 \dots R_{10}$), localizes temporal change points, and isolates whether protected demographic subgroups are disproportionately impacted across safety, fairness, and factuality dimensions.

---

### Core Research Questions Answered by the Dashboard

1. **Did the LLM drift?** — Yes, composite behavioral drift score reaches $0.67$ ($p < 0.001$).
2. **When did it drift?** — Statistically confirmed change point localized at **Round 6 (R6)**.
3. **Which dimensions changed?** — Safety violations $+12.4\%$, Fairness disparity $+8.7\%$, Factual errors $+10.2\%$.
4. **Were subgroups disproportionately affected?** — **Group C (Disability & Age)** experienced the largest disparity widening ($+31\%$), followed by **Group A** ($+18\%$), while Group D and E remained resilient ($+4\text{--}5\%$).
5. **How did safety, fairness, and factuality change?** — Post-drift co-occurrence showed jailbreak susceptibility surging 4.5x, disparity exceeding $0.20$ tolerance, and temporal factual hallucinations doubling.

---

## 1. Installation

Ensure you have Node.js 18+ installed on your system.

```bash
# Clone or navigate to the project directory
cd <project-folder>

# Install frontend dependencies
npm install
```

---

## 2. Running the Frontend

To start the Vite development server:

```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:3000
```

To create an optimized production build:
```bash
npm run build
```

---

## 3. Environment Variables

Configure environment variables in your `.env` or `.env.local` file:

```env
# URL of your existing Python backend service (default: http://localhost:8000)
VITE_API_BASE_URL="http://localhost:8000"
```

A template `.env.example` file is included in the project root.

---

## 4. Backend API Configuration

The frontend communicates with your backend via REST endpoints centralized in `src/services/api.ts`.

### Expected API Endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health probe & service ping |
| `GET` | `/api/v1/experiments` | List all historical experiments |
| `GET` | `/api/v1/experiments/:id` | Fetch specific experiment details |
| `POST` | `/api/v1/experiments` | Create new evaluation run |
| `POST` | `/api/v1/experiments/:id/evaluate` | Dispatch model evaluation rounds |
| `GET` | `/api/v1/experiments/:id/drift` | Longitudinal drift scores across rounds ($R_1 \dots R_{10}$) |
| `GET` | `/api/v1/experiments/:id/subgroups` | Subgroup disparity trajectories ($G_A \dots G_E$) |
| `GET` | `/api/v1/experiments/:id/safety` | Safety violation & refusal rate metrics |
| `GET` | `/api/v1/experiments/:id/fairness` | Demographic parity & equalized differences |
| `GET` | `/api/v1/experiments/:id/factuality` | Factual error rates & hallucination scores |
| `GET` | `/api/v1/experiments/:id/change-points` | Change-point detection statistics ($U^*, \tau, p\text{-val}$) |
| `GET` | `/api/v1/prompts` | Evaluation prompt bank & invariants |
| `POST` | `/api/v1/prompts` | Create or update prompt invariant |
| `DELETE` | `/api/v1/prompts/:id` | Delete prompt invariant |

---

## 5. Mock Data Mode & Research Integrity

When the Python backend is offline or unreachable, the application automatically activates **Illustrative Demo Mode**:

- Displays a clear `[DEMO DATA - Illustrative results]` badge in the top navigation header.
- Provides realistic, scientifically coherent evaluation values across 10 evaluation rounds ($R_1 \dots R_{10}$).
- Clearly distinguishes simulated illustrative values from actual empirical measurements in compliance with IEEE research standards.
- You can toggle between Demo Mode and Live API at any time in the **Settings** modal or via the sidebar footer.

---

## 6. Connecting Your Existing Python Backend

Your existing Python project structure is preserved:

```bash
# In your Python repository root
source .venv/bin/activate

# Install requirements if needed
pip install -e .

# Launch FastAPI / Uvicorn server on port 8000
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

Once the backend is listening on `http://localhost:8000`, open the dashboard settings, click **Test Ping**, and the indicator will switch to `Connected (Py)`.

---

## 7. Project Structure

```
├── .env.example                       # Environment template
├── index.html                         # Entry HTML with IEEE STIX / Latin typography
├── package.json                       # Dependencies (React, Recharts, Lucide, Tailwind)
├── README.md                          # Documentation & reproduction guide
├── vite.config.ts                     # Vite + Tailwind configuration
└── src/
    ├── App.tsx                        # Root application container & page router
    ├── main.tsx                       # React DOM entry point
    ├── index.css                      # IEEE publication typography utilities
    ├── types/
    │   └── index.ts                   # Strongly typed scientific data contracts
    ├── data/
    │   └── mockData.ts                # Coherent 10-round longitudinal dataset
    ├── services/
    │   └── api.ts                     # Centralized API service with auto-fallback
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx             # Research context header & integrity alerts
    │   │   └── Sidebar.tsx            # Persistent navigation sidebar & telemetry
    │   └── common/
    │       ├── LoadingState.tsx       # Scientific loading & error states
    │       └── SettingsModal.tsx      # API health probe & mock toggle modal
    └── pages/
        ├── DashboardPage.tsx          # 6 Research answers, main drift chart, dimensions
        ├── ExperimentSetupPage.tsx    # Parameter configuration & execution monitor
        ├── PromptBankPage.tsx         # Invariant & prompt management CRUD
        ├── DriftAnalysisPage.tsx      # MMD drift formulation & velocity acceleration
        ├── SubgroupAnalysisPage.tsx   # Subgroup drift curves (Groups A-E) & ranking
        ├── SafetyAnalysisPage.tsx     # 0-25% violation rate & threat breakdown
        ├── FairnessAnalysisPage.tsx   # 0-0.50 disparity & grouped bar comparison
        ├── FactualityAnalysisPage.tsx # 0-25% error rate & knowledge domain audit
        ├── ChangePointPage.tsx        # Posterior probability curve (R6 peak)
        ├── ExperimentHistoryPage.tsx  # Run audit log & checkpoint loader
        ├── ReportsPage.tsx            # IEEE printable summary, CSV/JSON, LaTeX figure
        └── ArchitecturePage.tsx       # Interactive 13-stage pipeline flowchart
```

---

## 8. Publication Figure & Reporting Export

In the **Reports** page, you can:
- **Print / Save as PDF**: Formatted clean view for research reviews.
- **Export CSV**: Download round-by-round metrics for custom R or Python Pandas plotting.
- **Download JSON Results**: Export complete data structures and confidence statistics.
- **Copy LaTeX Figure**: Ready-to-paste `\begin{figure*}` snippet for IEEEtran Overleaf papers.
