const { Configuration, OpenAIApi } = require("openai");
const https = require("https");
const fs = require('fs');
const util = require('util');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let featureName;
let objective;
let uiRequirements;
let functionality;
let dataRequirements;
let dependencies;
let platform;
let constraints;
let outputResult;
let instructions
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
    featureName = await askQuestion('Feature Name: ');
    objective = await askQuestion('Objective/Purpose: ');
    uiRequirements = await askQuestion('User Interface (UI) Requirements: ');
    functionality = await askQuestion('Functionality: ');
    dataRequirements = await askQuestion('Data Requirements: ');
    dependencies = await askQuestion('Dependencies: ');
    platform = await askQuestion('Platform/Technology: ');
    constraints = await askQuestion('Constraints/Limitations: ');
    outputResult = await askQuestion('Expected Output/Result: ');
    instructions = await askQuestion("instructions: ");
    file_name = await askQuestion('Input File Name: ');
    file_name2 = await askQuestion('Output File Name: ');

    console.log(`Feature Name: ${featureName}`);
    console.log(`Objective/Purpose: ${objective}`);
    console.log(`User Interface (UI) Requirements: ${uiRequirements}`);
    console.log(`Functionality: ${functionality}`);
    console.log(`Data Requirements: ${dataRequirements}`);
    console.log(`Dependencies: ${dependencies}`);
    console.log(`Platform/Technology: ${platform}`);
    console.log(`Constraints/Limitations: ${constraints}`);
    console.log(`Expected Output/Result: ${outputResult}`);
    console.log(`Instructions: ${instructions}`)
    console.log(`Input File: ${file_name}`);
    console.log(`Output File: ${file_name2}`);

    rl.close();

    if (
        featureName &&
        objective &&
        file_name &&
        file_name2
    ) {
        console.log("Feature is building");

        // Example usage of the global variable outside the readline interface
        setTimeout(() => {
            console.log(`User input (global variable): ${featureName}`);
        }, 2000);

        const readFileAsync = util.promisify(fs.readFile);
        const writeFileAsync = util.promisify(fs.writeFile);
        const filePath = '/Users/sagar/WebstormProjects/GPTdev/' + file_name;
        const filePath2 = '/Users/sagar/WebstormProjects/GPTdev/' + file_name2;

        const configuration = new Configuration({
            apiKey: "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",
        });
        const openai = new OpenAIApi(configuration);

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
            } catch (error) {
                console.error('Error:', error);
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
                }
            });
    }
}

collectInputs();
