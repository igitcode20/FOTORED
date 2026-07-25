import React, { useState } from 'react';
import { X, UserPlus, Mail, Lock, BookOpen, CreditCard, User, AlertCircle } from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

const CAREERS = [
  'Ingeniería en Sistemas',
  'Ingeniería Agroindustrial',
  'Medicina Veterinaria',
  'Administración de Empresas',
  'Contaduría Pública y Finanzas',
  'Derecho',
  'Lengua y Literatura Hispánicas',
  'Ciencias de la Educación',
  'Enfermería',
  'Bioanálisis Clínico',
  'Agronomía'
];

export default function RegisterModal({ isOpen, onClose, onRegisterSuccess, registeredCount, maxLimit = 25 }) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    carnet: '',
    email: '',
    password: '',
    carrera: CAREERS[0]
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isFull = registeredCount >= maxLimit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isFull) {
      setError('Lo sentimos, se ha alcanzado el límite máximo de 25 participantes.');
      return;
    }

    if (!formData.nombres || !formData.apellidos || !formData.carnet || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    setLoading(true);

    try {
      // 1. Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            carnet: formData.carnet,
            carrera: formData.carrera
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Error al crear el usuario');
      }

      // 2. Crear perfil en la tabla profiles
      const newProfile = {
        id: authData.user.id,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        carnet: formData.carnet,
        email: formData.email,
        carrera: formData.carrera,
        role: 'participant'
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([newProfile]);

      if (profileError) throw profileError;

      // 3. Éxito - pasar el perfil al padre
      onRegisterSuccess(newProfile);
      setLoading(false);
      onClose();
      
      alert('✅ ¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.');

    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.message || 'Error al registrar. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-2">
            <Logo size="medium" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
            Registro de Participante
          </h2>
          <p className="text-xs text-slate-500">
            Reto Fotográfico Oficial UNAN-FAREM Chontales (Cupos: <strong className="text-red-600">{registeredCount}/{maxLimit}</strong>)
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-600 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Los 2 Nombres <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Carlos"
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Los 2 Apellidos <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ej: López Pérez"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Carnet Estudiantil <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ej: 2024-0192U"
                  value={formData.carnet}
                  onChange={(e) => setFormData({ ...formData, carnet: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Carrera Universitaria <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <select
                  value={formData.carrera}
                  onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                >
                  {CAREERS.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Correo Electrónico <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="ejemplo@est.curchontales.edu.ni"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contraseña <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isFull}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer ${
              isFull
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 hover:scale-[1.01]'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Registrando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Completar Registro (Cupo {registeredCount + 1}/25)
              </span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}