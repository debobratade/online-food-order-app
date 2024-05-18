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
exports.GetDeliveryUsers = exports.VerifyDeliveryUser = exports.GetTransactionById = exports.GetTransactions = exports.GetVandorByID = exports.GetVanndors = exports.CreateVandor = exports.FindVendor = void 0;
const models_1 = require("../models");
const Transaction_1 = require("../models/Transaction");
const utility_1 = require("../utility");
const FindVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vendor.findOne({ email: email });
    }
    else {
        return yield models_1.Vendor.findById(id);
    }
});
exports.FindVendor = FindVendor;
const CreateVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pincode, foodType, email, password, ownerName, phone } = req.body;
    const existingVandor = yield (0, exports.FindVendor)('', email);
    if (existingVandor !== null) {
        return res.json({ "message": "A vandor is exist with this email ID" });
    }
    //generate a salt
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    // encrypt the password using the salt
    const createdVandor = yield models_1.Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        lat: 0,
        lng: 0
    });
    return res.json(createdVandor);
});
exports.CreateVandor = CreateVandor;
const GetVanndors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find();
    if (vendors !== null) {
        return res.json(vendors);
    }
    return res.json({ "message": "Vendors data not available" });
});
exports.GetVanndors = GetVanndors;
const GetVandorByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    const vendors = yield (0, exports.FindVendor)(vendorId);
    if (vendors !== null) {
        return res.json(vendors);
    }
    return res.json({ "message": "Vendors data not available" });
});
exports.GetVandorByID = GetVandorByID;
const GetTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield Transaction_1.Transaction.find();
    if (transactions) {
        return res.status(200).json(transactions);
    }
    return res.json({ "message": "Transactions data not available" });
});
exports.GetTransactions = GetTransactions;
const GetTransactionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const transaction = yield Transaction_1.Transaction.findById(id);
    if (transaction) {
        return res.status(200).json(transaction);
    }
    return res.json({ "message": "Transaction data not available" });
});
exports.GetTransactionById = GetTransactionById;
const VerifyDeliveryUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, status } = req.body;
    if (_id) {
        const profile = yield models_1.DeliveryUser.findById(_id);
        if (profile) {
            profile.verified = status;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
    return res.json({ message: 'Unable to verify Delivery User' });
});
exports.VerifyDeliveryUser = VerifyDeliveryUser;
const GetDeliveryUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUsers = yield models_1.DeliveryUser.find();
    if (deliveryUsers) {
        return res.status(200).json(deliveryUsers);
    }
    return res.json({ message: 'Unable to get Delivery Users' });
});
exports.GetDeliveryUsers = GetDeliveryUsers;
//# sourceMappingURL=AdminController.js.map