import React, { useState } from 'react';
import { X, Mail, Lock, LogIn } from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Intentando login con:', email);

      // 1. Intentar autenticar con Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) {
        console.error('Error de auth:', authError);
        throw new Error('❌ Credenciales incorrectas. Verifica tu correo y contraseña.');
      }

      if (!authData || !authData.user) {
        throw new Error('❌ No se pudo autenticar el usuario');
      }

      console.log('Usuario autenticado:', authData.user.id);

      // 2. Buscar perfil en profiles
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      console.log('Perfil encontrado:', profileData);

      // 3. Si no existe perfil, crearlo
      if (!profileData) {
        console.log('Creando nuevo perfil...');
        
        const isAdmin = email === 'redadmind@gmail.com';
        const newProfile = {
          id: authData.user.id,
          email: email,
          nombres: isAdmin ? 'Moderador' : 'Usuario',
          apellidos: isAdmin ? 'Oficial' : '',
          carnet: isAdmin ? 'ADMIN-2026' : 'PENDIENTE',
          carrera: isAdmin ? 'Red de Comunicadores (Moderador & Jurado)' : 'Estudiante',
          role: isAdmin ? 'admin' : 'participant'
        };

        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .maybeSingle();

        if (insertError) {
          console.error('Error insertando perfil:', insertError);
          // Usar el perfil local como fallback
          profileData = newProfile;
        } else {
          profileData = inserted;
        }
      }

      // 4. Si es admin, asegurar rol admin
      if (email === 'redadmind@gmail.com' && profileData.role !== 'admin') {
        console.log('Actualizando a rol admin...');
        const { data: updated, error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('email', email)
          .select()
          .maybeSingle();

        if (!updateError && updated) {
          profileData = updated;
        } else {
          profileData.role = 'admin';
        }
      }

      // 5. Enviar perfil al padre
      console.log('Login exitoso:', profileData);
      onLoginSuccess(profileData);
      setLoading(false);
      onClose();

    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || '❌ Error al iniciar sesión. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl">
        
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
          <h2 className="text-2xl font-black font-heading text-slate-900">
            Iniciar Sesión
          </h2>
          <p className="text-xs text-slate-500">
            Ingresa con tu correo y contraseña
          </p>
          <p className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full inline-block">
            Admin: 
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Ingresando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Ingresar
              </span>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            ¿No tienes cuenta? <button onClick={onClose} className="text-red-600 font-bold hover:underline">Regístrate</button>
          </p>
        </div>

      </div>
    </div>
  );
}