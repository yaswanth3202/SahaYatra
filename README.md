# 🌍 Sahyaatra – Complete Travel Social Platform

Sahyaatra is a modern AI-powered travel platform for exploring India through an interactive map, live weather insights, AI recommendations, budget planning, and day-wise trip planning.  
Built with **React + Vite**, **TailwindCSS**, and **Convex** backend — it combines smart AI features with a clean UI and fast performance.

---

## ✨ Features

### 🗺️ Interactive India Map
- Explore all Indian states visually via a colorful, responsive state map.  
- Click any state to view:
  - State information
  - Popular places
  - Weather details
  - Travel suggestions

### 🌤 Live Weather System
- Shows temperature, humidity, wind speed, pressure, visibility, and UV index.  
- Full weather widget → Place detail page  
- Compact widget → State pages + map sidebar  
- Auto refresh every **10 minutes**  
- Region-aware realistic mock weather generation  
- Ready for real API integration (OpenWeather, WeatherAPI, IMD, etc.)

### 🤖 AI Travel Chatbot
- Powered by Gemini / OpenAI LLMs.  
- Helps with:
  - Travel recommendations
  - Destination discovery
  - Weather-based advice
  - Budget-friendly travel options
  - Itinerary suggestions  
- Uses **LangChain**, **LangGraph**, and **RAG** for reliable outputs.

### 💸 Smart Budget Planner
- Enter budget + number of days to get estimated:
  - Hotel cost
  - Food cost
  - Travel cost
  - Activity cost
- Suggests places/states that fit the budget.
- ML-based estimation logic.

### 🗓️ Day-wise Trip Planner
- Generates daily travel plans based on:
  - Destination, Weather, Budget, Duration
- Provides morning–afternoon–evening itineraries, travel flow, timings, key attractions.
- RAG-enhanced to provide accurate local recommendations.

### 🗂️ Places & State Database
- Uses `merged_state_places.csv` for state-wise travel locations.
- Helps the itinerary planner and AI chatbot retrieve correct place details.

---

## 🏛️ Tech Stack

**Frontend**
- React, Vite, TailwindCSS, shadcn/ui, Radix UI, React Router

**Backend**
- Convex, Convex Auth, Serverless real-time functions

**AI / ML**
- LangChain, LangGraph, Gemini & OpenAI LLMs, RAG (Chroma / Pinecone)
- Python-based ML logic (budget estimation)

**Dev Tools**
- Docker, Git, ESLint, Prettier

---

## 🔑 Authentication
- Anonymous login using Convex Auth
- Upgradeable to Google / GitHub OAuth
- Secure backend routing via `convex/router.ts`

---

## 🚀 Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/yaswanth3202/SahaYatra.git
cd saha yatra
