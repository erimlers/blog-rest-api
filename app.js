const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = require('./src/routers');
const errorHandlerMiddleware = require('./src/middlewares/errorHandler');
const corsOptions = require("./src/config/corsOptions");

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors(corsOptions)); 
app.use(compression());

app.use(cookieParser());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use("/api", router);

app.use(errorHandlerMiddleware);

module.exports = app;