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
exports.getVendorById = exports.getVendors = exports.createVendor = exports.FindVandor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
// Query function to find vendor by id or email
const FindVandor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vandor.findOne({ email: email });
    }
    else {
        return yield models_1.Vandor.findById(id);
    }
});
exports.FindVandor = FindVandor;
// API to create vandor
const createVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pincode, foodType, email, password, ownerName, phone, serviceAvailable } = req.body;
    const exitVandor = yield (0, exports.FindVandor)('', email);
    if (exitVandor !== null) {
        return res
            .status(400)
            .json({ message: "A vandor is already present with this email ID." });
    }
    // Generate salt string for password
    const salt = yield (0, utility_1.generateSalt)();
    // Mix the salt with password and make it a bcrypt string
    const userPassword = yield (0, utility_1.generatePassword)(password, salt);
    const createVandor = yield models_1.Vandor.create({
        name: name,
        ownerName: ownerName,
        foodType: foodType,
        pincode: pincode,
        address: address,
        phone: phone,
        email: email,
        password: userPassword,
        salt: salt,
        serviceAvailable: serviceAvailable,
        coverImages: [],
        rating: 0,
        foods: []
    });
    return res.status(200).json(createVandor);
});
exports.createVendor = createVendor;
// API to get all vandors
const getVendors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allvandor = yield models_1.Vandor.find();
    if (allvandor != null) {
        return res.status(200).json(allvandor);
    }
    return res.status(404).json({ message: "Vandors data are not avaliable" });
});
exports.getVendors = getVendors;
// API to get vandor by database ID
const getVendorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const getVandorData = yield (0, exports.FindVandor)(id);
    if (getVandorData != null) {
        return res.status(200).json(getVandorData);
    }
    return res.status(400).json({ message: 'Vandor data is not avaliable' });
});
exports.getVendorById = getVendorById;
//# sourceMappingURL=adminController.js.map