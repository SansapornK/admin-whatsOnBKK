// server.js
const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Serve static files from 'public/uploads'
  server.use('/public/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

  // Custom route for events or other API routes
  server.post('/api/addEvent', (req, res) => {
    // Handle your custom POST logic here
  });

  // All other requests will be handled by Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});
