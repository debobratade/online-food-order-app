import { Request, Response, NextFunction } from 'express'
import { EditVendorInputs, loginVandor } from '../dto'
import { FindVandor } from './adminController'
import { generateSignature, validatePassword } from '../utility'
import { CreateFoodInput } from '../dto/food.dto'
import { Food, Vandor } from '../models'
import { Order } from '../models/order'

export const vendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <loginVandor>req.body
    const existingVandor = await FindVandor('', email)
    if (existingVandor != null) {
        const validateVandor = await validatePassword(password, existingVandor.password, existingVandor.salt)
        if (validateVandor) {
            // Create the signature with paylods to return and use the information for future request
            const signature = await generateSignature({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodType: existingVandor.foodType,
                name: existingVandor.name

            })
            return res.status(200).json(signature)
        } else {
            return res.status(403).json('password is not valid.')
        }
    }
    return res.status(403).json('Login credential are not valid.')
}


export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user

    if (user) {
        const existingVandor = await FindVandor(user._id)
        return res.json(existingVandor)
    }
    return res.status(404).json({ 'message': 'vandor information does not find' })
}


export const updateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
    
        const existingVandor = await FindVandor(user._id);
        if (existingVandor !== null) {

            const files = req.files as [Express.Multer.File]
            const images = files.map((file: Express.Multer.File) => file.filename)

            existingVandor.coverImages.push(...images)

            const result = await existingVandor.save();
            return res.json(result);
        }
    }
    return res.json({ 'message': 'Something went wrong to add food' });
}


export const updateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, phone, foodType } = <EditVendorInputs>req.body
    const user = req.user
    if (user) {
        const existingVandor = await FindVandor(user._id)

        if (existingVandor !== null) {
            existingVandor.name = name
            existingVandor.address = address
            existingVandor.phone = phone
            existingVandor.foodType = foodType
            const saveResult = await existingVandor.save()
            return res.json(saveResult)
        }
        return res.json(existingVandor)
    }
    return res.status(404).json({ 'message': 'vandor information does not find' })
}

export const updateVandorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const existingVandor = await FindVandor(user._id)

        if (existingVandor !== null) {
            existingVandor.serviceAvaliable = !existingVandor.serviceAvaliable;
            const saveResult = await existingVandor.save()
            return res.json(saveResult)
        }
        return res.json(existingVandor)
    }
}


export const addFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = <CreateFoodInput>req.body;
        const existingVandor = await FindVandor(user._id);
        if (existingVandor !== null) {

            const files = req.files as [Express.Multer.File]
            const images = files.map((file: Express.Multer.File) => file.filename)

            const vendorId = existingVandor._id.toString();
            const createFood = await Food.create({
                vendorId: vendorId,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
                price: price,
                readyTime: readyTime,
                rating: 0
            });
            existingVandor.foods.push(createFood);
            const result = await existingVandor.save();
            return res.json(result);
        }
    }
    return res.json({ 'message': 'Something went wrong to add food' });
};


export const getFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        console.log(user._id)
        const foods = await Food.find({ vendorId: user._id })

        if (foods !== null) {
            return res.status(200).json(foods)
        }
    }
    return res.json({ 'message': 'Something went wrong to get foods' })
}

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;
    
    if(user){

        const orders = await Order  .find({ vendorId: user._id}).populate('items.food');

        if(orders != null){
            return res.status(200).json(orders);
        }
    }

    return res.json({ message: 'Orders Not found'});
}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {

    const orderId = req.params.id;
    
    if(orderId){

        const order = await Order.findById(orderId).populate('items.food');

        if(order != null){
            return res.status(200).json(order);
        }
    }

    return res.json({ message: 'Order Not found'});
}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {

    const orderId = req.params.id;

    const { status, remarks, time } = req.body;

    
    if(orderId){

        const order = await Order.findById(orderId).populate('food');

        order.orderStatus = status;
        order.remarks = remarks;
        if(time){
            order.readyTime = time;
        }

        const orderResult = await order.save();

        if(orderResult != null){
            return res.status(200).json(orderResult);
        }
    }

    return res.json({ message: 'Unable to process order'});
}

/*
export const GetOffers = async (req: Request, res: Response, next: NextFunction) => {


    const user = req.user;

    if(user){
        let currentOffer = Array();

        const offers = await Offer.find().populate('vendors');

        if(offers){


            offers.map(item => {

                if(item.vendors){
                    item.vendors.map(vendor => {
                        if(vendor._id.toString() === user._id){
                            currentOffer.push(item);
                        }
                    })
                }

                if(item.offerType === "GENERIC"){
                    currentOffer.push(item)
                }

            })

        }

        return res.status(200).json(currentOffer);

    }

    return res.json({ message: 'Offers Not available'});
}


export const AddOffer = async (req: Request, res: Response, next: NextFunction) => {


    const user = req.user;

    if(user){
        const { title, description, offerType, offerAmount, pincode,
        promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = <CreateOfferInputs>req.body;

        const vendor = await FindVendor(user._id);

        if(vendor){

            const offer = await Offer.create({
                title,
                description,
                offerType,
                offerAmount,
                pincode,
                promoType,
                startValidity,
                endValidity,
                bank,
                isActive,
                minValue,
                vendor:[vendor]
            })

            console.log(offer);

            return res.status(200).json(offer);

        }

    }

    return res.json({ message: 'Unable to add Offer!'});

    

}

export const EditOffer = async (req: Request, res: Response, next: NextFunction) => {


    const user = req.user;
    const offerId = req.params.id;

    if(user){
        const { title, description, offerType, offerAmount, pincode,
        promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = <CreateOfferInputs>req.body;

        const currentOffer = await Offer.findById(offerId);

        if(currentOffer){

            const vendor = await FindVendor(user._id);

            if(vendor){
           
                currentOffer.title = title,
                currentOffer.description = description,
                currentOffer.offerType = offerType,
                currentOffer.offerAmount = offerAmount,
                currentOffer.pincode = pincode,
                currentOffer.promoType = promoType,
                currentOffer.startValidity = startValidity,
                currentOffer.endValidity = endValidity,
                currentOffer.bank = bank,
                currentOffer.isActive = isActive,
                currentOffer.minValue = minValue;

                const result = await currentOffer.save();

                return res.status(200).json(result);
            }
            
        }

    }

    return res.json({ message: 'Unable to add Offer!'});    

}
*/