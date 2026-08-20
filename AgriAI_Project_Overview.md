# AgriAI - Project Technical Overview & Architecture Document

AgriAI is an advanced, AI-driven, eco-friendly agricultural assistance platform designed to empower farmers with instant crop disease diagnostics, predictive risk forecasting, real-time IoT sensor telemetry, market intelligence, and sustainable organic treatment plans.

---

## 1. Executive Summary & Core Philosophy

- **Mission:** Democratize precision agriculture for smallholder and commercial farmers by combining multi-modal Artificial Intelligence, real-time IoT data streams, and local language support.
- **Primary Objective:** Help farmers detect crop diseases early, minimize synthetic chemical usage, cut agricultural input costs, and improve crop yield and soil health.
- **Design Philosophy:** Mobile-first, dark-mode glassmorphic interface built for high performance, low bandwidth, and offline resilience with multi-model AI fallbacks.

---

## 2. Key Modules & Features

| Module | Features & Capabilities |
| :--- | :--- |
| **1. Plant Disease Scanner** | - Upload or capture plant/crop leaf photos.<br>- **Strict Two-Stage Verification**: Gatekeeper AI filters out non-agricultural photos (people, animals, objects) and identifies exact crop species.<br>- Instant disease classification, confidence score, and severity level. |
| **2. Eco-Friendly Treatment Engine** | - Generates crop-specific organic solutions (Neem oil, bio-fungicides) prioritized over chemicals.<br>- Incorporates current IoT telemetry (soil moisture, temperature, pH) to refine dosage. |
| **3. 7-Day Disease Risk Forecaster** | - Evaluates local climate and real-time IoT soil metrics.<br>- Forecasts upcoming crop disease risks 7 days in advance with peak risk dates and preventative action steps. |
| **4. Live IoT Telemetry Dashboard** | - Real-time telemetry feed (Soil Moisture, Ambient Temperature, Solar Radiation, Soil pH).<br>- Synced with global datasets of 54,000+ crop records. |
| **5. KrishiAI Multilingual Chatbot** | - AI companion speaking in local regional languages (Hindi, Punjabi, English, etc.).<br>- Context-aware responses using farm metrics and past scan history. |
| **6. Mandi Market Intelligence** | - Real-time market prices for various crops across different states and regional mandis. |
| **7. Sustainability & Carbon Audit** | - Tracks reduction in synthetic pesticide usage, bio-treatment counts, and estimated CO2 emission savings. |
| **8. Comprehensive PDF Farm Reports** | - Generates downloadable markdown/PDF farm diagnostic reports for insurance, government schemes, or farm records. |
| **9. Farmer Profile & Custom Metadata** | - Stores basic details (Name, Phone, Location, Farm Size, Primary Crops, Soil Type) directly attached to user auth sessions. |

---

## 3. Comprehensive Tech Stack Breakdown

| Technology / Library | Where Used in Project | Why It Is Used | How It Is Helpful to Farmers |
| :--- | :--- | :--- | :--- |
| **Next.js 16 (App Router & Turbopack)** | Core Framework (`src/app/`) | Next.js 16 provides hybrid Server Component rendering, API Route Handlers, and instant Turbopack compilation for high performance. | Enables lighting-fast page loads on mobile networks, smooth page transitions, and server-side security for API keys. |
| **React 19 & TypeScript 5** | Frontend & UI Logic (`src/components/`) | React 19 provides modern UI state hooks; TypeScript enforces strict type safety across all API payloads and components. | Prevents application crashes and runtime bugs in the field; ensures smooth interactive forms and scanner UI. |
| **Google Gemini AI SDK (`@google/generative-ai`)** | Multi-modal Diagnostics (`api/detect`, `api/predict`, `api/treatment`, `api/chatbot`) | Gemini 1.5/2.0 Flash offers fast multi-modal vision recognition and structured JSON response generation at low cost. | Diagnoses plant images in seconds, identifies exact crop species, and provides customized treatment plans. |
| **Anthropic Claude API (Fallback LLM)** | Secondary AI Fallback Engine | Acts as a high-reliability fallback if Gemini hits rate limits or quota caps. | Guarantees zero downtime; farmers receive accurate diagnostics even during peak server traffic. |
| **Supabase SSR (`@supabase/ssr` & `@supabase/supabase-js`)** | User Auth & Profile Data (`src/lib/supabase/`) | Cloud database and session authentication using `user_metadata` without needing server migrations. | Securely saves farmer profile details, location, farm size, and scan history across all devices. |
| **Tailwind CSS v4 & Glassmorphism** | UI Styling (`src/app/globals.css`) | Utility-first CSS engine producing lightweight, GPU-accelerated dark-mode glassmorphic cards and buttons. | High-contrast visual design optimized for outdoor sunlight readability on low-cost smartphones. |
| **Framer Motion** | UI Animations & Transitions (`framer-motion`) | Smooth UI animations, luminous particle flows, and modal spring animations. | Delivers an engaging, premium user experience with visual cues for loading states during scans. |
| **Recharts** | Telemetry & Sustainability Charts (`recharts`) | High-performance SVG charting library for React. | Visualizes 7-day disease risk trends, soil moisture levels, and farm sustainability progress visually. |
| **IndexedDB (`idb`)** | Offline Caching & Storage | In-browser database for offline data caching. | Allows farmers to view past scan results and farm reports even when disconnected from the internet. |
| **Bhashini API Integration** | Local Language Translation (`api/bhashini`, `langHelper`) | National language translation initiative API for Indian regional languages. | Enables non-English speaking farmers to use the platform in their native language. |

---

## 4. Multi-Tier AI Diagnostics Workflow

```
[Farmer Uploads Leaf Photo]
         │
         ▼
[/api/detect Route] ──► [Inject Real-Time IoT Sensors (Moisture, Temp, Light, pH)]
         │
         ▼
[Stage 1: Gatekeeper Check (Is it a plant/crop?)]
   ├── No  ──► [Reject Image & Prompt User]
   └── Yes ──► [Stage 2: Gemini 1.5/2.0 Flash]
                      │
                      ├── Success ──► [Return JSON Diagnosis & Eco Treatment]
                      └── Quota Exceeded ──► [Anthropic Claude Fallback]
                                                   │
                                                   ├── Success ──► [Return Diagnosis]
                                                   └── Fail ──► [Offline Smart Fallback]
```

---

## 5. Summary of Key Benefits for Farmers

1. **Cost Savings:** Organic remedies reduce reliance on expensive chemical pesticides.
2. **Early Intervention:** 7-day risk forecasting alerts farmers before fungal or bacterial outbreaks become severe.
3. **Accessibility:** Native regional language translation (Bhashini) ensures usability for all farmers.
4. **Data-Driven:** Combines IoT sensor data with AI vision analysis for personalized recommendations.
5. **High Availability:** Built-in multi-model fallbacks ensure the platform is available 24/7.
