var cookieParser = require("cookie-parser");
var bodyParser  = require("body-parser");
var express    =    require('express');
var session = require('express-session');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser()); 
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: true}));
app.use(express.static(__dirname + '/public'));
require('./controllers/teste')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var server     =    app.listen(3000,function(){
    console.log("Servidor ativado na porta 3000");
});
