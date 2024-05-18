"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayment = exports.VerifyOffer = exports.DeleteCart = exports.GetCart = exports.AddToCart = exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("../dto");
const models_1 = require("../models");
const Offer_1 = require("../models/Offer");
const Order_1 = require("../models/Order");
const Transaction_1 = require("../models/Transaction");
const utility_1 = require("../utility");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInput, req.body);
    const validationError = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }
    const { email, phone, password } = customerInputs;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.GenerateOtp)();
    console.log(otp);
    const existingCustomer = yield models_1.Customer.find({ email: email });
    if (existingCustomer !== null) {
        return res.status(400).json({ message: 'Email already exist!' });
    }
    const result = yield models_1.Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
        orders: []
    });
    if (result) {
        // send OTP to customer
        // await onRequestOTP(otp, phone);
        //Generate the Signature
        const signature = yield (0, utility_1.GenerateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified
        });
        // Send the result
        return res.status(201).json({ signature, verified: result.verified, email: result.email });
    }
    return res.status(400).json({ msg: 'Error while creating user' });
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginInput, req.body);
    const validationError = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }
    const { email, password } = customerInputs;
    const customer = yield models_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            });
            return res.status(200).json({
                signature,
                email: customer.email,
                verified: customer.verified
            });
        }
    }
    return res.json({ msg: 'Error With Signup' });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = yield profile.save();
                const signature = (0, utility_1.GenerateSignature)({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                });
                return res.status(200).json({
                    signature,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                });
            }
        }
    }
    return res.status(400).json({ msg: 'Unable to verify Customer' });
});
exports.CustomerVerify = CustomerVerify;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.GenerateOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            const sendCode = yield (0, utility_1.onRequestOTP)(otp, profile.phone);
            if (!sendCode) {
                return res.status(400).json({ message: 'Failed to verify your phone number' });
            }
            return res.status(200).json({ message: 'OTP sent to your registered Mobile Number!' });
        }
    }
    return res.status(400).json({ msg: 'Error with Requesting OTP' });
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(201).json(profile);
        }
    }
    return res.status(400).json({ msg: 'Error while Fetching Profile' });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerProfileInput, req.body);
    const validationError = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }
    const { firstName, lastName, address } = customerInputs;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            return res.status(201).json(result);
        }
    }
    return res.status(400).json({ msg: 'Error while Updating Profile' });
});
exports.EditCustomerProfile = EditCustomerProfile;
/* ------------------- Delivery Notification --------------------- */
const assignOrderForDelivery = (orderId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    // find the vendor
    const vendor = yield models_1.Vendor.findById(vendorId);
    if (vendor) {
        const areaCode = vendor.pincode;
        const vendorLat = vendor.lat;
        const vendorLng = vendor.lng;
        //find the available Delivery person
        const deliveryPerson = yield models_1.DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true });
        if (deliveryPerson) {
            // Check the nearest delivery person and assign the order
            const currentOrder = yield Order_1.Order.findById(orderId);
            if (currentOrder) {
                //update Delivery ID
                currentOrder.deliveryId = deliveryPerson[0]._id;
                yield currentOrder.save();
                //Notify to vendor for received new order firebase push notification
            }
        }
    }
});
/* ------------------- Order Section --------------------- */
const validateTransaction = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTransaction = yield Transaction_1.Transaction.findById(txnId);
    if (currentTransaction) {
        if (currentTransaction.status.toLowerCase() !== 'failed') {
            return { status: true, currentTransaction };
        }
    }
    return { status: false, currentTransaction };
});
const CreateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const { txnId, amount, items } = req.body;
    if (customer) {
        const { status, currentTransaction } = yield validateTransaction(txnId);
        if (!status) {
            return res.status(404).json({ message: 'Error while Creating Order!' });
        }
        const profile = yield models_1.Customer.findById(customer._id);
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
        const cart = req.body;
        let cartItems = Array();
        let netAmount = 0.0;
        let vendorId;
        const foods = yield models_1.Food.find().where('_id').in(cart.map(item => item._id)).exec();
        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    vendorId = food.vendorId;
                    netAmount += (food.price * unit);
                    cartItems.push({ food, unit });
                }
            });
        });
        if (cartItems) {
            const currentOrder = yield Order_1.Order.create({
                orderId: orderId,
                vendorId: vendorId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount: amount,
                orderDate: new Date(),
                orderStatus: 'Waiting',
                remarks: '',
                deliveryId: '',
                readyTime: 45
            });
            profile.cart = [];
            profile.orders.push(currentOrder);
            currentTransaction.vendorId = vendorId;
            currentTransaction.orderId = orderId;
            currentTransaction.status = 'CONFIRMED';
            yield currentTransaction.save();
            yield assignOrderForDelivery(currentOrder._id, vendorId);
            const profileResponse = yield profile.save();
            return res.status(200).json(profileResponse);
        }
    }
    return res.status(400).json({ msg: 'Error while Creating Order' });
});
exports.CreateOrder = CreateOrder;
const GetOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate("orders");
        if (profile) {
            return res.status(200).json(profile.orders);
        }
    }
    return res.status(400).json({ msg: 'Orders not found' });
});
exports.GetOrders = GetOrders;
const GetOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield models_1.Customer.findById(orderId).populate("items.food");
        if (order) {
            return res.status(200).json(order);
        }
    }
    return res.status(400).json({ msg: 'Order not found' });
});
exports.GetOrderById = GetOrderById;
/* ------------------- Cart Section --------------------- */
const AddToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        let cartItems = Array();
        const { _id, unit } = req.body;
        const food = yield models_1.Food.findById(_id);
        if (food) {
            if (profile != null) {
                cartItems = profile.cart;
                if (cartItems.length > 0) {
                    // check and update
                    let existFoodItems = cartItems.filter((item) => item.food._id.toString() === _id);
                    if (existFoodItems.length > 0) {
                        const index = cartItems.indexOf(existFoodItems[0]);
                        if (unit > 0) {
                            cartItems[index] = { food, unit };
                        }
                        else {
                            cartItems.splice(index, 1);
                        }
                    }
                    else {
                        cartItems.push({ food, unit });
                    }
                }
                else {
                    // add new Item
                    cartItems.push({ food, unit });
                }
                if (cartItems) {
                    profile.cart = cartItems;
                    const cartResult = yield profile.save();
                    return res.status(200).json(cartResult.cart);
                }
            }
        }
    }
    return res.status(404).json({ msg: 'Unable to add to cart!' });
});
exports.AddToCart = AddToCart;
const GetCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile.cart);
        }
    }
    return res.status(400).json({ message: 'Cart is Empty!' });
});
exports.GetCart = GetCart;
const DeleteCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate('cart.food').exec();
        if (profile != null) {
            profile.cart = [];
            const cartResult = yield profile.save();
            return res.status(200).json(cartResult);
        }
    }
    return res.status(400).json({ message: 'cart is Already Empty!' });
});
exports.DeleteCart = DeleteCart;
const VerifyOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const offerId = req.params.id;
    const customer = req.user;
    if (customer) {
        const appliedOffer = yield Offer_1.Offer.findById(offerId);
        if (appliedOffer) {
            if (appliedOffer.isActive) {
                return res.status(200).json({ message: 'Offer is Valid', offer: appliedOffer });
            }
        }
    }
    return res.status(400).json({ msg: 'Offer is Not Valid' });
});
exports.VerifyOffer = VerifyOffer;
const CreatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const { amount, paymentMode, offerId } = req.body;
    let payableAmount = Number(amount);
    if (offerId) {
        const appliedOffer = yield Offer_1.Offer.findById(offerId);
        if (appliedOffer.isActive) {
            payableAmount = (payableAmount - appliedOffer.offerAmount);
        }
    }
    // perform payment gateway charge api
    // create record on transaction
    const transaction = yield Transaction_1.Transaction.create({
        customer: customer._id,
        vendorId: '',
        orderId: '',
        orderValue: payableAmount,
        offerUsed: offerId || 'NA',
        status: 'OPEN',
        paymentMode: paymentMode,
        paymentResponse: 'Payment is cash on Delivery'
    });
    //return transaction
    return res.status(200).json(transaction);
});
exports.CreatePayment = CreatePayment;
//# sourceMappingURL=CustomerController.js.map