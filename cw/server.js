import express from 'express'
import http from 'http'
import {router} from './routes.js'
const app = express()

app.use('/public', express.static('public'));
app.use("/",router);
app.set("views",`./views`);
app.set("view engine", "ejs");

const server = http.createServer(app)


server.listen(8000)