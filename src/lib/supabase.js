import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export { supabaseUrl, supabaseAnonKey };

// Función para subir imágenes al Storage de Supabase
export const uploadImage = async (file, folder = 'submissions') => {
  if (!supabase) {
    console.error('Supabase no configurado');
    return null;
  }

  if (!file) {
    console.error('No hay archivo para subir');
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log('Subiendo archivo:', filePath);

    const { error: uploadError } = await supabase.storage
      .from('fotored')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error de upload:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('fotored')
      .getPublicUrl(filePath);

    console.log('URL pública:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return null;
  }
};