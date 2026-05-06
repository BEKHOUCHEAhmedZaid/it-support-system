'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createFaqArticle(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const title    = formData.get('title') as string
  const content  = formData.get('content') as string
  const category = formData.get('category') as string | null
  const is_public = formData.get('is_public') === 'true'

  const { error } = await supabase.from('faq_articles').insert({
    title,
    content,
    category: category || null,
    created_by: user.id,
    is_public,
  })
  if (error) return { error: error.message }

  revalidatePath('/technician/faq')
  revalidatePath('/employee/faq')
}
