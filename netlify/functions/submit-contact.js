// Netlify Function: submit-contact (CommonJS v1)
// Proxies OHN form submissions to farrier-crm Vercel API

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://ohiohousingnerd.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const response = await fetch('https://farrier-crm.vercel.app/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    return { statusCode: response.status, headers, body: JSON.stringify(data) }
  } catch (err) {
    console.error('submit-contact error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || 'Unknown error' }) }
  }
}
