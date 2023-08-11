const express = require("express")
const user_route = express();
const path = require('path');
const session = require("express-session");
const nocache = require("nocache");



const userController = require("../api/services/user-controllers");
const profilecontrollers = require('../api/services/profile-controllers')


const userAuth = require('../middleware/userauth');

user_route.get('/sample',userController.sample)
user_route.get('/',userController.home)
//signup route
user_route.get('/signup',userController.signup)
user_route.post('/signup',userController.signup_post)
// user_route.post('/otp-signupValidation',userController.signup_Otpvalidation)


//login route
user_route.get('/login',userController.login)
user_route.post('/login',userController.login_post)
//  user_route.post('/otp-loginValidation',userController.login_OTPValidation)
// user_route.post('/login-validation',userController.login_OTPValidation)

//logout
user_route.get('/logout',userController.signout)


//shop
user_route.get('/shop',userController.shop)

//product view 
user_route.get('/product-view/:id',userController.productView)

// Add to cart 
user_route.get('/cart',userController.loadcart)
user_route.post('/cart/:id',userController.Addcart)
user_route.post('/cart/quantityUpdate/:itemId', userController.cartQuantityUpdate); 
user_route.post('/cartDelete/:id', userController.cartDelete);


//wishlist
user_route.get('/wishlist',userController.WhishListLoad)
user_route.post('/wishlist/:id',userController.addingWhishList)
user_route.get('/wishlist/:id',userController.WhishProductDelete)
user_route.post('/wishlist/:id',userController.addingWhishListtoCart)


// checkout
user_route.get('/CheckOutPage',userController.Checkout)
user_route.post('/AddressUpdate',userController.addressAdding)
user_route.post('/CheckOut',userController.orderSuccess)

user_route.get('/profile',profilecontrollers.profile)
user_route.get('/profile/order',profilecontrollers.order)
user_route.get('/profile/address',profilecontrollers.profileAddress)
user_route.post('/profile/address/editAddress',profilecontrollers.editAddress)
user_route.post('/profile/address/updateAddress',profilecontrollers.updateaddress)


module.exports = user_route


