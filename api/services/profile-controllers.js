const usercollection = require('../../models/usermodel')
const productcollection = require('../../models/productmodel')
const ordercollection = require('../../models/order')
const bcrypt = require('bcrypt');


const pwdEncription = (password) => {
    const hashedPWD = bcrypt.hash(password, 10)
    return hashedPWD
}


const profile = async(req,res)=>{
    try {
        if(req.session.user){
        console.log('i am profile')
        const userDetails = await usercollection.findOne({ email: req.session.user });
        let cart = userDetails.cart.items;
        let cartCount = cart.length;
        const user = userDetails.name;
        console.log(user)
        const FoundUser = req.session.user;
        const userData = await usercollection.findOne({ email: FoundUser });
        res.render('user/account/profile', { user,userData, cartCount });
        }else{
            res.redirect('/')
        }
    } catch (error) {
        console.log(error)
    }
}

const order = async (req, res) => {
    try {
        console.log('i am the order list')
        // const user = req.session.user;
        const email = req.session.user;
        const userDetails = await usercollection.findOne({ email: email });
        const cart = userDetails.cart.items;
        const cartCount = cart.length;
        const userid = userDetails._id;
        const order = await ordercollection.find({ userId: userid, orderReturnRequest: false, orderCancleRequest: false, status: { $ne: 'Deliverd' } }).sort({ _id: -1 });
        const orderHist = await ordercollection.find({
            userId: userid,
            $or: [
                { orderCancleRequest: true },
                { status: 'Deliverd' }
            ], orderReturnRequest: false,
        }).sort({ _id: -1 });
        const orderProducts = orderHist.map(data => data.products);
        const orderProduct = orderProducts.flat();
        const orderHistStatus = orderHist.map(data => data.orderCancleRequest);
        const orderHista = orderHist.map(data => data.status);


        const product = order.map(data => data.products);
        const newProduct = product.flat();
        const status = order.map(data => data.status);
        const orderstatus = order.map(data => data.orderCancleRequest);
        const Date = order.map(data => data.expectedDelivery.toLocaleDateString());
        res.render('user/account/myOrder', {
            title: "OrderPage",
            user,
            newProduct,
            status,
            Date,
            order,
            orderstatus,
            cartCount,
            orderHist,
            orderProduct,
            orderHistStatus,
            orderHista,
        });
    } catch (error) {
        console.log(error)
    }
}

const profileAddress = async (req, res) => {
    try {
        // const user = req.session.user;
        const userEmail = req.session.user;
        const userData = await usercollection.findOne({ email: userEmail });
        let cart = userData.cart.items;
        let cartCount = cart.length;
        const userAddress = userData.address;
        res.render('user/account/address', { userAddress, cartCount })
    } catch (error) {
        console.log(error)
    }
}
const updateaddress = async (req, res) => {
    try {
        const email = req.session.user;
        const { name, houseName, street, city, state, phone, postalCode, AddressId } = req.body;
        const userData = await usercollection.findOne({ email: email });
        const exisitingAddress = userData.address.find((data) => data._id.toString() === req.body.AddressId);

        if (exisitingAddress) {
            exisitingAddress.name = name;
            exisitingAddress.houseName = houseName;
            exisitingAddress.street = street;
            exisitingAddress.city = city;
            exisitingAddress.state = state;
            exisitingAddress.phone = phone;
            exisitingAddress.postalCode = postalCode;
        } else {
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
        }
        await userData.save();
        res.redirect('/profile/address');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};
const editAddress = async (req, res) => {
    try {
        console.log('i am address editor')
        // const user = req.session.user;  
        const addressId = req.body.selectedAddress;
        const userDetails = await usercollection.findOne({ email: req.session.user });
        const cart = userDetails.cart.items;
        const cartCount = cart.length;
        const address = userDetails.address;
        const selectedAddress = address.find((data) => data._id.toString() === addressId);
        res.render('user/account/editaddress', {  selectedAddress, cartCount }) 
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    profile,
    order,
    profileAddress,
    editAddress,
    updateaddress,
}