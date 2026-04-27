import { createClient } from './client'

export async function saveScanResult(result: {
  disease: string,
  confidence: number,
  severity: string,
  imageUrl: string | null,
  userId: string
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('scans')
    .insert([{
      disease_name: result.disease,
      confidence_score: result.confidence,
      severity_level: result.severity,
      image_url: result.imageUrl,
      user_id: result.userId,
      created_at: new Date().toISOString()
    }])

  return { data, error }
}

export async function getRecentScans(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  return { data, error }
}
