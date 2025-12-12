# NutriAI Frontend

React + Vite application for AI-powered nutrition chat interface.

## Quick Start

```bash
npm install
npm run dev
```

Visits http://localhost:5173

## Features

- 💬 Real-time chat with Gemini AI
- 📱 Responsive design (mobile & desktop)
- 🔄 Automatic conversation syncing
- 💾 Conversation history with persistence
- 🎨 Modern UI with Tailwind CSS
- ✅ React Query for state management

## Tech Stack

- **React** 18.2
- **Vite** 4.4
- **React Query** 3.39
- **Tailwind CSS** 3.3
- **Lucide Icons**
- **Supabase** (backend)

## Deployment

Build for production:

```bash
npm run build
```

Deploy to GitHub Pages, Vercel, or Netlify.

## Project Structure

```
src/
├── components/        # React components
│   ├── ChatWindow.jsx
│   ├── ConversationSidebar.jsx
│   ├── AuthForms.jsx
│   └── DashboardLayout.jsx
├── App.jsx           # Main app
├── main.jsx          # Entry point
└── index.css         # Styles
```

## Backend

Requires NutriAI backend API running on `http://localhost:3000`

See parent directory for backend setup.
