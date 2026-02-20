# 🚀 AI SDLC Demo - Quick Start Guide

## What You Have

A complete **Django + React** application for generating **BRD** and **TAP** documents using **Azure AI Foundry agents**.

## 📋 Prerequisites

- Python 3.11+
- Node.js 16+ (for React frontend)
- Azure OpenAI account with agent deployment
- Git

## ⚡ Quick Start (5 minutes)

### Backend Setup

```powershell
# Navigate to backend
cd backend

# Run setup script (creates venv, installs deps, runs migrations)
.\setup.ps1

# Configure environment
# Edit .env with your Azure OpenAI credentials
notepad .env

# Start server
python manage.py runserver
```

Server runs at: **http://localhost:8000**

### Frontend Setup (Optional)

```powershell
# Navigate to project root
cd ..

# Install dependencies
npm install

# Start React app
npm start
```

React app runs at: **http://localhost:3000**

## 🔧 Configuration Checklist

### 1. Azure OpenAI Setup

Get these from Azure Portal:

```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=your-deployment-name
```

Update in `backend/.env`

### 2. Django Admin Configuration

```powershell
# Access admin panel
# URL: http://localhost:8000/admin
# Login with superuser credentials created during setup

# Configure agents:
# 1. Go to "Agent Configurations"
# 2. Add BRD Agent:
#    - Name: BRD Generator
#    - Type: Business Requirements Document
#    - Azure Agent ID: (from Azure AI Foundry)
#    - Fill in endpoint, API key, deployment
# 3. Add TAP Agent:
#    - Name: TAP Generator  
#    - Type: Technical Architecture Plan
#    - Same Azure credentials
```

### 3. Test the API

**Test health endpoint:**
```powershell
curl http://localhost:8000/health/
```

**Generate BRD (using PowerShell):**
```powershell
$headers = @{ "Content-Type" = "application/json" }
$body = @{
    project_name = "Test Project"
    project_description = "A test project"
    stakeholders = "Team A, Team B"
    objectives = "Complete in 1 month"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:8000/api/agents/brd/generate/" `
    -Headers $headers -Body $body
```

## 📚 Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/` | GET | Django admin panel |
| `/health/` | GET | Health check |
| `/api/agents/configurations/` | GET | List agents |
| `/api/agents/brd/generate/` | POST | Generate BRD |
| `/api/agents/tap/generate/` | POST | Generate TAP |
| `/api/documents/generated/` | GET | List documents |

## 🎯 Typical Workflow

1. **Configure agents** in Django admin
2. **Upload document templates** (optional DOCX templates)
3. **Call API** to generate documents:
   - BRD: `/api/agents/brd/generate/`
   - TAP: `/api/agents/tap/generate/`
4. **Download results** from `/api/documents/generated/`

## 📁 Project Structure

```
ai-sdlc-demo/
├── backend/               # Django backend
│   ├── app/
│   │   ├── agents/       # AI agent logic
│   │   ├── documents/    # Document processing
│   │   └── core/         # Auth & core features
│   ├── config/           # Django settings
│   ├── manage.py         # Django CLI
│   └── requirements.txt  # Python dependencies
├── src/                  # React frontend
│   ├── UltraAiDeliveryHub.jsx
│   └── ...
└── package.json          # Node dependencies
```

## 🔍 Troubleshooting

### Backend won't start?
```powershell
# Activate venv
cd backend
.\venv\Scripts\Activate.ps1

# Reinstall deps
pip install -r requirements.txt

# Run migrations
python manage.py migrate
```

### Can't access admin?
```powershell
# Create superuser
python manage.py createsuperuser
```

### API returns 500?
- Check `.env` file has correct Azure credentials
- Verify agent configuration in admin panel
- Check logs: `backend/logs/django.log`

### Import errors?
- Make sure virtual environment is activated
- Look for `(venv)` prefix in terminal

## 🌐 Deploy to Azure

```powershell
cd backend
.\deploy_azure.ps1
```

This creates:
- Azure App Service
- PostgreSQL database (optional)
- Configured environment variables

## 📖 Full Documentation

- **Backend Details**: `BACKEND_IMPLEMENTATION.md`
- **API Reference**: `backend/README.md`
- **Architecture**: See code comments

## 🆘 Need Help?

1. Check logs: `backend/logs/django.log`
2. Verify `.env` configuration
3. Ensure Azure AI agents are deployed
4. Check admin panel for agent configuration

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Superuser created
- [ ] `.env` configured with Azure credentials
- [ ] Agents configured in admin panel
- [ ] Health endpoint returns OK
- [ ] Can generate BRD via API
- [ ] Can generate TAP via API
- [ ] Documents download successfully

## 🎉 You're Ready!

Your AI-powered document generation system is ready to use!

**Next:** Configure agents in admin panel and start generating documents!
