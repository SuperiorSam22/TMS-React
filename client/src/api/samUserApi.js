import axios from 'axios';

export const registerUser = async (name, email, password, role) => {
  try {
    const response = await axios.post('/api/users/register', {
      name,
      email,
      password,
      role,
    });

    return response.data; // Returns the newly created user with token
  } catch (error) {
    console.error('Error registering user:', error);
    throw error.response.data.message || 'Registration failed';
  }
};

export const loginUser = async (email, password) => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
  
      // Store JWT in sessionStorage or localStorage if needed
      sessionStorage.setItem('accessJWT', response.data.token);
  
      return response.data; // Returns user data with token
    } catch (error) {
      console.error('Error logging in:', error);
      throw error.response.data.message || 'Login failed';
    }
  };


  export const getUserProfile = async () => {
    try {
      const token = sessionStorage.getItem('accessJWT');
  
      const response = await axios.get('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data; // Returns user profile data
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error.response.data.message || 'Failed to fetch user profile';
    }
  };



export const logoutUser = async () => {
    try {
      const response = await axios.post('/api/users/logout');
  
      // Clear the session storage on logout
      sessionStorage.removeItem('accessJWT');
  
      return response.data; // Returns a logout success message
    } catch (error) {
      console.error('Error logging out:', error);
      throw error.response.data.message || 'Logout failed';
    }
  };