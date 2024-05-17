"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
// const imageStorage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'images')
//     },
//     filename: function(req, file, cb){
//         cb(null, new Date().toISOString()+'-'+file.originalname)
//     }
// })
// const images = multer({storage: imageStorage}).array('images', 10)
const router = express_1.default.Router();
exports.vendorRoutes = router;
router.post('/login', controllers_1.vendorLogin);
router.use(middleware_1.authenticate); // Below its all end point by default fall under authentication, which end point is not neede the authentication keep them above of this line. 
router.get('/profile', controllers_1.getVendorProfile);
router.patch('/updateprofile', controllers_1.updateVandorProfile);
router.patch('/updatevendorcoverimage', middleware_1.images, controllers_1.updateVendorCoverImage);
router.patch('/service', controllers_1.updateVandorService);
router.post('/addfood', middleware_1.images, controllers_1.addFood);
router.get('/getfood', controllers_1.getFood);
router.get('/', (req, res) => {
    return res.json('Hello from vendor');
});
//# sourceMappingURL=vendorRoute.js.map