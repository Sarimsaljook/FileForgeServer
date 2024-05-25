const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

const parseContentType = (responseData) => {

   // Convert responseData to string if it's not already a string
   responseData = responseData.toString();

    // Use a regular expression to find the content type
    const match = responseData.match(/Content-Type: (.*)/i);
    
    // If match is found, return the content type, otherwise return a default value
    return match ? match[1].trim() : 'application/octet-stream';
};

// Define a route to call the ngrok URL
app.get('/ngrok-reference-user-directory', async (req, res) => {
  try {
    const response = await axios.get('https://963d-119-155-18-236.ngrok-free.app/list-full-user-directory',  {
        headers: {
            uid: req.headers.uid
        }
    });
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling ngrok URL:', error);
    res.status(500).json({ error: 'Failed to fetch data from ngrok URL' });
  }
});

app.post('/ngrok-reference-upload-file', async (req, res) => {
  try {
    const response = await axios.post('https://963d-119-155-18-236.ngrok-free.app/upload', req.body, {
        headers: {
            'Content-Type': 'multipart/form-data',
             uid: req.headers.uid,
            'file-name' : req.headers['file-name'],
            'file-path' : req.headers['file-path'] 
        }
    });
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling ngrok URL:', error);
    res.status(500).json({ error: 'Failed to fetch data from ngrok URL' });
  }
});

app.get('/ngrok-reference-read-file', async (req, res) => {
  try { 
    const response = await axios.get('https://963d-119-155-18-236.ngrok-free.app/read', {
        headers: {
            uid: req.headers.uid,
            'file-name' : req.headers['file-name'],
            'file-path' : req.headers['file-path'] 
        },
        responseType: 'arraybuffer'
    });
       res.setHeader('Content-Type', parseContentType(response.data));
       res.send(response.data);
  } catch (error) {
    console.error('Error calling ngrok URL:', error);
    res.status(500).json({ error: 'Failed to fetch data from ngrok URL' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
