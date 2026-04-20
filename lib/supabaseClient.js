import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://uawboypkomtiicqivkdv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd2JveXBrb210aWljcWl2a2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDI3OTksImV4cCI6MjA5MjI3ODc5OX0.Z5fIN-bu_rvqO3inf6bnNsFOyjkLjC8cXfQHcEs3Oc4'
)

export default supabase