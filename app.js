const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const session  = require('express-session');
const flash = require('connect-flash');


//COFIGURAÇÕES
//SESSION
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())//FLASH
//MIDDLEWERE
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash("success_msg") //variavel global acessada em qualquer pagina
    res.locals.error_msg = req.flash("error_msg")
    next();
})



//BODY-PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//HANDLEBARS
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//MONGOOSE
mongoose.connect('mongodb+srv://ramon_teste:32251049@ramon.lxiex.mongodb.net/ramon_teste_mongo?retryWrites=true&w=majority', {
     useNewUrlParser: true, 
     useUnifiedTopology: true })
     .then(() => console.log("Conectado ao mongo"))
    .catch((err) => console.log("Erro ao se conectar", err))

//DIRETÓRIO PUBLIC
app.use(express.static(path.join(__dirname, 'public')));




//ROTAS
app.use('/admin', admin);

//OUTROS
const PORT = 8081;
app.listen(PORT, () => console.log(`Server runing in port ${PORT}`));