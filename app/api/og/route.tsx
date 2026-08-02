import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scanId = searchParams.get('scanId');

    if (!scanId) {
      return new Response('Missing scanId parameter', { status: 400 });
    }

    // Fetch scan record from Supabase DB (preventing score parameter spoofing)
    const supabase = getSupabaseServerClient();
    const { data: scanRow, error } = await supabase
      .from('scans')
      .select('domain, visibility_score')
      .eq('id', scanId)
      .single();

    if (error || !scanRow) {
      return new Response('Scan record not found', { status: 404 });
    }

    const scanData = scanRow as any;
    const domain = scanData.domain || 'Target Domain';
    const score = Math.round(Number(scanData.visibility_score) || 0);

    let statusText = 'Dominant Visibility';
    let statusColor = '#34d399'; // emerald

    if (score < 80 && score >= 50) {
      statusText = 'Moderate Visibility';
      statusColor = '#fbbf24'; // amber
    } else if (score < 50 && score >= 20) {
      statusText = 'Low Visibility';
      statusColor = '#fb923c'; // orange
    } else if (score < 20) {
      statusText = 'Invisible in AI Search';
      statusColor = '#D9707A'; // rose
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'radial-gradient(circle at 50% 0%, #312e81 0%, #0f172a 75%)',
            fontFamily: 'sans-serif',
            color: 'white',
            padding: '40px',
          }}
        >
          {/* Header Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              AI
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#94a3b8' }}>
              AI VISIBILITY CHECKER
            </span>
          </div>

          {/* Domain Badge */}
          <div
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#e2e8f0',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              padding: '10px 24px',
              borderRadius: '9999px',
              border: '1px solid #334155',
              marginBottom: '20px',
            }}
          >
            {domain}
          </div>

          {/* Big Score */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              margin: '10px 0',
            }}
          >
            <span
              style={{
                fontSize: '110px',
                fontWeight: '900',
                letterSpacing: '-0.05em',
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span style={{ fontSize: '48px', fontWeight: '800', color: '#818cf8' }}>
              %
            </span>
          </div>

          {/* Score Badge */}
          <div
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: statusColor,
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              padding: '8px 20px',
              borderRadius: '9999px',
              border: `2px solid ${statusColor}`,
              marginTop: '10px',
            }}
          >
            {statusText}
          </div>

          {/* Subtitle */}
          <div
            style={{
              marginTop: '40px',
              fontSize: '16px',
              color: '#64748b',
            }}
          >
            Evaluated across Gemini, GPT, Claude, and Perplexity
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG Image: ${e?.message || e}`, { status: 500 });
  }
}
