"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.shoppingRoute = router;
/**------------- Food availability -------------**/
router.get('/:pincode', controllers_1.getFoodAvailability);
/**------------- Top Restaurants -------------**/
router.get('/toprestaurants/:pincode', controllers_1.getTopRestaurants);
/**------------- Food availabilty in 30 minutes -------------**/
router.get('/foodin30min/:pincode', controllers_1.getFoodIn30Min);
/**------------- Search food -------------**/
router.get('/searchfood/:pincode', controllers_1.searchFoods);
/**------------- Find restaurants by id -------------**/
router.get('/restaurant/:id', controllers_1.restaurantById);
//# sourceMappingURL=shoppingRoute.js.map