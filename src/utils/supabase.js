import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUp = async (email, password, name, role) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }
      }
    })
    if (error) throw error
    
    console.log('User signed up successfully:', data.user)

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{ id: data.user.id, name, role }])
    
    if (profileError) throw profileError
    
    console.log('User profile created successfully:', profileData)

    return { ...data.user, role }
  } catch (error) {
    console.error('Error in signUp function:', error.message)
    throw error
  }
}

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    
    // Fetch user profile to get role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()
    
    if (profileError) throw profileError

    return { ...data.user, role: profile.role }
  } catch (error) {
    console.error('Error in signIn function:', error.message)
    throw error
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error in signOut function:', error.message)
    throw error
  }
}

export const getCurrentSession = async () => {
  console.log('Getting current session...');
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log('Session data:', data);
    if (error) throw error
    return data.session
  } catch (error) {
    console.error('Error getting current session:', error.message)
    throw error
  }
}

export const getCurrentUser = async () => {
  console.log('Getting current user...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    console.log('User data:', user);
    if (error) throw error
    
    if (user) {
      // Fetch user profile to get role
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profileError) throw profileError

      return { ...user, role: profile.role }
    }
    return null
  } catch (error) {
    console.error('Error getting current user:', error.message)
    throw error
  }
}