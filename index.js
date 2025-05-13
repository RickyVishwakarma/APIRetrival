const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 3000;
const TOPICS_FILE = path.join(__dirname, 'topic-api', 'data', 'topics.json');

// Initialize cache with 5 minutes TTL
const cache = new NodeCache({ stdTTL: 300 });

// Rate limiting - 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiting to all routes
app.use(limiter);

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Topics API',
      version: '1.0.0',
      description: 'A simple API to search programming topics by name',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Log the actual file path we're trying to access
console.log('Topics file path:', TOPICS_FILE);

// Optional logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Search for programming topics
 *     description: Retrieve programming topics based on name search with pagination
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term to filter topics by name
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [name]
 *         description: Sort results by name
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page
 */
app.get('/api/topics', async (req, res) => {
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);

  if (!searchQuery || typeof searchQuery !== 'string') {
    return res.status(400).json({ error: "Missing or invalid 'search' query parameter." });
  }

  try {
    // Generate cache key based on query parameters
    const cacheKey = `topics-${searchQuery}-${sortQuery}-${page}-${limit}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const data = await fs.readFile(TOPICS_FILE, 'utf-8');
    let topics = JSON.parse(data);

    // Apply name filter
    let filtered = topics.filter(topic =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply sorting
    if (sortQuery === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filtered.slice(startIndex, endIndex);

    const result = {
      data: paginatedResults,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit)
      }
    };

    // Store in cache
    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
