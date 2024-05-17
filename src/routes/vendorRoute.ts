import express, {Request, Response} from 'express';
import { addFood, getFood, getVendorProfile, updateVandorProfile, updateVandorService, updateVendorCoverImage, vendorLogin } from '../controllers';
import { authenticate, images } from '../middleware';


// const imageStorage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'images')
//     },
//     filename: function(req, file, cb){
//         cb(null, new Date().toISOString()+'-'+file.originalname)
//     }
// })
// const images = multer({storage: imageStorage}).array('images', 10)



const router = express.Router()

router.post('/login', vendorLogin)

router.use(authenticate)  // Below its all end point by default fall under authentication, which end point is not neede the authentication keep them above of this line. 
router.get('/profile', getVendorProfile)   
router.patch('/updateprofile',updateVandorProfile)    
router.patch('/updatevendorcoverimage', images, updateVendorCoverImage)    
router.patch('/service', updateVandorService)   

router.post('/addfood', images, addFood)
router.get('/getfood', getFood)

router.get('/orders', GetOrders);
router.put('/order/:id/process', ProcessOrder);
router.get('/order/:id', GetOrderDetails)
 

//Offers
// router.get('/offers', GetOffers);
// router.post('/offer', AddOffer);
// router.put('/offer/:id', EditOffer)

router.get('/', (req:Request, res:Response)=>{
    return res.json('Hello from vendor')
})
export {router as vendorRoutes}