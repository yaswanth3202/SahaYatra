import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { StateDetail } from "./pages/StateDetail";
import { Trips } from "./pages/Trips";
import { CreateTrip } from "./pages/CreateTrip";
import { TripDetail } from "./pages/TripDetail";
import { Chat } from "./pages/Chat";
import { Budget } from "./pages/Budget";
import { Profile } from "./pages/Profile";
import { Demo } from "./pages/Demo";
import { Places } from "./pages/Places";
import { PlaceDetail } from "./pages/PlaceDetail";
import { EnhancedStatePlaces } from "./pages/EnhancedStatePlaces";
import { InteractiveIndiaSVGMap } from "./components/InteractiveIndiaSVGMap";
import { WoodenIndiaMap } from "./components/WoodenIndiaMap";
import { HTMLMapIndia } from "./components/HTMLMapIndia";
import { AdvancedIndiaMap } from "./components/AdvancedIndiaMap";
import { ChatWidget } from "./components/ChatWidget";
import { MapPin, Users, MessageCircle, Calculator, User, Sparkles, Compass } from "lucide-react";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/places" element={<Places />} />
            <Route path="/places/state/:stateCode" element={<EnhancedStatePlaces />} />
            <Route path="/places/detail/:placeId" element={<PlaceDetail />} />
            <Route path="/places/map" element={<AdvancedIndiaMap />} />
            <Route path="/places/map/html" element={<HTMLMapIndia />} />
            <Route path="/places/map/wooden" element={<WoodenIndiaMap />} />
            <Route path="/places/map/svg" element={<InteractiveIndiaSVGMap />} />
            <Route path="/states/:code" element={<StateDetail />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/create" element={<CreateTrip />} />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route path="/chat/:tripId" element={<Chat />} />
            <Route path="/budget/:tripId" element={<Budget />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/demo" element={<Demo />} />
          </Routes>
        </main>
        <ChatWidget />
        <Toaster />
      </div>
    </Router>
  );
}

function Header() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Sahyaatra
            </span>
          </Link>

          <Authenticated>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/places"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/places') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Places</span>
              </Link>
              <Link
                to="/places/map"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/places/map') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Interactive Map</span>
              </Link>
              <Link
                to="/trips"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/trips') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Trips</span>
              </Link>
              <Link
                to="/profile"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/profile') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                to="/demo"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/demo') 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Demo</span>
              </Link>
            </nav>
          </Authenticated>

          <div className="flex items-center space-x-4">
            <Authenticated>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {loggedInUser?.email?.split('@')[0] || 'friend'}!
                </span>
                <SignOutButton />
              </div>
            </Authenticated>
            <Unauthenticated>
              <div className="text-sm text-gray-600">
                Sign in to explore India together
              </div>
            </Unauthenticated>
          </div>
        </div>
      </div>
    </header>
  );
}
