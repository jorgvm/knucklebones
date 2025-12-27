import { createServer } from "http";

export const httpServer = createServer((req, res) => {
  // Handle health ping
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });

    res.end("OK");
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});
