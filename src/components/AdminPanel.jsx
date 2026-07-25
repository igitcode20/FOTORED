import React, { useState, useEffect } from 'react';
import { ShieldCheck, Timer, Award, Eye, Plus, Image as ImageIcon, Send, Trash2, Trophy, Medal, Users, Edit, UserX, Key, X, Check, AlertCircle, FolderOpen } from 'lucide-react';
import { supabase, uploadImage } from '../lib/supabase';

export default function AdminPanel({
  user,
  challenge,
  onUpdateChallenge,
  submissions,
  onGradeSubmission,
  onSelectWinner,
  onGenerateCertificate,
  onAddGalleryPost,
  onDeleteGalleryPost,
  galleryPosts
}) {
  const [activeSubTab, setActiveSubTab] = useState('submissions');
  const [scheduledMinutes, setScheduledMinutes] = useState(25);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Comunicación');
  const [postDescription, setPostDescription] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  const [showPlaceSelector, setShowPlaceSelector] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="py-16 text-center max-w-lg mx-auto px-4">
        <div className="bg-white p-8 rounded-3xl space-y-4 border border-red-200 shadow-md text-red-600">
          <ShieldCheck className="w-12 h-12 mx-auto text-red-600" />
          <h2 className="text-2xl font-bold font-heading text-slate-900">Acceso Restringido al Moderador</h2>
          <p className="text-xs text-slate-600">
            Esta sección se habilita al iniciar sesión con las credenciales de moderación.
          </p>
        </div>
      </div>
    );
  }

  const handleStartTimer = () => {
    onUpdateChallenge({
      ...challenge,
      status: 'active',
      startTime: new Date().toISOString(),
      durationMinutes: scheduledMinutes
    });
    alert('⏱️ ¡Cronómetro del reto iniciado para todos los participantes registrados!');
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageToPost = async () => {
    if (!newImageFile) return;

    setUploadingImages(true);
    try {
      const imageUrl = await uploadImage(newImageFile, 'gallery');
      if (imageUrl) {
        setPostImages([...postImages, imageUrl]);
        setNewImageFile(null);
        setNewImagePreview('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImageFromPost = (idx) => {
    setPostImages(postImages.filter((_, i) => i !== idx));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle || postImages.length === 0) {
      alert('Ingresa el título y al menos 1 fotografía.');
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      author: `Moderador (${postCategory})`,
      title: postTitle,
      category: postCategory,
      description: postDescription,
      image_urls: postImages,
      is_official_post: true,
      created_at: new Date().toISOString()
    };

    onAddGalleryPost(newPost);
    setPostTitle('');
    setPostDescription('');
    setPostImages([]);
    alert('✅ Publicación oficial creada exitosamente en la Galería Digital con ' + postImages.length + ' fotografías.');
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('¿Estás seguro de eliminar esta publicación? Esta acción no se puede deshacer.')) return;

    try {
      await onDeleteGalleryPost(postId);
      setShowDeleteConfirm(null);
      alert('✅ Publicación eliminada correctamente');
    } catch (error) {
      console.error('Error eliminando publicación:', error);
      alert('Error al eliminar la publicación');
    }
  };

  const handleSelectPlace = (sub, place) => {
    const placeText = place === 1 ? '🥇 1er Lugar' : place === 2 ? '🥈 2do Lugar' : '🥉 3er Lugar';
    
    const selectedSub = { ...sub, is_winner: true, place: place };
    onSelectWinner(selectedSub);
    
    if (place === 1) {
      onGenerateCertificate(selectedSub);
    }
    
    setShowPlaceSelector(null);
    alert(`✅ ${sub.participant_name} ha sido seleccionado como ${placeText}`);
  };

  const getPlaceBadge = (place) => {
    if (place === 1) return '🥇 1er Lugar';
    if (place === 2) return '🥈 2do Lugar';
    if (place === 3) return '🥉 3er Lugar';
    return null;
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario ${userEmail}? Esta acción no se puede deshacer.`)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      await supabase
        .from('submissions')
        .delete()
        .eq('participant_id', userId);

      await loadProfiles();
      alert('✅ Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const handleChangePassword = async (userId, email) => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      );

      if (error) throw error;

      alert(`✅ Contraseña cambiada correctamente para ${email}`);
      setShowChangePassword(null);
      setNewPassword('');
      setPasswordError('');
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      setPasswordError('Error al cambiar la contraseña. Asegúrate de que el usuario existe en Auth.');
    }
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white uppercase tracking-wider">
                Panel Moderador Oficial
              </span>
              <span className="text-xs text-slate-500">{user?.email}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
              Jurado Evaluador
            </h1>
            <p className="text-xs text-slate-600">
              UNAN Managua CUR Chontales • Red de Comunicadores de Nicaragua
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setActiveSubTab('submissions')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'submissions'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entregas ({submissions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'users'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Usuarios ({profiles.length})
          </button>
          <button
            onClick={() => setActiveSubTab('timer')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'timer'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cronómetro
          </button>
          <button
            onClick={() => setActiveSubTab('post')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'post'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Publicar
          </button>
          <button
            onClick={() => setActiveSubTab('manage_posts')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'manage_posts'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gestionar ({galleryPosts.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-600" />
              Revisiones de Entregas Fotográficas ({submissions.length})
            </h2>
            <span className="text-xs text-slate-500">
              Evaluación transparente basada en los 4 criterios oficiales.
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center text-slate-500 space-y-3 border border-slate-200">
              <ImageIcon className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Aún no hay entregas de fotografías por evaluar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submissions.map((sub) => (
                <div 
                  key={sub.id} 
                  className={`bg-white p-6 rounded-3xl space-y-4 border ${
                    sub.is_winner ? 'border-amber-400 bg-amber-50/40 shadow-md' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="font-bold text-slate-900 text-base">{sub.participant_name}</div>
                      <div className="text-xs text-slate-500">
                        Carnet: <span className="text-slate-800 font-semibold">{sub.carnet}</span> • {sub.carrera}
                      </div>
                    </div>
                    {sub.is_winner && sub.place && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                        <Trophy className="w-4 h-4" /> {getPlaceBadge(sub.place)}
                      </span>
                    )}
                  </div>

                  <div className="text-xs">
                    <span className="text-slate-500">Temática Asignada: </span>
                    <strong className="text-red-600">"{sub.assigned_theme}"</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">1. Foto Evidencia:</span>
                      <img src={sub.evidence_photo_url} alt="Evidencia" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">2. Foto Temática:</span>
                      <img src={sub.creative_photo_url} alt="Temática" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                    "{sub.description}"
                  </p>

                  <div className="pt-2 flex flex-col gap-2">
                    {!sub.is_winner ? (
                      <div className="relative">
                        <button
                          onClick={() => setShowPlaceSelector(showPlaceSelector === sub.id ? null : sub.id)}
                          className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Award className="w-4 h-4" />
                          Elegir Lugar
                        </button>
                        
                        {showPlaceSelector === sub.id && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg z-10 p-2 space-y-1">
                            <button
                              onClick={() => handleSelectPlace(sub, 1)}
                              className="w-full py-2 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs flex items-center gap-2 transition-colors"
                            >
                              <Trophy className="w-4 h-4" />
                              🥇 1er Lugar
                            </button>
                            <button
                              onClick={() => handleSelectPlace(sub, 2)}
                              className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors"
                            >
                              <Medal className="w-4 h-4" />
                              🥈 2do Lugar
                            </button>
                            <button
                              onClick={() => handleSelectPlace(sub, 3)}
                              className="w-full py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs flex items-center gap-2 transition-colors"
                            >
                              <Medal className="w-4 h-4" />
                              🥉 3er Lugar
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs text-center">
                        ✅ {getPlaceBadge(sub.place)} - Ya seleccionado
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-600" />
              Gestión de Usuarios ({profiles.length})
            </h2>
            <button
              onClick={loadProfiles}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              🔄 Recargar
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Usuario</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Carnet</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Carrera</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Rol</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-semibold text-slate-900">{profile.nombres} {profile.apellidos}</div>
                          <div className="text-xs text-slate-500">{profile.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">{profile.carnet}</td>
                      <td className="px-4 py-3 text-xs text-slate-700">{profile.carrera}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          profile.role === 'admin' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {profile.role === 'admin' ? 'Admin' : 'Participante'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {profile.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => setShowChangePassword(showChangePassword === profile.id ? null : profile.id)}
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                title="Cambiar contraseña"
                              >
                                <Key className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(profile.id, profile.email)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Eliminar usuario"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                        {showChangePassword === profile.id && (
                          <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                              <input
                                type="password"
                                placeholder="Nueva contraseña (mín 6 caracteres)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                              <button
                                onClick={() => handleChangePassword(profile.id, profile.email)}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setShowChangePassword(null);
                                  setNewPassword('');
                                  setPasswordError('');
                                }}
                                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-bold"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            {passwordError && (
                              <p className="text-xs text-red-600 mt-1">{passwordError}</p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'timer' && (
        <div className="bg-white p-8 rounded-3xl max-w-xl mx-auto space-y-6 border border-slate-200 shadow-md">
          <div className="text-center space-y-2">
            <Timer className="w-12 h-12 text-red-600 mx-auto" />
            <h2 className="text-2xl font-black font-heading text-slate-900">Programador del Reto</h2>
            <p className="text-xs text-slate-600">
              Como moderador, tú decides a qué hora arranca el cronómetro de 25 minutos para todos los participantes registrados.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <span className="text-xs text-slate-500 uppercase font-bold">Estado Actual del Reto:</span>
            <div className="text-lg font-bold text-emerald-600 uppercase">
              {challenge.status === 'active' ? '🟢 Reto En Curso (25 Min Activos)' : '⏳ Programado (Esperando Inicio)'}
            </div>

            <div className="pt-3">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Duración del Reto (Minutos)
              </label>
              <input
                type="number"
                value={scheduledMinutes}
                onChange={(e) => setScheduledMinutes(parseInt(e.target.value) || 25)}
                className="w-32 py-2 text-center bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-lg"
              />
            </div>
          </div>

          <button
            onClick={handleStartTimer}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Timer className="w-5 h-5" />
            Iniciar Cronómetro del Reto de 25 Minutos
          </button>
        </div>
      )}

      {activeSubTab === 'post' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-3xl mx-auto space-y-6 border border-slate-200 shadow-md">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-red-600" />
              Nueva Publicación Oficial
            </h2>
            <p className="text-xs text-slate-500">
              Sube publicaciones de actividades de los movimientos: <strong>Red de Comunicadores, Guardabarranco, Deportivo Alexis Argüello/UNEN, Promotoría Solidaria</strong>
            </p>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Título de la Publicación</label>
              <input
                type="text"
                required
                placeholder="Ej: Galería de la Jornada Fotográfica UNAN Managua CUR Chontales"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Categoría / Movimiento</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm"
                >
                  <option value="Comunicación">Red de Comunicadores</option>
                  <option value="Ecología">Guardabarranco (Ecología)</option>
                  <option value="Deporte">Deporte Alexis Argüello / UNEN</option>
                  <option value="Solidaria">Promotoría Solidaria</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Agregar Fotografía</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:text-xs file:font-bold hover:file:bg-red-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageToPost}
                    disabled={!newImageFile || uploadingImages}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {uploadingImages ? '...' : '+ Foto'}
                  </button>
                </div>
                {newImagePreview && (
                  <div className="mt-2">
                    <img src={newImagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Descripción de la Actividad</label>
              <textarea
                rows={3}
                placeholder="Detalla lo acontecido en la actividad universitaria..."
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Fotografías de la Publicación ({postImages.length} fotos adjuntas)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {postImages.map((img, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden group border border-slate-200">
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImageFromPost(idx)}
                      className="absolute top-1 right-1 p-1 bg-slate-900/80 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Publicar en Galería Digital ({postImages.length} fotos)
            </button>
          </form>
        </div>
      )}

      {activeSubTab === 'manage_posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-red-600" />
              Gestionar Publicaciones ({galleryPosts.length})
            </h2>
            <span className="text-xs text-slate-500">
              Administra las publicaciones de los movimientos
            </span>
          </div>

          {galleryPosts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center text-slate-500 space-y-3 border border-slate-200">
              <ImageIcon className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">No hay publicaciones en la galería.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galleryPosts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{post.title}</div>
                      <div className="text-xs text-slate-500">{post.author}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      post.category === 'Comunicación' ? 'bg-red-50 border-red-200 text-red-600' :
                      post.category === 'Ecología' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                      post.category === 'Deporte' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                      'bg-rose-50 border-rose-200 text-rose-600'
                    }`}>
                      {post.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{post.description}</p>

                  <div className="grid grid-cols-3 gap-2">
                    {(post.image_urls || []).slice(0, 3).map((img, idx) => (
                      <img key={idx} src={img} alt={`${post.title} ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-slate-200" />
                    ))}
                    {(post.image_urls || []).length > 3 && (
                      <div className="w-full h-20 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        +{post.image_urls.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">
                      {new Date(post.created_at).toLocaleDateString('es-NI')}
                    </span>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </section>
  );
}