import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
