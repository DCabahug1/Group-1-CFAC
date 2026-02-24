# ASLingo - CSUN Code For A Cause 2026

## Project Overview

Communication should be a bridge, not a barrier. For Deaf and Hard of Hearing individuals (DHH), navigating a non-ASL-speaking world often results in systemic isolation. In the modern day of universal AI access and tools, accessibility problems of the past should no longer bother us the same. Existing solutions often rely on expensive human interpreters or cumbersome written exchanges that lack spontaneity and speed.

In our mission to eradicate these problems of the past, we built ASLingo powered through AI innovation to bridge the accessibility gap affecting the DHH community. By capturing signing in real-time and curated AI analysis, ASLingo functions as a digital tutor providing corrective feedback, ensuring users move beyond basic memorization toward a refined, professional command of the language. By transforming practice into real-time connection, ASLingo overcomes language barriers and blazes the path towards seamless dialogue that empowers both sides of the conversation.

ASLingo is designed to dismantle communication barriers by equipping hearing users with the tools to learn, practice, and perfect their ASL. It reduces the "appointment barrier" by allowing for spontaneous, everyday interactions.

## Key Features

- **Dual-Layer Sign Recognition**: Real-time image analysis with hand coordinates accessed and referenced through MediaPipe libraries & additionally reanalyzed through OpenAI integration
- **Progress Report**: Overall learning insights after each lesson guided to encourage and help users on their signing journey
- **Interactive Learning Modules**: Structured lessons with real-time feedback
- **AI-Powered Feedback**: Intelligent analysis of hand positions and gestures

## Tech Stack

- **Frontend**: React Native
- **Framework**: Expo
- **Backend**: FastAPI (Python) + Supabase
- **AI/ML**: MediaPipe, OpenAI GPT, scikit-learn
- **Database**: Supabase (PostgreSQL)

---

## Installation Instructions (macOS)

### Prerequisites

Before you begin, ensure you have the following installed on your Mac:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **Python 3** (v3.10 or higher) - Usually pre-installed on macOS
- **npm** (comes with Node.js)
- **Expo Go** app on your iOS/Android device - [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CFAC-Hackathon.git
cd CFAC-Hackathon
```

### 2. Frontend Setup (React Native + Expo)

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add your Supabase and OpenAI credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

#### Start the Expo Development Server

```bash
npm start
```

This will start the Metro bundler and display a QR code. Scan it with:
- **iOS**: Camera app
- **Android**: Expo Go app

### 3. Backend Setup (Python + FastAPI)

#### Navigate to Backend Directory

```bash
cd backend
```

#### Install Python Dependencies

```bash
pip3 install -r requirements.txt
```

**Note**: The requirements include:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `mediapipe==0.10.30` - Hand landmark detection
- `opencv-python` - Image processing
- `scikit-learn` - Machine learning model
- `numpy` - Numerical operations
- Other dependencies for image handling and API integration

#### Download MediaPipe Model

The hand landmark detection model will be downloaded automatically when you first run the server. Alternatively, you can download it manually:

```bash
curl -o hand_landmarker.task https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task
```

#### Start the Backend Server

```bash
python3 main.py
```

The server will start on `http://0.0.0.0:8000`

**Important**: Update the API URL in the frontend to match your local network IP:
- Open `app/lib/api-client.ts`
- Change `API_URL` to your Mac's local IP (e.g., `http://192.168.1.XXX:8000`)
- You can find your IP by running: `ifconfig | grep "inet " | grep -v 127.0.0.1`

### 4. Database Setup (Supabase)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL schema from `supabase/migrations/` (if available) or create the `letter_attempts` table:

```sql
CREATE TABLE letter_attempts (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  module_id INTEGER NOT NULL,
  letter TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempt_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE letter_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts
CREATE POLICY "Allow anonymous inserts" ON letter_attempts
FOR INSERT TO anon
WITH CHECK (true);
```

4. Copy your project URL and anon key to `.env.local`

### 5. Running the Full Application

1. **Terminal 1** - Backend:
   ```bash
   cd backend
   python3 main.py
   ```

2. **Terminal 2** - Frontend:
   ```bash
   npm start
   ```

3. **Mobile Device** - Scan the QR code with Expo Go

### Troubleshooting

#### Backend Issues

- **Port 8000 already in use**: Kill the process with `lsof -ti:8000 | xargs kill -9`
- **MediaPipe import errors**: Ensure you're using Python 3.10+ and mediapipe 0.10.30
- **Model not found**: The `hand_landmarker.task` file should be in the `backend/` directory

#### Frontend Issues

- **Cannot connect to backend**: Make sure the `API_URL` in `app/lib/api-client.ts` matches your Mac's local IP
- **Expo Go not loading**: Ensure your phone and Mac are on the same WiFi network
- **Missing dependencies**: Run `npm install` again

#### Database Issues

- **Insert errors**: Check that RLS policies are set up correctly in Supabase
- **Connection errors**: Verify your Supabase credentials in `.env.local`

### Development Tips

- Use `npm start --clear` to clear the Metro bundler cache
- Check backend logs for API errors
- Use the Expo DevTools for debugging React Native issues
- Monitor the Supabase dashboard for database activity

---

## Project Structure

```
CFAC-Hackathon/
├── app/                    # React Native app (Expo)
│   ├── components/         # React components
│   ├── lib/               # Utilities and API clients
│   └── (tabs)/            # App screens/routes
├── backend/               # Python FastAPI backend
│   ├── main.py           # API server
│   ├── models/           # ML models
│   └── hand_landmarker.task  # MediaPipe model
├── lib/                   # Shared libraries
│   └── supabase.ts       # Supabase client
├── supabase/             # Database migrations
└── .env.local            # Environment variables (not in git)
```

## Contributing

This project was built for CSUN Code For A Cause 2026. Contributions are welcome!

## License

MIT License - See LICENSE file for details
