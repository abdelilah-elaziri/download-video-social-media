import React, { useState } from 'react';

const TwitterPage = () => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [downloadInfo, setDownloadInfo] = useState(null); // Stores { link, filename }
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchMedia = async () => {
    setIsLoading(true);
    setError('');
    setDownloadInfo(null);

    if (!mediaUrl.trim()) {
      setError('Please enter a Twitter media URL.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/download/twitter?url=${encodeURIComponent(mediaUrl)}`);
      const data = await response.json();

      if (response.ok) {
        const fetchedUrl = data.downloadUrl;
        // Try to guess a filename with extension. This is very basic.
        let suggestedFilename = "twitter_media";
        try {
            const urlPath = new URL(fetchedUrl).pathname;
            const lastSegment = urlPath.substring(urlPath.lastIndexOf('/') + 1);
            if (lastSegment.includes('.')) {
                suggestedFilename = lastSegment;
            } else if (fetchedUrl.includes('format=mp4')) {
                suggestedFilename += '.mp4';
            } else if (fetchedUrl.includes('format=jpg')) {
                suggestedFilename += '.jpg';
            } else if (fetchedUrl.includes('format=png')) {
                suggestedFilename += '.png';
            } else {
                // If no obvious extension, try to infer from common video/image query params or default
                suggestedFilename += (fetchedUrl.includes('video') || fetchedUrl.includes('mp4')) ? '.mp4' : '.jpg';
            }
        } catch (e) {
            // If URL parsing fails, stick to generic
            console.warn("Could not parse URL to suggest filename:", e);
            suggestedFilename += (fetchedUrl.includes('video') || fetchedUrl.includes('mp4')) ? '.mp4' : '.jpg';
        }


        // Trigger direct download
        const link = document.createElement('a');
        link.href = fetchedUrl;
        link.setAttribute('download', suggestedFilename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setDownloadInfo({ link: fetchedUrl, filename: suggestedFilename });
        setError('');
        setMediaUrl(''); // Clear input on success
      } else {
        const userMessage = data.error || 'Failed to fetch Twitter media.';
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
      <h2>Twitter Media Downloader</h2>
      <p>Enter a Twitter URL (e.g., a tweet with a video or GIF) to get its direct download link.</p>
      <div>
        <input
          type="text"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="Enter Twitter Media URL (e.g., tweet with video/GIF)"
          style={{ width: '400px', marginRight: '10px' }}
          disabled={isLoading}
        />
        <button onClick={handleFetchMedia} disabled={isLoading}>
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
            Download Media ({downloadInfo.filename})
          </a>
          <p style={{ fontSize: '0.9em', color: '#555' }}>
            Note: This link is for the media found by yt-dlp. Ensure the Twitter link directly points to or contains the media.
          </p>
        </div>
      )}
    </div>
  );
};

export default TwitterPage;
