const express = require('express');
const { exec } = require('child_process');
const cors = require('cors'); // Import CORS. Note: npm install cors would be needed.
const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// TODO: Implement rate limiting in a production environment
// Consider using libraries like 'express-rate-limit' to prevent abuse.
// Rate limiting should be applied to download endpoints based on IP address.

const isValidUrl = (urlString) => {
  const urlPattern = /^https?:\/\//i;
  return urlPattern.test(urlString);
};

app.get('/api/test', (req, res) => {
  console.log(`[${new Date().toISOString()}] Received GET request for /api/test`);
  res.json({ message: 'Backend is running' });
});

// Endpoint to get YouTube video download URL
app.get('/api/download/youtube', (req, res) => {
  const videoUrl = req.query.url;
  console.log(`[${new Date().toISOString()}] Received GET request for /api/download/youtube?url=${videoUrl}`);

  if (!videoUrl) {
    console.warn(`[${new Date().toISOString()}] URL is required for /api/download/youtube. Request IP: ${req.ip}`);
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!isValidUrl(videoUrl)) {
    console.warn(`[${new Date().toISOString()}] Invalid URL format for /api/download/youtube: ${videoUrl}. Request IP: ${req.ip}`);
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const command = `yt-dlp -g "${videoUrl}"`;
  console.log(`[${new Date().toISOString()}] Executing command for YouTube: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`[${new Date().toISOString()}] yt-dlp execution error for YouTube URL "${videoUrl}": ${error.message}. Stderr: ${stderr}. Request IP: ${req.ip}`);
      if (error.message.includes('ENOENT') || error.message.toLowerCase().includes('not found')) {
        return res.status(500).json({
          error: 'Failed to fetch video information',
          details: 'yt-dlp command not found. Please ensure it is installed and in PATH.',
        });
      }
      return res.status(500).json({
        error: 'Failed to fetch video information',
        details: stderr || error.message, // Return stderr as details for more context
      });
    }

    if (stderr) {
      // yt-dlp might output warnings to stderr even on success. Log these warnings.
      console.warn(`[${new Date().toISOString()}] yt-dlp stderr for YouTube URL "${videoUrl}": ${stderr}. Request IP: ${req.ip}`);
    }

    const downloadUrls = stdout.trim().split('\n');
    if (downloadUrls.length > 0 && downloadUrls[0]) {
      let bestUrl = downloadUrls[0];
      console.log(`[${new Date().toISOString()}] Successfully fetched YouTube download URL for "${videoUrl}": ${bestUrl}. Request IP: ${req.ip}`);
      res.json({ downloadUrl: bestUrl });
    } else {
      console.error(`[${new Date().toISOString()}] yt-dlp did not return a downloadable URL for YouTube: "${videoUrl}". Stdout: ${stdout}. Request IP: ${req.ip}`);
      res.status(500).json({
        error: 'Failed to fetch video information',
        details: 'yt-dlp did not return a downloadable URL.',
      });
    }
  });
});

// Endpoint to get Twitter media download URL
app.get('/api/download/twitter', (req, res) => {
  const mediaUrl = req.query.url;
  console.log(`[${new Date().toISOString()}] Received GET request for /api/download/twitter?url=${mediaUrl}`);

  if (!mediaUrl) {
    console.warn(`[${new Date().toISOString()}] URL is required for /api/download/twitter. Request IP: ${req.ip}`);
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!isValidUrl(mediaUrl)) {
    console.warn(`[${new Date().toISOString()}] Invalid URL format for /api/download/twitter: ${mediaUrl}. Request IP: ${req.ip}`);
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const command = `yt-dlp -g "${mediaUrl}"`;
  console.log(`[${new Date().toISOString()}] Executing command for Twitter: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`[${new Date().toISOString()}] yt-dlp execution error for Twitter URL "${mediaUrl}": ${error.message}. Stderr: ${stderr}. Request IP: ${req.ip}`);
      if (error.message.includes('ENOENT') || error.message.toLowerCase().includes('not found')) {
        return res.status(500).json({
          error: 'Failed to fetch Twitter media',
          details: 'yt-dlp command not found. Please ensure it is installed and in PATH.',
        });
      }
      return res.status(500).json({
        error: 'Failed to fetch Twitter media',
        details: stderr || error.message, // Return stderr as details
      });
    }

    if (stderr) {
      console.warn(`[${new Date().toISOString()}] yt-dlp stderr for Twitter URL "${mediaUrl}": ${stderr}. Request IP: ${req.ip}`);
    }

    const downloadUrls = stdout.trim().split('\n');
    let bestUrl = downloadUrls.find(url => url.includes('video') || url.includes('mp4')) || downloadUrls[0];

    if (bestUrl) {
      console.log(`[${new Date().toISOString()}] Successfully fetched Twitter download URL for "${mediaUrl}": ${bestUrl}. Request IP: ${req.ip}`);
      res.json({ downloadUrl: bestUrl });
    } else {
      console.error(`[${new Date().toISOString()}] yt-dlp did not return a downloadable URL for Twitter: "${mediaUrl}". Stdout: ${stdout}. Request IP: ${req.ip}`);
      res.status(500).json({
        error: 'Failed to fetch Twitter media',
        details: 'yt-dlp did not return a downloadable URL for the Twitter link.',
      });
    }
  });
});

// If this script is run directly (node server.js), then start the server.
// If it's imported by another script (e.g., a test file), the server shouldn't start automatically.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`[${new Date().toISOString()}] Server is listening on port ${port}`);
  });
}

module.exports = app; // Export the app for testing
