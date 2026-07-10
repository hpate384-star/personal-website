export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return new Response(`Authorization error: ${error}`, { status: 400 })
  }

  if (!code) {
    
    const params = new URLSearchParams({
      client_id: 'd58bcdfb97a44ca4bd7221065b12ad4e',
      response_type: 'code',
      redirect_uri: 'https://refinish-cartload-starfish.ngrok-free.dev/authorize',
      scope: 'user-read-currently-playing user-top-read',
    })
    
    return new Response(`
      <html>
        <head><title>Redirecting to Spotify...</title></head>
        <body style="font-family: Arial; padding: 20px; text-align: center;">
          <p>Redirecting to Spotify...</p>
          <script>
            window.location.href = 'https://accounts.spotify.com/authorize?${params.toString()}';
          </script>
        </body>
      </html>
    `, { 
      headers: { 'Content-Type': 'text/html' }
    })
  }

  
  const CLIENT_ID = 'd58bcdfb97a44ca4bd7221065b12ad4e'
  const CLIENT_SECRET = '34761f557c144158a0f99e8f55740c08'
  const REDIRECT_URI = 'https://refinish-cartload-starfish.ngrok-free.dev/authorize'

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
    })

    const data = await response.json()

    if (data.refresh_token) {
      return new Response(`
        <html>
          <head><title>Authorization Successful!</title></head>
          <body style="font-family: Arial; padding: 20px; text-align: center; background: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #1DB954; margin-bottom: 20px;">✅ Authorization Successful!</h1>
              <p style="color: #333; margin-bottom: 20px; font-size: 16px;">Your refresh token is:</p>
              <code style="background: #f0f0f0; padding: 15px; display: block; margin: 20px 0; word-break: break-all; border-radius: 5px; border: 2px solid #1DB954; font-family: monospace; font-size: 14px;">
                ${data.refresh_token}
              </code>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">📋 Copy this token and send it to your developer to update the widget.</p>
            </div>
          </body>
        </html>
      `, { 
        headers: { 'Content-Type': 'text/html' }
      })
    } else {
      return new Response(`
        <html>
          <body style="font-family: Arial; padding: 20px; text-align: center;">
            <h1>❌ Error</h1>
            <p>${JSON.stringify(data)}</p>
          </body>
        </html>
      `, { 
        headers: { 'Content-Type': 'text/html' },
        status: 400
      })
    }
  } catch (error) {
    return new Response(`
      <html>
        <body style="font-family: Arial; padding: 20px; text-align: center;">
          <h1>❌ Error</h1>
          <p>${error.message}</p>
        </body>
      </html>
    `, { 
      headers: { 'Content-Type': 'text/html' },
      status: 500
    })
  }
}
