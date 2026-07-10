// Run this script to get your Spotify refresh token
// Usage: node get-spotify-token.js YOUR_AUTHORIZATION_CODE

const CLIENT_ID = 'd58bcdfb97a44ca4bd7221065b12ad4e'
const CLIENT_SECRET = '34761f557c144158a0f99e8f55740c08'
const REDIRECT_URI = 'https://refinish-cartload-starfish.ngrok-free.dev/callback'

const authCode = process.argv[2]

if (!authCode) {
  console.log('❌ Please provide the authorization code as an argument')
  console.log('Usage: node get-spotify-token.js YOUR_CODE')
  process.exit(1)
}

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${basic}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: REDIRECT_URI
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.refresh_token) {
      console.log('\n✅ Success! Your refresh token is:\n')
      console.log(data.refresh_token)
      console.log('\n📋 Copy this and save it somewhere safe!')
    } else {
      console.log('❌ Error:', data)
    }
  })
  .catch(err => console.error('❌ Error:', err))
