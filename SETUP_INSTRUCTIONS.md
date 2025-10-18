# Quick Setup Instructions

## 1. Create Environment File

Create a `.env.local` file in your project root (same level as `package.json`) with the following content:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-actual-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 2. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings (gear icon)
4. Scroll to "Your apps" section
5. Click "Web app" icon (</>)
6. Register app with name "AIDESK SPACE Web"
7. Copy the configuration values to your `.env.local` file

## 3. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Enable "Google" provider
6. Add your support email and save

## 4. Restart Development Server

After creating the `.env.local` file:

```bash
npm run dev
```

## 5. Test Authentication

1. Click "Get Started" or "Sign In" in the app
2. Try creating an account with email/password
3. Try signing in with Google
4. Check Firebase Console > Authentication > Users to see registered users

## Troubleshooting

- **API Key Error**: Make sure your `.env.local` file has the correct Firebase configuration
- **Google Sign-In Not Working**: Check that Google provider is enabled in Firebase Console
- **Environment Variables Not Loading**: Restart your development server after creating `.env.local`

