// In a file named adminReducer.js
import { ADMIN_LOGIN, ADMIN_LOGOUT, RESET_ADMIN } from './AdminActions';

const initialState = {
  isLoggedIn: false,
  name: '',
  email: '',
  picture: '',
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_LOGIN:
      return {
        ...state,
        isLoggedIn: true,
      };
    case ADMIN_LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
      };
      case RESET_ADMIN:
        return initialState; // Reset admin state to initial values
      default:
        return state;
  }
};

export default adminReducer;
