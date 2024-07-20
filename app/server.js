// server.js

import "dotenv/config";
import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';

const PORT = 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('Novo cliente conectado', socket.id);

    socket.on('message', (data) => {
        console.log('Mensagem recebida: ', data);
        io.emit('message', data);
    });

    // Lida com a desconexão do cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);
    });
});

function geraValor() {
    return (Math.random() * 100).toFixed(2);
}

setInterval(() => {
    io.emit("cotação", geraValor());
}, 1000);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
