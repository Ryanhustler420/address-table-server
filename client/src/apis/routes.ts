const host = process.env.REACT_APP_SERVER_HOST_URL || '';
export const routes = {
  GET_CURRENT_USER: `${host}/api/auth/currentuser`,
};