require('dotenv').config(); // Load environment variables
const express = require('express');
const app = express();
const { Configuration, OpenAIApi } = require("openai");
const https = require("https");
const fs = require('fs');
const util = require('util');
// Import the scraper module
const scraper = require('./Scraper');

app.use(express.static('public'));
app.use(express.json());



// Handle CORS (Cross-Origin Resource Sharing) to allow requests from different origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// // Replace this with your actual OpenAI API key
// const openai = new OpenAIApi({ apiKey: '' });
// const configuration = new Configuration({
//     apiKey: "",
// });

// Initialize OpenAI API client with the API key from environment variable
const openaiApiKey = process.env.OPENAI_API_KEY;
console.log(openaiApiKey);
const openai = new OpenAIApi({ apiKey: openaiApiKey });


// Define an async function to use the scraper function
async function getFinancialData(stockSymbol) {
    try {
      // Call the scraper function with the stock symbol
      const scrapedData = await scraper.scrapeFinancialData(stockSymbol);
    //   console.log(scrapedData)
      
      // Do something with the scraped data (e.g., return it, process it, etc.)
      return scrapedData;
    } catch (error) {
      // Handle any errors that may occur during scraping
      console.error('Error in getFinancialData:', error);
      return 'An error occurred while fetching financial data.';
    }
  }

// Define a route to handle API requests

app.post('/api/investment-guide', async (req, res) => {
    try {
      // Get the user query from the request body
      const { query } = req.body;
      const stockSymbol = query; // Replace with the desired stock symbol
      const financialData = await getFinancialData(stockSymbol);
      console.log(financialData + "haaan yahi hai");

    async function fetchChatCompletion(financialData) {
        const data = JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: financialData + "from above data give me Fundamental analysis which includes, covering key metrics such as Net Sales/Income, Profit After Tax, and Earnings Per Share over five recent quarters. Additionally, an overview of the company's expenditure, including details on raw material consumption, purchase of traded goods, employee costs, and other expenses, provides insights into the allocation of funds and operational efficiency, give numbers from provided informaion only oherwise say null, give the sentiments from above info from range positive , negative to neutral.Convert response in HTML format" }
            ],
        });

        const options = {
            hostname: 'api.openai.com',
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': `Bearer ${openaiApiKey}`,
            },
        };
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    const parsedData = JSON.parse(responseData);
                    console.log(responseData)
                    if (parsedData && parsedData.choices && parsedData.choices.length > 0) {
                        resolve(parsedData.choices[0].message);
                    } else {
                        console.log(openaiApiKey);
                        reject(new Error("Invalid response from OpenAI API"));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(data);
            req.end();
        });
    }

    const response = await fetchChatCompletion(query);
    const responseData = response.content;
    console.log(response)


    res.json({ response: responseData });
    } catch (error) {
      // Log the error for debugging, but consider not exposing detailed error messages to users
      console.error('Error:', error);
  
      // Respond with a generic error message
    //   res.status(500).json({ error: 'An error occurred while generating the investment guide.' });
      res.status(500).json({ error: error.message });

    }
  });
  

app.post('/process', function(req, res) {
    const {
        featureName,
        objective,
        uiRequirements,
        functionality,
        dataRequirements,
        dependencies,
        platform,
        constraints,
        outputResult,
        instructions,
        fileName,
        outputFileName
    } = req.body;

    if (
        featureName &&
        objective &&
        fileName &&
        outputFileName
    ) {
        console.log("Feature is building");

        // Add loader to submit button


        // Example usage of the global variable
        setTimeout(() => {
            console.log(`User input (global variable): ${featureName}`);
        }, 2000);

        const readFileAsync = util.promisify(fs.readFile);
        const writeFileAsync = util.promisify(fs.writeFile);
        const filePath = __dirname + '/' + fileName;
        const filePath2 = __dirname + '/' + outputFileName;

        // const configuration = new Configuration({
        //     apiKey: "",
        // });
        const openaiApiKey = process.env.OPENAI_API_KEY;

        const openai = new OpenAIApi(openaiApiKey);

        async function fetchChatCompletion(fileContent) {
            const data = JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "user", content: `Feature Name: ${featureName}\nObjective/Purpose: ${objective}\nUser Interface (UI) Requirements: ${uiRequirements}\nFunctionality: ${functionality}\nData Requirements: ${dataRequirements}\nDependencies: ${dependencies}\nPlatform/Technology: ${platform}\nConstraints/Limitations: ${constraints}\nExpected Output/Result: ${outputResult}\n +Instructions: ${instructions}`+ fileContent }
                ],
            });

            const options = {
                hostname: 'api.openai.com',
                path: '/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'Authorization': `Bearer ${configuration.apiKey}`,
                },
            };

            return new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    let responseData = '';

                    res.on('data', (chunk) => {
                        responseData += chunk;
                    });

                    res.on('end', () => {
                        const parsedData = JSON.parse(responseData);
                        if (parsedData && parsedData.choices && parsedData.choices.length > 0) {
                            resolve(parsedData.choices[0].message);
                        } else {
                            reject(new Error("Invalid response from OpenAI API"));
                        }
                    });
                });

                req.on('error', (error) => {
                    reject(error);
                });

                req.write(data);
                req.end();
            });
        }

        async function updateFileWithCode(fileContent) {
            try {
                const response = await fetchChatCompletion(fileContent);
                const codeResponse = response.content.replace(`Feature Name: ${featureName}\nObjective/Purpose: ${objective}\nUser Interface (UI) Requirements: ${uiRequirements}\nFunctionality: ${functionality}\nData Requirements: ${dataRequirements}\nDependencies: ${dependencies}\nPlatform/Technology: ${platform}\nConstraints/Limitations: ${constraints}\nExpected Output/Result: ${outputResult}\n +Instructions: ${instructions}`, '');
                // Extract the code instructions from the codeResponse
                const codeInstructions = codeResponse.split('\n').filter(line => line.startsWith('//'));

                // Check if the file exists
                const fileExists = fs.existsSync(filePath2);

                // Create a new file if it doesn't exist
                if (!fileExists) {
                    fs.writeFileSync(filePath2, '', 'utf8');
                }

                await writeFileAsync(filePath2, codeResponse, 'utf8');
                console.log('File updated successfully.');
                console.log(response);

                // // Remove loader and enable submit button
                // document.getElementById("submit-button").innerText = "Submit";
                // document.getElementById("submit-button").disabled = false;
            } catch (error) {
                console.error('Error:', error);

                // // Remove loader and enable submit button
                // document.getElementById("submit-button").innerText = "Submit";
                // document.getElementById("submit-button").disabled = false;
            }
        }

        readFileAsync(filePath, 'utf8')
            .then(fileContent => {
                return updateFileWithCode(fileContent);
            })
            .catch(error => {
                if (error.code === 'ENOENT') {
                    // Create a new file if it doesn't exist
                    fs.writeFileSync(filePath, '', 'utf8');
                    console.log('New file created:', filePath);
                    console.log('Please rerun the script to proceed.');
                    return updateFileWithCode(fileContent);
                } else {
                    console.error('Error:', error);

                    // Remove loader and enable submit button
                    // document.getElementById("submit-button").innerText = "Submit";
                    // document.getElementById("submit-button").disabled = false;
                }
            });

        res.send('Feature is building');
    } else {
        res.send('Required fields are missing.');
    }
});

app.get('/output', function(req, res) {
    res.sendFile(__dirname + '/output.html');
});
app.post('/invest', function(req, res) {
    res.sendFile(__dirname + '/invest.html');
})
app.get('/invest', function(req, res) {
    res.sendFile(__dirname + '/invest.html');
});
app.get('/record', function(req, res) {
    res.sendFile(__dirname + '/record.html');
});


app.get('/',function(req,res){
    res.sendFile(__dirname+'/invest.html')
});

app.listen(3000, function() {
    console.log('Server is running on port 3000');
});

module.express=app;