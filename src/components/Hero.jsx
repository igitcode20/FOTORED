import React from 'react';
import Logo from './Logo';
import { Camera, Sparkles, Trophy, Users, ArrowRight, Timer } from 'lucide-react';

export default function Hero({ 
  onStartChallenge, 
  onOpenRegister, 
  onViewGallery, 
  registeredCount, 
  maxLimit = 25,
  user
}) {
  const isFull = registeredCount >= maxLimit;

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Institutional Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            UNAN Managua CUR Chontales
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-600">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            ¡Universidad del Pueblo y para el Pueblo!
          </span>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
            <Logo size="huge" />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tight text-slate-900 leading-tight">
            Captura la Identidad de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-700">UNAN Managua CUR Chontales</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
            Una iniciativa oficial de la <strong className="text-slate-900">Red de Comunicadores de Nicaragua</strong> para impulsar el arte y la comunicación en unión con el <strong className="text-red-600">Movimiento Ecologista Guardabarranco</strong>, el <strong className="text-red-600">Movimiento Deportivo Alexis Argüello / UNEN</strong> y la <strong className="text-red-600">Promotoría Solidaria</strong>.
          </p>

          {/* Counter Banner */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-slate-200 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Users className="w-4 h-4 text-red-600" />
              Cupos Máximos:
            </div>
            <div className="text-xl font-black text-slate-900 font-heading">
              <span className={isFull ? 'text-red-600' : 'text-emerald-600'}>{registeredCount}</span> / {maxLimit} Inscriptos
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <div className="text-xs text-slate-500 hidden sm:block">
              {isFull ? 'Inscripciones completas' : `¡Quedan ${maxLimit - registeredCount} cupos libres!`}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {user ? (
              <button
                onClick={onStartChallenge}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-xl shadow-red-600/20 hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                Ir al Reto Fotográfico
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onOpenRegister}
                disabled={isFull}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base transition-all shadow-xl flex items-center justify-center gap-3 ${
                  isFull
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 hover:scale-105 cursor-pointer'
                }`}
              >
                <Camera className="w-5 h-5" />
                {isFull ? 'Cupos Completos (25/25)' : 'Registrarme para Participar'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onViewGallery}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              Ver Galería Digital
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 lg:mt-24">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-red-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900">Temática Automática</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Respondes un breve cuestionario de máximo 5 preguntas. El sistema te asignará automáticamente una temática fotográfica adaptada a tus respuestas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-red-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900">Reto de 25 Minutos</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tendrás 25 minutos exactos para tomar o subir de tu galería 2 fotografías: 1 foto de evidencia y 1 foto temática con su descripción.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-red-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900">Premios & Diplomas (1º, 2º, 3º)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              El jurado evaluará transparencia, creatividad y composición para otorgar diplomas a los 3 primeros lugares enviándolos directo a su correo.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
