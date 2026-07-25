import React from 'react';
import { Radio, Leaf, Trophy, HeartHandshake, ShieldCheck, ExternalLink } from 'lucide-react';

export default function MovementsSection() {
  const movements = [
    {
      id: 'comunicadores',
      name: 'Red de Comunicadores de Nicaragua',
      tagline: 'Creadora Oficial de FOTORED',
      icon: Radio,
      badge: 'Creadora Oficial',
      badgeColor: 'bg-red-600 text-white',
      color: 'from-red-500 to-rose-600',
      description: 'Impulsa la creación de contenido digital, periodismo universitario, fotografía institucional y difusión del talento en UNAN Managua CUR Chontales.'
    },
    {
      id: 'guardabarranco',
      name: 'Movimiento Ecologista Guardabarranco',
      tagline: 'Protección y Naturaleza',
      icon: Leaf,
      badge: 'Ecología & Medio Ambiente',
      badgeColor: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
      color: 'from-emerald-500 to-teal-600',
      description: 'Fomenta el amor por la flora, fauna y paisajes de Chontales a través de actividades ecológicas, reforestación y sensibilidad fotográfica ambiental.'
    },
    {
      id: 'deportivo',
      name: 'Movimiento Deportivo Alexis Argüello / UNEN',
      tagline: 'Energía y Liderazgo Estudiantil',
      icon: Trophy,
      badge: 'Deporte & UNEN',
      badgeColor: 'bg-blue-100 text-blue-700 border border-blue-300',
      color: 'from-blue-500 to-indigo-600',
      description: 'Promueve el desarrollo físico, torneos universitarios, el compañerismo y la unión del gremio estudiantil a través de UNEN CUR Chontales.'
    },
    {
      id: 'solidaria',
      name: 'Promotoría Solidaria',
      tagline: 'Amor y Servicio Comunitario',
      icon: HeartHandshake,
      badge: 'Acción Social',
      badgeColor: 'bg-rose-100 text-rose-700 border border-rose-300',
      color: 'from-rose-500 to-pink-600',
      description: 'Lleva alegría, acompañamiento social y solidaridad a las comunidades, capturando momentos de humanidad, sonrisas y valores en acción.'
    }
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-600 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Alianza Movimientos Juveniles UNAN Managua CUR Chontales
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-slate-900">
            Impulsado por Nuestros Movimientos
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            FOTORED nace de la unidad de las expresiones juveniles del CUR Chontales para fortalecer la comunicación, el arte fotográfico y el protagonismo universitario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movements.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.id}
                className="bg-slate-50 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between border border-slate-200 group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:bg-white"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${m.color}`}></div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-xs group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-red-600 transition-colors">
                      {m.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{m.tagline}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                  <span>UNAN Managua CUR Chontales</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}