// API Configuration
export const API_CONFIG = {
  // Use environment variable or fallback to localhost for development
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  
  // API endpoints
  ENDPOINTS: {
    SEND_OTP: '/api/send-otp',
    VERIFY_OTP: '/api/verify-otp',
    HEALTH: '/api/health',
    VALIDATE_PHONE: '/api/validate-phone'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BACKEND_URL}${endpoint}`;
}; 