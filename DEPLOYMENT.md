# Deployment Guide - Patel Tent House Platform

This document describes how to build, test, and deploy the Patel Tent House website to production on Vercel and Firebase Hosting.

---

## 1. Local Development Setup

To run and test the application locally:

```bash
# Install dependencies (already completed)
npm install

# Run the local Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Admin Credentials (Local/Mock Mode)
- **Email**: `admin@pateltenthouse.com`
- **Password**: `admin12345`
- Dashboard URL: `/admin/dashboard` (redirects to `/admin/login` if not authenticated)

---

## 2. Setting Up Production Firebase

To connect the application to your actual Firebase project instead of the LocalStorage Mock Database:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project named `patel-tent-house`.
3. Enable **Authentication** (Email/Password sign-in method).
4. Enable **Cloud Firestore** database.
5. Create a Web App under your project settings and grab your Firebase Configuration object.
6. Create a `.env.local` file in the root of this project and paste your keys:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Once the environment variables are detected, the app automatically transitions from Mock Database to real Firestore collections (`bookings`, `reviews`, `settings`, `availability`, etc.).

---

## 3. Deploying to Vercel (Recommended)

Next.js App Router is optimized for **Vercel** serverless hosting.

### Method A: Vercel Git Integration
1. Push this project code to a GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, paste the Firebase variables listed above (if using real Firebase).
5. Click **Deploy**. Vercel will automatically configure the build pipelines.

---

## 4. Deploying to Firebase Hosting

If you want to host the app entirely on Firebase Hosting:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in and initialize:
   ```bash
   firebase login
   firebase init
   ```
   - Choose **Hosting: Configure files for Firebase Hosting**.
   - Select your Firebase Project.
   - Set the public directory to `.next` or configure the next export settings (for static exports, update `next.config.ts` with `output: 'export'` and set public dir to `out`).
3. Deploy:
   ```bash
   firebase deploy --only hosting
   ```
