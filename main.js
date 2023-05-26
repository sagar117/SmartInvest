const { Configuration, OpenAIApi } = require("openai");
const request = require('sync-request');

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);

// const response = request('POST', 'https://api.openai.com/v1/images/generations', {
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${configuration.apiKey}`,
//     },
//     json: {
//         prompt: "A cute baby sea otter",
//         n: 2,
//         size: "1024x1024",
//     },
// });
//
// const responseData = JSON.parse(response.getBody('utf-8'));
// console.log(responseData); // Process or handle the response data


const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: "Hello world"}],
});
console.log(completion.data.choices[0].message);
