# 🚛 TransitOps - Smart Transport Operations Platform

> **Hackathon Objective:** Build an end-to-end transport operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management while enforcing strict business rules and providing real-time operational insights.

Many logistics companies still rely on spreadsheets and manual logbooks. This leads to scheduling conflicts, underutilized vehicles, missed maintenance, and poor operational visibility. **TransitOps** eliminates these inefficiencies by providing a centralized command center for Fleet Managers, Drivers, Safety Officers, and Financial Analysts.

---

## 🌟 Key Features

### 🔒 Secure Authentication & Role-Based Access
- JWT-based authentication system.
- Distinct roles (Fleet Manager, Driver, Safety Officer, Financial Analyst) ensure users only see and interact with what is relevant to their job.

### 📊 Real-Time Dashboard
- Live KPIs: Active Vehicles, Vehicles in Maintenance, Active Trips, Fleet Utilization %.
- Beautiful, interactive charts providing a bird's-eye view of fleet health and operations.

### 🚚 Vehicle & Driver Registry
- Maintain master lists of vehicles (capacity, odometer, acquisition cost) and drivers (license expiry, safety score).
- Automated tracking of statuses: `Available`, `On Trip`, `In Shop`, `Off Duty`, `Suspended`.

### 🛣️ Smart Trip & Dispatch Engine
- Create trips by assigning available vehicles and drivers.
- **Strict Business Logic:** 
  - Prevents dispatching overloaded vehicles (Cargo Weight ≤ Max Capacity).
  - Prevents dispatching drivers with expired licenses.
  - Prevents double-booking drivers or vehicles.
- Automated lifecycle transitions: `Draft` ➔ `Dispatched` (locks vehicle/driver) ➔ `Completed` (frees vehicle/driver, logs revenue/fuel).

### 🔧 Automated Maintenance Workflow
- Logging a vehicle for maintenance instantly pulls it from the dispatch pool and updates its status to `In Shop`.
- Closing the maintenance record restores it to `Available`.

### 💰 Fuel & Expense Tracking
- Digitized fuel logs and operational expenses (tolls, parking, repairs).
- Instant calculation of total operational costs per vehicle and fuel efficiency metrics.

---

## 🎨 Design & UI/UX (M-Style Dark Theme)
TransitOps doesn't just work flawlessly—it looks stunning. We built a premium **M-Style Dark Theme**:
- **Deep Space Backgrounds:** Easy on the eyes for 8-hour shifts (`#0B0F14` & `#121821`).
- **Glassmorphism & Neon Glows:** Beautiful translucent panels with electric blue (`#00C2FF`) and purple (`#7C3AED`) hover states.
- **Fully Responsive:** Works perfectly on desktop command centers and mobile tablets for drivers.

---

## 🛠️ Tech Stack

**Frontend:**
- **React.js** (Vite)
- **Tailwind CSS** (Custom M-Style styling, Glassmorphism)
- **Zustand** (Global State Management)
- **React Hook Form & Zod** (Validation)
- **Lucide React** (Icons)
- **Recharts** (Data Visualization)

**Backend:**
- **Node.js & Express.js** (REST API)
- **MongoDB & Mongoose** (Database & ODM)
- **JWT** (Authentication)

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
Ensure you have Node.js and MongoDB installed on your system.

### 2. Clone & Install Dependencies
```bash
# Install Backend Dependencies
cd Backend
npm install

# Install Frontend Dependencies
cd ../Frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the **Backend** directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. Seed Dummy Data (Optional)
To instantly populate the database with realistic vehicles, drivers, trips, and expenses:
```bash
cd Backend
node seed.js
```

### 5. Run the Application
Open two terminals to run the frontend and backend simultaneously.

**Terminal 1 (Backend):**
```bash
cd Backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd Frontend
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🛡️ Business Rules Enforced (API Level)
- ✅ Vehicle registration numbers are guaranteed unique.
- ✅ Cargo Weight cannot exceed Vehicle Capacity.
- ✅ `Retired` or `In Shop` vehicles cannot be dispatched.
- ✅ Drivers with expired licenses or `Suspended` statuses cannot be dispatched.
- ✅ Final trip odometer readings cannot be less than the starting odometer. 
