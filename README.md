#🌍 Sahyaatra – Complete Travel Social Platform

Sahyaatra is a modern AI-powered travel platform designed for exploring India through an interactive map, live weather insights, AI-based recommendations, budget planning, and day-wise trip planning.
Built with React + Vite, TailwindCSS, and Convex backend, it combines smart AI features with clean UI and fast performance.

##✨ Features
🗺️ Interactive India Map

Explore all Indian states visually through a colorful, responsive state map.

Click any state to view:

State information

Popular places

Weather details

Travel suggestions

##🌤 Live Weather System

Shows temperature, humidity, wind speed, pressure, visibility, and UV index.

Full weather widget → Place detail page

Compact widget → State pages + map sidebar

Auto refresh every 10 minutes

Region-aware realistic mock weather generation

Fully ready for real API integration (OpenWeather, WeatherAPI, IMD, etc.)

🤖 AI Travel Chatbot

Powered using Gemini/OpenAI models, the chatbot helps with:

Travel recommendations

Destination discovery

Weather-based advice

Budget-friendly travel options

Itinerary suggestions

Natural conversation about places, routes, and activities

Uses LangChain, LangGraph, and RAG for reliable outputs.

💸 Smart Budget Planner

Enter budget + number of days

Get estimated:

Hotel cost

Food cost

Travel cost

Activity cost

Suggests travel places and states that fit the budget

ML-based estimation logic

🗓️ Day-wise Trip Planner

Generates daily travel plans based on:

Destination

Weather

Budget

Duration

Provides morning–afternoon–evening itineraries

Suggests travel flow, timings, and key attractions

RAG-enhanced to provide accurate local recommendations

🗂️ Places & State Database

Uses merged_state_places.csv for state-wise travel locations

Helps itinerary planner and AI chatbot retrieve correct place details

##🏛️ Tech Stack
Frontend

React

Vite

TailwindCSS

shadcn/ui

Radix UI

React Router

Backend

Convex

Convex Auth

Serverless real-time functions

AI/ML

LangChain

LangGraph

Gemini & OpenAI LLMs

RAG with Chroma/Pinecone

Python-based ML logic (for budget estimation)

Dev Tools

Docker

Git

ESLint + Prettier
##🔑 Authentication

Anonymous login using Convex Auth

Can be upgraded to Google/GitHub OAuth

Secure backend routing via convex/router.ts

##🚀 Getting Started
1️⃣ Clone the repo
git clone[ https://github.com/your-username/sahyaatra.git](https://github.com/yaswanth3202/SahaYatra)
cd sahyaatra

2️⃣ Install dependencies
npm install

3️⃣ Start development server
npm run dev


This will start both:

Vite frontend

Convex backend

🌐 Deployment (Netlify)

Configured in netlify.toml:

Build: npm run build

Publish: /dist

SPA redirect enabled

🧠 Future Enhancements

Real-time weather APIs

User accounts & saved trips

Social feed for travel stories

Hotel & restaurant recommendations

Offline itinerary mode

Multi-language support

🤝 Contributing

Pull requests are welcome!
Please open an issue for major changes.

📜 License

This project is licensed under MIT.
