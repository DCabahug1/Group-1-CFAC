# Deployment Guide - Supabase Edge Function

## Prerequisites

1. Install Supabase CLI:
```bash
brew install supabase/tap/supabase
```

2. Login to Supabase:
```bash
supabase login
```

## Deploy the Edge Function

1. Link your project (first time only):
```bash
supabase link --project-ref your-project-ref
```

2. Set the OpenAI API key as a secret:
```bash
supabase secrets set OPENAI_API_KEY=sk-your-actual-openai-key-here
```

3. Deploy the function:
```bash
supabase functions deploy verify-asl
```

4. Verify deployment:
```bash
supabase functions list
```

## Testing the Edge Function

Test locally:
```bash
supabase functions serve verify-asl
```

Test with curl:
```bash
curl -i --location --request POST 'https://your-project-ref.supabase.co/functions/v1/verify-asl' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "image_base64": "...",
    "landmarks": "Thumb: (0.5, 0.3); Index: (0.6, 0.2)...",
    "predicted_letter": "A"
  }'
```

## Architecture

```
Frontend (React Native)
  ↓
  1. Capture image
  ↓
Python Backend (FastAPI)
  ↓
  2. MediaPipe detects hand landmarks
  3. Random Forest model predicts letter
  4. Returns: { sign: "ASL_A", confidence: 0.85, landmarks: "..." }
  ↓
Frontend
  ↓
  5. Calls Supabase Edge Function with image + landmarks
  ↓
Supabase Edge Function
  ↓
  6. Sends to OpenAI Vision API (GPT-4o)
  7. Returns AI verification
  ↓
Frontend
  ↓
  8. Uses AI result if available, fallback to model
  9. Logs attempt to Supabase database
```

## Environment Variables

### Frontend (.env.local):
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key  # For insights page
```

### Supabase Edge Function (secrets):
```
OPENAI_API_KEY=sk-your-key
```

### Backend (backend/.env):
```
# No longer needed - OpenAI moved to Edge Function
```

## Monitoring

View function logs:
```bash
supabase functions logs verify-asl
```

View function metrics in Supabase Dashboard:
- Go to Edge Functions
- Click on `verify-asl`
- View invocations, errors, and response times
