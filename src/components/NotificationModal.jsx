import React from 'react';
import { BellRing, Users, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function NotificationModal({ isOpen, onClose, onRegister, registeredCount, maxLimit = 25 }) {
  if (!isOpen) return null;

  const spotsLeft = Math.max(0, maxLimit - registeredCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-red-50 text-red-600 border border-red-100 mb-2">
            <BellRing className="w-8 h-8 animate-bounce" />
          </div>

          <div className="flex justify-center mb-1">
            <Logo size="medium" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
            ¡Atención Estudiante!
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            El <strong className="text-slate-900">Reto Fotográfico FOTORED 2026</strong> de la <strong className="text-red-600">UNAN-FAREM Chontales</strong> ya está habilitado.
          </p>
        </div>

        {/* Spots Counter Card */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Users className="w-4 h-4 text-red-600" />
            Límite Estricto de Participación
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">
            <span className="text-red-600">{registeredCount}</span> / {maxLimit} Registrados
          </div>
          <p className="text-xs text-slate-600">
            {spotsLeft > 0 ? (
              <span className="text-emerald-600 font-semibold">
                ¡Quedan únicamente {spotsLeft} cupo{spotsLeft > 1 ? 's' : ''} libre{spotsLeft > 1 ? 's' : ''}!
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                Se han completado los 25 cupos máximos de registro.
              </span>
            )}
          </p>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full bg-red-600 transition-all duration-500 rounded-full"
              style={{ width: `${(registeredCount / maxLimit) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2 text-xs text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>Responde 5 preguntas rápidas para que la página te asigne tu temática.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>Tendrás <strong>25 minutos</strong> para subir 1 foto de evidencia y 1 foto temática.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>Evaluación transparente y diploma digital oficial del CUR Chontales.</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onRegister();
            }}
            disabled={spotsLeft === 0}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-md ${
              spotsLeft === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 hover:scale-[1.02] cursor-pointer'
            }`}
          >
            {spotsLeft === 0 ? 'Cupos Agotados' : 'Inscribirme Ahora'}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors border border-slate-200 cursor-pointer"
          >
            Ver Información
          </button>
        </div>

      </div>
    </div>
  );
}
