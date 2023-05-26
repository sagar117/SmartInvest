const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) =>{
  // Get username and password from form
  let username = req.body.username;
  let password = req.body.password;
  
  // Check if they are valid
  if (username === 'example' && password === 'password') {
    res.redirect('/calculate');
  } else {
    res.send(`<html><body><h1>Invalid username or password</h1></body></html>`);
  }
});

// app.post('/calculate', (req, res) => {
//   res.sendFile(__dirname + '/public/calculator.html');
// });

app.post('/calculate', (req, res) => {
  // Get the login token from session
  console.log("shi he!!!!!!")
  // const sessionToken = req.session.token;
  //
  // // Verify the token
  // if (!sessionToken || sessionToken !== 'abc123') {
  //   return res.redirect('/');
  //   console.log("Gadbad he")
  // }

  // Get the form data
  const firstNumber = parseInt(req.body.firstNumber);
  const secondNumber = parseInt(req.body.secondNumber);
  const operation = req.body.operation;

  let result;

  // Calculate the result based on the operation
  switch (operation) {
    case '+':
      result = firstNumber + secondNumber;
      break;
    case '-':
      result = firstNumber - secondNumber;
      break;
    case '*':
      result = firstNumber * secondNumber;
      break;
    case '/':
      result = firstNumber / secondNumber;
      break;
    default:
      result = 'Invalid operation';
      break;
  }

  // Return the result to the user
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="stylesheet" href="/css/materialize.min.css">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            background-color: #2196F3;
            color: white;
          }
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50px;
          }
          h1 {
            font-size: 36px;
            margin-bottom: 30px;
            text-align: center;
          }
          .result {
            font-size: 42px;
            text-align: center;
          }
          .input-field {
            margin-top: 20px;
          }
          .btn {
            background-color: #0D47A1;
          }
          .btn:hover {
            background-color: #1565C0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Calculator</h1>
          <div class="row">
            <form class="col s12" action="/calculate" method="post">
              <div class="input-field col s12 m6">
                <input id="firstNumber" type="number" name="firstNumber" class="validate" required>
                <label for="firstNumber">First Number</label>
              </div>
              <div class="input-field col s12 m6">
                <input id="secondNumber" type="number" name="secondNumber" class="validate" required>
                <label for="secondNumber">Second Number</label>
              </div>
              <div class="input-field col s12 m6">
                <select name="operation" required>
                  <option value="" disabled selected>Choose operation</option>
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="*">*</option>
                  <option value="/">/</option>
                </select>
                <label>Operation</label>
              </div>
              <div class="input-field col s12">
                <h2 class="result">Result: ${result}</h2>
              </div>
              <div class="input-field col s12">
                <button class="btn waves-effect waves-light" type="submit" name="action">Calculate</button>
              </div>
            </form>
          </div>
        </div>

        <script src="/js/materialize.min.js"></script>
      </body>
    </html>
  `)
})

// Start server
app.listen(3000, () => console.log('Server started at http://localhost:3000/'))