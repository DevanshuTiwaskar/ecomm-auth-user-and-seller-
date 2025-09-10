
require('dotenv').config()
const express = require('express');
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const productRoutes = require("./routes/product.routes")
const paymentRouter = require('./routes/payment.routes')
const cors = require('cors')




const app = express();




app.use(express.json());
app.use(cookieParser())


app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});

// app.use(cors({
//   origin: [
//   "http://localhost:5173",
//   "https://ecomm-auth-user-and-seller.vercel.app"
// ],
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://ecomm-auth-user-and-seller.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));



app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/payment",paymentRouter)

module.exports = app