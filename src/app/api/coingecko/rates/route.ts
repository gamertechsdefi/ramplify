import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCurrency = searchParams.get('from') || 'USDC';
    
    console.log('Fetching CoinGecko rate for:', fromCurrency);

    // Map crypto symbols to CoinGecko IDs
    const coinGeckoIds: { [key: string]: string } = {
      'USDC': 'usd-coin',
      'ETH': 'ethereum',
      'BTC': 'bitcoin'
    };

    const coinId = coinGeckoIds[fromCurrency];
    if (!coinId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported currency',
          message: `Currency ${fromCurrency} is not supported. Supported: USDC, ETH, BTC`,
        },
        { status: 400 }
      );
    }

    // CoinGecko API endpoint for prices in NGN
    const coingeckoApiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=ngn`;
    
    console.log('CoinGecko API URL:', coingeckoApiUrl);

    const response = await fetch(coingeckoApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('CoinGecko response status:', response.status);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('CoinGecko response data:', JSON.stringify(data, null, 2));

    // Extract rate from CoinGecko response
    const rate = data[coinId]?.ngn;
    
    if (!rate) {
      throw new Error('Rate not found in CoinGecko response');
    }

    console.log('Extracted rate:', rate);

    return NextResponse.json(
      {
        success: true,
        rate,
        fromCurrency,
        toCurrency: 'NGN',
        timestamp: new Date().toISOString(),
        source: 'coingecko'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching CoinGecko rates:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch rates from CoinGecko',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
