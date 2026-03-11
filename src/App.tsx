import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter basename="/news-hub">
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
