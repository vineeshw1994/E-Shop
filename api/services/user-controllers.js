const categoryCollection = require('../../models/categorymodel');
const productCollection = require('../../models/productmodel');
const usercollection = require('../../models/usermodel');
const otpcollection = require('../../models/otpmodel')
const couponcollection = require('../../models/coupon')
const ordercollection = require('../../models/order')
const session = require('express-session')
const bcrypt = require('bcrypt');
// const otpGenerator = require('otp-generator');
const sweet_alert = require('sweetalert2');

const fast2sms = require('fast-two-sms');
const { log } = require('util');

// const API = 'FONkjetDrTbMoQXPy2fm5YS84BRawh3s9cUAC0zl6pHqJdZv1KxzTR8oCsfw50VaWnYDGJA71FOPcKdp'
const API = process.env.FAST_TWO_SMS_API

// const accountSid = 'ACa0ac5445876f34a8fe8a836ec0c444ce';
// const authToken = 'ca8bbedf375a5ea328790b1fbcaa136a';
 //const phoneNumber = '+13186977527'
// const client = require('twilio')(accountSid, authToken);
// const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
// console.log(otp);

//PASSWORD ENCRIPTION

const pwdEncription = (password) => {
    const hasheNdPWD = bcrypt.hash(password, 10)
    return hasheNdPWD
}

const sample = (req, res) => {
    const user = false
    res.render('user/cart', { user })

}

const home = async (req, res) => {
    try {
        console.log('hello man i am the home page ');  
        const data = await productCollection.find()
        const mobiles = await productCollection.find({ category: 'Mobiles' }, {})
        if(req.session.user){
            const useremail = req.session.user
            const userdetials = await usercollection.findOne({email:useremail})
            const name = userdetials.name
            const cart = userdetials.cart.items
            const cartCount = cart.length
            user = true;
            res.render('user/home', { data,user,cartCount, mobiles,name})
        } else{
            user = false;
            res.render('user/home',{user,data,mobiles});
        }

        //const mobiles = await productCollection.find({ category: 'Smart Watch' }, {})
        // const headphones = await productCollection.find({category:'Head Phones'},{})
        // const smartwatche = await productCollection.find({category:'Smart Watch'},{})
        // const bluetooth = await productCollection.find({category:'Bluetooth Speaker'},{})


    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal error");
    }
}




const login = (req, res) => {
    try {
       if(req.session.user){
        res.redirect('/')
       }else{
        res.render('user/login')
       }
    } catch (error) {
        console.log('error.message');
    }

}
const login_post = async (req, res) => {
    try {
        const entrie = 1
        const userdata = await usercollection.findOne({ email: req.body.email });
        if (userdata === null) {
            res.render('user/login', { errmsg: 'user credentials invalid' });
        } else {
            isvalid = userdata.isblocked;
            if (isvalid === true) {
                res.render('user/login', { blockmsg: 'Please Contact Your Admin You are not Allow to Use this Account AnyMore'});
            } else {

                const vpsw = await bcrypt.compare(req.body.password, userdata.password);
                if (userdata.email === req.body.email && vpsw === true) {
                    const usernumber =userdata.mobile;
                    const number = usernumber;
                    let cartCount;
                    let entrie = 0;

                    req.session.user = req.body.email;
                    res.redirect('/')
                    // req.session.data = {
                    //     username: userdata.name,
                    //     useremail: userdata.email,
                    // }

                      // otp generator
                    //  let randome = Math.floor(Math.random() * 9000) + 1000;
                    //  //sms sending to the user 
                    //  fast2sms.sendMessage({
                    //     authorization: API,
                    //     message: `Your verification OTP is: ${randome}`,
                    //     numbers: [number],
                    //  })
                    //  .then(saveUser());

                    //  //save randome Number to database then render verify page
                    // function saveUser() {
                    //     const newUser = new otpcollection({
                    //         number: randome
                    //     })
                    //     newUser.save()
                    //         .then(() => {
                    //             res.render('user/validation', { user: req.session.user, cartCount, entrie });
                    //         })
                    //         .catch((error) => {
                    //             console.log("error generating numb", error);
                    //         });
                    // }

                    

                } else {
                    const cart = userdata.cart.items;
                    const cartCount = cart.length;
                    res.render('user/login', { errmsg: 'Check your password'})
                }
            }
        }
    } catch (error) {
        console.log(error.message);

    }
}

// const login_OTPValidation = async (req, res) => {
//     let cartCount;
//     try {
//         const num1 = req.body.num_1;
//         const num2 = req.body.num_2;
//         const num3 = req.body.num_3;
//         const num4 = req.body.num_4;
//         const code = parseInt(num1 + num2 + num3 + num4);
//         const { userName, userEmail } = req.session.data;
//         await otpcollection.find({ number: code })
//             .then((fount) => { 
//                 if (fount.length > 0) {
//                     req.session.user = userName;
//                     req.session.email = userEmail;
//                     const succ = "Successfully Logged In"
//                     let cartCount;
//                     res.render("user/successtic", { user: req.session.user, cartCount, succ });
//                     // IF FOUND, DELETE THE OTP CODE FROM DB
//                     otpcollection.findOneAndDelete({ number: code })
//                         .then(() => {
//                             console.log("successfully deleted")
//                         })
//                         .catch((err) => {
//                             console.log("error while deleting", err);
//                         });
//                 } else {
//                     res.render('user/validation', { fal: "Please Check Your OTP", user: req.session.user, cartCount })
//                 }
//             })
//             .catch((err) => {
//                 res.render('user/validation', { fal: "Please Check Your OTP", user: req.session.user, cartCount })
//             })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send("Otp error")
//     }
// }


const signup = (req, res) => {
    try {
        res.render('user/signup', { success: '', exist: '' })
    } catch (error) {
        console.log(error.message);
    }
}
const signup_post = async (req, res) => {
    try {
        const entrie = 1;
        const enpwd = await pwdEncription(req.body.password);
        req.body.password = enpwd;
        req.body.isblocked = false
        let cartCount;
        const { name, email, mobile, password, isblocked } = req.body
        const userdata = {
            name: name,
            email: email,
            mobile: mobile,
            password: password,
            isblocked: isblocked,
        }

        const checkname = await usercollection.findOne({ $or: [{ email: req.body.email }, { mobile: req.body.mobile }] })

        if (!checkname) {
            //  const randome = Math.floor(Math.random() * 9000) + 1000;
            //  fast2sms.sendMessage({
            //      authorization: API,
            //      message: `Your verification OTP is: ${randome}`,
            //      numbers: [mobile],
            //  })
            //      .then(saveUser());             //save randome Number to database then render verify page
            //  function saveUser() {
            //      const newUser = new otpcollection({
            //          number: randome
            //      })
            //      newUser.save()
            //          .then(() => {
            //              res.render('user/validation', { user: req.session.user, cartCount, entrie });
            //          })
            //          .catch((error) => {
            //              console.log("error generating numb", error);
            //          });
            //  }

            await usercollection.insertMany([userdata])
            req.session.user = req.body.email
            res.redirect('/')


        } else {
               const user = true
            res.render('user/signup', { exist: 'email or mobile already exist', user })
        }

    } catch (error) {
        console.log(error.message);
        let cartCount;
        // res.render('user/signUp', { succ: "Please Use a Uniqe Email ID and Phone Number", user: req.session.user, cartCount })
    }
}
const signup_Otpvalidation = async (req, res) => {
    let cartCount;
    try {
        const num1 = req.body.num_1;
        const num2 = req.body.num_2;
        const num3 = req.body.num_3;
        const num4 = req.body.num_4;
        const code = parseInt(num1 + num2 + num3 + num4);
        await otpcollection.find({ number: code })
            .then((fount) => {
                if (fount.length > 0) {
                    let cartCount;
                    const succ = "Successfully Created Your Account"
                    usercollection.create(req.session.userdata);
                    res.render("user/successtic", { user: req.session.user, cartCount,succ })
                    // IF FOUND, DELETE THE OTP CODE FROM DB
                    otpcollection.findOneAndDelete({ number: code })
                        .then(() => {
                            console.log("successfully deleted")
                        })
                        .catch((err) => {
                            console.log("error while deleting", err);
                        });
                } else {
                    res.render('user/validation', { fail: "Please Check Your OTP", user: req.session.user, cartCount })
                }
            })
            .catch((err) => {
                console.log(err)
                res.render('user/validation', { fail: "Please Check Your OTP", user: req.session.user, cartCount })
            })
    } catch (error) {
        console.log(error)
        res.status(500).send("SignIn Otp error")
    }
}

// single product view
const productView = async (req, res) => { 
    console.log(' hi i am product view page');
    try {
        const userData = await usercollection.findOne({ email: req.session.user });
        const id = req.params.id;
        // console.log(id);
        const data = await productCollection.findOne({ _id: id });
        // const cate = data.category[0];
        // const category = await ProductModel.find({ category: cate }).sort({ _id: -1 }).limit(4);
        let cart, cartCount;
        const price = data.originalprice - ((data.originalprice * data.productOffer) / 100)
        if (userData) {
            cart = userData.cart.items;
            cartCount = cart.length;
            res.render('user/product-view', {  user: req.session.user,price, data, cartCount })
        } else {
            res.render('user/product-view', {  user: req.session.user,price, data, cartCount }) 
        }
       
        res.render('user/product-view', { data,user: req.session.user})
    } catch (error) {
        console.log("detaild page error" + error)
    }
}




const signout = (req, res) => {
    try {
        req.session.destroy((err)=>{
            if(err){
             res.send('Error')
            }else{
             res.redirect('/')
            }
         })
    
 } catch (err) {
        console.log(err);
    }
}

//cart section

const loadcart = async(req,res)=>{
        try {
         if(req.session.user){
            const userEmail = req.session.user;
            const userDetails = await usercollection.findOne({ email: userEmail })
            const similarproducts = await productCollection.find({availability:true}).sort({name:-1}).limit(4)
            const cartItems = userDetails.cart.items
            const cartCount = cartItems.length
            const cartProductIds = cartItems.map(item => item.productId);
            const cartProducts = await productCollection.find({ _id: { $in: cartProductIds } });
            const productsPrice = cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
            const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
            let totalPrice = 0;
            for (const item of cartItems) {
              const product = cartProducts.find(prod => prod._id.toString() === item.productId.toString());
              if (product) {
                totalPrice += item.quantity * product.price;
              } else {
                console.log(`Product not found for item: ${item.productId}`);
              }
            }
            const user = true
            const discount = Math.abs(totalPrice - productsPrice);
            res.render('user/cart', {  message: "Login Page",user, cartCount, cartItems, cartProducts, productsPrice, totalQuantity, totalPrice, discount,similarproducts })
         }else{
            res.redirect('/login')
         }
        } catch (error) {
          console.log(error)
          res.status(500).send("Internal error from cart side");
        }
      
      }



//Add to cart

const Addcart =async(req,res)=>{
    try {
        console.log('hello man this is add to cart')
        const id = req.params.id
        const userEmail = req.session.user
        const userdata = await usercollection.findOne({email:userEmail})
        const cartitems = userdata.cart.items
        const existingCartItem = await productCollection.findOne({productId: id})
        const product = await productCollection.findOne({_id:id})
        const productprice = product.price

        if(existingCartItem){
            existingCartItem.quantity += 1;
            existingCartItem.price = existingCartItem.quantity * productprice
        } else{
            const newcartitem ={
                productId :id,
                quantity:1,
                price:product.originalprice,
                realPrice:product.price
            }
            userdata.cart.items.push(newcartitem)
        }

        await userdata.save()
        res.json('successfully cart u r product')

       

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal error from cart side");
    }
}

const cartQuantityUpdate = async (req, res) => { 
    try { 
        const cartId = req.params.itemId;
        const data = Number(req.body.quantity);
        const userEmail = req.session.user;
        const userDetails = await usercollection.findOne({ email: userEmail });

        const cartItems = userDetails.cart.items;
        //const CartProductIds = cartItems.map((items) => items.productId);

        const cartItem = userDetails.cart.items.id(cartId);
        const cartQuantityPre = cartItem.quantity;
        const CartQuantity = cartItem.quantity = data;
        const product = await productCollection.findById(cartItem.productId);
        const ProQuantity = +product.quantity;

        const count = CartQuantity - cartQuantityPre;
        product.quantity -= count;
        const cartPrice = cartItem.price = product.finalPrice * CartQuantity;
        cartItem.realPrice = product.price * CartQuantity;
        await product.save();
        await userDetails.save();

        let grantTotal = cartItems.reduce((total, item) => total + item.realPrice, 0);
        const total = cartItems.reduce((total, item) => total + item.price, 0);

        const discount = grantTotal - total;

        res.json({ cartPrice, grantTotal, total, discount, ProQuantity });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while updating the quantity.' });
    }
};

const cartDelete = async (req, res) => {
    console.log('i am cart deleter');
    try {
        const id = req.params.id;
        const userEmail = req.session.user;
        console.log(userEmail);
        await usercollection.updateOne({ email: userEmail }, { $pull: { 'cart.items': { _id: id } } });
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
        res.status(500).send("internal error at cartDelete")
    }
}



//whish list 
const WhishListLoad = async (req, res) => {
    try {
        if(req.session.user){
        const userEmail = req.session.user;
        const userDetails = await usercollection.findOne({ email: userEmail });
        const productData = userDetails.wishlist;
        const cart = userDetails.cart.items;
        const cartCount = cart.length;
        const productId = productData.map(items => items.productId);
        const productDetails = await productCollection.find({ _id: { $in: productId } });
        const price = productDetails.originalprice-(productDetails.originalprice * productDetails.productOffer) / 100

        res.render('user/wishList', { user,price, productDetails, cartCount })
        }else{
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error)
    }
}

const addingWhishList = async (req, res) => {
    console.log('hey i am the add wishlist');
    try {
        const productId = req.params.id;
        const userEmail = req.session.user;
        const userDetails = await usercollection.findOne({ email: userEmail });
        const productExist = userDetails.wishlist.map(items => items.productId.toString() === productId);


        if (productExist.includes(true)) {
            return res.json("Already Existe");
        } else {
            const WhishList = {
                productId: productId
            }
            userDetails.wishlist.push(WhishList);
            await userDetails.save();
            return res.json('server got this....');
        }
    } catch (error) {
        console.log(error);
    }
}

const WhishProductDelete = async (req, res) => {
    console.log('hello i am the wishlist delete');
    try {
        const productId = req.params.id;
        const userEmail = req.session.user;
        await usercollection.findOneAndUpdate(
            { email: userEmail },
            { $pull: { wishlist: { productId: productId } } }
        );
        res.redirect("/wishlist");
    } catch (error) {
        console.log("whish deleting Error" + error)
    }
}

const addingWhishListtoCart = async (req, res) => {
    try {
        const id = req.body.productId;
        const userEmail = req.session.email;
        const userData = await usercollection.findOne({ email: userEmail });
        const cartItems = userData.cart.items;
        const existingCartItem = cartItems.find(item => item.productId.toString() === id);
        const cartPrtoduct = await productCollection.findOne({ _id: id });
        const productPrice = cartPrtoduct.price;

        if (existingCartItem) {
            existingCartItem.quantity += 1;
            existingCartItem.price = existingCartItem.quantity * productPrice;
        } else {
            const newCartItem = {
                productId: id,
                quantity: 1,
                price: cartPrtoduct.finalPrice,
                realPrice: cartPrtoduct.price
            };
            userData.cart.items.push(newCartItem);
        }

        await userData.save();
        res.json("successfully cart u r product")
    } catch (error) {
        console.log('Error adding to cart:', error);
    }
};

// /////////////////////////////////////////////////////////////////////////////////

// checkout 
const Checkout = async (req, res) => {
    try {
        console.log(' hey i am the checkout form');
        // const user = req.session.user;

        const userFinder = req.session.user;
        console.log(userFinder);
        const userDetails = await usercollection.findOne({ email: userFinder });
        // console.log(userDetails);
        const currentUserID = userDetails._id;
        const cartItems = userDetails.cart.items;
        const cartCount = cartItems.length;
        const coupons = await couponcollection.find();
        const coupon = coupons.filter(coupon => !coupon.userId.includes(currentUserID));
        const cartProductIds = cartItems.map(item => item.productId.toString());
        const cartProducts = await productCollection.find({ _id: { $in: cartProductIds } });
        const totalP_Price = cartItems.reduce((total, items) => total + parseFloat(items.realPrice), 0);
        const address = userDetails.address;
        let totalPrice = 0;
        cartItems.map(item => totalPrice += item.price);

        const discount = Math.abs(totalP_Price - totalPrice) 
        res.render('user/account/billing', {
            title: "Check Out",
            user,
            cartItems,
            cartProducts,
            discount,
            totalP_Price,
            totalPrice,
            address,
            cartCount,
            coupon
        })
    } catch (error) {
        console.log(error);
    }
}

const addressAdding = async (req, res) => {
    console.log('hey i am address adding function '); 
    try {

        const email = req.session.user;
        const { name, houseName, street, city, state, phone, postalCode } = req.body;

        const userData = await usercollection.findOne({ email: email });

        if (!userData) {
            return console.log("User not found")
        } 

        const newAddress = {
            name: name,
            houseName: houseName,
            street: street,
            city: city,
            state: state,
            phone: phone,
            postalCode: postalCode
        };

        userData.address.push(newAddress);
        await userData.save();
        res.redirect('/CheckOutPage');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

////////////////////// order placing

const orderSuccess = async (req, res) => {
    try {
        const currentDate = new Date();
        const data = req.body
        const email = req.session.user;
        const foundUser = await usercollection.findOne({ email: email });
        // console.log(foundUser);
        const cartItems = foundUser.cart.items;
        console.log(cartItems);
        const cartProductIds = cartItems.map(item => item.productId.toString());
        const cartProducts = await productCollection.find({ _id: { $in: cartProductIds } });

        const userId = foundUser._id;
        const addressId = data.selectedAddress;
        const method = data.method;
        const amount = data.amount;
        console.log(('hey man this your ordered amount'));
        console.log(amount)
        // Data collecting for db Storing
        const productData = cartProducts.map(product => ({
            name: product.name,
            realPrice: product.price,
            price: amount,
            description: product.discription,
            image: product.image,
            category: product.category,
            quantity: product.quantity
        }));
        const deliveryDate = new Date();
        deliveryDate.setDate(currentDate.getDate() + 5);
        newOrder = new ordercollection({
            userId: userId,
            address: addressId,
            products: productData,
            payment: {
                method: method,
                amount: amount
            },
            status: "Processing",
            proCartDetail: cartProducts,
            cartProduct: cartItems,
            createdAt: currentDate,
            expectedDelivery: deliveryDate
        });
        if (method === "InternetBanking") {
            const instance = new Razorpay({
                key_id: key_id,
                key_secret: key_secret
            });
            let order = await instance.orders.create({
                amount: amount * 100,
                currency: "INR",
                receipt: 'new id u want to impliment',
            })
            res.json(order);
        } else if (method === "COD") {
            await newOrder.save();
            for (let values of cartItems) {
                for (let products of cartProducts) {
                    if (new String(values.productId).trim() == new String(products._id).trim()) {
                        products.quantity = products.quantity - values.quantity;
                        await products.save()
                    }
                }
            }
            foundUser.cart.items = [];
            await foundUser.save();
            res.json("successFully cod Completed")
        } else {
            res.status(400).send("individual payment")
        }

    } catch (error) {
        console.log('data not comming');
        res.status(500).send('An error occurred While saving data in DB');
    }
}

module.exports = {
    sample,
    home,
    productView,
    login,
    signup,
    signup_post,
    login_post,
    signout,
    // login_OTPValidation,
    // signup_Otpvalidation,
    WhishListLoad,
    addingWhishList,
    WhishProductDelete,
    addingWhishListtoCart,
    Addcart,
    loadcart,
    cartQuantityUpdate,
    cartDelete,
    Checkout,
    addressAdding,
    orderSuccess,

}