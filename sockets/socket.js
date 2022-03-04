const { io } = require('../index');
const Band = require('../models/band');


const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del silencio'));
bands.addBand(new Band('L-gante'));

// Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());


    client.on('disconnect', () => {
        console.log('Cliente desconectado')

    });


    client.on('mensaje', (payload) => {
        console.log('Mensaje !!!!', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });


    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        //sucedio un cambio en la informacion y hay que refrescarlo
        //se usa el io para que se mande a todos los clientes conectados
        io.emit('active-bands', bands.getBands());

    })

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        //sucedio un cambio en la informacion y hay que refrescarlo
        //se usa el io para que se mande a todos los clientes conectados
        io.emit('active-bands', bands.getBands());

    })
    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        //sucedio un cambio en la informacion y hay que refrescarlo
        //se usa el io para que se mande a todos los clientes conectados
        io.emit('active-bands', bands.getBands());

    })



    /* client.on('emitir-mensaje', (payload) => {
        // io.emit('nuevo-mensaje', payload)  emite a todos!!
        client.broadcast.emit('nuevo-mensaje', payload); // emite a todos menos el que lo emitio

    }) */
});