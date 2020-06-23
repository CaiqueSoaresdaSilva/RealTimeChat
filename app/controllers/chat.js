const { validationResult } = require("express-validator/check");
const { emit } = require("../../config/server");

module.exports.iniciaChat = function(application, req, res){

    var dadosForm = req.body;

    req.assert('apelido', 'O Nome é obrigatório').notEmpty();
    req.assert('apelido', 'O Nome deve ter entre 3 a 15 caracteres').len(3, 15);
    console.log(application.get('participantes'));
    if(application.get('participantes')){
        if(application.get('participantes').indexOf(dadosForm.apelido) !== -1){
            req.assert('em_uso', 'este apelido esta em uso!').notEmpty();
        }
    }

    var erros = req.validationErrors();

    if(erros){
        res.render('index', {validacao : erros, apelido: dadosForm.apelido});
        return;
    };

    /*application.get('io').emit(
        'msgParaCliente',
        {apelido: dadosForm.apelido, mensagem: 'Chegou Coroi'}
    );*/

    res.render('chat', {dadosForm: dadosForm});

};