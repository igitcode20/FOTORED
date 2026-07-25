import React, { useState } from 'react';
import Logo from './Logo';
import { Menu, X, User, LogOut, ShieldCheck, Camera, Sparkles, Users, Layers } from 'lucide-react';

export default function Navbar({ 
  user, 
  onLogout, 
  onOpenLogin, 
  onOpenRegister, 
  registeredCount, 
  activeTab, 
  setActiveTab,
  onOpenNotification 
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const maxLimit = 25;
  const isFull = registeredCount >= maxLimit;

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Sparkles },
    { id: 'reto', label: 'Reto Fotográfico', icon: Camera },
    { id: 'galeria', label: 'Galería Digital', icon: Layers },
    { id: 'contactos', label: 'Contactos & Movimientos', icon: Users },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Panel Moderador', icon: ShieldCheck });
  }

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('inicio')}>
            <Logo size="medium" />
            <div className="hidden lg:flex flex-col">
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 uppercase tracking-wider">
                UNAN Managua CUR Chontales
              </span>
              <span className="text-[9px] font-semibold text-slate-500 italic ml-1">
                ¡Universidad del Pueblo y para el Pueblo!
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Action & Status Badge */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={onOpenNotification}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium hover:border-red-400 transition-all cursor-pointer shadow-xs"
            >
              <span className={`w-2 h-2 rounded-full ${isFull ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span className="text-slate-600">Cupos:</span>
              <span className={`font-bold ${isFull ? 'text-red-600' : 'text-emerald-600'}`}>
                {registeredCount} / {maxLimit}
              </span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' ? (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold shadow-xs hover:bg-red-100 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-red-600" />
                    Moderador Assael
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                    <User className="w-3.5 h-3.5 text-red-600" />
                    {user.nombres.split(' ')[0]}
                  </span>
                )}

                <button
                  onClick={onLogout}
                  title="Cerrar Sesión"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={onOpenRegister}
                  disabled={isFull}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                    isFull
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 hover:scale-105 cursor-pointer'
                  }`}
                >
                  {isFull ? 'Cupos Agotados' : 'Registrarme'}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={onOpenNotification}
              className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-emerald-600"
            >
              {registeredCount}/{maxLimit}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-700 border border-slate-200">
                  <div className="font-bold text-slate-900">{user.nombres} {user.apellidos}</div>
                  <div className="text-slate-500">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-red-600 font-semibold text-sm hover:bg-red-50 border border-slate-200"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileOpen(false);
                  }}
                  className="py-3 text-center rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-200"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    onOpenRegister();
                    setMobileOpen(false);
                  }}
                  disabled={isFull}
                  className="py-3 text-center rounded-xl bg-red-600 text-white font-bold text-sm shadow-md"
                >
                  {isFull ? 'Lleno' : 'Registrarme'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
