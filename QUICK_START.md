# Quick Start Guide - CarHub MERN Stack

## 1️⃣ Prerequisites
- Node.js 18+ (Download from nodejs.org)
- MongoDB (Download or use MongoDB Atlas cloud)
- OpenAI API Key (Get from platform.openai.com)

## 2️⃣ Installation Steps

### Step 1: Navigate to project folder
```bash
cd car_showcase
```

### Step 2: Install all dependencies
```bash
npm run install:all
```

### Step 3: Configure Backend

Go to `backend` folder:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add:
- MONGODB_URI (local or MongoDB Atlas connection string)
- OPENAI_API_KEY (your OpenAI API key)

### Step 4: Configure Frontend

Go to `frontend` folder:
```bash
cd frontend
cp .env.example .env
```

Frontend .env is usually ready, but verify:
- VITE_API_URL=http://localhost:5000/api

### Step 5: Seed Database

```bash
cd backend
npm run seed
```

This adds 16 sample cars to MongoDB.

## 3️⃣ Run the Application

### Option A: Run Both at Once
```bash
npm run dev
```

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

## 4️⃣ Access the Application

- **Frontend**: http://localhost:3000 ✨
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 5️⃣ Try the Features

### Test AI Recommendations
1. Scroll to "AI Recommender" section
2. Enter query: "Family SUV under 20 lakh"
3. See AI-powered recommendations!

### Test Car Comparison
1. Browse car grid
2. Select 2 cars (checkboxes)
3. Click "Compare Selected"
4. View detailed AI comparison

## 6️⃣ Folder Structure

```
car_showcase/
├── backend/          ← Express server & APIs
├── frontend/         ← React app
└── README.md         ← Full documentation
```

## 🆘 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or use MongoDB Atlas
- Check connection string in .env

### OpenAI Error
- Verify API key is correct
- Ensure you have credits/quota

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: Modify vite.config.js server.port

### Dependencies Not Installed
```bash
npm run install:all
```

## 📚 Key Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Run both backend & frontend |
| `npm run seed` | Add sample cars to database |
| `npm run build` | Build for production |
| `npm install:all` | Install all dependencies |

## 🎉 You're Ready!

The MERN car marketplace is ready to use. Impress with:
- 🤖 AI Recommendations
- 📊 AI Comparisons
- ✨ Premium UI
- 🚀 Production-ready code

Good luck with your internship applications! 💪
