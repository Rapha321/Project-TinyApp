var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');



app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.use(cookieSession({
  name: 'session',
  keys: ['mysecretkey'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(function (req, res, next) {
  req.session.user_id = 'session';
  req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge
  next()
})



var PORT = 8080; // default port 8080

//This tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs")

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.
app.get('/', function (req, res) {
  console.log('Cookies: ', req.cookies)
})


// Generate short URL
function generateRandomString() {
  let randomString = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i <= 5; i++) {
    randomString += possible[(Math.floor(Math.random() * possible.length))];
  }
  return randomString;
}


// Generate random user ID
function generateRandomID() {
  let randomID = "";
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    randomID += possible[(Math.floor(Math.random() * possible.length))];
  }
  return `user${randomID}ID`;
}


// Database of URLs
var urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", user_id: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", user_id: "user2RandomID"}
};


// Database of users
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "123"
  }
}

// Check if user is registered
function validUser (user_id) {
  return users[user_id];
}


app.get("/urls", (req, res) => {
  let templateVars = {
    user_id: [req.cookies['user_id']],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});


// the path /urls/new actually matches the /urls/:id pattern (with the :id placeholder matching the string "new" instead of an actual id. Another way to say it is that in case of overlap, routes should be ordered from most specific to least specific.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/register", (req, res) => {
  res.render("register");
});


app.get("/", (req, res) => {
  res.render("_header");
});

app.get("/login", (req, res) => {
  res.render("urls_login");
});


app.get("/urls/:id", (req, res) => {
  let templateVars = {shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get('/_headers', function (req, res) {
  res.send('GET request to the homepage')
})


app.post("/urls", (req, res) => {
  console.log(req.body.longURL);  // debug statement to see POST parameters
  let shortString = generateRandomString();
  urlDatabase[shortString] = req.body.longURL;
  res.redirect(`/urls/${shortString}`); // Respond with 'Ok' (we will replace this)
});


app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});


// when Delete button is clicked
app.post('/urls/:id/delete', function (req, res) {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});


// when Edit button is clicked
app.post('/urls/:id/update', function (req , res ) {
  // const updateLongURL = Object.values(urlDatabase).find()
  for (let long of urlDatabase) {
    long[longURL] = req.body.newUrl;
  }
  return long[longURL];
  res.redirect('/urls');
});


// validating registration + setting cookie
app.post("/register", (req, res) => {
  const user_id = generateRandomID();
  users[user_id] = {id: user_id, email: req.body.email, password: req.body.password}

  if (req.body.email === "" || req.body.password === "") {
    console.log(`400 - Email and password should not be blank`);
  }

  for (let key in users) {
    if (users[key].email === req.body.email) {
      console.log(`400 – Email already exist`);
    }
  }

  res.cookie('user_id', user_id)
  res.redirect('/urls');
});

//validating login
app.post("/login", (req, res) => {
  const password = bcrypt.hashSync(req.body.password, 10);
  // const usersData = Object.values(users).find(user =>

  for (let usersKey in users) {
    if (users[usersKey].email === req.body.email && users[usersKey].password === password) {
      res.cookie('user_id', users['user_id']);
    } else {
      console.log(`403`);
    }
  }
  res.redirect('/urls');
});


app.get("/logout", (req, res) => {
  res.clearCookie('user_id', users['user_id']);
  res.redirect('/urls');
});
























