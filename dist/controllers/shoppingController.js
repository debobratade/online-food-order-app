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
exports.restaurantById = exports.searchFoods = exports.getFoodIn30Min = exports.getTopRestaurants = exports.getFoodAvailability = void 0;
const models_1 = require("../models");
const getFoodAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    console.log(pincode);
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .populate('foods');
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(404).json({ message: "Data not found!" });
});
exports.getFoodAvailability = getFoodAvailability;
const getTopRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    console.log(pincode);
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .populate('foods');
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(404).json({ message: "Data not found!" });
});
exports.getTopRestaurants = getTopRestaurants;
const getFoodIn30Min = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAvailable: true })
        .populate('foods');
    if (result.length > 0) {
        let foodResults = [];
        result.map(vandor => {
            const foods = vandor.foods;
            foodResults.push(...foods.filter(food => food.readyTime <= 30));
        });
        return res.status(200).json(foodResults);
    }
    return res.status(404).json({ message: "Data not found!" });
});
exports.getFoodIn30Min = getFoodIn30Min;
const searchFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAvailable: true })
        .populate('foods');
    if (result.length > 0) {
        let foodBucket = [];
        result.map(item => foodBucket.push(...item.foods));
        return res.status(200).json(foodBucket);
    }
    return res.status(404).json({ message: "Data not found!" });
});
exports.searchFoods = searchFoods;
const restaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield models_1.Vandor.findById(id);
    if (result) {
        return res.status(200).json(result);
    }
    return res.status(404).json({ message: "Data not found!" });
});
exports.restaurantById = restaurantById;
//# sourceMappingURL=shoppingController.js.map