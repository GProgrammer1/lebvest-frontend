import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Centralized Axios API client
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:8080/',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    // Attach interceptors
    this.axiosInstance.interceptors.request.use(
      this.handleRequest,
      this.handleError
    );
    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    );
  }

  // Add auth token if present
  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = localStorage.getItem('authToken');
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        // Axios v1: headers is AxiosHeaders instance
        config.headers.set('Authorization', `Bearer ${token}`);
      } else if (config.headers) {
        // Fallback for plain object headers
        (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // If data is FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      if (config.headers && typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else if (config.headers && 'Content-Type' in config.headers) {
        delete (config.headers as Record<string, any>)['Content-Type'];
      }
    }
    
    return config;
  }

  // You can transform the response here if needed
  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  // Centralized error handling
  private handleError(error: any): Promise<any> {
    // For example, logout on 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }

  // HTTP methods
  public get<T>(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get<T>(url, config);
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete<T>(url, config);
  }
}

// Single exported instance
const apiClient = new ApiClient();
export default apiClient;
