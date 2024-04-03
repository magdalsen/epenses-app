import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_URL!
const supabaseKey = process.env.VITE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)