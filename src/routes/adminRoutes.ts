import express, {Request, Response} from 'express';
import { createVendor, getVendorById, getVendors } from '../controllers';

const router = express.Router()

router.post('/createVendor', createVendor)
router.get('/getVendors', getVendors)
router.get('/getVendor/:id', getVendorById)

router.get('/',(req:Request, res:Response)=>{
    return res.json('Hello from admin page')
})

export {router as adminRoutes}