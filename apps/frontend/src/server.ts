import index from "../index.html";

Bun.serve({
  port: 3020,
  routes: {
    "/": index,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("Frontend running on http://localhost:3020");
