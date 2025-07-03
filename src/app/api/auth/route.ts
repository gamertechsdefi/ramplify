import { NextRequest, NextResponse } from 'next/server';
import { supabase} from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { action, email, password } = await req.json();

  try {
    if (action === 'signIn') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ user: data.user });
    } else if (action === 'signUp') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ user: data.user });
    } else if (action === 'signOut') {
      await supabase.auth.signOut();
      return NextResponse.json({ message: 'Signed out' });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}