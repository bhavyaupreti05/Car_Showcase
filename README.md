# 🚗 CarHub - AI-Powered Car Discovery Platform

> A premium, production-ready MERN stack application featuring AI-powered car recommendations and intelligent comparison tools. Built for SDE internship applications.

## 🎯 Overview

CarHub is a sophisticated car discovery platform that combines a modern tech stack with cutting-edge AI features. Users can:

- **🔍 Browse & Filter**: Search through a curated collection of 16+ premium Indian cars
- **🤖 AI Recommendations**: Get personalized car suggestions based on natural language queries
- **📊 AI Comparison**: Get detailed AI-powered comparison between any two cars
- **✨ Premium UI**: Industry-level design inspired by BMW, Mercedes-Benz, and Tesla

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **Database**: MongoDB
- **AI**: OpenAI GPT-4 API
- **Architecture**: MVC (Model-View-Controller)

### Frontend
- **Framework**: React 19.1
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
car_showcase/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── models/          # Car schema & database models
│   ├── controllers/     # Business logic (cars, recommendations, comparisons)
│   ├── routes/          # API endpoints
│   ├── services/        # OpenAI integration & AI logic
│   ├── middleware/      # Error handling & async wrapper
│   ├── seeds/           # Database seed data (16 cars)
│   ├── server.js        # Express app initialization
│   ├── package.json     # Backend dependencies
│   └── .env.example     # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   │   ├── AIRecommender.jsx      # AI recommendation UI
│   │   │   ├── CarComparison.jsx      # AI comparison modal
│   │   │   ├── CarCard.jsx            # Individual car display
│   │   │   ├── CarFilter.jsx          # Advanced filters
│   │   │   ├── Hero.jsx               # Landing hero section
│   │   │   ├── Navbar.jsx             # Navigation bar
│   │   │   └── Footer.jsx             # Footer section
│   │   ├── pages/       # Page components
│   │   │   └── BrowsePage.jsx         # Main browse & filter page
│   │   ├── services/    # API & state management
│   │   │   ├── api.js               # Axios API client
│   │   │   └── store.js             # Zustand store
│   │   ├── styles/      # CSS
│   │   │   └── main.css             # Tailwind + custom styles
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # React entry point
│   ├── index.html       # HTML template
│   ├── vite.config.js   # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   ├── package.json     # Frontend dependencies
│   └── .env.example     # Environment variables template
│
└── package.json         # Root package for concurrent development
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- OpenAI API key

### Installation

1. **Clone or navigate to the project**
```bash
cd car_showcase
```

2. **Install all dependencies**
```bash
npm run install:all
```

This will install dependencies for root, backend, and frontend.

### Configuration

#### Backend Setup

1. Create `.env` file in `backend/` folder:
```bash
cd backend
cp .env.example .env
```

2. Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car_showcase
OPENAI_API_KEY=sk-your-actual-openai-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. **Seed the database** with 16 sample cars:
```bash
npm run seed
```

#### Frontend Setup

1. Create `.env` file in `frontend/` folder:
```bash
cd frontend
cp .env.example .env
```

2. Edit `frontend/.env` (should work as-is):
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

**Option 1: Run both concurrently**
```bash
npm run dev
```
This opens both:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run dev:backend
```

Terminal 2 (Frontend):
```bash
npm run dev:frontend
```

## 🤖 AI Features

### 1. AI Car Recommender
Users can ask natural language queries like:
- "I need a family SUV under ₹20 lakh"
- "Best electric car for city driving"
- "Recommend a sedan with good mileage under ₹15 lakh"

The AI:
- Analyzes the query
- Searches the car database as context
- Returns 3-5 relevant cars with personalized reasons
- Displays with full specs, price, and features

### 2. AI Car Comparison
Select any two cars and click "Compare with AI":
- **Performance**: Power, torque, acceleration, top speed
- **Comfort**: Interior features, seating capacity
- **Mileage**: Fuel efficiency comparison
- **Safety**: Safety ratings and features
- **Maintenance**: Estimated costs
- **City vs Highway**: Which excels in each scenario
- **Pros/Cons**: Detailed advantages and disadvantages
- **Final Recommendation**: Who should buy which car

## 🎨 Design Philosophy

### Premium Automotive Design
- **Color Palette**: White, light-gray, black + subtle blue accents
- **Typography**: Inter (body), Poppins (headings)
- **Layout**: Spacious with consistent spacing
- **Cards**: Rounded corners with soft shadows
- **Interactions**: Smooth hover animations
- **Responsiveness**: Mobile-first, fully responsive

### Inspired By
- BMW Official Site
- Mercedes-Benz Digital Experience
- Tesla Design Language
- Apple's Minimalism

## 📊 Database Schema

### Car Model
```javascript
{
  name: String,              // "BMW X5"
  brand: String,             // "BMW"
  model: String,             // "X5"
  year: Number,              // 2024
  price: Number,             // 7500000
  priceDisplay: String,      // "₹75 - 85 Lakh"
  fuelType: String,          // "petrol" | "diesel" | "electric" | "hybrid" | "cng"
  transmission: String,      // "manual" | "automatic"
  mileage: Number,           // 13.2
  mileageUnit: String,       // "kmpl" | "km" | "kwh"
  seatingCapacity: Number,   // 5-7
  driveType: String,         // "fwd" | "rwd" | "awd"
  bodyType: String,          // "sedan" | "suv" | "hatchback" | etc.
  features: [String],        // ["Panoramic Sunroof", "Leather Seats", ...]
  safetyRating: Number,      // 0-5 stars
  power: Number,             // 340 PS
  torque: Number,            // 450 Nm
  acceleration: Number,      // 5.9 seconds (0-100)
  topSpeed: Number,          // 240 km/h
  imageUrl: String,          // Car image URL
  description: String,       // Marketing description
  tags: [String],            // ["luxury", "performance-suv", ...]
}
```

## 🔌 API Endpoints

### Cars
- `GET /api/cars` - Get all cars with pagination & filters
- `GET /api/cars/:id` - Get single car details
- `GET /api/cars?brand=BMW&fuelType=petrol` - Advanced filtering

### AI Features
- `POST /api/cars/recommendations` - Get AI recommendations
  ```json
  {
    "query": "I need a family SUV under ₹20 lakh"
  }
  ```
- `POST /api/cars/compare` - Compare two cars with AI
  ```json
  {
    "car1Id": "6f7e8d9c0b1a2f3e4d5c6b7a",
    "car2Id": "7g8f9e0d1c2b3a4f5e6d7c8b"
  }
  ```

## 🧪 Testing the Features

### Test AI Recommendations
1. Go to "AI Recommender" section
2. Try queries like:
   - "Family car under 10 lakh"
   - "Luxury SUV for highway"
   - "Best electric car"

### Test Comparison
1. Browse the car grid
2. Select 2 cars using checkboxes
3. Click "Compare Selected"
4. Review the AI-generated comparison

## 📦 Deployment Ready

### Backend Deployment (Render, Railway, Heroku)
```bash
cd backend
npm run build
# Set environment variables on deployment platform
```

### Frontend Deployment (Vercel, Netlify)
```bash
cd frontend
npm run build
# Deploy the `dist` folder
```

## 🎓 For Internship Applications

This project demonstrates:
- ✅ Full-stack MERN development
- ✅ RESTful API design
- ✅ Database optimization
- ✅ AI/ML integration (OpenAI)
- ✅ Production-ready code quality
- ✅ Component-based architecture
- ✅ State management (Zustand)
- ✅ Error handling & validation
- ✅ Premium UI/UX design
- ✅ Clean, maintainable code

## 🔐 Security Features

- Environment variables for sensitive data
- CORS configuration
- Helmet.js security headers
- Input validation
- Error handling middleware

## 📝 Code Quality

- Modular architecture (services, controllers, utilities)
- Meaningful variable names
- No duplicate code
- Clean separation of concerns
- Production-ready error handling

## 🤝 Contributing

Feel free to enhance this project:
- Add more cars to the seed data
- Implement additional filters
- Create user profiles & saved cars
- Add email notifications
- Implement authentication

## 📄 License

MIT License - Feel free to use this for portfolio & internship applications

## 👨‍💻 Author

Built as a premium showcase project for SDE internship applications

---

**Ready to impress top tech companies? Deploy this and add the link to your resume!** 🚀
