const axios = require('axios');

module.exports = async function (context, req) {
  try {
    context.log('Raw request:', JSON.stringify(req.body));
    
    // Get the request body
    let parsedData = req.body;
    context.log('Request body:', parsedData);
    
    // Handle case where body might be a string
    if (typeof parsedData === 'string') {
      parsedData = JSON.parse(parsedData);
      context.log('Parsed body:', parsedData);
    }
    
    // Check if we need to parse the body again (nested JSON)
    if (parsedData.body && typeof parsedData.body === 'string') {
      parsedData = JSON.parse(parsedData.body);
      context.log('Second parse:', parsedData);
    }
    
    const { url, method, headers, body } = parsedData;
    
    // Validate required fields
    if (!url || !method) {
      context.res = {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: {
          error: 'Missing required fields: url and method are required'
        }
      };
      return;
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
    
    context.log('Making request with config:', JSON.stringify(config, null, 2));
    
    // Make the axios request
    const result = await axios(config);
    
    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        data: result.data,
        status: result.status
      }
    };
    
  } catch (error) {
    context.log.error('Error occurred:', error.message);
    
    context.res = {
      status: error?.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        error: error?.message,
        details: error?.response?.data
      }
    };
  }
};
