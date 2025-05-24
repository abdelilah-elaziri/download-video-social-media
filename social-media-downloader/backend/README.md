# Backend Server

This directory contains the Node.js Express backend server for the Social Media Downloader application.

## Setup and Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **System Dependencies:**
    *   **`yt-dlp`**: This application uses `yt-dlp` to fetch media information from various platforms. `yt-dlp` must be installed on the system and accessible in the PATH. You can find installation instructions on the [official `yt-dlp` GitHub page](https://github.com/yt-dlp/yt-dlp#installation).

3.  **Install Node.js Dependencies:**
    The primary Node.js dependencies for this backend are `express` (for the server framework) and `cors` (for enabling Cross-Origin Resource Sharing).
    ```bash
    npm install express cors
    ```
    *(Note: In a typical Node.js project, these would be listed in `package.json` and installed with a single `npm install`. Due to sandbox limitations during development, a `package.json` file might be minimal or missing. Running the command above ensures the necessary packages are installed.)*

## Running the Server

1.  **Start the server:**
    Once dependencies are installed (and `express` is available in `node_modules`), you can run the server using:
    ```bash
    node server.js
    ```
    Alternatively, if a `start` script is defined in `package.json` (e.g., `"start": "node server.js"`), you can use:
    ```bash
    npm start
    ```

The server will start, and you should see a message in the console indicating which port it is listening on (e.g., `Server is listening on port 3001`).

## API Endpoints

-   **GET `/api/test`**
    -   **Description:** A test endpoint to verify if the backend is running.
    -   **Response:**
        ```json
        {
          "message": "Backend is running"
        }
        ```

-   **GET `/api/download/youtube`**
    -   **Description:** Fetches a direct download URL for a given YouTube video URL.
    -   **Query Parameters:**
        -   `url` (string, required): The full URL of the YouTube video (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`).
    -   **Success Response (200 OK):**
        -   Returns a JSON object containing the direct media download URL.
        -   Example:
            ```json
            {
              "downloadUrl": "https://rr1---sn-ab5l6nzk.googlevideo.com/videoplayback?..."
            }
            ```
    -   **Error Responses:**
        -   **400 Bad Request (URL is required):**
            ```json
            {
              "error": "URL is required"
            }
            ```
        -   **400 Bad Request (Invalid URL format):**
            ```json
            {
              "error": "Invalid URL format"
            }
            ```
        -   **500 Internal Server Error (Failed to fetch):**
            ```json
            {
              "error": "Failed to fetch video information",
              "details": "yt-dlp command not found. Please ensure it is installed and in PATH." 
            }
            ```
            *(Or other details if `yt-dlp` fails for other reasons, e.g., video not found, network issues).*

-   **GET `/api/download/twitter`**
    -   **Description:** Fetches a direct download URL for media (video/GIF) from a given Twitter URL.
    -   **Query Parameters:**
        -   `url` (string, required): The full URL of the Twitter status containing the media (e.g., `https://twitter.com/user/status/1234567890`).
    -   **Success Response (200 OK):**
        -   Returns a JSON object containing the direct media download URL.
        -   Example:
            ```json
            {
              "downloadUrl": "https://video.twimg.com/ext_tw_video/..."
            }
            ```
    -   **Error Responses:**
        -   **400 Bad Request (URL is required):**
            ```json
            {
              "error": "URL is required"
            }
            ```
        -   **400 Bad Request (Invalid URL format):**
            ```json
            {
              "error": "Invalid URL format"
            }
            ```
        -   **500 Internal Server Error (Failed to fetch):**
            ```json
            {
              "error": "Failed to fetch Twitter media",
              "details": "yt-dlp did not return a downloadable URL for the Twitter link."
            }
            ```
            *(Or other details if `yt-dlp` fails).*

## Security Considerations

It is crucial to consider the following security aspects when deploying this backend in a production environment:

-   **Rate Limiting**: Implement rate limiting on API endpoints (especially `/api/download/youtube` and `/api/download/twitter`) to prevent abuse, protect server resources, and ensure fair usage for all users. Libraries like `express-rate-limit` can be used for this purpose.
-   **Regularly Updating Dependencies**: Keep `yt-dlp` and other Node.js dependencies (like Express, cors, etc.) updated to their latest stable versions. This helps in patching known security vulnerabilities and adapting to changes in external platforms (YouTube, Twitter).
-   **Input Validation**: While basic input validation (e.g., checking URL format) is implemented, thorough server-side validation and sanitization of all inputs (especially URLs passed to external processes like `yt-dlp`) is crucial in a production environment to prevent command injection or other vulnerabilities.
-   **Error Monitoring**: Use a dedicated error monitoring service (e.g., Sentry, LogRocket) in production to track, analyze, and get alerted about backend errors. This helps in identifying and resolving issues proactively.
-   **Resource Management**: Downloading media can be resource-intensive. Monitor server resources (CPU, memory, bandwidth) and consider implementing mechanisms to manage or limit concurrent downloads if necessary.
-   **`yt-dlp` Specifics**: Be aware that `yt-dlp` interacts with third-party websites. Its behavior can be affected by changes on those sites, and it might download content that could be malicious if not handled carefully (though this backend only fetches URLs, not the content itself directly). Always run `yt-dlp` with the least privileges necessary.

## Running Tests

Basic unit tests are provided in the `backend/test/api.test.js` file. These tests focus on input validation for the API endpoints and simple endpoint responses. They do not cover the interaction with `yt-dlp` due to the complexities of mocking external processes and sandbox limitations.

To run the tests:

1.  **Navigate to the backend directory:**
    ```bash
    cd backend 
    ```
    *(Or `cd social-media-downloader/backend` from the project root)*

2.  **Execute the test file using Node.js:**
    ```bash
    node test/api.test.js
    ```

The test script includes a minimal custom test runner and will output the results (passed/failed tests) to the console. If all tests pass, the script will exit with code 0. If any tests fail, it will exit with code 1.
