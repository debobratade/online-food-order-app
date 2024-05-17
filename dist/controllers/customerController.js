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
exports.getOrderById = exports.getAllOrder = exports.orderFood = exports.editCustomerProfile = exports.getCustomerProfile = exports.requestOtp = exports.customerVerify = exports.customerLogin = exports.customerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const customer_dto_1 = require("../dto/customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const customer_1 = require("../models/customer");
const notificationUtility_1 = require("../utility/notificationUtility");
const models_1 = require("../models");
const order_1 = require("../models/order");
const customerSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(customer_dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInputs;
    const isUserExist = yield customer_1.Customer.findOne({ email: email });
    if (isUserExist) {
        return res.status(400).json('An user is already present with this email id.');
    }
    const salt = yield (0, utility_1.generateSalt)();
    const userPassword = yield (0, utility_1.generatePassword)(password, salt);
    const { otp, expiry } = (0, notificationUtility_1.generateOtp)();
    console.log(otp, expiry);
    // waxepic521@rencr.com
    //Twilio@123456789
    const result = yield customer_1.Customer.create({
        email: email,
        password: userPassword,
        firstName: 'Arjun',
        lastName: 'Das',
        salt: salt,
        address: 'Kolkata',
        phone: phone,
        otp: otp,
        otp_expiery: expiry,
        verified: false,
        lat: 0,
        lng: 0,
        orders: []
    });
    if (result) {
        // send the OTP to customer phone numbsr
        //   await onRequestOtp(otp, phone)
        const signature = yield (0, utility_1.generateSignature)({
            _id: result.id,
            email: result.email,
            verified: result.verified
        });
        console.log(signature);
        return res.status(201).json({ signature: signature, verified: result.verified, email: result.email });
    }
    return res.status(400).json({ message: 'Error with signup' });
});
exports.customerSignUp = customerSignUp;
const customerLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(customer_dto_1.CustomerLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors);
    }
    const { email, password } = loginInputs;
    const customer = yield customer_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_1.validatePassword)(password, customer.password, customer.salt);
        if (validation) {
            const signature = yield (0, utility_1.generateSignature)({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified
            });
            console.log(signature);
            return res.status(201).json({ signature: signature, verified: customer.verified, email: customer.email });
        }
        else {
            //password does not match
        }
    }
    return res.status(404).json({ message: 'Error with login' });
});
exports.customerLogin = customerLogin;
const customerVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp == parseInt(otp) && profile.otp_expiery >= new Date()) {
                profile.verified = true;
                const updateCustomerResponse = yield profile.save();
                const signature = yield (0, utility_1.generateSignature)({
                    _id: updateCustomerResponse.id,
                    email: updateCustomerResponse.email,
                    verified: updateCustomerResponse.verified
                });
                return res.status(201).json({ signature: signature, verified: updateCustomerResponse.verified, email: updateCustomerResponse.email });
            }
        }
    }
    return res.status(400).json({ message: 'Error with otp validation' });
});
exports.customerVerify = customerVerify;
const requestOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, notificationUtility_1.generateOtp)();
            console.log(otp);
            profile.otp = otp;
            profile.otp_expiery = expiry;
            yield profile.save();
            //    await onRequestOtp(otp,profile.phone)
            return res.status(200).json({ message: 'OTP sent your registered phone number.' });
        }
    }
    return res.status(400).json({ message: 'Error with request otp.' });
});
exports.requestOtp = requestOtp;
const getCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ message: 'Error with fetch customer profile.' });
});
exports.getCustomerProfile = getCustomerProfile;
const editCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(customer_dto_1.EditCustomerProfileInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: false } });
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
    return res.status(400).json({ message: 'Error with update customer profile.' });
});
exports.editCustomerProfile = editCustomerProfile;
// Food order 
const orderFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Grab current login customer
    const customer = req.user;
    if (customer) {
        // Create an order id
        const orderId = `${Math.floor(Math.random() * 89999) + 10000}`;
        const profile = yield customer_1.Customer.findById(customer._id);
        // Grab order items from request [{id:xx, unit:xx}]
        const cart = req.body;
        let cartItems = Array();
        let netamount = 0.0;
        // Calculate order amount
        const foods = yield models_1.Food.find().where('_id').in(cart.map(item => item._id)).exec();
        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    netamount += (food.price * unit);
                    cartItems.push({ food, unit });
                }
            });
        });
        // Create order with item description
        if (cartItems) {
            // Create order
            const currentOrder = yield order_1.Order.create({
                orderId: orderId,
                items: cartItems,
                totalAmount: netamount,
                orderDate: new Date(),
                paidThrough: 'COD',
                paymentResponse: '',
                orderStatus: 'Waiting'
            });
            if (currentOrder) {
                profile.orders.push(currentOrder);
                const profileResponse = yield profile.save();
                return res.status(200).json(profileResponse);
            }
        }
        return res.status(400).json({ message: 'Error with create order.' });
    }
    // Finally update order to user account 
});
exports.orderFood = orderFood;
const getAllOrder = (req, res) => { };
exports.getAllOrder = getAllOrder;
const getOrderById = (req, res) => { };
exports.getOrderById = getOrderById;
//# sourceMappingURL=customerController.js.map