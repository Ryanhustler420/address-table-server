import { ENV } from "../env";

// Subdomain can share this cookie
export default {
  //   domain: ".example.com",
  secure: ENV() !== "test",
  //   sameSite: "none",
  //   httpOnly: true,
  signed: false,
  //   path: "/",
} as CookieSessionInterfaces.CookieSessionOptions;

// app.get('/setcookie', (req, res) => {
//   // Set a cookie that can be shared across all subdomains
//   res.cookie('mycookie', 'cookie-value', {
//     domain: '.example.com', // Replace with your domain
//     path: '/', // The cookie is available on all paths
//     httpOnly: true, // Recommended for security
//     secure: true, // Recommended for HTTPS
//     sameSite: 'none', // Recommended for cross-origin requests
//   });
//   res.send('Cookie set');
// });
