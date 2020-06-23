/* IMPORTAR AS CONFIGURAÇÕES DO SERVIDOR */
var app = require('./config/server');

/* PARAMETRIZAR A PORTA DE ESCUTA */
var server = app.listen(80, function(){
    console.log("SERVIDOR TA ON");
}); 

var io = require('socket.io').listen(server);

/* CRIANDO UMA VARIAVEL GLOBAL */
app.set('io', io);

var participantes = [];

/* CRIAR A CONEXÃO POR WEBSOCKET */
io.on('connection', function(socket){
    console.log("Usuario Conectado");

    var  socketReq = socket.request;
    var apelido  = socketReq._query['apelido']; 

    if(participantes.indexOf(apelido) === -1){
        participantes.push(apelido);
    }
    console.log('Participantes: '+ participantes);
    console.log('O usuario '+ apelido + ' conectou');
    socket.broadcast.emit('msgParaCliente', {apelido: apelido, mensagem: 'Acabou de entrar no chat'});
    app.set('participantes', participantes);
    socket.emit('participantesParaCliente', { apelidos: participantes });
    socket.broadcast.emit('participantesParaCliente', { apelidos: participantes });

    socket.on('disconnect', function(){
        participantes.splice( participantes.indexOf(apelido), 1);
        console.log('Participantes: ' + participantes);
        console.log('O usuario ' + apelido + ' desconectou');
        socket.broadcast.emit('msgParaCliente', {apelido: apelido, mensagem: ' acabou de sair do chat'});
        app.set('participantes', participantes);
        socket.emit('participantesParaCliente', { apelidos: participantes });
        socket.broadcast.emit('participantesparaCliente', { apelidos: participantes });

    });

    /* DIALOGO */
    socket.on('msgParaServidor', function(data){
        socket.emit(
            'msgParaCliente', 
            {apelido: data.apelido, mensagem: data.mensagem}
        );

        /* MOSTRA AS MENSAGENS ENVIADAS PARA OUTROS USUARIOS DO CHAT */
        socket.broadcast.emit(
            'msgParaCliente', 
            {apelido: data.apelido, mensagem: data.mensagem}
        );

        /* PARTICIPANTES */
        if(parseInt(data.apelido_atualizado_clientes) == 0) {
            socket.emit(
                'participantesParaCliente', 
                {apelido: data.apelido}
            );

            socket.broadcast.emit(
                'participantesParaCliente', 
                {apelido: data.apelido}
            );   
        }
    });
});