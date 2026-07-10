export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return new Response(`Authorization error: ${error}`, { status: 400 })
  }

  if (!code) {
    return new Response('No authorization code received', { status: 400 })
  }

  
  return new Response(`
    <html>
      <body style="font-family: Arial; padding: 20px; text-align: center;">
        <h1>Authorization Successful!</h1>
        <p>Your authorization code is:</p>
        <code style="background: #f0f0f0; padding: 10px; display: block; margin: 20px 0; word-break: break-all;">
          ${code}
        </code>
        <p>Copy this code and paste it in the terminal.</p>
      </body>
    </html>
  `, { 
    headers: { 'Content-Type': 'text/html' }
  })
}
