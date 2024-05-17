import express from 'express';
import App  from './services/expressApp';
import dbConnection  from './services/dataBase';
import { PORT } from './config';

const startServer = async()=>{
    const app = express()
    await dbConnection()
    await App(app);
    app.listen(PORT,()=>{
        console.log(`Listenting to port ${PORT}`)
    })
}

startServer()