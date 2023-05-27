const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Recursive function to ask questions and receive input
function askQuestion(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// Function to collect multiple inputs
async function collectInputs() {
    const name = await askQuestion('What is your name? ');
    const age = await askQuestion('How old are you? ');
    const city = await askQuestion('Which city do you live in? ');

    // Process the collected inputs
    console.log(`Name: ${name}`);
    console.log(`Age: ${age}`);
    console.log(`City: ${city}`);

    rl.close();
}

// Call the function to start collecting inputs
collectInputs();
