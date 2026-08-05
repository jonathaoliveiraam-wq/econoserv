export const config = { runtime: 'edge' };

const DESTINO = 'jonatha.oliveira.am@gmail.com';
const REFERER = 'https://econoserv-beta.vercel.app/';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const incoming = await request.formData();

    const upstream = await fetch('https://formsubmit.co/ajax/' + DESTINO, {
      method: 'POST',
      body: incoming,
      headers: {
        'Accept': 'application/json',
        'Referer': REFERER
      }
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: upstream.ok, raw: text };
    }

    return new Response(JSON.stringify(data), {
      status: upstream.ok ? 200 : 502,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: String(err && err.message || err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
