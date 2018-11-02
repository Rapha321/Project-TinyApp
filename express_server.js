var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())


var PORT = 8080; // default port 8080
// app.listen(8080)

//This tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs")

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.
app.get('/', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  // console.log('Signed Cookies: ', req.signedCookies)
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


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.post("/register", (req, res) => {
  const user_id = generateRandomID();
  users[user_id] = {id: user_id, email: req.body.email, password: req.body.password}

  if (req.body.email === "" || req.body.password === "") {
    console.log(`400 - Please insert email and password`);
  }

  for (let key in users) {
    if (users[key].email === req.body.email) {
      console.log(`400 – Email already exist`);
    }
  }

  res.cookie('user_id', user_id)
  res.redirect('/urls');
});


app.get("/urls", (req, res) => {

  let templateVars = {
    username: users[req.cookies['user_id']],  // abc123
    urls: urlDatabase
  };
  // console.log("templateVars: ", templateVars)
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
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
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


app.post('/urls/:id/update', function (req , res ) {
  urlDatabase[req.params.id] = req.body.newUrl;
  res.redirect('/urls');
});


app.post("/login", (req, res) => {
  res.cookie('user_id', users['user_id'])
  res.redirect('/urls');
});


app.post("/logout", (req, res) => {
  for (let key in users) {
    if (users[key].email !== req.body.email) {
      console.log(`403`);
    }
    if (users[key].email === req.body.email && users[key].password !== req.body.password) {
      console.log(`403`);
    }
    else {
       res.clearCookie('user_id', users[user_id]);
    }
  }
  res.redirect('/');
});


app.get("/register", (req, res) => {
  res.redirect('/urls');
});
















