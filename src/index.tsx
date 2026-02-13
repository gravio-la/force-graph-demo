import { serve } from "bun";
import index from "./index.html";

const server = serve({
  port: process.env.PORT || 3001,
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: false,
  },
});

console.log(`🚀 3D Force Graph Explorer running at ${server.url}`);
