import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { port } from './config/config';
import './config/db'; // initialize database
import routesV1 from './routes/v1';

var cookieParser = require('cookie-parser');

const fs = require('fs')
const https = require('https');
var cors = require('cors');

var corsOptions = {
    origin: 'https://flow.tacticalpedia.com',
    credentials: true };

const app = express();

app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));

var privateKey = fs.readFileSync('/opt/bitnami/apache/conf/flow.tacticalpedia.com.key');
var certificate = fs.readFileSync('/opt/bitnami/apache/conf/flow.tacticalpedia.com.crt');

var credentials = {key: privateKey, cert: certificate};

// Routes
app.use('/v1', routesV1);

var server = https.createServer(credentials, app);

server
  .listen(port, () => {
    console.log(`server running on port : ${port}`);
  })
  .on('error', (e) => console.error(e));


export default app;