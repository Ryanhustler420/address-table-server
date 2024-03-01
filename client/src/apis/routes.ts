const backend = process.env.REACT_APP_SERVER_BACKEND_URL || ''; // proxy
const monolithic = process.env.REACT_APP_SERVER_MONOLITHIC_URL || 'http://localhost:8087/';

export const routes = {
  GET_AUTH_CURRENT_USER: `${monolithic}api/auth/currentuser`,
  POST_AUTH_REMOVE_ADMIN: `${monolithic}api/auth/remove-admin`,
  POST_AUTH_MAKE_ADMIN: `${monolithic}api/auth/make-admin`,
  POST_AUTH_REGISTER: `${monolithic}api/auth/register`,
  POST_AUTH_LOGOUT: `${monolithic}api/auth/logout`,
  POST_AUTH_LOGIN: `${monolithic}api/auth/login`,

  POST_COMPILERS_CPP: `${backend}api/compilers/cpp`,
  POST_COMPILERS_JAVA: `${backend}api/compilers/java`,
  POST_COMPILERS_NODE: `${backend}api/compilers/node`,
  POST_COMPILERS_PYTHON: `${backend}api/compilers/python`,

  GET_RENDER_RENDERS: `${backend}api/render`,
  POST_RENDER_CREATE_RENDER: `${backend}api/render`,
  DELETE_RENDER_CREATE_RENDER: `${backend}api/render`,
  POST_RENDER_PING_RENDERS: `${backend}api/render/ping`,
  GET_RENDER_RENDERS_COUNT: `${backend}api/render/tags`,
  POST_RENDER_REDEPLOY_RENDERS: `${backend}api/render/redeploy`,
};