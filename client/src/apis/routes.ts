const host = process.env.REACT_APP_SERVER_HOST_URL || '';
export const routes = {
  GET_AUTH_CURRENT_USER: `${host}api/auth/currentuser`,
  POST_AUTH_REMOVE_ADMIN: `${host}api/auth/remove-admin`,
  POST_AUTH_MAKE_ADMIN: `${host}api/auth/make-admin`,
  POST_AUTH_REGISTER: `${host}api/auth/register`,
  POST_AUTH_LOGOUT: `${host}api/auth/logout`,
  POST_AUTH_LOGIN: `${host}api/auth/login`,

  POST_COMPILERS_CPP: `${host}api/compilers/cpp`,
  POST_COMPILERS_JAVA: `${host}api/compilers/java`,
  POST_COMPILERS_NODE: `${host}api/compilers/node`,
  POST_COMPILERS_PYTHON: `${host}api/compilers/python`,

  GET_RENDER_RENDERS: `${host}api/render`,
  POST_RENDER_CREATE_RENDER: `${host}api/render`,
  DELETE_RENDER_CREATE_RENDER: `${host}api/render`,
  POST_RENDER_PING_RENDERS: `${host}api/render/ping`,
  GET_RENDER_RENDERS_COUNT: `${host}api/render/tags`,
  POST_RENDER_REDEPLOY_RENDERS: `${host}api/render/redeploy`,
};