import { createClient } from './client'

export async function uploadScanImage(file: File) {
  const supabase = createClient()
  
  // Create a unique file path
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `user-scans/${fileName}`

  // Try the primary bucket 'agri-scans'
  let { data, error } = await supabase.storage
    .from('agri-scans')
    .upload(filePath, file)

  // Fallback to 'scans' bucket if 'agri-scans' is missing
  if (error && error.message.includes('Bucket not found')) {
    const fallback = await supabase.storage
      .from('scans')
      .upload(filePath, file);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.warn('Supabase Storage Error:', error.message);
    // If bucket is missing or upload fails, fallback to local object URL for demo/offline purposes
    // This allows the app to continue working even if storage is not set up
    const localUrl = URL.createObjectURL(file);
    return { publicUrl: localUrl, error: null };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(data?.fullPath.split('/')[0] || 'agri-scans')
    .getPublicUrl(filePath)

  return { publicUrl, error: null }
}
