
require('dotenv').config()
const express = require('express');
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const productRoutes = require("./routes/product.routes")
<<<<<<< HEAD
const paymentRouter = require('./routes/payment.routes')
const cors = require('cors')
=======
const cors = require("cors")


>>>>>>> 6cf8996621dda0cb515dfc9e84400505210ae5aa

const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/payment",paymentRouter)

module.exports = app