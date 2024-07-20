// ./src/app.js

import express from "express"
import connectDataBase from './config/dbConnect.js'
import cors from "cors"; 
import routes from './routes/index.js'
import path from "path";

const conex = await connectDataBase();

conex.on("error", (error) => {
    console.log("Erro de conexão: " + error)
})

conex.once("open", () => {
    console.log("Conexão com BD estabelecida");
})

const app = express()

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
routes(app)

export default app