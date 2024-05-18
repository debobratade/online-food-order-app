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
exports.EditOffer = exports.AddOffer = exports.GetOffers = exports.ProcessOrder = exports.GetOrderDetails = exports.GetCurrentOrders = exports.GetFoods = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const models_1 = require("../models");
const Offer_1 = require("../models/Offer");
const Order_1 = require("../models/Order");
const utility_1 = require("../utility");
const AdminController_1 = require("./AdminController");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield (0, AdminController_1.FindVendor)('', email);
    if (existingUser !== null) {
        const validation = yield (0, utility_1.ValidatePassword)(password, existingUser.password, existingUser.salt);
        if (validation) {
            const signature = yield (0, utility_1.GenerateSignature)({
                _id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name
            });
            return res.json(signature);
        }
    }
    return res.json({ 'message': 'Login credential is not valid' });
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        return res.json(existingVendor);
    }
    return res.json({ 'message': 'vendor Information Not Found' });
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { foodType, name, address, phone } = req.body;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;
            const saveResult = yield existingVendor.save();
            return res.json(saveResult);
        }
    }
    return res.json({ 'message': 'Unable to Update vendor profile ' });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vendor.coverImages.push(...images);
            const saveResult = yield vendor.save();
            return res.json(saveResult);
        }
    }
    return res.json({ 'message': 'Unable to Update vendor profile ' });
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { lat, lng } = req.body;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            if (lat && lng) {
                existingVendor.lat = lat;
                existingVendor.lng = lng;
            }
            const saveResult = yield existingVendor.save();
            return res.json(saveResult);
        }
    }
    return res.json({ 'message': 'Unable to Update vendor profile ' });
});
exports.UpdateVendorService = UpdateVendorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { name, description, category, foodType, readyTime, price } = req.body;
    if (user) {
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const food = yield models_1.Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                price: price,
                rating: 0,
                readyTime: readyTime,
                foodType: foodType,
                images: images
            });
            vendor.foods.push(food);
            const result = yield vendor.save();
            return res.json(result);
        }
    }
    return res.json({ 'message': 'Unable to Update vendor profile ' });
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vendorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ 'message': 'Foods not found!' });
});
exports.GetFoods = GetFoods;
const GetCurrentOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const orders = yield Order_1.Order.find({ vendorId: user._id }).populate('items.food');
        if (orders != null) {
            return res.status(200).json(orders);
        }
    }
    return res.json({ message: 'Orders Not found' });
});
exports.GetCurrentOrders = GetCurrentOrders;
const GetOrderDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield Order_1.Order.findById(orderId).populate('items.food');
        if (order != null) {
            return res.status(200).json(order);
        }
    }
    return res.json({ message: 'Order Not found' });
});
exports.GetOrderDetails = GetOrderDetails;
const ProcessOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const { status, remarks, time } = req.body;
    if (orderId) {
        const order = yield Order_1.Order.findById(orderId).populate('food');
        order.orderStatus = status;
        order.remarks = remarks;
        if (time) {
            order.readyTime = time;
        }
        const orderResult = yield order.save();
        if (orderResult != null) {
            return res.status(200).json(orderResult);
        }
    }
    return res.json({ message: 'Unable to process order' });
});
exports.ProcessOrder = ProcessOrder;
const GetOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        let currentOffer = Array();
        const offers = yield Offer_1.Offer.find().populate('vendors');
        if (offers) {
            offers.map(item => {
                if (item.vendors) {
                    item.vendors.map(vendor => {
                        if (vendor._id.toString() === user._id) {
                            currentOffer.push(item);
                        }
                    });
                }
                if (item.offerType === "GENERIC") {
                    currentOffer.push(item);
                }
            });
        }
        return res.status(200).json(currentOffer);
    }
    return res.json({ message: 'Offers Not available' });
});
exports.GetOffers = GetOffers;
const AddOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { title, description, offerType, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = req.body;
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor) {
            const offer = yield Offer_1.Offer.create({
                title,
                description,
                offerType,
                offerAmount,
                pincode,
                promoType,
                startValidity,
                endValidity,
                bank,
                isActive,
                minValue,
                vendor: [vendor]
            });
            console.log(offer);
            return res.status(200).json(offer);
        }
    }
    return res.json({ message: 'Unable to add Offer!' });
});
exports.AddOffer = AddOffer;
const EditOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const offerId = req.params.id;
    if (user) {
        const { title, description, offerType, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = req.body;
        const currentOffer = yield Offer_1.Offer.findById(offerId);
        if (currentOffer) {
            const vendor = yield (0, AdminController_1.FindVendor)(user._id);
            if (vendor) {
                currentOffer.title = title,
                    currentOffer.description = description,
                    currentOffer.offerType = offerType,
                    currentOffer.offerAmount = offerAmount,
                    currentOffer.pincode = pincode,
                    currentOffer.promoType = promoType,
                    currentOffer.startValidity = startValidity,
                    currentOffer.endValidity = endValidity,
                    currentOffer.bank = bank,
                    currentOffer.isActive = isActive,
                    currentOffer.minValue = minValue;
                const result = yield currentOffer.save();
                return res.status(200).json(result);
            }
        }
    }
    return res.json({ message: 'Unable to add Offer!' });
});
exports.EditOffer = EditOffer;
//# sourceMappingURL=VendorController.js.map