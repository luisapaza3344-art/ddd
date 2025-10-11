import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContextDB';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Apuestas from './components/Apuestas';
import CasasApuestas from './components/CasasApuestas';
import HistorialFinanciero from './components/HistorialFinanciero';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <Navigation />
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/apuestas" element={<Apuestas />} />
              <Route path="/casas" element={<CasasApuestas />} />
              <Route path="/historial" element={<HistorialFinanciero />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-slate-800 border-t border-slate-700 mt-12">
            <div className="container mx-auto px-4 py-6">
              <p className="text-center text-gray-400 text-sm">
                Gestión de Apuestas Deportivas &copy; {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

