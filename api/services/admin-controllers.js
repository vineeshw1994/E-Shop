// const express = require('express');
const admincollection = require('../../models/adminmodel');
const userCollection = require('../../models/usermodel');
const categorycollection = require('../../models/categorymodel');
const productCollection = require('../../models/productmodel');
const ordercollection = require('../../models/order')
const session = require("express-session");
const multer = require('multer');
const path = require('path')
const util = require('util');
// const app = express(); 

// app.use(bodyParser.urlencoded({ extended: true }));

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'productimages')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname.replace(/\.[^/.]+$/, '') + '_' + Date.now() + path.extname(file.originalname))
//     }
// })

// const maxsize = 5 * 1000 * 1000
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: maxsize
//     },
//     fileFilter: function (req, file, cb) {
//         let filetypes = /jpeg|jpg|png|webp/
//         let mimetype = filetypes.test(file.mimetype)


//         let extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())
//         if (mimetype && extname) {
//             return cb(null, true)
//         }

//         cb("Error: File upload only supports the folling filetypes" + filetypes)
//     }
// }).single('mypic')
 

//dashboard
const dashboard = (req,res)=>{
    try{
        if(req.session.admin){
            const admin = false
            res.render('admin/dashboard',{admin})
        }else{
            const admin = true
            res.render('admin/adminlogin',{admin,errmsg: 'please Login'})
        }
    }catch(error){
        console.log(error.message);
    }
}


const login = (req, res) => {
    try {
        if (req.session.admin) {
            let admin = false
            res.render('admin/dashboard', { admin })
        } else {
            let admin = true
            res.render('admin/adminlogin', { admin })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const login_post = async (req, res) => {
    const email = 'admin@gmail.com'
    const password = 12345
    const admindata = req.body
    //console.log(admindata); 
    if (email == admindata.email && password == admindata.password) {
        let admin = false
        req.session.admin = admindata.email
        const data = await categorycollection.find()
        res.render('admin/dashboard', { data, admin})
    } else {
        let admin = true
        res.render('admin/adminlogin', { msg: 'Invalid login credentials', admin })
    }

}

const adminLogout = async (req, res) => {
    try {
        req.session.admin = null;
        res.render('admin/adminlogin', { title: "Admin Login", admin: req.session.admin })
    } catch (error) {
        console.log(error)
    }
}


//users block
const users = async (req, res) => {
    try {
        if (req.session.admin) {
            let admin = false
            const userdata = await userCollection.find()
            res.render('admin/users', { user: false, userdata, admin })
        } else {
            let admin = true
            res.render('admin/adminlogin', { admin, errmsg: 'please Login' })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const user_search = async (req, res) => {
    const search = req.body.search
    const userdata = await userCollection.find({ name: { $regex: '^' + search,$options: 'i'} })
    //console.log(userdata);
    if (userdata === '') {
        let admin = false
        res.render('admin/users', { userdata, admin, nodata: 'Searching name is not available' })
    } else {
        let admin = false
        res.render('admin/users', { userdata, admin })
    }
}
const search_product = async(req,res)=>{
    try{
        const search = req.body.search
    const product = await productCollection.find({name:{$regex: '^' + search,$options: 'i'}})

    if(product === ' '){
        let admin = false
        res.render('admin/viewproducts',{admin,product})
    }else{
        const admin = true
        res.render('admin/viewproducts',{admin,product,res:'product is not avilable'})
    }
    }catch(err){
        console.log(err.message);
    }
    
}

const userblocking = async (req, res) => {
    try {
        const userId = req.query.id
        //console.log('hello');
        //console.log(userId);
        await userCollection.updateOne({ _id: userId}, {
            $set: {
                isblocked: true
            }
 
        })
        res.redirect('/admin/users')
    }
    catch (err) {
        console.log(err)
    }

}

const userUnBlocking = async (req, res) => {
    try {
        const userId = req.query.id
        await userCollection.updateOne({ _id: userId }, {
            $set: {
                isblocked: false
            }
        })
        res.redirect('/admin/users')
    }
    catch (err) {
        console.log(err)
    }

}


//category block
const category = async (req, res) => {
    try {
        if (req.session.admin) {
            let admin = false
            const data = await categorycollection.find()
            res.render('admin/category', { data, admin })
        } else {
            let admin = true
            res.render('admin/adminlogin', { admin, errmsg: 'please Login' })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const create_category = (req, res) => {
    try {
        if(req.session.admin){
            const admin = false
            res.render('admin/category-create',{admin})
        }else{
            const admin = true
            res.redirect('/admin/login')
        }
    } catch (error) {
        console.log(error)
    }

}
const create_category_post = async (req, res) => {
    try {

        const category = await categorycollection.findOne({categoryName:req.body.categoryName})
        console.log(category);
        if(category.categoryName === req.body.categoryName){
            const admin = false
            res.render('admin/category-create',{errmsg:'Category is already exist',admin})
        }else{
            const admin = false
            const data = {
                categoryName: req.body.categoryName.trim(),
                categoryDescription: req.body.description.trim(),
                isavilable: req.body.isAvailable
            }
            await categorycollection.insertMany([data])
            res.render('admin/category-create', { msg: 'category added sucessfully',admin })
        }
       

    } catch (err) {
        console.log(err.message);
    }
}
const edit_categories = async (req, res) => {
    try {
        const id = req.query.id
        const list = await categorycollection.findOne({ _id: id })
        //console.log(list);
        res.render('admin/category-edit', { list })
    } catch (err) {
        console.log(err.message);
    }
}
const categoryEditpost = async (req, res) => {
    try {

        await categorycollection.findByIdAndUpdate({ _id: req.body.id }, {
            $set: {
                categoryName: req.body.categoryName,
                categoryDescription: req.body.description,
                isavailable: req.body.isavailable,
            }
        })
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error)
    }
}
const delete_category = async (req, res) => {
    const id = req.query.id
    //console.log(id);
    await categorycollection.deleteOne({ _id: id })
    res.redirect('/admin/category')
}


//product block
const products = async (req, res) => {
    try {
        if (req.session.admin) {
            let admin = false
            const product = await productCollection.find()
            res.render('admin/viewproducts', { product, admin })
        } else {
            let admin = true
            res.render('admin/adminlogin', { admin, errmsg: 'please Login' })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const add_product = async(req, res) => {
    try {
        const cateData = await categorycollection.find({},{categoryName:1
        })
        //console.log(cateData);
        res.render('admin/add-products', {cateData, msg: '' })
    } catch (error) {
        console.log(error.message);
    }
}

const add_product_post = async (req, res, next) => {
    try {
         const files = req.files
        //console.log(req.body); 
        const product = {
            name: req.body.name,
            price: req.body.price,
            originalprice:req.body.originalprice,
            productOffer:req.body.offers,
            quantity:req.body.quantity,
            discription: req.body.discription.trim(),
            category:req.body.category.trim(),
            image:files.map(file => file.filename)
        }

        await productCollection.insertMany([product])
        res.redirect('/admin/view-product')
        //console.log('image upload successfully ');

    } catch (error) {
        console.log(error.message);
    }
}


const edit_product = async (req,res,next)=>{
   try{
    const id = req.query.id
    const productData = await productCollection.findOne({_id:id})
    res.render('admin/edit-product',{productData})
   }catch(error){
    console.log(error.message);
   }
} 

const editproduct_post = async(req,res)=>{
    try{
        const id = req.query.id
        await productCollection.updateOne({_id:id},{
            $set:{
                name:req.body.name,
                price:req.body.price,
                category:req.body.category,
                discription:req.body.discription
            }
        })
        res.redirect('/admin/view-product')
    }catch(error){
        console.log(error.message);
    }
}

const delete_product = async (req, res) => {
    try{
    const id = req.query.id
    //console.log(id);
    await productCollection.deleteOne({ _id:id })
    res.redirect('/admin/view-product')
    }catch(err){
        console.log(err.message);
    } 
}

const orderList = async (req, res) => {
    try {
       if(req.session.admin){
        // const admin = req.session.admin;
        const admin = false
        const orderList = await ordercollection.find();
        const user = orderList.map(item => item.userId);
        const userData = await userCollection.find({ _id: { $in: user } });
        const ordersWithData = orderList.map(order => {
            const user = userData.find(user => user._id.toString() === order.userId.toString());
            return {
                ...order.toObject(),
                user: user
            };
        });
        const ordersWithDataSorted = ordersWithData.sort((a, b) => b.createdAt - a.createdAt);
        res.render('admin/orders', { admin, orderList: ordersWithDataSorted })
       }else{
        res.redirect('/admin/login')
       }
    } catch (error) {
        console.log(error)
    }
}






module.exports = {
    dashboard,
    login,
    products,
    users,
    category,
    add_product,
    add_product_post,
    create_category,
    create_category_post,
    userblocking,
    userUnBlocking,
    edit_categories,
    categoryEditpost,
    user_search,
    delete_category,
    login_post,
    adminLogout,
    delete_product,
    edit_product,
    search_product,
    editproduct_post,
    orderList,
}