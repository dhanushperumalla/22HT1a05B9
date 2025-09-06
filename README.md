# URL Shortener Microservice

This project is a simple HTTP URL Shortener Microservice built with Node.js and Express.
It provides functionality to create short URLs, handle redirections, and retrieve usage statistics.
It also includes a logging middleware that records application events through an external logging API.

---

## Features

* Create short URLs with custom or auto-generated codes
* Set expiry time (default: 30 minutes)
* Redirect shortened URLs to their original destination
* Retrieve statistics (click count, timestamps, referrers, mock geo)
* Error handling for invalid or expired URLs
* Integrated logging middleware for all requests and important events


## API Endpoints

### 1. Create Short URL

**POST** `/shorturls`
**Body (JSON):**

```json
{
  "url": "https://example.com/long/path/to/resource",
  "validity": 10,
  "shortcode": "abc123"
}
```

**Response (201):**

```json
{
  "shortLink": "http://localhost:3000/abc123",
  "expiry": "2025-09-06T08:30:00.000Z"
}
```

---

### 2. Redirect

**GET** `/:code`

Example: `GET http://localhost:3000/abc123`

Redirects to the original URL.
If expired, response is:

```json
{ "error": "Shortcode expired" }
```

---

### 3. Stats

**GET** `/shorturls/:code/stats`

**Response (200):**

```json
{
  "originalUrl": "https://example.com/long/path/to/resource",
  "createdAt": "2025-09-06T07:45:00.000Z",
  "expiry": "2025-09-06T08:30:00.000Z",
  "clicks": 2,
  "clickDetails": [
    {
      "time": "2025-09-06T07:50:00.000Z",
      "referrer": "unknown",
      "geo": "IN"
    }
  ]
}
```

---

## Logging

All requests and events are logged via `logger.js` to an external logging API.

Examples of logged events:

* Incoming requests (method and path)
* Short URL creation
* Redirects
* Errors (expired or missing shortcodes)
* Stats retrieval

---

## Testing with Postman

1. Start the server:

  ```bash
  node BackendTestSubmission/server.js
  ```
2. Use Postman to send requests to the endpoints:

  * `POST http://localhost:3000/shorturls`
  * `GET http://localhost:3000/:code`
  * `GET http://localhost:3000/shorturls/:code/stats`
3. Verify both responses and logs.

---

## Screenshots of Requests
Screenshots of requests for the routes used can be found in the following Google Drive folder:

[Google Drive - API Requests Screenshots](https://drive.google.com/drive/u/1/folders/1WkfJVD-K5VDn6Via-vv3ZgLIdv_YlNZm)
