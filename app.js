import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cors from 'cors'
import bodyparser from 'body-parser'
import morgan from 'morgan'

dotenv.config()
const PORT = process.env.PORT
const app=express()
connectDB()

app.use(morgan('dev'))
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

import USER_ROUTES from './routes/user.routes.js'
import AUTH_ROUTES from './routes/auth.routes.js'
import UTIL_ROUTES from './routes/utils.routes.js'

app.use('/v1/auth', AUTH_ROUTES)
app.use('/v1/user', USER_ROUTES)
app.use('/v1/util', UTIL_ROUTES)

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => res.status(error.status || 500).json({ error: { message: error.message } }));


app.listen(PORT,console.log(`Server started in PORT ${PORT}`))