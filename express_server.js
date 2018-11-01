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


function generateRandomString() {
  let randomString = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i <= 5; i++) {
    randomString += possible[(Math.floor(Math.random() * possible.length))];
  }
  return randomString;
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/urls", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  console.log("templateVars: ", templateVars)
  res.render("urls_index", templateVars);
});


// the path /urls/new actually matches the /urls/:id pattern (with the :id placeholder matching the string "new" instead of an actual id. Another way to say it is that in case of overlap, routes should be ordered from most specific to least specific.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/", (req, res) => {
  res.render("_header");
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
  res.cookie('username', req.body.username)
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie('username', req.body.username);
  res.redirect('/urls');
});









