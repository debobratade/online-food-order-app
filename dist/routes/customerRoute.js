"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
exports.customerRoute = router;
/**---------------- Signup / create customer ---------------**/
router.post('/signup', controllers_1.customerSignUp);
/**---------------- Login ---------------**/
router.post('/login', controllers_1.customerLogin);
/**---------------- Authentication ---------------**/
router.use(middleware_1.authenticate);
/**---------------- Verify customer account ---------------**/
router.patch('/verify', controllers_1.customerVerify);
/**---------------- OTP / Requesting OTP ---------------**/
router.get('/otp', controllers_1.requestOtp);
/**---------------- Profile ---------------**/
router.get('/getprofile', controllers_1.getCustomerProfile);
router.patch('/updateprofile', controllers_1.editCustomerProfile);
// Cart
// Order
router.post('/create-order', controllers_1.orderFood);
router.get('/orders', controllers_1.getAllOrder);
router.get('/order/:id', controllers_1.getOrderById);
//# sourceMappingURL=customerRoute.js.map