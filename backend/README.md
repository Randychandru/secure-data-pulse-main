# SecurePay Backend - Custom OTP API

This backend provides a custom OTP (One-Time Password) system for phone number authentication, integrated with Firebase for user management.

## Features

- ✅ **Custom OTP Generation & Verification**
- ✅ **Phone Number Validation** (with NumVerify integration)
- ✅ **Firebase Integration** for user management
- ✅ **Rate Limiting** (3 attempts per OTP)
- ✅ **OTP Expiry** (5 minutes)
- ✅ **Development Mode** (console logging, no SMS cost)
- ✅ **Production Ready** (can integrate with Twilio for real SMS)

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy the `env` file and update it with your API keys:
```bash
cp env .env
```

Update the following variables:
- `NUMVERIFY_API_KEY`: Your NumVerify API key (optional, for phone validation)
- `TWILIO_*`: Twilio credentials (for production SMS)

### 3. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
```
GET /api/health
```
Returns server status.

### 2. Send OTP
```
POST /api/send-otp
Content-Type: application/json

{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "carrier": "Airtel",
  "country": "India"
}
```

### 3. Verify OTP
```
POST /api/verify-otp
Content-Type: application/json

{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "uid": "user123",
    "phoneNumber": "+919876543210",
    "isNewUser": false
  }
}
```

### 4. Validate Phone Number
```
POST /api/validate-phone
Content-Type: application/json

{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "valid": true,
  "error": null,
  "carrier": "Airtel",
  "country": "India"
}
```

## Development vs Production

### Development Mode
- OTPs are logged to console (no SMS sent)
- No external SMS service required
- Perfect for testing

### Production Mode
To enable real SMS sending, uncomment and configure the Twilio section in `server.js`:

```javascript
// In production, you would send SMS here
const twilio = require('twilio')(accountSid, authToken);
await twilio.messages.create({
  body: `Your SecurePay OTP is: ${otp}`,
  from: '+1234567890',
  to: cleanedPhone
});
```

## Phone Number Validation

The API supports two validation modes:

1. **Basic Validation** (default): Validates Indian phone number format
2. **NumVerify Validation** (optional): Validates phone numbers globally using NumVerify API

To enable NumVerify:
1. Get a free API key from [NumVerify](https://numverify.com/)
2. Add it to your `.env` file: `NUMVERIFY_API_KEY=your_key_here`

## Security Features

- **OTP Expiry**: 5 minutes
- **Rate Limiting**: 3 attempts per OTP
- **Phone Number Cleaning**: Removes spaces, dashes, parentheses
- **Input Validation**: Validates phone number format
- **Error Handling**: Comprehensive error messages

## Integration with Frontend

The frontend (React app) calls these endpoints:

1. **Send OTP**: `http://localhost:5000/api/send-otp`
2. **Verify OTP**: `http://localhost:5000/api/verify-otp`

Make sure the backend is running before testing the phone authentication in the frontend.

## Troubleshooting

### Common Issues

1. **"Failed to send OTP"**
   - Check if backend server is running
   - Verify phone number format (+91XXXXXXXXXX)

2. **"Invalid OTP"**
   - Check server console for the generated OTP
   - Ensure OTP hasn't expired (5 minutes)

3. **"No OTP found"**
   - Request a new OTP
   - Check if phone number matches exactly

### Server Logs

The server provides detailed logging:
```
📱 OTP for +919876543210: 123456
⏰ Expires at: 12/25/2024, 2:30:45 PM
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NUMVERIFY_API_KEY` | NumVerify API key | No |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | No (for production) |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | No (for production) |
| `TWILIO_PHONE_NUMBER` | Twilio Phone Number | No (for production) |

## Next Steps

1. **Test the API** with your React frontend
2. **Add NumVerify** for better phone validation
3. **Configure Twilio** for production SMS
4. **Add Redis** for better OTP storage in production
5. **Add rate limiting** per IP address 