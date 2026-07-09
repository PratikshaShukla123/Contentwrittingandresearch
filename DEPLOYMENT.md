# Deployment Guide

This guide provides step-by-step instructions on deploying the AI Grant Writing application to production. Since the architecture is decoupled, we recommend deploying the **Frontend to Vercel** and the **Backend to Render, AWS, or GCP**.

---

## 1. Frontend Deployment (Vercel)

Vercel is the optimal platform for Next.js applications, offering zero-configuration deployments and excellent edge performance.

1. **Push your code to GitHub**: Ensure your `main` branch is up-to-date.
2. **Import Project**: Log in to [Vercel](https://vercel.com) and click **Add New... > Project**.
3. **Select Repository**: Import your GitHub repository (`Contentwrittingandresearch`).
4. **Configure Project**:
   - **Framework Preset**: Next.js (Vercel will auto-detect this).
   - **Root Directory**: Set this to `frontend`.
5. **Environment Variables**: Add the following variable in the Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://api.yourdomain.com`). *You will need to update this after deploying the backend.*
6. **Deploy**: Click the Deploy button. Vercel will automatically build the standalone application and assign a live URL.

---

## 2. Backend Deployment (Render / AWS / GCP)

The backend is fully containerized, making it easy to deploy to any cloud provider that supports Docker.

### Option A: Render (Easiest)
Render offers managed PostgreSQL and easy Docker deployments.

1. **Database Setup**:
   - In the Render Dashboard, create a new **PostgreSQL** database.
   - Note the **Internal Database URL** provided.
2. **Web Service Setup**:
   - Create a new **Web Service** and connect your GitHub repo.
   - **Root Directory**: Set to `backend`.
   - **Environment**: Select `Docker`.
3. **Environment Variables**:
   - `DATABASE_URL`: Paste the Internal Database URL from step 1.
   - `OPENAI_API_KEY`: Your OpenAI key.
   - `ANTHROPIC_API_KEY`: Your Anthropic key (optional).
4. **Deploy**: Render will automatically build the Dockerfile and start the Uvicorn server.

### Option B: AWS (ECS / EC2) or GCP (Cloud Run)
1. **Push Image**: Build the backend Docker image and push it to a container registry (ECR or GCR):
   ```bash
   cd backend
   docker build -t your-registry/grant-backend:latest .
   docker push your-registry/grant-backend:latest
   ```
2. **Database Setup**: Provision an AWS RDS PostgreSQL instance or Google Cloud SQL instance. Ensure you enable `pgvector` extensions if necessary.
3. **Deploy Container**: 
   - Deploy the pushed image to AWS ECS/Fargate or Google Cloud Run.
   - Expose port `8000`.
   - Inject the `DATABASE_URL` and `OPENAI_API_KEY` into the container's environment variables.

---

## 3. Final Integration

1. Once the backend is deployed, copy its public URL.
2. Go back to your **Vercel** dashboard for the frontend.
3. Update the `NEXT_PUBLIC_API_URL` environment variable to point to your new backend URL.
4. Trigger a new deployment on Vercel so the frontend bakes in the correct API route.
