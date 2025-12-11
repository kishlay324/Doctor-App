import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = "$";
    
    // Get backend URL with proper fallback
    // In production, VITE_BACKEND_URL MUST be set
    // In development, fallback to localhost
    let backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    if (!backendUrl) {
        if (import.meta.env.DEV) {
            // Development mode - use localhost
            backendUrl = 'http://localhost:4000';
            console.log('🔗 Development mode: Using localhost backend');
        } else {
            // Production mode - try to detect from window location or use a default
            // Most hosting platforms will require you to set VITE_BACKEND_URL
            const hostname = window.location.hostname;
            
            // If hosted on same domain, use relative path
            // Otherwise, this will fail and show an error (which is correct)
            backendUrl = '';
            console.error('❌ VITE_BACKEND_URL is not set in production!');
            console.error('Please set VITE_BACKEND_URL environment variable in your hosting platform.');
        }
    } else {
        console.log('🔗 Backend URL configured:', backendUrl);
    }

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || false);
    const [userData, setUserData] = useState(false);

    const loadUserProfileData = async () => {
        if (!token) {
            setUserData(false);
            return;
        }

        try {
            const { data } = await axios.get(`${backendUrl}/api/users/get-profile`, {
                headers: { token },
            });
            if (data.success) {
                setUserData(data.userData);
            } else {
                // If token is invalid, clear it
                if (data.message && (data.message.includes('Invalid') || data.message.includes('expired') || data.message.includes('Not authorized'))) {
                    console.log('⚠️ Token invalid, clearing...');
                    localStorage.removeItem('token');
                    setToken(false);
                    setUserData(false);
                }
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            // If it's an auth error, clear the token
            if (error.response?.status === 401 || error.response?.data?.message?.includes('Invalid') || error.response?.data?.message?.includes('expired')) {
                console.log('⚠️ Auth error, clearing token...');
                localStorage.removeItem('token');
                setToken(false);
                setUserData(false);
            }
            // Don't show error toast for auth errors - user will be redirected to login
            if (!error.response?.data?.message?.includes('Invalid') && !error.response?.data?.message?.includes('expired')) {
                toast.error(error.message);
            }
        }
    };

    const testBackendConnection = async () => {
        if (!backendUrl) return false;
        
        try {
            const response = await axios.get(`${backendUrl}/health`, { timeout: 5000 });
            return response.data.status === 'ok';
        } catch (error) {
            console.error('❌ Backend health check failed:', error.message);
            return false;
        }
    };

    const getDoctorsData = async () => {
        // Validate backend URL
        if (!backendUrl) {
            console.error('❌ Backend URL is not configured!');
            console.error('Please set VITE_BACKEND_URL in your .env file or hosting platform environment variables');
            toast.error('Backend URL not configured. Please set VITE_BACKEND_URL environment variable.');
            return;
        }

        // Test backend connection first
        const isBackendAvailable = await testBackendConnection();
        if (!isBackendAvailable) {
            console.error(`❌ Cannot reach backend at ${backendUrl}`);
            toast.error(`Cannot connect to backend server. Please check if it's running at ${backendUrl}`);
            return;
        }

        try {
            const apiUrl = `${backendUrl}/api/doctors/list`;
            console.log('🔄 Fetching doctors from:', apiUrl);
            
            const { data } = await axios.get(apiUrl, { timeout: 10000 });
            console.log('📥 API Response:', data);
            
            if (data.success) {
                const doctorCount = data.doctors?.length || 0;
                console.log(`✅ Received ${doctorCount} doctors from database: ${data.debug?.dbName || 'unknown'}`);
                
                if (data.debug) {
                    console.log('🔍 Debug Info:', {
                        database: data.debug.dbName,
                        collection: data.debug.collectionName,
                        totalCount: data.debug.totalCount,
                        returned: data.debug.returned
                    });
                }
                
                setDoctors(data.doctors || []);
                
                if (doctorCount === 0) {
                    console.warn('⚠️ No doctors returned from API');
                    console.warn('This could mean:');
                    console.warn('  1. No doctors in the database');
                    console.warn('  2. Wrong database being accessed');
                    console.warn('  3. Connection issue');
                }
            } else {
                console.error('❌ API returned error:', data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error('❌ Error fetching doctors:', error);
            const errorDetails = {
                message: error.message,
                url: `${backendUrl}/api/doctors/list`,
                response: error.response?.data,
                status: error.response?.status
            };
            console.error('Error details:', errorDetails);
            
            if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                toast.error(`Cannot connect to backend at ${backendUrl}. Please check if the server is running.`);
            } else {
                toast.error(error.message || 'Failed to fetch doctors');
            }
        }
    };

    useEffect(() => {
        // Only fetch if backend URL is configured
        if (backendUrl) {
        getDoctorsData();
        } else {
            console.error('❌ Cannot fetch doctors: Backend URL not configured');
            toast.error('Backend URL not configured. Please set VITE_BACKEND_URL environment variable.');
        }
    }, [backendUrl]);

    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(false);
        }
    }, [token]);

    const value = {
        doctors,getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
