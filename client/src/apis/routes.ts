const backend = process.env.REACT_APP_SERVER_BACKEND_URL || ''; // proxy
export const routes = {
  GET_AUTH_CURRENT_USER: `${backend}api/auth/currentuser`,
  POST_AUTH_REMOVE_ADMIN: `${backend}api/auth/remove-admin`,
  POST_AUTH_MAKE_ADMIN: `${backend}api/auth/make-admin`,
  POST_AUTH_REGISTER: `${backend}api/auth/register`,
  POST_AUTH_LOGOUT: `${backend}api/auth/logout`,
  POST_AUTH_LOGIN: `${backend}api/auth/login`,

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