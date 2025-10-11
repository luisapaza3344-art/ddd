import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Building2, 
  History,
  Menu,
  X,
  Download
} from 'lucide-react';
import ExportImport from './ExportImport';

export default function Navigation() {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarExportImport, setMostrarExportImport] = useState(false);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/apuestas', label: 'Mis Apuestas', icon: Target },
    { path: '/casas', label: 'Casas de Apuestas', icon: Building2 },
    { path: '/historial', label: 'Historial Financiero', icon: History },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {mostrarExportImport && (
        <ExportImport onCerrar={() => setMostrarExportImport(false)} />
      )}
      
      {/* Barra de navegación superior */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Target size={28} className="text-blue-500" />
              <h1 className="text-xl font-bold text-white hidden sm:block">
                Gestión de Apuestas
              </h1>
            </div>

            {/* Menú desktop */}
            <div className="hidden md:flex items-center gap-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Botón Exportar/Importar */}
              <button
                onClick={() => setMostrarExportImport(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white ml-2"
                title="Exportar/Importar datos"
              >
                <Download size={20} />
                <span className="font-medium">Backup</span>
              </button>
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {menuAbierto ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>

          {/* Menú móvil */}
          {menuAbierto && (
            <div className="md:hidden py-4 border-t border-slate-700">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuAbierto(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Botón Exportar/Importar en móvil */}
              <button
                onClick={() => {
                  setMostrarExportImport(true);
                  setMenuAbierto(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white mt-2"
              >
                <Download size={20} />
                <span className="font-medium">Backup / Restaurar</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

