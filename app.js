const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const router = require('./src/routers');
const errorHandlerMiddleware = require('./src/middlewares/errorHandler');
const corsOptions = require("./src/config/corsOptions");

app.use(helmet());
app.use(cors(corsOptions)); 
app.use(compression());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Bu IP adresinden çok fazla istek yapıldı, lütfen daha sonra tekrar deneyin.'
});
app.use('/api', apiLimiter);

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use("/api", router);

app.use(errorHandlerMiddleware);

module.exports = app;