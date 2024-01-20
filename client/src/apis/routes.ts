const host = process.env.REACT_APP_SERVER_HOST_URL || 'http://localhost:8080';
export const routes = {
  GET_CURRENT_USER: `${host}/api/auth/currentuser`,
};