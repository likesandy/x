/**
 * Configuration for X-Request component
 * Loads values from environment variables with fallback defaults
 */

export interface ApiConfig {
  baseURL: string;
  path: string;
  model: string;
  apiKey: string;
}

/**
 * Get API configuration from environment variables
 * @returns ApiConfig object with all necessary configuration
 */
export const getApiConfig = (): ApiConfig => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const path = process.env.REACT_APP_API_PATH;
  const model = process.env.REACT_APP_MODEL;
  const apiKey = process.env.REACT_APP_API_KEY;

  // Debug: Log environment variables (remove in production)
  console.log('🔧 Environment Variables Debug:', {
    baseURL,
    path,
    model,
    apiKey: apiKey ? '***' + apiKey.slice(-4) : 'undefined',
  });

  // Validate required configuration
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('⚠️ API Key is not configured. Please set REACT_APP_API_KEY in your .env file');
  }

  if (!baseURL) {
    console.warn(
      '⚠️ Base URL is not configured. Please set REACT_APP_API_BASE_URL in your .env file',
    );
  }

  return {
    baseURL: baseURL || 'https://api.moonshot.cn/v1',
    path: path || '/chat/completions',
    model: model || 'kimi-k2-0711-preview',
    apiKey: apiKey || '',
  };
};
