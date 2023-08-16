var express = require('express');
var admin_router = express.Router();
const session = require("express-session");
const nocache = require("nocache");
const multer =require('multer')

const admincontroller = require('../api/services/admin-controllers.js')

const adminauth = require('../middleware/adminauth');


//multer 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'productImages'); // Destination folder for uploaded images
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Unique filename for each uploaded image
    }
  });
  
  const upload = multer({storage: storage});



//dashboard

admin_router.get('/dashboard',admincontroller.dashboard)

//admin login
admin_router.get('/login',adminauth.isAdmin, admincontroller.login)
admin_router.post('/login',admincontroller.login_post)
admin_router.get('/signout',admincontroller.adminLogout)

//product routes
admin_router.get('/view-product', admincontroller.products)
admin_router.get('/add-product', admincontroller.add_product)
admin_router.post('/add-product',upload.array('image'),admincontroller.add_product_post)
admin_router.get('/edit-product',upload.array('image'),admincontroller.edit_product)
admin_router.post('/edit-product',admincontroller.editproduct_post)
admin_router.post('/product-search',admincontroller.search_product)
admin_router.get('/delete-product',admincontroller.delete_product)

//users routes
admin_router.get('/users', admincontroller.users)
admin_router.post('/user-search',admincontroller.user_search)
admin_router.post('/user-blocking', admincontroller.userblocking)
admin_router.post('/user-unblocking', admincontroller.userUnBlocking)
 
//category routes     
admin_router.get('/category', admincontroller.category)
admin_router.get('/create-category', admincontroller.create_category)
admin_router.post('/create-category', admincontroller.create_category_post)
admin_router.get('/edit-category', admincontroller.edit_categories)
admin_router.post('/category-edit',admincontroller.categoryEditpost)
admin_router.get('/delete-category',admincontroller.delete_category)
admin_router.post('/unlistCategory/:id',admincontroller.unlistCategory)
admin_router.post('/listCategory/:id',admincontroller.listCategory)



//order
admin_router.get('/order',admincontroller.orderList)






module.exports = admin_router
