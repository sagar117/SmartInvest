const { Configuration, OpenAIApi } = require("openai");
const https = require("https");
const fs = require('fs');
const util = require('util');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let feature; // Declare a global variable
let file_name;
let file_name2;

function askQuestion(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function collectInputs() {
    const feature = await askQuestion('Describe your feature');
    const file_name = await askQuestion('File Name');
    const file_name2 = await askQuestion('File Name2');
    // const city = await askQuestion('Which city do you live in? ');

    // Process the collected inputs
    console.log(`Feature: ${feature}`);
    console.log(`Input file: ${file_name}`);
    console.log(`Output file: ${file_name2}`);
    // console.log(`City: ${city}`);

    rl.close();





    if (feature && file_name && file_name2) {
        console.log("Feature is building")


// Example usage of the global variable outside the readline interface
        setTimeout(() => {
            console.log(`User input (global variable): ${feature}`);
        }, 2000);

        const readFileAsync = util.promisify(fs.readFile);
        const writeFileAsync = util.promisify(fs.writeFile);
        const filePath = '/Users/sagar/WebstormProjects/GPTdev/'+file_name;
        const filePath2 = '/Users/sagar/WebstormProjects/GPTdev/'+file_name2;

        const configuration = new Configuration({
            apiKey: "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",
        });
        const openai = new OpenAIApi(configuration);

        async function fetchChatCompletion(fileContent) {
            const data = JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: feature + "update and rewrite code! \n" + fileContent}],
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

        readFileAsync(filePath, 'utf8')
            .then(fileContent => {
                return fetchChatCompletion(fileContent);
            })
            .then(response => {
                console.log(response);

            })
            .catch(error => {
                console.error('Error:', error);
            });

        async function updateFileWithCode(fileContent) {
            try {
                const response = await fetchChatCompletion(fileContent);
                const codeResponse = response.content.replace(feature + "update and rewrite code! \n", ''); // Extract coding part of the response

                await writeFileAsync(filePath2, codeResponse, 'utf8');
                console.log('File updated successfully.');
                console.log(response)
            } catch (error) {
                console.error('Error:', error);
            }
        }

        readFileAsync(filePath, 'utf8')
            .then(fileContent => {
                return updateFileWithCode(fileContent);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

collectInputs();
