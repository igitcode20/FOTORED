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
      setError('❌ Límite máximo de 25 participantes alcanzado.');
      return;
    }

    if (!formData.nombres || !formData.apellidos || !formData.carnet || !formData.email || !formData.password) {
      setError('❌ Completa todos los campos requeridos.');
      return;
    }

    if (formData.password.length < 6) {
      setError('❌ La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Registrando usuario:', formData.email);

      // 1. Verificar si ya existe en profiles
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingProfile) {
        throw new Error('❌ Este correo ya está registrado. Inicia sesión.');
      }

      // 2. Registrar en Supabase Auth
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

      if (authError) {
        console.error('Error de auth:', authError);
        throw new Error('❌ ' + authError.message);
      }

      if (!authData || !authData.user) {
        throw new Error('❌ No se pudo crear el usuario');
      }

      console.log('✅ Usuario creado en Auth:', authData.user.id);

      // 3. Crear perfil en profiles (con reintento si falla)
      const newProfile = {
        id: authData.user.id,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        carnet: formData.carnet,
        email: formData.email,
        carrera: formData.carrera,
        role: 'participant'
      };

      let profileError;
      let attempts = 0;
      let maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const { error } = await supabase
            .from('profiles')
            .insert([newProfile]);
          
          if (!error) {
            profileError = null;
            break;
          }
          profileError = error;
          attempts++;
          console.log(`Intento ${attempts} falló, reintentando...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
          profileError = e;
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (profileError) {
        console.error('Error creando perfil después de reintentos:', profileError);
        // Intentar eliminar el usuario de auth
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (e) {}
        throw new Error('❌ Error al crear el perfil del usuario. Intenta nuevamente.');
      }

      console.log('✅ Perfil creado exitosamente');

      // 4. AUTO-LOGIN
      try {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (!loginError && loginData) {
          // Obtener el perfil completo
          const { data: finalProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', formData.email)
            .maybeSingle();

          setLoading(false);
          onClose();
          onRegisterSuccess(finalProfile || newProfile);
          alert('✅ ¡Registro exitoso! Has iniciado sesión automáticamente.');
          return;
        }
      } catch (loginErr) {
        console.error('Auto-login falló:', loginErr);
      }

      // Si el auto-login falla, igual notificamos éxito
      setLoading(false);
      onClose();
      onRegisterSuccess(newProfile);
      alert('✅ ¡Registro exitoso! Por favor inicia sesión.');

    } catch (error) {
      console.error('❌ Error en registro:', error);
      setError(error.message || '❌ Error al registrarte. Intenta nuevamente.');
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
            Reto Fotográfico UNAN Managua CUR Chontales (Cupos: <strong className="text-red-600">{registeredCount}/{maxLimit}</strong>)
          </p>
          <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full inline-block">
            ✅ Registro e inicio de sesión automático
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-600 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nombres <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Juan Carlos"
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Apellidos <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="López Pérez"
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
                Carnet <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="2024-0192U"
                  value={formData.carnet}
                  onChange={(e) => setFormData({ ...formData, carnet: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Carrera <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <select
                  value={formData.carrera}
                  onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                >
                  {CAREERS.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
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
            <p className="text-[10px] text-slate-400 mt-1">La contraseña debe tener al menos 6 caracteres</p>
          </div>

          <button
            type="submit"
            disabled={loading || isFull}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4 ${
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
                Registrarme e Iniciar Sesión
              </span>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            ¿Ya tienes cuenta? <button onClick={onClose} className="text-red-600 font-bold hover:underline">Iniciar sesión</button>
          </p>
        </div>

      </div>
    </div>
  );
}