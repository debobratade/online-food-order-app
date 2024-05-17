import express from 'express';
import { getFoodAvailability, getFoodIn30Min, getTopRestaurants, restaurantById, searchFoods } from '../controllers';
const router = express.Router();

/**------------- Food availability -------------**/
router.get('/:pincode', getFoodAvailability)

/**------------- Top Restaurants -------------**/
router.get('/toprestaurants/:pincode', getTopRestaurants)

/**------------- Food availabilty in 30 minutes -------------**/
router.get('/foodin30min/:pincode', getFoodIn30Min)

/**------------- Search food -------------**/
router.get('/searchfood/:pincode', searchFoods)

/**------------- Find restaurants by id -------------**/
router.get('/restaurant/:id', restaurantById)

export { router as shoppingRoute };