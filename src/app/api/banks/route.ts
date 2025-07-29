import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Static list of major Nigerian banks with their CBN codes
    const banks = [
      {
        id: '044',
        name: 'Access Bank',
        code: '044',
        type: 'commercial'
      },
      {
        name: 'Guaranty Trust Bank',
        code: '058',
        type: 'commercial'
      },
      {
        name: 'First Bank of Nigeria',
        code: '011',
        type: 'commercial'
      },
      {
        name: 'Zenith Bank',
        code: '057',
        type: 'commercial'
      },
      {
        name: 'United Bank for Africa',
        code: '033',
        type: 'commercial'
      },
      {
        name: 'Fidelity Bank',
        code: '070',
        type: 'commercial'
      },
      {
        name: 'Union Bank of Nigeria',
        code: '032',
        type: 'commercial'
      },
      {
        name: 'Sterling Bank',
        code: '232',
        type: 'commercial'
      },
      {
        name: 'Stanbic IBTC Bank',
        code: '221',
        type: 'commercial'
      },
      {
        id: '214',
        name: 'First City Monument Bank',
        code: '214',
        type: 'commercial'
      },
      {
        id: '50515',
        name: 'Moniepoint MFB',
        code: '50515',
        type: 'microfinance'
      },
      {
        id: '50211',
        name: 'Kuda Bank',
        code: '50211',
        type: 'digital'
      },
      {
        id: '100004',
        name: 'Opay',
        code: '100004',
        type: 'fintech'
      },
      {
        id: '999991',
        name: 'PalmPay',
        code: '999991',
        type: 'fintech'
      }
    ];

    console.log('Returning static banks list:', banks.length, 'banks');

    return NextResponse.json(
      {
        success: true,
        banks,
        count: banks.length,
        timestamp: new Date().toISOString(),
        source: 'static'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error returning banks list:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch banks list',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
