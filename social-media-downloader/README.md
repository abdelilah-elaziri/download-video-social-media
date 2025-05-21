# Social Media Downloader Web App

## Description

This web application allows users to download videos and media (like GIFs or images from tweets) from popular social media platforms, including YouTube and Twitter. It provides a simple interface to paste the URL of the media and get a direct download link.

## Features

-   Supports YouTube video downloads.
-   Supports Twitter media downloads (videos, GIFs).
-   Aims to fetch the highest quality media link provided by `yt-dlp`.
-   Simple and user-friendly interface.
-   Backend API for fetching download links.
-   Frontend UI to interact with the API, display results, and handle errors.

## Tech Stack

-   **Frontend**: React (Vite), JavaScript, HTML, CSS
-   **Backend**: Node.js, Express.js
-   **External Tool**: `yt-dlp` (for fetching media information from social media platforms)

## Setup and Running Instructions

### Prerequisites

-   **Node.js and npm**: Ensure Node.js (which includes npm) is installed. You can download it from [nodejs.org](https://nodejs.org/).
-   **`yt-dlp`**: This is a system-wide dependency. You must install `yt-dlp` and ensure it's accessible in your system's PATH. Installation instructions can be found on the [official `yt-dlp` GitHub page](https://github.com/yt-dlp/yt-dlp#installation).

### Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd social-media-downloader/backend
    ```

2.  **Install dependencies**:
    The backend requires `express` and `cors`. Since `package.json` might be minimal due to sandbox limitations during development, install them explicitly:
    ```bash
    npm install express cors
    ```
    *(In a typical setup with a complete `package.json`, `npm install` would suffice.)*

3.  **Run the backend server**:
    ```bash
    node server.js
    ```
    The backend server will typically start on `http://localhost:3001`.

### Frontend Setup

1.  **Navigate to the project root directory**:
    (The frontend is located at the root of the `social-media-downloader` project).
    ```bash
    cd social-media-downloader 
    ```
    *(If you were in the `backend` directory, you'd use `cd ..`)*

2.  **Install dependencies**:
    The frontend requires React, `react-router-dom`, and other Vite-related packages.
    ```bash
    npm install
    ```
    *(This command should install all dependencies listed in `package.json` created by Vite, including `react` and `react-router-dom` which were added.)*

3.  **Run the frontend development server**:
    ```bash
    npm run dev
    ```
    The frontend development server will typically start on `http://localhost:5173` (Vite's default) or the next available port.

### Accessing the Application

Once both backend and frontend servers are running:
-   Open your web browser and go to the frontend URL (e.g., `http://localhost:5173`).

## Usage

1.  Navigate to the YouTube or Twitter downloader page using the navigation bar.
2.  Paste the full URL of the YouTube video or Twitter media (e.g., a tweet containing a video or GIF) into the input field.
3.  Click the "Get Download Link" button.
4.  If successful, the download should start automatically. A fallback download link will also be displayed.
5.  If there's an error, a message will be displayed. Check the URL or try again.

---

This README provides a basic guide to getting the Social Media Downloader application up and running. For more details on the backend API, see `social-media-downloader/backend/README.md`.
