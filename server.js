const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'HTTP Proxy Server is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Main proxy endpoint
app.post('/proxy', async (req, res) => {
  try {
    console.log('Raw request:', JSON.stringify(req.body));
    
    // Get the request body
    let parsedData = req.body;
    console.log('Request body:', parsedData);
    
    // Handle case where body might be a string
    if (typeof parsedData === 'string') {
      parsedData = JSON.parse(parsedData);
      console.log('Parsed body:', parsedData);
    }
    
    // Check if we need to parse the body again (nested JSON)
    if (parsedData.body && typeof parsedData.body === 'string') {
      parsedData = JSON.parse(parsedData.body);
      console.log('Second parse:', parsedData);
    }
    
    const { url, method, headers, body } = parsedData;
    
    // Validate required fields
    if (!url || !method) {
      return res.status(400).json({
        error: 'Missing required fields: url and method are required'
      });
    }
    
    // Parse the body if it's a string
    const requestBody = typeof body === 'string' ? JSON.parse(body) : body;
    
    // Configure the axios request
    const config = {
      method: method.toLowerCase(),
      url: url,
      headers: headers || {},
      data: requestBody
    };
    
    console.log('Making request with config:', JSON.stringify(config, null, 2));
    
    // Make the axios request
    const result = await axios(config);
    
    res.status(200).json({
      data: result.data,
      status: result.status
    });
    
  } catch (error) {
    console.error('Error occurred:', error.message);
    
    res.status(error?.response?.status || 500).json({
      error: error?.message,
      details: error?.response?.data
    });
  }
});

// Handle all other HTTP methods for the proxy endpoint
app.all('/proxy', (req, res) => {
  res.status(405).json({
    error: 'Method not allowed. Use POST method for proxy requests.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: {
      'GET /': 'Health check',
      'POST /proxy': 'HTTP proxy endpoint'
    }
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Proxy endpoint: http://localhost:${PORT}/proxy`);
});
