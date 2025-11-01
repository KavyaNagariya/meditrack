# Environment Variables Setup Guide

This document explains how to set up all required and optional environment variables for MediTrack Pro.

## Required Environment Variables

### SESSION_SECRET

**What is SESSION_SECRET?**

`SESSION_SECRET` is a secret key used to sign and encrypt session cookies. It ensures that session data cannot be tampered with by users. This is critical for security.

**Why is it needed?**

- Prevents session hijacking
- Ensures session data integrity
- Required for secure authentication

**How to generate a SESSION_SECRET:**

#### Option 1: Using Node.js (Recommended)

Open your terminal and run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will generate a 64-character hexadecimal string that you can use as your SESSION_SECRET.

#### Option 2: Using OpenSSL

```bash
openssl rand -hex 32
```

#### Option 3: Using Online Generator

Visit https://randomkeygen.com/ and copy a "CodeIgniter Encryption Keys" value.

#### Option 4: Manual Generation (Not Recommended)

You can use any random string of at least 32 characters, but using a cryptographically secure random generator is strongly recommended.

**Example SESSION_SECRET:**
```
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Important Notes:**
- Keep your SESSION_SECRET private and never commit it to version control
- Use different SESSION_SECRET values for development and production
- If you change the SESSION_SECRET, all existing user sessions will be invalidated
- The fallback secret (used if SESSION_SECRET is not set) is only for development and should NOT be used in production

---

## Optional Environment Variables

### Google OAuth (Optional)

To enable Google login/signup functionality:

#### GOOGLE_CLIENT_ID
- Your Google OAuth 2.0 Client ID
- Get it from: https://console.cloud.google.com/

#### GOOGLE_CLIENT_SECRET
- Your Google OAuth 2.0 Client Secret
- Get it from: https://console.cloud.google.com/

#### GOOGLE_CALLBACK_URL (Optional)
- The full URL where Google should redirect after authentication
- Default: `http://localhost:3000/auth/google/callback` (development)
- For production, set this to your production URL

#### BASE_URL (Optional)
- Your application's base URL
- Default: `http://localhost:3000` (development)
- Example for production: `https://yourdomain.com`

**How to get Google OAuth credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure the OAuth consent screen (if prompted)
6. Select application type: "Web application"
7. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/google/callback`
   - Production: `https://yourdomain.com/auth/google/callback`
8. Copy the Client ID and Client Secret

---

### Database Configuration (Optional)

#### DATABASE_URL
- PostgreSQL connection string
- Format: `postgresql://username:password@host:port/database`
- If not set, the app will use in-memory storage (data lost on restart)

---

### Application Configuration (Optional)

#### PORT
- Port number for the server to listen on
- Default: `3000`

#### NODE_ENV
- Environment mode: `development` or `production`
- Default: `development`

---

## Setting Up Your .env File

1. Create a `.env` file in the root of the `meditrack` directory:

```bash
cd meditrack
touch .env
```

2. Add your environment variables:

```env
# Required
SESSION_SECRET=your_generated_secret_key_here

# Optional - Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
BASE_URL=http://localhost:3000

# Optional - Database
DATABASE_URL=postgresql://user:password@localhost:5432/meditrack

# Optional - Server
PORT=3000
NODE_ENV=development
```

3. **Important:** Add `.env` to your `.gitignore` file to prevent committing secrets:

```
.env
.env.local
.env.*.local
```

---

## Quick Start Example

1. Generate a SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Copy the output and create your `.env` file:
```env
SESSION_SECRET=<paste_generated_secret_here>
```

3. Restart your development server for changes to take effect.

---

## Troubleshooting

### "Session secret is required" Error
- Make sure SESSION_SECRET is set in your `.env` file
- Restart your server after adding environment variables
- Check that your `.env` file is in the correct location (root of `meditrack` directory)

### Google OAuth Not Working
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
- Check that the callback URL in Google Console matches GOOGLE_CALLBACK_URL
- Ensure your redirect URI includes the protocol (http:// or https://)
- Check browser console for any CORS or redirect errors

### Sessions Not Persisting
- Verify SESSION_SECRET is set and consistent
- Check cookie settings (secure flag in production requires HTTPS)
- Ensure cookies are enabled in your browser

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. Use **different secrets for development and production**
3. **Rotate SESSION_SECRET** periodically in production
4. Use **HTTPS in production** (required for secure cookies)
5. Keep secrets **encrypted** in production environments
6. Use **environment variable management** services (e.g., AWS Secrets Manager, HashiCorp Vault) for production

