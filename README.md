# 🛡️ NER-RouteGuard AI

> **Smart Logistics & Terrain-Aware Accessibility Intelligence for Northeast India**  
> *Aligned with Govt. of India / MoDNER (Ministry of Development of North Eastern Region) Operational Grid Standards*

[![Expo](https://img.shields.io/badge/Expo-~57.0.24-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.86.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~6.0.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-v12.19.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Leaflet / OSM](https://img.shields.io/badge/OpenStreetMap-Leaflet-199900?style=for-the-badge&logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org/)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-4285F4?style=for-the-badge)](https://github.com/Bvenkatasrujan/NER-RouteGuard-AI)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [The Challenge in Northeast India](#-the-challenge-in-northeast-india)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [End-to-End Operational Flow](#-end-to-end-operational-flow)
- [Role-Based Workflows](#-role-based-workflows)
  - [1. Field Officer Workflow](#1-field-officer-workflow)
  - [2. Logistics Driver Workflow](#2-logistics-driver-workflow)
- [MapGuard AI Routing & Risk Engine](#-mapguard-ai-routing--risk-engine)
- [GIS Topographic Radar & Elevation Profiles](#-gis-topographic-radar--elevation-profiles)
- [Offline-First Resilience Architecture](#-offline-first-resilience-architecture)
- [Firestore Schema & Security Model](#-firestore-schema--security-model)
- [Claymorphism UI & Design System](#-claymorphism-ui--design-system)
- [Project Directory Structure](#-project-directory-structure)
- [Technology Stack](#-technology-stack)
- [Getting Started & Installation](#-getting-started--installation)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Security Rules & Deployment](#-security-rules--deployment)
- [Roadmap & Future Enhancements](#-roadmap--future-enhancements)
- [Contributing & License](#-contributing--license)

---

## 🌍 Overview

**NER-RouteGuard AI** is an intelligent, terrain-aware navigation, hazard reporting, and logistics coordination platform engineered specifically for the complex, hazard-prone topography of the **North Eastern Region (NER) of India** (covering Arunachal Pradesh, Assam, Meghalaya, Sikkim, Nagaland, Manipur, Mizoram, and Tripura).

During the severe monsoons, strategic arteries such as **NH-13 (Trans-Arunachal Highway)** and **NH-27** face continuous disruptions from catastrophic landslides, mudslips, road washouts, and flash flooding. NER-RouteGuard AI bridges the gap between field disaster monitoring and logistics operations by enabling:

1. **Ground Officers** to file standardized, GPS-anchored incident reports even with intermittent connectivity.
2. **AI Inference Engines** to instantly estimate risk scores (0–100), disruption probabilities, and corridor impacts.
3. **MapGuard Engine** to calculate safe detours and accessible valley bypasses in real-time.
4. **Supply & Relief Drivers** to navigate with live OpenStreetMap (OSM) visualizations, GIS elevation radars, and corridor hazard telemetry.

---

## ⛰️ The Challenge in Northeast India

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CRITICAL REGIONAL CHALLENGES                   │
├──────────────────┬───────────────────┬─────────────────────────────────┤
│ Topography       │ Extreme Weather   │ Connectivity Shadows            │
│ High-altitude    │ Cloudbursts,      │ Zero-cell coverage in mountain  │
│ Himalayan passes │ flash floods, &   │ gorges (Bomdila, Dirang,        │
│ & fragile slopes │ heavy monsoons    │ Barapani, Sela Pass)            │
└──────────────────┴───────────────────┴─────────────────────────────────┘
```

Traditional commercial navigation engines frequently guide heavy freight, relief convoys, and emergency ambulances onto severed mountain roads because they rely on slow municipal reports. **NER-RouteGuard AI** replaces this with decentralized field-officer telemetry, automated AI hazard analysis, and offline-first queue synchronization.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Role-Based Authentication** | Tailored dashboards for `FIELD_OFFICER` (reporting & monitoring) and `DRIVER` (routing & telemetry). |
| **Ground-Truth Incident Logging** | Structured incident reporting with weather conditions, severity grading, description, and GPS coordinates. |
| **Simulated/Backend AI Engine** | Instant risk assessment calculating hazard type, risk score (0–100), disruption probability (0–1), and nearest road. |
| **MapGuard Safe Routing** | Dynamic detour routing that identifies blocked corridors and reroutes around high-risk mountain sectors. |
| **Interactive Leaflet/OSM Maps** | Interactive map view built with OpenStreetMap + Leaflet via React Native WebView, rendering polylines and hazard badges. |
| **GIS Elevation & Topographic Radar** | Cross-sectional slope visualization with pass elevations, slope shear angles, and satellite radar sync status. |
| **Offline-First Synchronization** | Local queue via `@react-native-async-storage/async-storage` allowing zero-network incident submissions that auto-sync when online. |
| **Tactile Claymorphism UI** | Modern, accessible design system featuring soft bevels, inner shadows, and high-contrast government-grade palettes. |

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client["📱 Mobile Client (React Native / Expo 57)"]
        UI["Claymorphism UI Design System"]
        State["State Stores: AuthStore | IncidentStore | RouteStore"]
        Offline["AsyncStorage Offline Incident Queue"]
        Map["Leaflet / OSM WebView + GIS Elevation Radar"]
    end

    subgraph Firebase["🔥 Cloud Infrastructure (Firebase)"]
        Auth["Firebase Authentication (Email & Google)"]
        FS_Users["Firestore: users/{uid}"]
        FS_Incidents["Firestore: incident_reports/{reportId}"]
        FS_AI["Firestore: ai_analysis/{analysisId}"]
        FS_Routes["Firestore: routes/{routeId}"]
        FS_Tracking["Firestore: tracking/{trackingId}"]
        Storage["Firebase Cloud Storage (Evidence Photos)"]
    end

    subgraph AI_Engine["🧠 AI & Routing Services"]
        RiskEngine["AI Hazard & Risk Scoring Engine"]
        MapGuard["MapGuard GeoJSON Detour Router"]
    end

    UI --> State
    State --> Offline
    Offline -.->|Auto-sync when online| FS_Incidents
    State --> Auth
    State --> FS_Users
    State --> FS_Incidents
    State --> FS_Routes
    State --> FS_Tracking
    State --> Storage

    FS_Incidents -->|Trigger Report Event| RiskEngine
    RiskEngine -->|Write Risk Score & Disruption Probability| FS_AI
    FS_AI --> MapGuard
    MapGuard -->|Generate GeoJSON Detour LineString| FS_Routes
    FS_Routes -->|Real-time Snapshot Stream| Map
```

---

## 🔄 End-to-End Operational Flow

```mermaid
sequenceDiagram
    autonumber
    actor Officer as 👮 Field Officer
    participant App as 📱 Mobile App (NER-RouteGuard)
    participant OfflineQ as 💾 Offline Queue
    participant Firestore as 🔥 Firestore DB
    participant AI as 🧠 AI Analysis Engine
    participant Router as 🗺️ MapGuard Route Service
    actor Driver as 🚛 Logistics Driver

    Note over Officer,Driver: Step 1: Incident Ingestion
    Officer->>App: Logs hazard (e.g., Heavy Rain / Landslide on NH-13)
    alt Offline (No Cellular Signal)
        App->>OfflineQ: Cache report locally in AsyncStorage
        Note over OfflineQ: Waits for connection restore
        OfflineQ->>Firestore: Auto-flush to incident_reports/{reportId}
    else Online
        App->>Firestore: Writes to incident_reports/{reportId} (Status: PENDING_AI_ANALYSIS)
    end

    Note over Firestore,AI: Step 2: Risk Scoring & Classification
    Firestore->>AI: Real-time listener triggers analysis
    AI->>AI: Computes Risk Score (e.g., 88/100), Disruption Prob (0.85)
    AI->>Firestore: Writes to ai_analysis/{analysisId} (Status: COMPLETED)
    Firestore-->>Officer: Live UI Badge updates to "ANALYZED"

    Note over Driver,Router: Step 3: Route Computation & Safe Detour
    Driver->>App: Requests route (e.g., Bomdila -> Dirang Corridor)
    App->>Router: postRouteRequest(origin, destination)
    Router->>Firestore: Queries active incidents & AI analysis
    Router->>Router: Identifies blocked NH-13 stretch & computes safe detour
    Router->>Firestore: Persists routes/{routeId}
    Firestore-->>App: Streams route geometry LineString
    App->>Driver: Displays OSM route polyline, hazards avoided, & GIS radar
```

---

## 👥 Role-Based Workflows

### 1. Field Officer Workflow

```
[Login / Verify] ➡️ [Officer Station Setup] ➡️ [Officer Dashboard]
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼                                                                     ▼
       [Live Hazard Reporting]                                                [Submitted Incidents Feed]
       • Weather Selection (Clear, Rain, Storm, Snow)                         • Real-time Firestore sync
       • Hazard Description & Severity (Low - Critical)                       • AI Risk Analysis Card
       • GPS Geolocation or Manual Coords                                     • Disruption Probability %
       • Offline fallback with automatic sync                                 • Affected Highway ID
```

- **Coordinates Handling**: Supports single-tap device GPS capture or manual coordinate inputs for remote survey points.
- **Real-Time Verification**: Monitors the automated transition from `PENDING_AI_ANALYSIS` to `ANALYZED`.
- **Field Inspector Profile**: Stores Officer ID, department (e.g., *PWD / Border Roads Organisation Disaster Cell*), and assigned administrative district (e.g., *West Kameng*).

---

### 2. Logistics Driver Workflow

```
[Login / Verify] ➡️ [Driver Dashboard]
                         │
        ┌────────────────┴────────────────────────┐
        ▼                                         ▼
[Route Optimization Engine]              [Interactive OSM & Radar]
• Set Origin & Destination Coords        • Leaflet map rendered via WebView
• Query MapGuard Engine                  • Color-coded route polylines
• View Distance (km) & ETA (mins)        • Hazard markers with severity popups
• Risk score assessment (0 - 100)        • GIS Elevation Radar (Slope & Shear)
```

- **Presets & Custom Coordinates**: Pre-loaded with high-priority NER transit waypoints across Assam and Arunachal Pradesh.
- **Risk Avoidance Metrics**: Informs drivers of the exact number of active landslides, floods, and heavy rain sectors bypassed.
- **Telemetry Broadcasting**: Transmits driver position, speed, and heading to `tracking/{trackingId}` for emergency dispatchers.

---

## 🗺️ MapGuard AI Routing & Risk Engine

The MapGuard engine (`services/api/mapGuardApi.ts`) is designed to evaluate both direct geometric distances and hazard densities along the corridor.

### Route Classification Logic
- **`OPTIMIZED_SAFE_DETOUR`**: Selected when active hazards exist along the main artery, but a validated, hazard-free bypass route is available.
- **`ROUTE_WITH_MINIMIZED_RISK`**: Selected when weather is adverse (e.g., Medium/High risk) and no completely clean alternative exists; minimizes exposure time through affected sections.
- **`NO_HAZARD_FREE_ALTERNATIVE_AVAILABLE`**: Flagged when a `CRITICAL` severity incident (full mountain roadblock) cuts off all alternate corridors, signaling drivers to halt at designated staging yards.

### GeoJSON Geometry Specification
All routes are generated in standard **GeoJSON `LineString`** format:
```json
{
  "type": "LineString",
  "coordinates": [
    [91.7362, 26.1445],
    [92.1000, 26.8000],
    [92.4159, 27.2644],
    [91.8594, 27.5861]
  ]
}
```
The client utility (`utils/geoJson.ts`) automatically translates GeoJSON `[longitude, latitude]` pairs into Leaflet-compatible `[latitude, longitude]` coordinates for seamless rendering.

---

## 📡 GIS Topographic Radar & Elevation Profiles

The application includes an SVG-rendered **GIS Elevation Radar** (`components/GisElevationRadar.tsx`) tailored for mountain passes like the **Barapani Pass (ELV 1,496m)** and **Sela Pass**:

- **Cross-Sectional Elevation**: Displays vertical elevation climb against horizontal transit distance.
- **Slope Shear Indicator**: Highlights critical gradient sections (e.g., `SLOPE SHEAR 14°`) where heavy trucks risk brake failure or loss of traction.
- **3-Minute Radar Sync**: Visual indicator reflecting real-time meteorological and topographical radar polling.

---

## 📶 Offline-First Resilience Architecture

In mountainous terrains like West Kameng or Tawang, cellular networks frequently drop to 0G/2G. NER-RouteGuard AI uses an offline-first strategy:

```
[Officer Submits Report]
          │
    [Network Check]
     ├── ONLINE  ──> Direct write to Firestore
     └── OFFLINE ──> Stored in AsyncStorage (@routeguard_offline_incident_queue)
                           │
                 [Network Restored / Sync Button]
                           │
                 [Batch Queue Dispatch] ──> Firestore Database
```

The offline queue utility (`utils/offlineQueue.ts`) ensures that no incident report or vital telemetry data is lost during transit across shadow zones.

---

## 🗄️ Firestore Schema & Security Model

The database is organized into 5 structured collections under `firestore.rules`:

### 1. `users/{userId}`
```typescript
interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'FIELD_OFFICER' | 'DRIVER';
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  district?: string;
  department?: string;
  designation?: string;
  vehicleNumber?: string;
  vehicleType?: string;
}
```

### 2. `incident_reports/{reportId}`
```typescript
interface IncidentReportDoc {
  reportId: string;
  officerId: string;
  weather: 'CLEAR' | 'CLOUDY' | 'RAIN' | 'HEAVY_RAIN' | 'STORM' | 'FOG' | 'SNOW';
  hazardDescription: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  latitude: number;
  longitude: number;
  status: 'PENDING_AI_ANALYSIS' | 'ANALYZING' | 'ANALYZED' | 'ACTIVE' | 'RESOLVED';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3. `ai_analysis/{analysisId}`
```typescript
interface AIAnalysisDoc {
  analysisId: string;
  reportId: string;
  hazard: string;
  riskScore: number;             // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  disruptionProbability: number; // 0.00 to 1.00
  affectedRoad: string;          // e.g., "NH-13 Bomdila Stretch"
  analysisStatus: 'COMPLETED' | 'FAILED';
  modelName: string;
  modelVersion: string;
}
```

### 4. `routes/{routeId}`
```typescript
interface RouteDoc {
  routeId: string;
  reportId: string;
  analysisId: string;
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  geometry: { type: 'LineString'; coordinates: Array<[number, number]> };
  distanceKm: number;
  estimatedTravelTimeMinutes: number;
  riskScore: number;
  riskLevel: string;
  affectedRoad: string;
  routeStatus: 'AVAILABLE' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
}
```

### 5. `tracking/{trackingId}`
```typescript
interface TrackingDoc {
  trackingId: string;
  routeId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Timestamp;
}
```

---

## 🎨 Claymorphism UI & Design System

The application implements a custom tactile **Claymorphism** design system with a clean, high-contrast palette suited for high-glare daytime outdoor viewing in field conditions:

- **Colors (`constants/colors.ts`)**:
  - `primaryBlue`: `#1D4ED8` (MoDNER Official Blue)
  - `primaryBlueLight`: `#EFF6FF` (Ice Blue Tint)
  - `navyDark`: `#1E293B` (Primary Text & Strong Headers)
  - `cardBg`: `#FFFFFF` (Crisp White Surface)
  - `success`: `#16A34A` | `warning`: `#D97706` | `danger`: `#DC2626` | `critical`: `#991B1B`
- **Clay Components (`components/clay/`)**:
  - `ClayCard`: Beveled cards with soft dual shadows.
  - `ClayButton`: Responsive touch targets with tactile feedback.
  - `ClayInput`: Inset input surfaces for text and coordinate entry.
  - `ClayBadge`: Status chips with contextual color mapping.

---

## 📂 Project Directory Structure

```
NER-RouteGuard AI/
├── app/                              # Expo Router file-based route definitions
│   ├── (driver)/
│   │   ├── _layout.tsx               # Driver tab/stack layout
│   │   └── home.tsx                  # Driver dashboard: MapView, routes, elevation radar
│   ├── (officer)/
│   │   ├── _layout.tsx               # Officer tab/stack layout
│   │   └── home.tsx                  # Officer dashboard: Incident submission & status feed
│   ├── _layout.tsx                   # Root application layout with Context Providers
│   ├── index.tsx                     # Splash screen with role-based routing
│   ├── login.tsx                     # Multi-mode Auth (Login, Sign-up, Google Sign-in)
│   ├── email-verification.tsx        # Email verification checking screen
│   ├── forgot-password.tsx           # Password reset link dispatch
│   ├── personal-details.tsx          # Profile onboarding step 1
│   ├── officer-details.tsx           # Field officer credential & station onboarding
│   ├── driver-details.tsx            # Driver vehicle & license onboarding
│   ├── location-permission.tsx       # Foreground/Background GPS permissions
│   └── notification-permission.tsx   # Critical push notification permissions
├── assets/                           # Branding, adaptive icons, and splash screens
├── components/
│   ├── clay/                         # Claymorphic design system primitives
│   │   ├── ClayBadge.tsx
│   │   ├── ClayButton.tsx
│   │   ├── ClayCard.tsx
│   │   ├── ClayContainer.tsx
│   │   ├── ClayIconButton.tsx
│   │   ├── ClayInput.tsx
│   │   └── ClayStatusCard.tsx
│   ├── ui/                           # Domain-specific UI widgets
│   │   ├── AIResultCard.tsx          # Real-time AI hazard assessment card
│   │   ├── AppHeader.tsx             # Standard top navigation header
│   │   ├── EmptyState.tsx            # Clean fallback state for empty lists
│   │   ├── PhotoUploader.tsx         # Incident camera / photo attachment widget
│   │   ├── ProfileModal.tsx          # User profile modal with role details
│   │   ├── RouteTimeline.tsx         # Step-by-step route hazard checkpoints
│   │   ├── SelectorChip.tsx          # Weather and condition selection chips
│   │   └── SeveritySelector.tsx      # Severity grading selector (Low to Critical)
│   ├── GisElevationRadar.tsx         # Topographic mountain pass SVG radar
│   ├── Logo.tsx                      # App emblem vector logo
│   └── MapViewOSM.tsx                # OpenStreetMap + Leaflet interactive WebView
├── constants/
│   ├── colors.ts                     # Curated color tokens & risk statuses
│   ├── shadows.ts                    # Claymorphic shadow & bevel definitions
│   └── theme.ts                      # Spacing, font sizes, and layout standards
├── services/
│   ├── api/
│   │   ├── incidentService.ts        # Incident submission & AI simulation hooks
│   │   ├── mapGuardApi.ts            # MapGuard routing engine & detour calculation
│   │   ├── routingService.ts         # Corridor risk avoidance routing helpers
│   │   └── vehicleService.ts         # Vehicle telemetry & fleet status
│   ├── firebase/
│   │   ├── authService.ts            # Firebase Auth & user profile handlers
│   │   ├── config.ts                 # Firebase SDK client initialization
│   │   ├── firestoreService.ts       # Real-time Firestore snapshot streams
│   │   └── storageService.ts         # Cloud Storage image evidence upload
│   └── mockData/
│       ├── demoIncidents.ts          # Seed data for NH-13 & NH-27 corridors
│       └── demoVehicles.ts           # Demo emergency convoy & relief vehicle fleet
├── store/
│   ├── authStore.ts                  # React Context: Authentication & User Profile
│   ├── incidentStore.ts              # React Context: Incident state & offline sync
│   └── routeStore.ts                 # React Context: Active routes & MapGuard responses
├── types/
│   ├── alert.ts                      # Alert notification interfaces
│   ├── auth.ts                       # UserProfile, UserRole, LoginCredentials
│   ├── incident.ts                   # IncidentReportDoc, WeatherCondition, Severity
│   ├── routing.ts                    # RouteDoc, AIAnalysisDoc, MapGuardRouteResponse
│   ├── shipment.ts                   # Cargo & relief shipment definitions
│   └── vehicle.ts                    # Vehicle specifications & availability
├── utils/
│   ├── geoJson.ts                    # GeoJSON LineString to Leaflet lat/lng translator
│   ├── offlineQueue.ts               # AsyncStorage offline report queue service
│   └── validation.ts                 # Coordinate bounds & email validation
├── .env.example                      # Environment variables template
├── app.json                          # Expo project configuration
├── firestore.rules                   # Granular Firestore security rules
├── storage.rules                     # Cloud Storage access rules
├── package.json                      # Dependencies & npm scripts
└── tsconfig.json                     # Strict TypeScript configuration
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | React Native `0.86.3` with React `19.2.3` |
| **Tooling & Platform** | Expo `~57.0.24` (Expo Router `~57.0.22`) |
| **Language** | TypeScript `~6.0.3` (Strict Mode) |
| **Backend & Database** | Google Firebase `^12.19.0` (Firestore, Auth, Storage) |
| **Map Rendering** | Leaflet.js via OpenStreetMap inside `react-native-webview` |
| **Vector Graphics** | `react-native-svg` (`15.15.4`) |
| **Hardware Access** | `expo-location`, `expo-notifications`, `expo-constants` |
| **Local Persistence** | `@react-native-async-storage/async-storage` (`2.2.0`) |
| **Gestures & Animation**| `react-native-reanimated` (`4.5.1`), `react-native-gesture-handler` (`~2.32.0`) |

---

## 🚀 Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- `npm` or `yarn`
- [Expo Go app](https://expo.dev/go) on your physical mobile device, or an iOS Simulator / Android Emulator.

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Bvenkatasrujan/NER-RouteGuard-AI.git
   cd NER-RouteGuard-AI
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## ⚙️ Environment Configuration

Copy the example environment configuration:
```bash
cp .env.example .env
```

Ensure your `.env` contains your Firebase project credentials:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBLzjGHxSehAFwDE7pKrkzlUsPwqdh_thw
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=ner-routeguard-ai.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=ner-routeguard-ai
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=ner-routeguard-ai.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=864439315232
EXPO_PUBLIC_FIREBASE_APP_ID=1:864439315232:web:9d41127222cbcca1ecc545
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-SYXMLSQLD8
```

---

## 📱 Running the Application

### Start the Expo Development Server
```bash
# Standard start
npm start

# Or with cache clearing:
npm run start:clear
```

### Target Platforms
- **Run on Android**: Press `a` in the terminal or run `npm run android`
- **Run on iOS**: Press `i` in the terminal or run `npm run ios` (macOS required)
- **Run on Web**: Press `w` in the terminal or run `npm run web`
- **Type Checking**: Run `npm run type-check`

---

## 🔒 Security Rules & Deployment

Deploying the security rules ensures strict role isolation between field inspectors and drivers:

```bash
# Install Firebase CLI if not already present
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy Firestore rules and Cloud Storage rules
firebase deploy --only firestore:rules,storage
```

---

## 🗺️ Roadmap & Future Enhancements

- [ ] **Satellite InSAR Integration**: Automated landslide detection from Sentinel-1 / ISRO radar satellite passes.
- [ ] **Mesh Radio Forwarding**: Offline vehicle-to-vehicle (V2V) hazard broadcasting using BLE / LoRa mesh for convoys in zero-cell zones.
- [ ] **Turn-by-Turn Voice Navigation**: Multi-lingual offline voice prompts in English, Hindi, Assamese, and regional dialects.
- [ ] **Automated Emergency SOS**: Single-tap alert dispatching SOS signals to the nearest National Disaster Response Force (NDRF) battalion.

---

## 📄 License & Attribution

This project is developed under the MIT License. Built with dedication to enhancing disaster resilience, logistics safety, and accessibility intelligence across the North Eastern Region of India.
