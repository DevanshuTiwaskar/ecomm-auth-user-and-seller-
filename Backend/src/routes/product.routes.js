const express = require('express');
const multer = require('multer');
const productController = require("../controllers/product.controller")
const authMiddleware = require("../middlewares/auth.middleware")


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


/* POST /api/products/ */
router.post('/',
    authMiddleware.authSeller,
    upload.array("images", 5),
    productController.createProduct
)



router.get("/seller",
    authMiddleware.authSeller,
    productController.getSellerProducts
    
)

<<<<<<< HEAD
router.get('/',
    productController.getAllProduct
)


router.get('/:id',
    productController.getProductDetails)



=======
router.get("/",
    productController.getAllProducts
)

>>>>>>> 6cf8996621dda0cb515dfc9e84400505210ae5aa
module.exports = router;