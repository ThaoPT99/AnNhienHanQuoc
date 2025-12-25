import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SimpleChatbot from './components/SimpleChatbot';
import ConsultationButton from './components/ConsultationButton';
import ExitIntentPopup from './components/ExitIntentPopup';
import SocialProof from './components/SocialProof';
import LiveChat from './components/LiveChat';
import PWAInstall from './components/PWAInstall';
import NotificationCenter from './components/NotificationCenter';
import IncomingCall from './components/IncomingCall';
import PageViewTracker from './components/PageViewTracker';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import SkipToContent from './components/SkipToContent';
import { registerServiceWorker } from './utils/pushNotifications';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Calculator = lazy(() => import('./pages/Calculator'));
const SchoolComparison = lazy(() => import('./pages/SchoolComparison'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Resources = lazy(() => import('./pages/Resources'));
const Events = lazy(() => import('./pages/Events'));
const Videos = lazy(() => import('./pages/Videos'));
const Community = lazy(() => import('./pages/Community'));
const ProgressTracker = lazy(() => import('./pages/ProgressTracker'));
const ReferralProgram = lazy(() => import('./pages/ReferralProgram'));
const Gamification = lazy(() => import('./pages/Gamification'));
const Redemption = lazy(() => import('./pages/Redemption'));
const AIRecommendation = lazy(() => import('./pages/AIRecommendation'));
const VirtualTour = lazy(() => import('./pages/VirtualTour'));
const LanguageLearning = lazy(() => import('./pages/LanguageLearning'));
const ScholarshipMatcher = lazy(() => import('./pages/ScholarshipMatcher'));
const CostComparison = lazy(() => import('./pages/CostComparison'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
const TestNotifications = lazy(() => import('./pages/TestNotifications'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const AIMatching = lazy(() => import('./pages/AIMatching'));
const VideoCallBooking = lazy(() => import('./pages/VideoCallBooking'));
const Friends = lazy(() => import('./pages/Friends'));
const Login = lazy(() => import('./pages/Login'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ErrorBoundary>
          <PageViewTracker />
          <SkipToContent />
          <div className="App">
            <Navbar />
            <main id="main-content">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/recruitment" element={<Recruitment />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/school-comparison" element={<SchoolComparison />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/events" element={<Events />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/community" element={<Community />} />
                <Route path="/progress-tracker" element={<ProgressTracker />} />
                <Route path="/referral" element={<ReferralProgram />} />
                <Route path="/gamification" element={<Gamification />} />
                <Route path="/redemption" element={<Redemption />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ai-recommendation" element={<AIRecommendation />} />
                <Route path="/virtual-tour" element={<VirtualTour />} />
                <Route path="/language-learning" element={<LanguageLearning />} />
                <Route path="/scholarship-matcher" element={<ScholarshipMatcher />} />
                <Route path="/cost-comparison" element={<CostComparison />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-gallery" element={<AdminGallery />} />
                <Route path="/test-notifications" element={<TestNotifications />} />
                <Route path="/profile/:email" element={<UserProfile />} />
                <Route path="/ai-matching" element={<AIMatching />} />
                <Route path="/video-call" element={<VideoCallBooking />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <SimpleChatbot />
            <ConsultationButton />
            <ExitIntentPopup />
            <SocialProof />
            <LiveChat />
            <PWAInstall />
            <NotificationCenter />
            
            {/* Incoming Call Modal */}
            {incomingCall && (
              <IncomingCall
                callerName={incomingCall.callerName}
                callerEmail={incomingCall.callerEmail}
                roomId={incomingCall.roomId}
                roomLink={incomingCall.roomLink}
                onAccept={handleAcceptCall}
                onDecline={handleDeclineCall}
              />
            )}
          </div>
        </ErrorBoundary>
      </Router>
    </HelmetProvider>
  );
}

export default App;

