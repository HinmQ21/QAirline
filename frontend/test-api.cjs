// Test script để kiểm tra API dashboard
const https = require('https');

const options = {
  hostname: 'qairline-x0ye.onrender.com',
  path: '/api/admin/dashboard',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwidHlwZSI6ImFkbWluIiwiaWF0IjoxNzM4MjkzNjgzLCJleHAiOjE3MzgzMDgwODN9.example', // Token mẫu
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    try {
      const json = JSON.parse(data);
      console.log('Parsed JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Not valid JSON response');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end(); 