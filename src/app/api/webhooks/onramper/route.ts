import { NextRequest, NextResponse } from 'next/server';
import { updateTransaction } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const signature = req.headers.get('x-onramper-signature');

  // Verify webhook signature (implement actual verification logic)
  if (!signature) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  try {
    const { transactionId, status } = payload;
    await updateTransaction(transactionId, { status, updated_at: new Date().toISOString() });
    return NextResponse.json({ message: 'Webhook processed' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}