# Backend Assignment - Logging Middleware

## Setup
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with:
   ACCESS_TOKEN=your_access_token_here
4. Start server with:
   npm start

## API Endpoints
1. GET /users
2. POST /users
3. GET /orders
4. PUT /orders

## Example JSON

1. For Users: 
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```
2. For Orders:
```json
{
  "userId": 1,
  "item": "Laptop"
}
```

## Logging
All API calls trigger logs to Affordmed Logging API using the reusable middleware.

## Screenshots of Requests
Screenshots of requests for the routes used can be found in the following Google Drive folder:

[Google Drive - API Requests Screenshots](https://drive.google.com/drive/folders/1WkfJVD-K5VDn6Via-vv3ZgLIdv_YlNZm?usp=sharing)
