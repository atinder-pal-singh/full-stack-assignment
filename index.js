const bodyParser = require('body-parser')
const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3001

const secretKey = 'full-stack-developmentt';

function generateToken(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function generateJWT(token) {
  return jwt.sign({ token }, secretKey, {expiresIn: '1h'});
}

function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256']});
    if (Date.now() >= decoded.exp * 1000) {
      throw new Error('Token expired');
    }
    return decoded.token;
  } catch(err) {
    return null;
  }
}

function authenticateToken(req,res,next) {
  const token = req.headers.authorization;
  const verifiedToken = verifyJWT(token);

  if (verifiedToken) {
    next();
  } else {
    res.sendStatus(401);
  }
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.get('/signup1', function(req, res) {
  res.send("Hello worldss");
})

app.post('/signup', (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const {email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
   const existingUsers = USERS.find(user => user.email === email);
   if(existingUsers){
    return res.status(400).send('User already exists.');
   }

   USERS.push({email, password});


  // return back 200 status code to the client
  res.sendStatus(200);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userExist = USERS.find(user => user.email === email);
  if (userExist) {
    const passwordCheck = USERS.find(user => user.email === email && user.password === password);
    if (passwordCheck) {
      let token = generateToken();
      return res.status(200).send(generateJWT(token));
    }
   }


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.status(401).send('Email or password does not match');
})

app.get('/questions', authenticateToken, function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})