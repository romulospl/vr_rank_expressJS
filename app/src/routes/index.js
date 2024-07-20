// ./src/routes/index.js

import express from "express"
import path from 'path';
import { fileURLToPath } from 'url';
import rank from './rankRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = (app) => {
    app.route("/rank").get((request, response) => {
        response.sendFile(path.join(__dirname, '../views', 'rank.html'));
    });

    app.route("/").get((request, response) => {
        response.sendFile(path.join(__dirname, '../views', 'index.html'));
    });

    app.post('/score', (req, res) => {
        const io = req.app.get('io');
        const { score } = req.body;

        io.emit('finalscore', score);

        res.status(200).send({ status: 'success' });
    });

    app.post('/logByOculos', (request, response) => {
        
        const io = request.app.get('io');
        io.emit('log-oculos', request.body);
        response.status(200).send({ status: 'success' });
    })

    app.use(express.json(), rank)
}

export default routes