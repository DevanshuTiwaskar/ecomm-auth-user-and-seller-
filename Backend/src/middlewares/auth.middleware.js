const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authSeller = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({
      _id: decoded.id,
    });

    console.log(user);

    if (user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.seller = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};





const authUser = async (req,res,next) => {
 const token = req.cookies.token;

  if(!token) return res.status(401).json({message: "unauthorized"})

    try {
      const decoded = jwt.verify(token,process.env.JWT_SECRET)
      const user = await userModel.findById(decoded.id);
      if(!user) return res.status(401).json({message:" unauthorized"})
        req.user = user;
      next()
    } catch (error) {
       return res.status(401).json({message:"unauthorized error from authuser middleware  "})
    }

}

module.exports = { authSeller,authUser };
