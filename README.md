# Programming Topics API

A RESTful API service that provides information about various programming languages, technologies, and tools. The API supports searching, pagination, and sorting capabilities.

## Features

- 🔍 Name-based search functionality
- 📄 Pagination support
- ⚡ Fast response times with caching
- 🔒 Rate limiting for API protection
- 📚 Interactive Swagger documentation
- 🎯 100+ programming topics in database

## Prerequisites

- Node.js (>= 14.0.0)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/RickyVishwakarma/APIRetrival.git
cd APIRetrival
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. The server will start at:
- Server URL: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api-docs

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### GET /api/topics
Search for programming topics with pagination and sorting.

**Query Parameters:**
- `search` (required): String - Search term to filter topics by name
- `sort` (optional): String - Sort results by name (value: "name")
- `page` (optional): Integer - Page number (default: 1, minimum: 1)
- `limit` (optional): Integer - Items per page (default: 10, maximum: 50)

**Example Requests:**

1. Basic Search:
```bash
curl "http://localhost:3000/api/topics?search=javascript"
```

2. Search with Sorting:
```bash
curl "http://localhost:3000/api/topics?search=python&sort=name"
```

3. Search with Pagination:
```bash
curl "http://localhost:3000/api/topics?search=java&page=1&limit=10"
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Javascript",
      "category": "Programming",
      "description": "A high-level, dynamic, untyped, and interpreted programming language."
    }
    // ... more results
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Rate Limiting

- Rate limit: 100 requests per 15 minutes
- When exceeded, returns 429 Too Many Requests

## Caching

- Cache duration: 5 minutes
- Improves response times for repeated queries

## Development

For development with auto-reload:
```bash
npm run dev
```

## Project Structure

```
.
├── index.js              # Main application file
├── topic-api/
│   └── data/
│       └── topics.json   # Database file
├── package.json          # Project dependencies and scripts
└── README.md            # Project documentation
```

## Dependencies

- express: Web framework
- express-rate-limit: Rate limiting middleware
- node-cache: Caching solution
- swagger-jsdoc: API documentation
- swagger-ui-express: Swagger UI
- nodemon: Development dependency for auto-reload

## Testing the API

1. Using Swagger UI:
   - Open http://localhost:3000/api-docs in your browser
   - Try out the endpoints interactively

2. Using cURL:
```bash
# Test basic search
curl "http://localhost:3000/api/topics?search=python"

# Test search with sorting
curl "http://localhost:3000/api/topics?search=java&sort=name"

# Test pagination
curl "http://localhost:3000/api/topics?search=script&page=1&limit=5"
```

3. Using Browser:
   - Open http://localhost:3000/api/topics?search=javascript in your browser

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Successful request
- 400: Bad request (missing or invalid parameters)
- 429: Too many requests
- 500: Server error

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC License

## Author

Ricky Vishwakarma