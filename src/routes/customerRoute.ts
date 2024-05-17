import express from 'express'
import { customerLogin, getCustomerProfile, customerSignUp, customerVerify, editCustomerProfile, requestOtp, orderFood, getAllOrder, getOrderById, AddToCart, GetCart, DeleteCart } from '../controllers'
import { authenticate } from '../middleware'
const router = express.Router()


/**---------------- Signup / create customer ---------------**/
router.post('/signup', customerSignUp)
/**---------------- Login ---------------**/
router.post('/login', customerLogin)
/**---------------- Authentication ---------------**/
router.use(authenticate)
/**---------------- Verify customer account ---------------**/
router.patch('/verify', customerVerify)
/**---------------- OTP / Requesting OTP ---------------**/
router.get('/otp', requestOtp)
/**---------------- Profile ---------------**/
router.get('/getprofile', getCustomerProfile)
router.patch('/updateprofile', editCustomerProfile)

//Cart
router.post('/addcart', AddToCart)
router.get('/getcart', GetCart)
router.delete('/deletecart', DeleteCart)
// Order
router.post('/create-order', orderFood)
router.get('/orders', getAllOrder)
router.get('/order/:id', getOrderById)
// Payment
export { router as customerRoute }