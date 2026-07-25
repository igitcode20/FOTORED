import React, { useEffect } from 'react';
import { X, Award, Download, Printer, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import Logo from './Logo';

export default function CertificateModal({ isOpen, onClose, certificateData }) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen || !certificateData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-10 border border-amber-400 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-white via-slate-50 to-white border-4 border-amber-400 text-center space-y-6 relative overflow-hidden shadow-xl">
          
          <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-500"></div>

          <div className="flex justify-between items-center px-4">
            <div className="text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 block">
                UNAN Managua
              </span>
              <span className="text-[11px] font-bold text-slate-700 block">
                CUR Chontales
              </span>
            </div>

            <Logo size="medium" />

            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 block">
                Movimiento UNEN
              </span>
              <span className="text-[11px] font-bold text-slate-700 block">
                Alexis Argüello
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4" /> Reconocimiento al Mérito Fotográfico
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-heading text-slate-900">
              RECONOCIMIENTO OFICIAL
            </h1>
          </div>

          <p className="text-xs text-slate-600 uppercase tracking-widest">
            OTORGADO CON ORGULLO Y HONOR A:
          </p>

          <div className="py-2 border-b-2 border-amber-400 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 tracking-wide">
              {certificateData.winner_name}
            </h2>
            <div className="text-xs text-amber-600 font-semibold mt-1">
              Carnet: {certificateData.carnet} • {certificateData.carrera}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Por haberse acreditado el <strong className="text-amber-600">PRIMER LUGAR</strong> en el evento universitario <strong className="text-slate-900">"{certificateData.activity_name}"</strong>, demostrando un alto nivel de creatividad, excelente composición y fiel apego a la temática asignada.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-8 max-w-xl mx-auto">
            
            <div className="border-t border-slate-300 pt-2 space-y-1">
              <div className="text-xs font-bold text-slate-900">UNAN Managua</div>
              <div className="text-[10px] text-slate-500">CUR Chontales</div>
              <div className="text-[10px] text-red-600 font-semibold">Red de Comunicadores</div>
            </div>

            <div className="border-t border-slate-300 pt-2 space-y-1">
              <div className="text-xs font-bold text-slate-900">Movimiento UNEN</div>
              <div className="text-[10px] text-slate-500">Alexis Argüello</div>
              <div className="text-[10px] text-amber-600 font-semibold">Dirección de Movimientos</div>
            </div>

          </div>

          <div className="pt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>CÓDIGO DE VERIFICACIÓN: {certificateData.certificate_code || `UNAN-FOTORED-${Date.now().toString().slice(-6)}`}</span>
            <span>FECHA: {new Date().toLocaleDateString('es-NI')}</span>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2">
            <span className="text-[9px] text-slate-400">Sello de Autenticidad</span>
            <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Descargar Diploma PDF
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-300"
          >
            Cerrar Ventana
          </button>
        </div>

      </div>
    </div>
  );
}