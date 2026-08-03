import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { RevealDetail } from './pages/RevealDetail';
import { Admin } from './pages/Admin';
import { Privacy } from './pages/Privacy';
import { Support } from './pages/Support';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/history" element={<History />} />
      <Route path="/reveal/:id" element={<RevealDetail />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/support" element={<Support />} />
    </Routes>
  );
}
