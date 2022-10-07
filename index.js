const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');

dotenv.config({ path: './config/config.env' });

// Routers
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const stripeRouter = require('./routes/stripe');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/checkout', stripeRouter);

// Connect to DB
connectDB();

PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('Backedn server running');
});
