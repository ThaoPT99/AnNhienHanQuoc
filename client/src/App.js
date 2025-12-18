import React from 'react';
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
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Recruitment from './pages/Recruitment';
import FAQ from './pages/FAQ';
import Testimonials from './pages/Testimonials';
import Calculator from './pages/Calculator';
import SchoolComparison from './pages/SchoolComparison';
import Quiz from './pages/Quiz';
import Resources from './pages/Resources';
import Events from './pages/Events';
import Videos from './pages/Videos';
import Community from './pages/Community';
import ProgressTracker from './pages/ProgressTracker';
import ReferralProgram from './pages/ReferralProgram';
import Gamification from './pages/Gamification';
import AIRecommendation from './pages/AIRecommendation';
import VirtualTour from './pages/VirtualTour';
import LanguageLearning from './pages/LanguageLearning';
import ScholarshipMatcher from './pages/ScholarshipMatcher';
import CostComparison from './pages/CostComparison';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminGallery from './pages/AdminGallery';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Navbar />
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
            <Route path="/ai-recommendation" element={<AIRecommendation />} />
            <Route path="/virtual-tour" element={<VirtualTour />} />
            <Route path="/language-learning" element={<LanguageLearning />} />
            <Route path="/scholarship-matcher" element={<ScholarshipMatcher />} />
            <Route path="/cost-comparison" element={<CostComparison />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-gallery" element={<AdminGallery />} />
          </Routes>
          <Footer />
          <SimpleChatbot />
          <ConsultationButton />
          <ExitIntentPopup />
          <SocialProof />
          <LiveChat />
          <PWAInstall />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;

