// Netlify Function: submit-contact
// Proxies form submissions to the farrier-crm Vercel API
// Both OHN and JF sites ultimately write to the same Supabase + Kit

export default async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://ohiohousingnerd.com',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()

    const response = await fetch('https://farrier-crm.vercel.app/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://ohiohousingnerd.com',
      },
    })
  } catch (err) {
    console.error('submit-contact error:', err)
    return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://ohiohousingnerd.com',
      },
    })
  }
}

export const config = {
  path: '/netlify/functions/submit-contact',
}
