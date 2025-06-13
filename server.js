const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mysqlPool = require('./config/db');
const colors = require('colors');

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());


app.use('/numbers', require('./routes/numberRoutes'));

const PORT = process.env.PORT || 9876;

mysqlPool.query('SELECT 1').then(() => {
    console.log('mysql connected to db'.bgMagenta.white);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`.bgCyan.white);
    });
}).catch((err) => {
    console.log("db Connection Error:", err);
});
