import { getData } from "./FetchNodeServices";
export const FetchToken = async () => {
    try {
      const tokenData = await getData("category/login");
      if (tokenData && tokenData.token) {
        // Store the token in localStorage or in a variable accessible to handleSubmit
        localStorage.setItem('token', tokenData.token);
        return true;
      } else {
        return false; // Token not available
      }
    } catch (error) {
      console.error('Error fetching token:', error);
      return false;
    }
  }