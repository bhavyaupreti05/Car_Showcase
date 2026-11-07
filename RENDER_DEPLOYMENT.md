# 🚀 Deploying Car Showcase to Render

This project is fully configured to deploy on [Render](https://render.com) as a single high-performance Web Service (combining both the Node.js Express backend and Vite React frontend on a unified port with zero CORS issues), or via Render's automated Blueprint.

---

## ⚡ Option 1: Automated 1-Click Blueprint (Recommended)

1. **Push your latest changes to GitHub**:
   ```bash
   git add .
   git commit -m "Configure fullstack deployment for Render"
   git push origin master
   ```

2. Go to your [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** in the top right and select **Blueprint**.
4. Connect your repository: `bhavyaupreti05/Car_Showcase`.
5. Render will automatically parse `render.yaml` and configure:
   - **Service Name**: `car-showcase`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/api/health`
6. Click **Apply**.

---

## 🛠️ Option 2: Manual Web Service Setup

If you prefer creating a Web Service directly:

1. In Render Dashboard, click **New +** ➔ **Web Service**.
2. Select your repository: `bhavyaupreti05/Car_Showcase`.
3. Fill in the following settings:
   - **Name**: `car-showcase`
   - **Language / Runtime**: `Node`
   - **Branch**: `master` (or `main`)
   - **Region**: Choose the region closest to you (e.g., `Oregon`, `Frankfurt`, `Singapore`)
   - **Build Command**:
     ```bash
     npm run build
     ```
   - **Start Command**:
     ```bash
     npm run start
     ```
   - **Plan**: `Free`

---

## 🔑 Environment Variables to Configure on Render

In the **Environment** tab of your Render Web Service, add the following environment variables:

| Variable | Recommended Value / Notes |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (or leave default, Render sets this automatically) |
| `MONGODB_URI` | *(Optional)* Your MongoDB Atlas connection string.<br>*(Note: If omitted, the backend runs gracefully with the built-in 16-car in-memory engine!)* |
| `OPENAI_API_KEY` | *(Optional)* Your OpenAI API key for AI Recommender features.<br>*(Note: Built-in deterministic semantic fallback works if not provided!)* |
| `FRONTEND_URL` | *(Optional)* Leave blank for unified deployment. |

---

## 🧪 How It Works Under The Hood

- **Unified Routing**: Express serves the compiled Vite assets from `frontend/dist` on `/` while serving all REST endpoints on `/api`.
- **Zero CORS Headaches**: Since both the frontend and backend share the same domain (`https://car-showcase-xxxx.onrender.com`), browsers make same-origin requests seamlessly.
- **Graceful Fallbacks**: If MongoDB or OpenAI is not connected yet, the platform safely uses the built-in 16 supercar catalogue and custom vector similarity algorithms without crashing.

