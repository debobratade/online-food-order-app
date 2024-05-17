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
exports.getFood = exports.addFood = exports.updateVandorService = exports.updateVandorProfile = exports.updateVendorCoverImage = exports.getVendorProfile = exports.vendorLogin = void 0;
const adminController_1 = require("./adminController");
const utility_1 = require("../utility");
const models_1 = require("../models");
const vendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVandor = yield (0, adminController_1.FindVandor)('', email);
    if (existingVandor != null) {
        const validateVandor = yield (0, utility_1.validatePassword)(password, existingVandor.password, existingVandor.salt);
        if (validateVandor) {
            // Create the signature with paylods to return and use the information for future request
            const signature = yield (0, utility_1.generateSignature)({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodType: existingVandor.foodType,
                name: existingVandor.name
            });
            return res.status(200).json(signature);
        }
        else {
            return res.status(403).json('password is not valid.');
        }
    }
    return res.status(403).json('Login credential are not valid.');
});
exports.vendorLogin = vendorLogin;
const getVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, adminController_1.FindVandor)(user._id);
        return res.json(existingVandor);
    }
    return res.status(404).json({ 'message': 'vandor information does not find' });
});
exports.getVendorProfile = getVendorProfile;
const updateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, adminController_1.FindVandor)(user._id);
        if (existingVandor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            existingVandor.coverImages.push(...images);
            const result = yield existingVandor.save();
            return res.json(result);
        }
    }
    return res.json({ 'message': 'Something went wrong to add food' });
});
exports.updateVendorCoverImage = updateVendorCoverImage;
const updateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, foodType } = req.body;
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, adminController_1.FindVandor)(user._id);
        if (existingVandor !== null) {
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.foodType = foodType;
            const saveResult = yield existingVandor.save();
            return res.json(saveResult);
        }
        return res.json(existingVandor);
    }
    return res.status(404).json({ 'message': 'vandor information does not find' });
});
exports.updateVandorProfile = updateVandorProfile;
const updateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, adminController_1.FindVandor)(user._id);
        if (existingVandor !== null) {
            existingVandor.serviceAvaliable = !existingVandor.serviceAvaliable;
            const saveResult = yield existingVandor.save();
            return res.json(saveResult);
        }
        return res.json(existingVandor);
    }
});
exports.updateVandorService = updateVandorService;
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const existingVandor = yield (0, adminController_1.FindVandor)(user._id);
        if (existingVandor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const vendorId = existingVandor._id.toString();
            const createFood = yield models_1.Food.create({
                vendorId: vendorId,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
                price: price,
                readyTime: readyTime,
                rating: 0
            });
            existingVandor.foods.push(createFood);
            const result = yield existingVandor.save();
            return res.json(result);
        }
    }
    return res.json({ 'message': 'Something went wrong to add food' });
});
exports.addFood = addFood;
const getFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        console.log(user._id);
        const foods = yield models_1.Food.find({ vendorId: user._id });
        if (foods !== null) {
            return res.status(200).json(foods);
        }
    }
    return res.json({ 'message': 'Something went wrong to get foods' });
});
exports.getFood = getFood;
//# sourceMappingURL=vandorController.js.map