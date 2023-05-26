const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

axios
    .post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello world" }],
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${configuration.apiKey}`,
            },
        }
    )
    .then((response) => {
        const responseData = response.data;
        console.log(responseData.choices[0].message);
    })
    .catch((error) => {
        console.error("Error:", error);
    });