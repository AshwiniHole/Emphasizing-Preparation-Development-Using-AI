# 🤖 AI Mock Interview & Resume Builder Application

Welcome to the **AI Mock Interview & Resume Builder App**! This project is a comprehensive toolkit to help you practice for job interviews by simulating a real interview experience using AI, and to build ATS-friendly, professional resumes.

## 🌟 What is this Project?

This is a powerful web application designed to help job seekers, students, and professionals where you can:
1.  **Build Professional Resumes**: Create and standardize professional, ATS-friendly resumes with formatting templates (like the Mercury template). Export hard-copy PDFs instantly using standard sections (Location, Certifications, Awards, Languages, etc.).
2.  **Practice Mock Interviews**: Tell the AI about your target job role, industry, and experience level.
3.  **Real-Time Proctoring & Interviewing**: The AI generates relevant interview questions. The app actively proctors the session using computer vision (Face and Object Detection) and audio analysis (Voice Detection) to create a highly realistic interview environment.
4.  **Receive Instant Analytics & Feedback**: Get an emotional analysis of your answers, transcripts, and targeted tips to improve your interview skills.

---

## ✨ Key Features

-   **💼 Advanced Resume Builder**:
    -   Create highly structured resumes with standard sections (Experience, Education, Skills, Projects, Certifications, Awards, Languages).
    -   Professional Export: Download as a high-quality PDF (`react-to-print`).
    -   ATS-friendly design inspired by industry standards (e.g., Mercury template from FlowCV).
-   **🎯 Customized Mock Interviews**: Tailored to your specific Job Role, Industry, and Experience.
-   **📈 Progressive Difficulty**: Curated sets of questions based on chosen difficulty levels.
-   **🎤 Seamless Recording Flow**: Continuous microphone recording logic that automatically captures your speech.
-   **🛡️ Active Proctoring System**: 
    -   **Face & Object Detection**: Real-time webcam scanning via TensorFlow (`BlazeFace`, `COCO-SSD`) to warn if multiple people or a mobile phone is detected in the frame.
    -   **Real-Time Voice Tracking**: Microphone pitch/frequency analysis to accurately detect multiple distinct speakers during an answer.
-   **🧠 Smart AI Analytics (OpenAI)**:
    -   Generates intelligent interview questions and feedback using `gpt-4o-mini`.
    -   Scores your answers out of 10 and provides actionable improvement tips based on your transcript.
-   **💾 History & Dashboard**: Store all your past interviews, scores, and resumes in the cloud seamlessly without losing progress.

---

## 🛠️ Tech Stack & Key Libraries

### Core Framework & Language
-   **Language**: TypeScript (for strict typing, avoiding bugs, and a robust codebase).
-   **Frontend**: React 18
-   **Build Tool**: Vite (for extremely fast compilation and HMR).
-   **Routing**: React Router DOM v7 (un-opinionated, client-side routing).

### Styling & UI
-   **CSS Framework**: Tailwind CSS (for highly customizable, utility-first styling).
-   **Component Library**: Shadcn UI / Radix primitives.
-   **Icons**: Lucide React.
-   **Animations**: Framer Motion & Tailwind CSS Animate.
-   **Notifications**: Sonner.
-   **UI Extensibility**: `react-fast-marquee`, `clsx`, `tailwind-merge`.

### Backend, Database & Auth
-   **Authentication**: Clerk (`@clerk/clerk-react`) for secure authentication and user management.
-   **Database**: Firebase Firestore (`firebase`) for fast, serverless database storage of user interviews and resumes.

### AI, Machine Learning & Media
-   **Generative AI**: OpenAI Node API (`openai`) for AI-driven question generation and highly accurate feedback.
-   **Speech-to-Text**: `react-hook-speech-to-text` for real-time transcription from the browser.
-   **Camera & Printing**: `react-webcam` to capture media streams and `react-to-print` for Resume PDF Generation.
-   **Face/Object Detection**: TensorFlow.js (`@tensorflow/tfjs`), BlazeFace (`@tensorflow-models/blazeface`), and COCO-SSD (`@tensorflow-models/coco-ssd`).
-   **Voice Analysis**: Native Web Audio API for custom pitch-variance detection.

### Form Handling
-   **State Management**: React Hook Form for performant, flexible forms.
-   **Validation**: Zod & `@hookform/resolvers` for secure schema validations.

---

## 🚀 How to Run this Project

### Prerequisites
-   **Node.js**: Installed from [nodejs.org](https://nodejs.org/).
-   **A Code Editor**: e.g., VS Code.

### Step-by-Step Installation

1.  **Clone the Repository** (or unzip the project folder)
    ```bash
    git clone <repository-url>
    cd ai-mock-interview-react-vite-typescript-january-2025-main
    ```

2.  **Install Dependencies**
    Open your terminal in the project folder and run:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a file named `.env.local` in the root directory and add the following keys. You will need developer keys from Clerk, Firebase, and OpenAI:

    ```env
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    VITE_OPENAI_API_KEY=your_openai_api_key
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    # Add other firebase config keys as necessary...
    ```

4.  **Run the App**
    Start the development server:
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Go to `http://localhost:5173` to see the app!

---

## 📖 How to Use the App

1.  **Sign In**: Log in securely using your Google account or email via Clerk.
2.  **Dashboard Hub**: Click on "Dashboard". Here you can access **Mock Interviews** or the **Resume Builder**.
3.  **Resume Builder**:
    -   Navigate to the Resume Builder.
    -   Fill out your details (Personal Info, Education, Experience, Certifications, etc.).
    -   Review the live preview and click **Download / Print** to export a professional-grade ATS-friendly PDF.
4.  **Create New Interview**:
    -   Click **+ Add New** in the Interviews section.
    -   Enter your **Job Role**, **Industry**, **Description**, and **Years of Experience**.
    -   Start the Interview.
5.  **The Interview Room**:
    -   Allow **microphone** and **camera** permissions.
    -   The system active-proctors you via AI models: Keep your face centered, stow your phone, and avoid having others speak in the room. 
    -   The AI automatically asks 5 questions matching your specified difficulty.
    -   The microphone captures your response automatically. 
6.  **Analytics Dashboard**: After the interview, review your overall rating, complete metrics, transcript emotional analysis, and highly targeted AI feedback.

---

## 📁 Project Structure Highlights

-   `src/components`: UI primitives (Forms, Cards, Dialogs), Layout Components.
-   `src/routes`: Major Page Views (Dashboard, Mock Interview, Resume Builder, Feedback).
-   `src/scripts`: Centralized AI Integration points (`index.ts` for OpenAI configuration).
-   `src/types`: TypeScript Interfaces (`ResumeData`, etc.).

---

Made with ❤️ for better interview preparation!
