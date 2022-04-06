import mongoose from 'mongoose';
import { db } from './config';

let dbURI;

// Build the connection string
if (process.env.NODE_ENV == 'production') {
  dbURI = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME;
} else {
  dbURI = 'mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME;
}


const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: true,
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  };


// Create the database connection
mongoose
  .connect(dbURI, options)
  .then(() => {
    console.info('Mongoose connection done');
  })
  .catch((e) => {
    console.info('Mongoose connection error');
    console.error(e);
  });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  console.info('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


export function getConnection(){

  return mongoose.connection;

}