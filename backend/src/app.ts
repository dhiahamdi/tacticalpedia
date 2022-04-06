import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { port } from './config/config';
import './config/db'; // initialize database
import routesV1 from './routes/v1';
var cors = require('cors');
var cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));


// Routes
app.use('/v1', routesV1);

app
  .listen(port, () => {
    console.log(`server running on port : ${port}`);
  })
  .on('error', (e) => console.error(e));


export default app;