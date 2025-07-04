const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://data-pulse-main-default-rtdb.firebaseio.com/"
});

// In-memory storage for OTPs (use Redis in production)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Clean phone number (remove spaces, dashes, etc.)
const cleanPhoneNumber = (phone) => {
  return phone.replace(/[\s\-\(\)]/g, '');
};

// Validate Indian phone number format
const validateIndianPhone = (phone) => {
  const indianPhonePattern = /^\+91[6-9]\d{9}$/;
  return indianPhonePattern.test(phone);
};

// Validate phone number with NumVerify (if API key is provided)
const validatePhoneWithNumVerify = async (phoneNumber) => {
  if (!process.env.NUMVERIFY_API_KEY) {
    // If no NumVerify API key, just validate format
    return { valid: validateIndianPhone(phoneNumber), error: null };
  }

  try {
    const response = await fetch(
      `http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_API_KEY}&number=${phoneNumber}`
    );
    const data = await response.json();
    
    if (data.valid && data.line_type === "mobile") {
      return { 
        valid: true, 
        carrier: data.carrier,
        country: data.country_name,
        error: null 
      };
    } else {
      return { 
        valid: false, 
        error: "Invalid phone number or not a mobile number" 
      };
    }
  } catch (error) {
    console.error('NumVerify API error:', error);
    // Fallback to basic validation if NumVerify fails
    return { 
      valid: validateIndianPhone(phoneNumber), 
      error: null 
    };
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }

    const cleanedPhone = cleanPhoneNumber(phone);
    
    // Validate phone number
    const validation = await validatePhoneWithNumVerify(cleanedPhone);
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: validation.error || 'Invalid phone number format' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes expiry
    
    // Store OTP
    otpStore.set(cleanedPhone, {
      code: otp,
      expiresAt: expiresAt,
      attempts: 0
    });

    // In development, log the OTP (never do this in production!)
    console.log(`\n📱 OTP for ${cleanedPhone}: ${otp}`);
    console.log(`⏰ Expires at: ${new Date(expiresAt).toLocaleString()}\n`);

    // In production, you would send SMS here
    // Example with Twilio:
    // const twilio = require('twilio')(accountSid, authToken);
    // await twilio.messages.create({
    //   body: `Your SecurePay OTP is: ${otp}`,
    //   from: '+1234567890',
    //   to: cleanedPhone
    // });

    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      carrier: validation.carrier || null,
      country: validation.country || 'India',
      otp: otp // Always include OTP for demo
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send OTP' 
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number and OTP are required' 
      });
    }

    const cleanedPhone = cleanPhoneNumber(phone);
    const storedData = otpStore.get(cleanedPhone);
    
    if (!storedData) {
      return res.status(400).json({ 
        success: false, 
        error: 'No OTP found for this phone number' 
      });
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(cleanedPhone);
      return res.status(400).json({ 
        success: false, 
        error: 'OTP has expired' 
      });
    }

    // Check if too many attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(cleanedPhone);
      return res.status(400).json({ 
        success: false, 
        error: 'Too many failed attempts. Please request a new OTP.' 
      });
    }

    // Verify OTP
    if (storedData.code === otp) {
      // OTP is correct - remove from store
      otpStore.delete(cleanedPhone);
      
      // Try to get existing user from Firebase Auth
      try {
        const userRecord = await admin.auth().getUserByPhoneNumber(cleanedPhone);
        // Create custom token for existing user
        const customToken = await admin.auth().createCustomToken(userRecord.uid);
        res.json({ 
          success: true, 
          message: 'OTP verified successfully',
          user: {
            uid: userRecord.uid,
            phoneNumber: userRecord.phoneNumber,
            isNewUser: false,
            customToken: customToken
          }
        });
      } catch (error) {
        // User doesn't exist in Firebase Auth, create a new user
        try {
          const userRecord = await admin.auth().createUser({
            phoneNumber: cleanedPhone,
            displayName: `User ${cleanedPhone.slice(-4)}`, // Use last 4 digits as display name
            email: `${cleanedPhone}@securepay.local` // Temporary email for Firebase Auth
          });

          // Create basic user data in Firebase Database
          const db = admin.database();
          await db.ref(`users/${userRecord.uid}/personalInfo`).set({
            name: `User ${cleanedPhone.slice(-4)}`,
            phone: cleanedPhone,
            email: `${cleanedPhone}@securepay.local`,
            dateOfBirth: "",
            panNumber: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            occupation: "",
            annualIncome: "",
            preferredCurrency: "INR",
            accountType: "personal",
          });

          // Create default stats
          await db.ref(`users/${userRecord.uid}/stats`).set({
            totalBalance: { 
              title: "Total Balance", 
              value: "₹0", 
              change: "0%", 
              trend: "up", 
              icon: null, 
              color: "text-blue-600", 
              bgColor: "from-blue-100 to-blue-200", 
              period: "This month" 
            }
          });

          // Create custom token for new user
          const customToken = await admin.auth().createCustomToken(userRecord.uid);

          res.json({ 
            success: true, 
            message: 'OTP verified successfully',
            user: {
              uid: userRecord.uid,
              phoneNumber: userRecord.phoneNumber,
              isNewUser: true,
              customToken: customToken
            }
          });
        } catch (createError) {
          console.error('Error creating Firebase user:', createError);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to create user account' 
          });
        }
      }
    } else {
      // Increment attempts
      storedData.attempts += 1;
      otpStore.set(cleanedPhone, storedData);
      
      res.status(400).json({ 
        success: false, 
        error: 'Invalid OTP' 
      });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to verify OTP' 
    });
  }
});

// Validate phone number endpoint (for frontend validation)
app.post('/api/validate-phone', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Phone number is required' 
      });
    }

    const cleanedPhone = cleanPhoneNumber(phone);
    const validation = await validatePhoneWithNumVerify(cleanedPhone);
    
    res.json({
      valid: validation.valid,
      error: validation.error,
      carrier: validation.carrier,
      country: validation.country
    });

  } catch (error) {
    console.error('Phone validation error:', error);
    res.status(500).json({ 
      valid: false, 
      error: 'Validation failed' 
    });
  }
});

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
    }
  }
}, 5 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 OTP API ready: http://localhost:${PORT}/api/send-otp`);
  console.log(`✅ Verify API ready: http://localhost:${PORT}/api/verify-otp`);
  console.log(`🔍 Phone validation: http://localhost:${PORT}/api/validate-phone`);
}); 