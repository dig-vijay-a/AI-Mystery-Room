import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateCase from './pages/CreateCase';
import InvestigationRoom from './pages/InvestigationRoom';
import ResultsPage from './pages/ResultsPage';
import CaseArchive from './pages/CaseArchive';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-amber-500/30 selection:text-amber-300">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateCase />} />
            <Route path="/case/:id" element={<InvestigationRoom />} />
            <Route path="/case/:id/results" element={<ResultsPage />} />
            <Route path="/archive" element={<CaseArchive />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
