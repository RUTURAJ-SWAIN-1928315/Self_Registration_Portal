import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AxiosInterceptor() {
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response && error.response.status === 401) {
          // Perform the logout
          try {
            await axios.get(`${BACKEND_URL}/kiosk/logout`);
          } catch (logoutError) {
            console.error('Logout failed:', logoutError);
          }
          // Redirect to the root after logout
          navigate('/');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return null;  // This component does not render anything
}

export default AxiosInterceptor;
