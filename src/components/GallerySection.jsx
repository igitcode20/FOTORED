import React, { useState, useEffect } from 'react';
import { Layers, Image as ImageIcon, ChevronLeft, ChevronRight, User, Sparkles, ShieldCheck, Radio, Leaf, Trophy, HeartHandshake } from 'lucide-react';

export default function GallerySection({ galleryPosts, submissions, user, onOpenRegister }) {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [carouselIndices, setCarouselIndices] = useState({});

  const handlePrevSlide = (postId, maxLen) => {
    setCarouselIndices((prev) => {
      const current = prev[postId] || 0;
      return { ...prev, [postId]: current === 0 ? maxLen - 1 : current - 1 };
    });
  };

  const handleNextSlide = (postId, maxLen) => {
    setCarouselIndices((prev) => {
      const current = prev[postId] || 0;
      return { ...prev, [postId]: (current + 1) % maxLen };
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Comunicación': <Radio className="w-4 h-4 text-red-600" />,
      'Ecología': <Leaf className="w-4 h-4 text-emerald-600" />,
      'Deporte': <Trophy className="w-4 h-4 text-blue-600" />,
      'Solidaria': <HeartHandshake className="w-4 h-4 text-rose-600" />
    };
    return icons[category] || <Radio className="w-4 h-4 text-red-600" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Comunicación': 'bg-red-50 border-red-200 text-red-600',
      'Ecología': 'bg-emerald-50 border-emerald-200 text-emerald-600',
      'Deporte': 'bg-blue-50 border-blue-200 text-blue-600',
      'Solidaria': 'bg-rose-50 border-rose-200 text-rose-600'
    };
    return colors[category] || 'bg-red-50 border-red-200 text-red-600';
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-600 uppercase tracking-widest">
          <Layers className="w-4 h-4" /> Galería Digital FOTORED
        </span>
        <h2 className="text-3xl sm:text-5xl font-black font-heading text-slate-900">
          Exposición Fotográfica Estudiantil
        </h2>
        <p className="text-sm text-slate-600">
          Explora los trabajos de los participantes del Reto Fotográfico y las publicaciones de los movimientos: <strong>Red de Comunicadores, Guardabarranco, Deportivo Alexis Argüello/UNEN y Promotoría Solidaria</strong>
        </p>

        <div className="flex justify-center gap-2 pt-2 flex-wrap">
          <button
            onClick={() => setActiveFilter('todos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'todos'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveFilter('retos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'retos'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Retos ({submissions.length})
          </button>
          <button
            onClick={() => setActiveFilter('oficiales')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'oficiales'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Movimientos ({galleryPosts.length})
          </button>
        </div>
      </div>

      {(activeFilter === 'todos' || activeFilter === 'oficiales') && galleryPosts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            Publicaciones de Actividades de la Red & Movimientos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {galleryPosts.map((post) => {
              const images = post.image_urls || [];
              const currentIndex = carouselIndices[post.id] || 0;
              return (
                <div key={post.id} className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${getCategoryColor(post.category)} border flex items-center justify-center font-bold text-xs`}>
                        {getCategoryIcon(post.category)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{post.author}</div>
                        <div className="text-[11px] text-slate-500">UNAN-FAREM Chontales</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-heading">{post.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{post.description}</p>
                  </div>

                  {images.length > 0 && (
                    <div className="relative rounded-2xl overflow-hidden group border border-slate-200">
                      <img
                        src={images[currentIndex]}
                        alt={`${post.title} - Foto ${currentIndex + 1}`}
                        onClick={() => setSelectedImageModal(images[currentIndex])}
                        className="w-full h-64 sm:h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold shadow-md">
                        {currentIndex + 1} / {images.length} Fotografías
                      </div>

                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => handlePrevSlide(post.id, images.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleNextSlide(post.id, images.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="thumb"
                          onClick={() => setCarouselIndices({ ...carouselIndices, [post.id]: i })}
                          className={`w-16 h-12 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                            i === currentIndex ? 'border-red-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {(activeFilter === 'todos' || activeFilter === 'retos') && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600" />
            Fotografías del Reto de Participantes
          </h3>

          {submissions.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl text-center text-slate-500 border border-slate-200">
              <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Aún no se han enviado fotos del reto.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-3xl overflow-hidden group border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={sub.creative_photo_url}
                        alt={sub.assigned_theme}
                        onClick={() => setSelectedImageModal(sub.creative_photo_url)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold shadow-md">
                        "{sub.assigned_theme}"
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-red-600" />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{sub.participant_name}</div>
                          <div className="text-[11px] text-slate-500">{sub.carrera}</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        "{sub.description}"
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>UNAN-FAREM Chontales</span>
                    <button 
                      onClick={() => setSelectedImageModal(sub.evidence_photo_url)}
                      className="text-red-600 font-semibold hover:underline cursor-pointer"
                    >
                      Ver Evidencia 📷
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedImageModal && (
        <div 
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative max-w-4xl w-full">
            <img src={selectedImageModal} alt="HD View" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl border border-slate-700 shadow-2xl" />
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 px-4 py-2 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-red-600 cursor-pointer"
            >
              Cerrar (Esc)
            </button>
          </div>
        </div>
      )}

    </section>
  );
}