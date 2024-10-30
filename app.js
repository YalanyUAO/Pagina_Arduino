const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const portName = 'COM9'; // Cambia esto según el puerto de tu Arduino
const port = new SerialPort({ path: portName, baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

app.use(express.static('public'));

parser.on('data', (data) => {
    const [time, distance] = data.split(', ').map(Number);
    if (!isNaN(time) && !isNaN(distance)) { // Aseguramos que sean números válidos
        io.emit('sensorData', { time, distance });
    }
});

port.on('error', (err) => {
    console.error('Error: ', err.message);
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
