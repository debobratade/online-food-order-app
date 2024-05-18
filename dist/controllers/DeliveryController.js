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
exports.UpdateDeliveryUserStatus = exports.EditDeliveryProfile = exports.GetDeliveryProfile = exports.DeliveryLogin = exports.DeliverySignUp = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("../dto");
const models_1 = require("../models");
const utility_1 = require("../utility");
const DeliverySignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUserInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateDeliveryUserInput, req.body);
    const validationError = yield (0, class_validator_1.validate)(deliveryUserInputs, { validationError: { target: true } });
    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }
    const { email, phone, password, address, firstName, lastName, pincode } = deliveryUserInputs;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const existingDeliveryUser = yield models_1.DeliveryUser.findOne({ email: email });
    if (existingDeliveryUser !== null) {
        return res.status(400).json({ message: 'A Delivery User exist with the provided email ID!' });
    }
    const result = yield models_1.DeliveryUser.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        address: address,
        pincode: pincode,
        verified: false,
        lat: 0,
        lng: 0,
    });
    if (result) {
        //Generate the Signature
        const signature = yield (0, utility_1.GenerateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified
        });
        // Send the result
        return res.status(201).json({ signature, verified: result.verified, email: result.email });
    }
    return res.status(400).json({ msg: 'Error while creating Delivery user' });
});
exports.DeliverySignUp = DeliverySignUp;
const DeliveryLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginInput, req.body);
    const validationError = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: true } });
    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }
    const { email, password } = loginInputs;
    const deliveryUser = yield models_1.DeliveryUser.findOne({ email: email });
    if (deliveryUser) {
        const validation = yield (0, utility_1.ValidatePassword)(password, deliveryUser.password, deliveryUser.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: deliveryUser._id,
                email: deliveryUser.email,
                verified: deliveryUser.verified
            });
            return res.status(200).json({
                signature,
                email: deliveryUser.email,
                verified: deliveryUser.verified
            });
        }
    }
    return res.json({ msg: 'Error Login' });
});
exports.DeliveryLogin = DeliveryLogin;
const GetDeliveryProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = req.user;
    if (deliveryUser) {
        const profile = yield models_1.DeliveryUser.findById(deliveryUser._id);
        if (profile) {
            return res.status(201).json(profile);
        }
    }
    return res.status(400).json({ msg: 'Error while Fetching Profile' });
});
exports.GetDeliveryProfile = GetDeliveryProfile;
const EditDeliveryProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = req.user;
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerProfileInput, req.body);
    const validationError = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }
    const { firstName, lastName, address } = customerInputs;
    if (deliveryUser) {
        const profile = yield models_1.DeliveryUser.findById(deliveryUser._id);
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
exports.EditDeliveryProfile = EditDeliveryProfile;
/* ------------------- Delivery Notification --------------------- */
const UpdateDeliveryUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = req.user;
    if (deliveryUser) {
        const { lat, lng } = req.body;
        const profile = yield models_1.DeliveryUser.findById(deliveryUser._id);
        if (profile) {
            if (lat && lng) {
                profile.lat = lat;
                profile.lng = lng;
            }
            profile.isAvailable = !profile.isAvailable;
            const result = yield profile.save();
            return res.status(201).json(result);
        }
    }
    return res.status(400).json({ msg: 'Error while Updating Profile' });
});
exports.UpdateDeliveryUserStatus = UpdateDeliveryUserStatus;
//# sourceMappingURL=DeliveryController.js.map