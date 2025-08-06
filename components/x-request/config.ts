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

  return {
    baseURL: baseURL!,
    path: path!,
    model: model!,
    apiKey: apiKey!,
  };
};
