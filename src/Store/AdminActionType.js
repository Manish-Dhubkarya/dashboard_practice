// In a file named adminActions.js
import { ADMIN_LOGIN, ADMIN_LOGOUT, RESET_ADMIN } from './AdminActions';

export const adminLogin = () => ({
  type: ADMIN_LOGIN,
});

export const adminLogout = () => ({
  type: ADMIN_LOGOUT,
});
export const resetAdmin = () => ({
    type: RESET_ADMIN,
  });