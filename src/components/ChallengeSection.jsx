import React, { useState, useEffect } from 'react';
import { Camera, Timer, CheckCircle, Upload, Sparkles, Send, ShieldCheck, Lock, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { supabase, uploadImage } from '../lib/supabase';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: '1. ¿Qué tipo de expresión artística o mural llama más tu atención al recorrer el recinto de UNAN Managua CUR Chontales?',
    options: [
      { text: 'Murales con mensajes de identidad universitaria', themeWeight: 'Arte que inspira' },
      { text: 'Grafitis y expresiones artísticas juveniles', themeWeight: 'Arte que inspira' },
      { text: 'Esculturas y monumentos del campus', themeWeight: 'Arte que inspira' },
      { text: 'Arquitectura y diseños innovadores', themeWeight: 'Arte que inspira' }
    ]
  },
  {
    id: 2,
    question: '2. ¿Qué representa para ti el inicio de un nuevo semestre en la universidad?',
    options: [
      { text: 'La emoción de reencontrarme con amigos', themeWeight: 'Bienvenida universitaria' },
      { text: 'La alegría de comenzar nuevos aprendizajes', themeWeight: 'Bienvenida universitaria' },
      { text: 'La experiencia de conocer nuevas aulas y espacios', themeWeight: 'Bienvenida universitaria' },
      { text: 'La energía de los primeros días de clases', themeWeight: 'Bienvenida universitaria' }
    ]
  },
  {
    id: 3,
    question: '3. ¿Cuál es tu perspectiva fotográfica favorita para capturar la universidad?',
    options: [
      { text: 'Ángulo desde arriba (picado) para ver todo el campus', themeWeight: 'Una nueva perspectiva' },
      { text: 'Ángulo desde abajo (contrapicado) para dar majestuosidad', themeWeight: 'Una nueva perspectiva' },
      { text: 'Primer plano de detalles que pasan desapercibidos', themeWeight: 'Una nueva perspectiva' },
      { text: 'Reflejos en vidrios o agua para una vista diferente', themeWeight: 'Una nueva perspectiva' }
    ]
  },
  {
    id: 4,
    question: '4. ¿Qué elemento consideras que hace única a la UNAN Managua CUR Chontales?',
    options: [
      { text: 'Su arte y murales que cuentan historias', themeWeight: 'Arte que inspira' },
      { text: 'La calidez de su gente y vida estudiantil', themeWeight: 'Bienvenida universitaria' },
      { text: 'Sus espacios y arquitectura con historia', themeWeight: 'Una nueva perspectiva' },
      { text: 'La combinación de naturaleza y modernidad', themeWeight: 'Una nueva perspectiva' }
    ]
  },
  {
    id: 5,
    question: '5. Si pudieras capturar la esencia de la universidad en una foto, ¿qué contarías?',
    options: [
      { text: 'La historia y cultura a través de su arte', themeWeight: 'Arte que inspira' },
      { text: 'La emoción y alegría de los estudiantes', themeWeight: 'Bienvenida universitaria' },
      { text: 'La belleza desde un ángulo nunca antes visto', themeWeight: 'Una nueva perspectiva' },
      { text: 'La transformación y evolución del campus', themeWeight: 'Una nueva perspectiva' }
    ]
  }
];

const THEME_DESCRIPTIONS = {
  'Arte que inspira': 'Fotografía un mural o una expresión artística de la universidad que te llame la atención',
  'Bienvenida universitaria': 'Tomar una fotografía que represente la emoción, la alegría o la experiencia de iniciar un nuevo semestre',
  'Una nueva perspectiva': 'Toma una fotografía creativa desde un ángulo diferente que haga ver la universidad de una forma única'
};

export default function ChallengeSection({ user, onSubmitChallenge, challengeState, userSubmission, onOpenLogin, onOpenRegister }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [assignedTheme, setAssignedTheme] = useState(userSubmission?.assigned_theme || null);
  const [quizCompleted, setQuizCompleted] = useState(!!userSubmission?.assigned_theme);

  const [timeLeft, setTimeLeft] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [evidencePhoto, setEvidencePhoto] = useState(userSubmission?.evidence_photo_url || '');
  const [creativePhoto, setCreativePhoto] = useState(userSubmission?.creative_photo_url || '');
  const [description, setDescription] = useState(userSubmission?.description || '');

  const [evidenceFile, setEvidenceFile] = useState(null);
  const [creativeFile, setCreativeFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(!!userSubmission);

  const isChallengeReleased = challengeState?.status === 'active';

  useEffect(() => {
    if (quizCompleted && !submittedSuccess && isChallengeReleased) {
      setIsTimerRunning(true);
    }
  }, [quizCompleted, submittedSuccess, isChallengeReleased]);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (e, setPhotoState, setFileState) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileState(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoState(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleOptionSelect = (themeWeight) => {
    const updatedAnswers = { ...quizAnswers, [currentQuestion]: themeWeight };
    setQuizAnswers(updatedAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const themeCounts = {};
      Object.values(updatedAnswers).forEach((t) => {
        themeCounts[t] = (themeCounts[t] || 0) + 1;
      });

      let winnerTheme = 'Arte que inspira';
      let maxCount = 0;
      Object.entries(themeCounts).forEach(([theme, count]) => {
        if (count > maxCount) {
          maxCount = count;
          winnerTheme = theme;
        }
      });

      setAssignedTheme(winnerTheme);
      setQuizCompleted(true);
    }
  };

  const handleSubmitChallenge = async (e) => {
    e.preventDefault();
    if (!evidenceFile || !creativeFile || !description) {
      alert('Por favor selecciona o toma ambas fotos (evidencia + temática) desde tu dispositivo y escribe la descripción.');
      return;
    }

    setSubmitting(true);

    try {
      const evidenceUrl = await uploadImage(evidenceFile, 'evidence');
      const creativeUrl = await uploadImage(creativeFile, 'creative');

      if (!evidenceUrl || !creativeUrl) {
        throw new Error('Error al subir las imágenes');
      }

      const submission = {
        id: `sub-${Date.now()}`,
        participant_id: user.id,
        participant_name: `${user.nombres} ${user.apellidos}`,
        carnet: user.carnet,
        carrera: user.carrera,
        assigned_theme: assignedTheme,
        evidence_photo_url: evidenceUrl,
        creative_photo_url: creativeUrl,
        description: description,
        is_winner: false,
        place: null,
        submitted_at: new Date().toISOString()
      };

      onSubmitChallenge(submission);
      setSubmittedSuccess(true);
      setIsTimerRunning(false);
      setSubmitting(false);
      alert('✅ ¡Fotografías enviadas con éxito al Jurado!');

    } catch (error) {
      console.error('Error enviando submission:', error);
      alert('Error al enviar las fotografías. Intenta nuevamente.');
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="py-16 text-center max-w-2xl mx-auto px-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl space-y-6 border border-slate-200 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mx-auto">
            <Camera className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black font-heading text-slate-900">
            Inicia Sesión o Regístrate para el Reto
          </h2>
          <p className="text-sm text-slate-600">
            Para responder el cuestionario, recibir tu temática asignada y subir tus 2 fotografías dentro de los 25 minutos del reto, debes ingresar con tu cuenta.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Registrarme (Máx 25)
            </button>
            <button
              onClick={onOpenLogin}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-200 cursor-pointer"
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isChallengeReleased && user.role !== 'admin' && !submittedSuccess) {
    return (
      <div className="py-16 text-center max-w-2xl mx-auto px-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl space-y-6 border border-amber-200 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
            ⏳ Reto Pendiente de Liberación
          </div>
          <h2 className="text-3xl font-black font-heading text-slate-900">
            El Moderador Aún No Ha Iniciado el Reto
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            Hola <strong className="text-slate-900">{user.nombres}</strong>, tu registro está confirmado. El <strong className="text-red-600">Moderador</strong> liberará el reto fotográfico de 25 minutos para todos los participantes registrados. Por favor permanece atento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="mb-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900">
                Criterios de Evaluación Transparentes
              </h3>
              <p className="text-xs text-slate-500">
                Jurado Evaluador: <strong className="text-red-600">Moderador</strong> (UNAN Managua CUR Chontales)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">✨ Creatividad (25%)</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">📐 Composición (25%)</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">🎯 Temática (25%)</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">💡 Originalidad (25%)</span>
          </div>
        </div>
      </div>

      {!quizCompleted && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200 shadow-md">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                Paso 1: Asignación de Temática
              </span>
              <h2 className="text-2xl font-black font-heading text-slate-900 mt-1">
                Cuestionario de Estilo Fotográfico
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
              Pregunta {currentQuestion + 1} de {QUIZ_QUESTIONS.length}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">
              {QUIZ_QUESTIONS[currentQuestion].question}
            </h3>

            <div className="grid grid-cols-1 gap-3.5">
              {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt.themeWeight)}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-sm font-semibold text-slate-800 hover:border-red-500 hover:bg-red-50/50 hover:text-red-700 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>{opt.text}</span>
                  <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {quizCompleted && (
        <div className="space-y-8">
          
          <div className="bg-gradient-to-r from-red-600 to-rose-700 p-8 rounded-3xl text-white text-center space-y-3 shadow-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" /> Temática Fotográfica Asignada
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
              "{assignedTheme}"
            </h2>
            <p className="text-xs text-red-100 max-w-xl mx-auto">
              {THEME_DESCRIPTIONS[assignedTheme] || 'Captura la esencia de tu temática asignada'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${timeLeft < 300 ? 'bg-red-600 text-white animate-ping' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                <Timer className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tiempo Restante para Subir Fotografías</span>
                <div className={`text-4xl font-black font-heading tracking-wider ${timeLeft < 300 ? 'text-red-600' : 'text-slate-900'}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {submittedSuccess ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Entrega Enviada al Jurado
              </span>
            ) : (
              <span className="text-xs text-slate-500 italic">
                {isTimerRunning ? '⏱️ El tiempo está corriendo...' : 'Tiempo finalizado'}
              </span>
            )}
          </div>

          {submittedSuccess ? (
            <div className="bg-white p-8 rounded-3xl text-center space-y-4 border border-emerald-200 shadow-md">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-black font-heading text-slate-900">¡Fotografías Enviadas con Éxito!</h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Tus dos fotografías (Evidencia + Temática) han sido registradas para el <strong className="text-slate-900">Jurado</strong>. El resultado de premiación y tu diploma digital serán enviados a tu correo electrónico.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4 text-left">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">1. Foto de Evidencia:</span>
                  <img src={evidencePhoto} alt="Evidencia" className="w-full h-44 object-cover rounded-xl" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">2. Foto Temática ({assignedTheme}):</span>
                  <img src={creativePhoto} alt="Temática" className="w-full h-44 object-cover rounded-xl" />
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitChallenge} className="bg-white p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 shadow-md">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Formulario de Entrega Dual (2 Fotografías)
                </h3>
                <p className="text-xs text-slate-500">
                  Selecciona la foto desde tu galería o tómala directamente con tu cámara.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Foto 1: Evidencia (Detrás de cámaras) <span className="text-red-600">*</span>
                  </label>

                  {evidencePhoto ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                      <img src={evidencePhoto} alt="Evidencia Preview" className="w-full h-48 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setEvidencePhoto('');
                          setEvidenceFile(null);
                        }}
                        className="absolute top-2 right-2 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold hover:bg-red-600 cursor-pointer"
                      >
                        Cambiar Foto
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-3 hover:border-red-500 transition-colors">
                      <ImageIcon className="w-10 h-10 mx-auto text-slate-400" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Subir Foto de Evidencia</span>
                        <span className="text-[11px] text-slate-500">Desde tu Galería o Cámara del Dispositivo</span>
                      </div>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-all shadow-sm">
                        <Upload className="w-4 h-4" />
                        Seleccionar / Tomar Foto
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleFileUpload(e, setEvidencePhoto, setEvidenceFile)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Foto 2: Fotografía Temática ("{assignedTheme}") <span className="text-red-600">*</span>
                  </label>

                  {creativePhoto ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                      <img src={creativePhoto} alt="Temática Preview" className="w-full h-48 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setCreativePhoto('');
                          setCreativeFile(null);
                        }}
                        className="absolute top-2 right-2 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold hover:bg-red-600 cursor-pointer"
                      >
                        Cambiar Foto
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-3 hover:border-red-500 transition-colors">
                      <ImageIcon className="w-10 h-10 mx-auto text-slate-400" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Subir Foto Temática</span>
                        <span className="text-[11px] text-slate-500">Desde tu Galería o Cámara del Dispositivo</span>
                      </div>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-all shadow-sm">
                        <Upload className="w-4 h-4" />
                        Seleccionar / Tomar Foto
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleFileUpload(e, setCreativePhoto, setCreativeFile)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Descripción Explicativa de tu Fotografía <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explica la visión de tu fotografía, qué técnica utilizaste y cómo refleja la temática asignada..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting || timeLeft === 0}
                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Subiendo fotos...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Entregas al Jurado
                  </>
                )}
              </button>

            </form>
          )}

        </div>
      )}

    </section>
  );
}