import { NextRequest, NextResponse } from 'next/server';
import { supabase, getUserTransactions, createTransaction, updateTransaction } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const transactions = await getUserTransactions(user.id);
    return NextResponse.json(transactions);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const transactionData = await req.json();
  try {
    const transaction = await createTransaction({ ...transactionData, user_id: user.id });
    return NextResponse.json(transaction);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { id, updates } = await req.json();
  try {
    const transaction = await updateTransaction(id, updates);
    return NextResponse.json(transaction);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}