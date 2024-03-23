const http = require('http');
const fs = require('fs');

console.log(process.env.OPENAI_KEY);

async function upload() {
  try {
    const fileContent = fs.readFileSync('./train.jsonl', 'utf-8');
    console.log('File Content:', fileContent);

    const fileStream = fs.createReadStream('./train.jsonl');
    const fileStat = fs.statSync('./train.jsonl');

    const options = {
      method: 'POST',
      host: 'api.openai.com',
      path: '/v1/files',
      headers: {
        'Content-Type': 'application/x-ndjson', // Corrected content type
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
        'Content-Length': fileStat.size,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (data) {
          try {
            const responseObj = JSON.parse(data);
            console.log('File ID:', responseObj.id);
          } catch (error) {
            console.error('JSON Parsing Error:', error.message);
          }
        } else {
          console.error('Error: Empty response data');
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error.message);
    });

    fileStream.pipe(req);

  } catch (err) {
    console.log('Error:', err.message);
  }
}

upload();
