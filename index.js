const express = require('express');
const mongoose = require('mongoose');
const postRouter = require('./routes/postRoutes');
const authRouter = require('./routes/authRoutes');
const session = require('express-session')
const redis = require('redis')
const  cors = require('cors')
// require('dotenv').config();
const {
    MONGO_PASSWORD,
    MONGO_USER,
    MONGO_IP,
    MONGO_PORT,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET
} = require('./config/config');


let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = async () => {
    await mongoose
        .connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        .then(() => console.log('Connected to mongo...!!!'))
        .catch((err) => {
            console.log(err.message);
            setTimeout(connectWithRetry, 5000);
        });
};
app.use(cors())
app.enable('trust proxy')
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,

        httpOnly: true,
        maxAge: 30000
    },
    resave: false,
    saveUninitialized : false,
}))
app.use(express.json());

connectWithRetry()
    .then(() => console.log('Connection ok'))
    .catch(e => console.log(`'Connection error: ${e.message} `));

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', authRouter);


const port = process.env.PORT;

app.get('/api/v1', (req, res) => {
    res.send('<h2>Hi there !!!! test 7</h2>');
    let num = 0
    console.log(`Yeah it ran ${num+1}`)
});


app.listen(port, () => console.log(`Listening on port... ${port}`));
