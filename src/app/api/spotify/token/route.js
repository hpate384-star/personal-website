const CLIENT_ID = 'd58bcdfb97a44ca4bd7221065b12ad4e'
const CLIENT_SECRET = '34761f557c144158a0f99e8f55740c08'


let cachedToken = null
let tokenExpiry = null

export async function POST(request) {
  try {
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!refreshToken) {
      return new Response(
        JSON.stringify({ error: 'No refresh token provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      return new Response(
        JSON.stringify({ access_token: cachedToken }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    })

    const data = await response.json()

    if (!data.access_token) {
      console.error('Spotify token error:', data)
      return new Response(
        JSON.stringify({ error: 'Failed to get access token', details: data }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    
    cachedToken = data.access_token
    tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000 - 300000

    return new Response(
      JSON.stringify({ access_token: data.access_token }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Token exchange error:', error)
    return new Response(
      JSON.stringify({ error: 'Token exchange failed', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
