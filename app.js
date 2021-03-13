var express = require('express');
var path = require('path');
var fs = require('fs');
const { EILSEQ } = require('constants');
var app = express();
var session = require('express-session')
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('login', {title : "Welcome"});
});

app.post('/login', function(req, res){
  
  var user = req.body.username; 
  var pass = req.body.password;
  var registered = JSON.parse(fs.readFileSync("Accounts.json"));
  var found = false;
  for(var i = 0; i < registered.length; i ++)
  {
    if(registered[i].username == user)
    {
     if(registered[i].password == pass)
      {
        res.redirect('/home');
        req.session.user = registered[i];
        req.session.save();
        found = true;
      }
      else
      {
        res.render('login', {title : "Wrong username/password"});
        break;
      }
    }
  }
  if(!found)
    res.render('login', {title : "Wrong username/password"}); 

})

app.get('/registration', function(req, res) {
  res.render('registration', {title: "Please enter your username and password"});
});


app.post('/register', function(req, res){
  var user = req.body.username; 
  var pass = req.body.password;
  var newAccount = {username: user, password: pass, readlist: []};
  var accList = JSON.parse(fs.readFileSync("Accounts.json"));
  var already = false;
  for(var i = 0; i < accList.length; i++)
  {
    if(accList[i].username == user)
    {
      console.log("Username is taken!");
      already = true;
    }
  }
  if(!already)
  {
    accList.push(newAccount);
    req.session.user = newAccount;
    var newAccString = JSON.stringify(accList);
    fs.writeFileSync("Accounts.json", newAccString);
    res.render('home');
  }
});

app.get('/home', function(req, res) {
  
  res.render('home');
});

app.get('/novel', function(req, res) {
  res.render('novel');
});

app.get('/flies', function(req, res) {
  res.render('flies', {results:"Add to Read List"});
});

app.get('/sun', function(req, res) {
  res.render('sun', {results:"Add to Read List"});
});

app.get('/poetry', function(req, res) {
  res.render('poetry');
});

app.get('/leaves', function(req, res) {
  res.render('leaves', {results:"Add to Read List"});
});

app.get('/grapes', function(req, res) {
  res.render('grapes', {results:"Add to Read List"});
});

app.get('/fiction', function(req, res) {
  res.render('fiction');
});

app.get('/dune', function(req, res){
  res.render('dune', {results:"Add to Read List"});
});

app.get('/mockingbird', function(req, res){
  res.render('mockingbird', {results:"Add to Read List"});
});

app.get('/readlist', function(req, res) {
  var loggedinacc = req.session.user
  if(Object.keys(loggedinacc).length === 0){
  res.redirect('/');
  }
  else{
  var books = [];
  for(var i = 0; i<loggedinacc.readlist.length; i++){
    switch(loggedinacc.readlist[i]) {
      case "The Sun and Her Flowers": 
        books.push({name: "The Sun and Her Flowers", source: "sun.jpg", href: "/sun"})
        break;
        case "Dune": 
        books.push({name: "Dune", source: "dune.jpg", href: "/dune"})
        break;
        case "Leaves of Grass": 
        books.push({name: "Leaves of Grass", source: "leaves.jpg", href: "/leaves"})
        break;
        case "To Kill a Mockingbird": 
        books.push({name: "Mockingbird", source: "mockingbird.jpg", href: "/mockingbird"})
        break;
        case "The Grapes of Wrath": 
        books.push({name: "The Grapes of Wrath", source: "grapes.jpg", href: "/grapes"})
        break;
        case "Lord of the Flies": 
        books.push({name: "Lord of the Flies", source: "flies.jpg", href: "/flies"})
        break;
      default:
        books.push({name: "", source: ""})
    }
  }
  res.render('readlist', {names : books});
}});

app.get('/searchresults', function(req, res) {
  res.render('searchresults');
});

app.post('/search', function(req,res)
{
var searchResult = []
var searchTerm = req.body.Search.toLowerCase();
    if("the sun and her flowers".includes(searchTerm))
      searchResult.push({name: "The Sun and Her Flowers", source: "sun.jpg", href: "/sun"})
    
    if("dune".includes(searchTerm))
      searchResult.push({name: "Dune", source: "dune.jpg", href: "/dune"})
      
    if("leaves of grass".includes(searchTerm))
      searchResult.push({name: "Leaves of Grass", source: "leaves.jpg", href: "/leaves"})
      
    if("mockingbird".includes(searchTerm))
      searchResult.push({name: "Mockingbird", source: "mockingbird.jpg", href: "/mockingbird"})
     
    if("the grapes of wrath".includes(searchTerm)) 
      searchResult.push({name: "The Grapes of Wrath", source: "grapes.jpg", href: "/grapes"})
     
    if("lord of the flies".includes(searchTerm))
      searchResult.push({name: "Lord of the Flies", source: "flies.jpg", href: "/flies"})
    
    var results = "Search Results";
    if(searchResult.length == 0)
    {
      results = "No Results Found";
    }
    res.render('searchresults', {searchResults : searchResult, results: results} );
})


app.post('/addtolist', function(req,res)
{
  var loggedinacc = req.session.user
  if(loggedinacc.length === 0){
    console.log("Please login before trying to add to your readlist.")
  }
  else{
  var readlistBook = req.body.bookname;
  var link = ""
  switch(readlistBook) {
    case "The Sun and Her Flowers": 
      link = 'sun'
      break;
      case "Dune": 
      link = "dune"
      break;
      case "Leaves of Grass": 
      link = "leaves"     
      break;
      case "To Kill a Mockingbird": 
      link = "mockingbird"
      break;
      case "The Grapes of Wrath": 
      link = "grapes"
      break;
      case "Lord of the Flies": 
      link = "flies"
      break;
  }
  var flag = false;
  for(var i = 0; i < loggedinacc.readlist.length; i++)
  {
    if(loggedinacc.readlist[i] == readlistBook){
      res.render(link, {results:"Book is Already in The Read List"});
      flag = true;
    }
  }
  if(!flag){
    loggedinacc.readlist.push(readlistBook)
    req.session.user = loggedinacc
    req.session.save();
    var accList = JSON.parse(fs.readFileSync("Accounts.json"));
    for(var i = 0; i<accList.length; i++)
    {
      if(accList[i].username == loggedinacc.username){
        accList[i] = loggedinacc;
      }
    }
    var newAccString = JSON.stringify(accList);
    fs.writeFileSync("Accounts.json", newAccString);
  }
}
})
app.get('/')


app.listen(process.env.PORT || 3000);
