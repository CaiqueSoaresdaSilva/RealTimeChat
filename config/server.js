/* IMPORTAR O MODULO DO FRAMEWORK EXPRESS */
var express = require('express');

/* IMPORTAR O MODULO DO CONSIGN */
var consign = require('consign');

/* IMPORTAR O MODULO DO BODY-PARSER */
var bodyParser = require('body-parser');

/* IMPORTAR O MODULO DO EXPRESS-VALIDATOR */
var expressValidator = require('express-validator');

var app = express();

/* SETAR AS VARIAVEIS QUE A 'VIEW ENGINE' E 'VIEWS' DO EXPRESS */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* CONFIGURAR MIDDLEWARE EXPRESS.STATIC */
app.use(express.static('./app/public'));

/* CONFIGURAR O MIDDLEWARE BODY-PARSER */
app.use(bodyParser.urlencoded({
    extended: true
}));

/* CONFIGURAR O MIDDLEWARE EXPRESS-VALIDATOR */
app.use(expressValidator());

/* EFETUA O AUTOLOAD DAS ROTAS, MODELS E CONTROLLERS PARA O OBJETO APP */
consign()
    .include('app/routes')
    .then('app/models')
    .then('app/controllers')
    .into(app);

/* EXPORTAR OBJETO APP */
module.exports = app;