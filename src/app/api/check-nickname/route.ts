import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const zoneId = searchParams.get('zone');

    if (!userId || !zoneId) {
      return NextResponse.json({ success: false, message: 'Missing id or zone' }, { status: 400 });
    }

    // Try primary API
    const apiUrl = `https://api.isan.eu.org/nickname/ml?id=${encodeURIComponent(userId)}&zone=${encodeURIComponent(zoneId)}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const res = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        return NextResponse.json({ success: false, message: 'API returned error' });
      }

      const data = await res.json();
      
      // The API may return different formats, handle flexibly
      const nickname = data?.nickname || data?.name || data?.username || null;

      if (nickname) {
        return NextResponse.json({ success: true, nickname });
      } else {
        return NextResponse.json({ success: false, message: 'Nickname not found' });
      }
    } catch (fetchError: any) {
      clearTimeout(timeout);
      // API timeout or network error — graceful fallback
      console.warn('[check-nickname] API error:', fetchError.message);
      return NextResponse.json({ success: false, message: 'API unavailable' });
    }

  } catch (error: any) {
    console.error('[check-nickname] Error:', error.message);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
