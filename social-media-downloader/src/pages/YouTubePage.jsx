import React, { useState } from 'react';

const YouTubePage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadInfo, setDownloadInfo] = useState(null); // Stores { link, filename }
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchVideo = async () => {
    setIsLoading(true);
    setError('');
    setDownloadInfo(null);

    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/download/youtube?url=${encodeURIComponent(videoUrl)}`);
      const data = await response.json();

      if (response.ok) {
        const fetchedUrl = data.downloadUrl;
        const suggestedFilename = "youtube_video.mp4"; // Generic filename

        // Trigger direct download
        const link = document.createElement('a');
        link.href = fetchedUrl;
        link.setAttribute('download', suggestedFilename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Set info for fallback display
        setDownloadInfo({ link: fetchedUrl, filename: suggestedFilename });
        setError('');
        setVideoUrl(''); // Clear input on success
      } else {
        // Display user-friendly error from API, log details
        const userMessage = data.error || 'Failed to fetch video information.';
        setError(userMessage);
        if (data.details) {
          console.error('API Error Details:', data.details);
        }
        setDownloadInfo(null);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('An unexpected network error occurred. Please try again or check if the backend server is running.');
      setDownloadInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>YouTube Downloader</h2>
      <p>Enter a YouTube video URL to get its direct download link.</p>
      <div>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube Video URL"
          style={{ width: '300px', marginRight: '10px' }}
          disabled={isLoading}
        />
        <button onClick={handleFetchVideo} disabled={isLoading}>
          {isLoading ? 'Fetching...' : 'Get Download Link'}
        </button>
      </div>

      {isLoading && <p style={{ marginTop: '10px' }}>Loading, please wait...</p>}

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {downloadInfo && (
        <div style={{ marginTop: '20px' }}>
          <h3>Download Initiated!</h3>
          <p>If your download didn't start automatically, you can use the link below:</p>
          <a href={downloadInfo.link} target="_blank" rel="noopener noreferrer" download={downloadInfo.filename}>
            Download Video ({downloadInfo.filename})
          </a>
          <p style={{ fontSize: '0.9em', color: '#555' }}>
            Note: Direct links can sometimes expire or have restrictions. If it doesn't work, please try generating a new link.
          </p>
        </div>
      )}
    </div>
  );
};

export default YouTubePage;
