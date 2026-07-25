import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovementsSection from './components/MovementsSection';
import ChallengeSection from './components/ChallengeSection';
import GallerySection from './components/GallerySection';
import ContactsSection from './components/ContactsSection';
import AdminPanel from './components/AdminPanel';
import NotificationModal from './components/NotificationModal';
import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import CertificateModal from './components/CertificateModal';
import Logo from './components/Logo';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [profiles, setProfiles] = useState([]);
  const [challenge, setChallenge] = useState({
    id: 'challenge-2026',
    title: 'Reto Fotográfico FOTORED 2026',
    description: 'Reto de 25 minutos para estudiantes de UNAN Managua CUR Chontales.',
    status: 'scheduled',
    durationMinutes: 25,
    juryName: 'Moderador'
  });
  const [submissions, setSubmissions] = useState([]);
  const [galleryPosts, setGalleryPosts] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [activeCertificateData, setActiveCertificateData] = useState(null);

  const ADMIN_EMAIL = 'redadmind@gmail.com';

  useEffect(() => {
    const loadData = async () => {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase no configurado');
        setLoading(false);
        return;
      }

      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) throw profilesError;
        if (profilesData) setProfiles(profilesData);

        const { data: challengeData, error: challengeError } = await supabase
          .from('challenge')
          .select('*')
          .single();
        
        if (challengeError && challengeError.code !== 'PGRST116') throw challengeError;
        if (challengeData) {
          setChallenge({
            id: challengeData.id,
            title: challengeData.title,
            description: challengeData.description,
            status: challengeData.status || 'scheduled',
            durationMinutes: challengeData.durationminutes || 25,
            juryName: challengeData.juryname || 'Moderador',
            startTime: challengeData.starttime
          });
        }

        const { data: submissionsData, error: submissionsError } = await supabase
          .from('submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (submissionsError) throw submissionsError;
        if (submissionsData) setSubmissions(submissionsData);

        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (galleryError) throw galleryError;
        if (galleryData) setGalleryPosts(galleryData);

        const { data: certificatesData, error: certificatesError } = await supabase
          .from('certificates')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (certificatesError) throw certificatesError;
        if (certificatesData) setCertificates(certificatesData);

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      if (!isSupabaseConfigured()) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (profile) {
          if (profile.email === ADMIN_EMAIL && profile.role !== 'admin') {
            const { data: updated } = await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('email', ADMIN_EMAIL)
              .select()
              .single();
            if (updated) setUser(updated);
          } else {
            setUser(profile);
          }
        }
      }
    };

    checkSession();
  }, []);

  const registeredParticipantsCount = profiles.filter((p) => p.role === 'participant').length;

  const handleRegisterSuccess = async (newUserProfile) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([newUserProfile])
        .select();
      
      if (error) throw error;
      
      setProfiles((prev) => [...prev, newUserProfile]);
      setUser(newUserProfile);
      setIsNotificationOpen(false);
    } catch (error) {
      console.error('Error registrando usuario:', error);
      setProfiles((prev) => [...prev, newUserProfile]);
      setUser(newUserProfile);
    }
  };

  const handleLoginSuccess = (userProfile) => {
    if (userProfile.email === ADMIN_EMAIL) {
      userProfile.role = 'admin';
      userProfile.nombres = 'Moderador';
      userProfile.apellidos = 'Oficial';
      userProfile.carnet = 'ADMIN-2026';
      userProfile.carrera = 'Red de Comunicadores (Moderador & Jurado)';
    }
    
    setUser(userProfile);
    if (userProfile.role === 'admin') {
      setActiveTab('admin');
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setActiveTab('inicio');
  };

  const handleSubmitChallenge = async (newSubmission) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([newSubmission])
        .select();
      
      if (error) throw error;
      setSubmissions((prev) => [data[0], ...prev]);
    } catch (error) {
      console.error('Error enviando submission:', error);
      setSubmissions((prev) => [newSubmission, ...prev]);
    }
  };

  const handleGradeSubmission = async (gradedSub) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update(gradedSub)
        .eq('id', gradedSub.id)
        .select();
      
      if (error) throw error;
      setSubmissions((prev) => prev.map((s) => (s.id === gradedSub.id ? data[0] : s)));
    } catch (error) {
      console.error('Error calificando submission:', error);
      setSubmissions((prev) => prev.map((s) => (s.id === gradedSub.id ? gradedSub : s)));
    }
  };

  const handleSelectWinner = async (winnerSub) => {
    try {
      const updatedSub = { ...winnerSub, is_winner: true, place: winnerSub.place || 1 };
      
      const { data, error } = await supabase
        .from('submissions')
        .update(updatedSub)
        .eq('id', winnerSub.id)
        .select();
      
      if (error) throw error;
      
      setSubmissions((prev) =>
        prev.map((s) => ({
          ...s,
          is_winner: s.id === winnerSub.id,
          place: s.id === winnerSub.id ? updatedSub.place : null
        }))
      );
    } catch (error) {
      console.error('Error seleccionando ganador:', error);
      setSubmissions((prev) =>
        prev.map((s) => ({
          ...s,
          is_winner: s.id === winnerSub.id,
          place: s.id === winnerSub.id ? winnerSub.place : null
        }))
      );
    }
  };

  const handleGenerateCertificate = async (winnerSub) => {
    const cert = {
      id: `cert-${Date.now()}`,
      submission_id: winnerSub.id,
      winner_name: winnerSub.participant_name,
      carnet: winnerSub.carnet,
      carrera: winnerSub.carrera,
      place_text: 'Primer Lugar',
      activity_name: 'Reto Fotográfico FOTORED 2026 - UNAN Managua CUR Chontales',
      certificate_code: `UNAN-FOTORED-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert([cert])
        .select();
      
      if (error) throw error;
      
      setCertificates((prev) => [data[0], ...prev]);
      setActiveCertificateData(data[0]);
      setIsCertificateOpen(true);
    } catch (error) {
      console.error('Error generando certificado:', error);
      setCertificates((prev) => [cert, ...prev]);
      setActiveCertificateData(cert);
      setIsCertificateOpen(true);
    }
  };

  const handleAddGalleryPost = async (newPost) => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert([newPost])
        .select();
      
      if (error) throw error;
      setGalleryPosts((prev) => [data[0], ...prev]);
    } catch (error) {
      console.error('Error añadiendo post a galería:', error);
      setGalleryPosts((prev) => [newPost, ...prev]);
    }
  };

  const handleDeleteGalleryPost = async (postId) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      setGalleryPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error eliminando publicación:', error);
      throw error;
    }
  };

  const handleUpdateChallenge = async (newChallenge) => {
    try {
      const { data, error } = await supabase
        .from('challenge')
        .upsert({
          id: newChallenge.id,
          title: newChallenge.title,
          description: newChallenge.description,
          status: newChallenge.status,
          durationminutes: newChallenge.durationMinutes,
          juryname: newChallenge.juryName,
          starttime: newChallenge.startTime || null
        })
        .select();
      
      if (error) throw error;
      if (data && data[0]) {
        setChallenge({
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          status: data[0].status,
          durationMinutes: data[0].durationminutes,
          juryName: data[0].juryname,
          startTime: data[0].starttime
        });
      }
    } catch (error) {
      console.error('Error actualizando challenge:', error);
      setChallenge(newChallenge);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-red-600 selection:text-white">
      
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        registeredCount={registeredParticipantsCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotification={() => setIsNotificationOpen(true)}
      />

      <main className="flex-grow">
        {activeTab === 'inicio' && (
          <>
            <Hero
              onStartChallenge={() => setActiveTab('reto')}
              onOpenRegister={() => setIsRegisterOpen(true)}
              onViewGallery={() => setActiveTab('galeria')}
              registeredCount={registeredParticipantsCount}
              user={user}
            />
            <MovementsSection />
          </>
        )}

        {activeTab === 'reto' && (
          <ChallengeSection
            user={user}
            onSubmitChallenge={handleSubmitChallenge}
            challengeState={challenge}
            userSubmission={submissions.find((s) => s.participant_id === user?.id)}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {activeTab === 'galeria' && (
          <GallerySection
            galleryPosts={galleryPosts}
            submissions={submissions}
            user={user}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {activeTab === 'contactos' && <ContactsSection />}

        {activeTab === 'admin' && (
          <AdminPanel
            user={user}
            challenge={challenge}
            onUpdateChallenge={handleUpdateChallenge}
            submissions={submissions}
            onGradeSubmission={handleGradeSubmission}
            onSelectWinner={handleSelectWinner}
            onGenerateCertificate={handleGenerateCertificate}
            onAddGalleryPost={handleAddGalleryPost}
            onDeleteGalleryPost={handleDeleteGalleryPost}
            galleryPosts={galleryPosts}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 mt-16 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex justify-center">
            <Logo size="medium" />
          </div>
          
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            Plataforma oficial del Reto Fotográfico <strong className="text-slate-900">FOTORED</strong>. Creada por la <strong className="text-red-600">Red de Comunicadores de Nicaragua</strong> en alianza con el <strong className="text-slate-800">Movimiento Ecologista Guardabarranco</strong>, el <strong className="text-slate-800">Movimiento Deportivo Alexis Argüello / UNEN</strong> y la <strong className="text-slate-800">Promotoría Solidaria</strong> de la <strong className="text-slate-900">UNAN Managua CUR Chontales</strong>.
          </p>

          {user && user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Panel Moderador
            </button>
          )}

          <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-100">
            © {new Date().getFullYear()} FOTORED • UNAN Managua CUR Chontales. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onRegister={() => setIsRegisterOpen(true)}
        registeredCount={registeredParticipantsCount}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        registeredCount={registeredParticipantsCount}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        certificateData={activeCertificateData}
      />

    </div>
  );
}