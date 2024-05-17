"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.adminRoutes = router;
router.post('/createVendor', controllers_1.createVendor);
router.get('/getVendors', controllers_1.getVendors);
router.get('/getVendor/:id', controllers_1.getVendorById);
router.get('/', (req, res) => {
    return res.json('Hello from admin page');
});
//# sourceMappingURL=adminRoutes.js.map