// Your client-side JavaScript (client.js)
// This script runs in the browser environment

// Example of DOM manipulation
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', async () => {
    // Disable the button while processing
    submitButton.innerText = 'Building...';
    submitButton.disabled = true;

    // Gather user input and create data to send to the server
    const userInput = {
        // ... gather user input here ...
    };

    // Send the data to the server
    const response = await fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
    });

    // Handle the server response, update UI, etc.
    // ...

    // Enable the button again
    submitButton.innerText = 'Submit';
    submitButton.disabled = false;
});
