import React from 'react';
import { Mail, Phone, MapPin, Radio, Leaf, Trophy, HeartHandshake, Globe, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function ContactsSection() {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center mb-2">
          <Logo size="medium" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-heading text-slate-900">
          Contactos & Movimientos Universitarios
        </h2>
        <p className="text-sm text-slate-600">
          Red de Comunicadores de Nicaragua en UNAN-FAREM Chontales (CUR Chontales), Juigalpa, Chontales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info Card */}
        <div className="bg-white p-8 rounded-3xl space-y-6 border border-slate-200 shadow-md">
          <h3 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-600" />
            Sede Principal FOTORED
          </h3>

          <div className="space-y-4 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Ubicación:</strong>
                UNAN-FAREM Chontales, Recinto Universitario Cornelius Silva Argüello. Juigalpa, Chontales, Nicaragua.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Correo Oficial:</strong>
                redadmind@gmail.com / comunicadores@curchontales.edu.ni
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Teléfono / WhatsApp:</strong>
                +505 2512 2450 / Ext. Comunicaciones
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Portal Web:</strong>
                www.unan.edu.ni / faremchontales.unan.edu.ni
              </div>
            </div>
          </div>
        </div>

        {/* Movimientos Contacts List */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl space-y-6 border border-slate-200 shadow-md">
          <h3 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            Directorio de Coordinaciones
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <Radio className="w-4 h-4" /> Red de Comunicadores
              </div>
              <p className="text-xs text-slate-600">Coordinación de Prensa y Plataforma FOTORED</p>
              <div className="text-[11px] text-slate-500">Encargado: Compañero Assael (redadmind@gmail.com)</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Leaf className="w-4 h-4" /> Movimiento Guardabarranco
              </div>
              <p className="text-xs text-slate-600">Jornadas Verdes y Retos Fotográficos Ambientales</p>
              <div className="text-[11px] text-slate-500">Oficina de Gestión Ambiental FAREM Chontales</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Trophy className="w-4 h-4" /> Deportivo Alexis Argüello / UNEN
              </div>
              <p className="text-xs text-slate-600">UNEN FAREM Chontales & Liga Estudiantil</p>
              <div className="text-[11px] text-slate-500">Sede UNEN Estudiantil Recinto Chontales</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <HeartHandshake className="w-4 h-4" /> Promotoría Solidaria
              </div>
              <p className="text-xs text-slate-600">Proyectos Comunitarios y Acción Social</p>
              <div className="text-[11px] text-slate-500">Coordinación de Voluntariado Universitario</div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
