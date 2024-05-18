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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("../routes");
const CustomerRoute_1 = require("../routes/CustomerRoute");
const ShoppingRoutes_1 = require("../routes/ShoppingRoutes");
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    const imagePath = path_1.default.join(__dirname, '../images');
    app.use('/images', express_1.default.static(imagePath));
    app.use('/admin', routes_1.AdminRoute);
    app.use('/vendor', routes_1.VandorRoute);
    app.use('/customer', CustomerRoute_1.CustomerRoute);
    app.use('/delivery', routes_1.DeliveryRoute);
    app.use(ShoppingRoutes_1.ShoppingRoute);
    return app;
});
//# sourceMappingURL=ExpressApp.js.map