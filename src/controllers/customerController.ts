import { plainToClass, plainToInstance } from 'class-transformer'
import { Request, Response, NextFunction } from 'express'
import { CartItem, CreateCustomerInputs, CustomerLoginInputs, EditCustomerProfileInputs, OrderInputs } from '../dto/customer.dto'
import { validate } from 'class-validator';
import { generatePassword, generateSalt, generateSignature, validatePassword } from '../utility';
import { Customer } from '../models/customer';
import { generateOtp, onRequestOtp } from '../utility/notificationUtility';
import { Food } from '../models';
import { Order } from '../models/order';

export const customerSignUp = async (req: Request, res: Response) => {
    const customerInputs = plainToClass(CreateCustomerInputs, req.body);
    const inputErrors = await validate(customerInputs, { validationError: { target: true } })
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }
    const { email, phone, password } = customerInputs
    const isUserExist = await Customer.findOne({ email: email })
    if (isUserExist) {
        return res.status(400).json('An user is already present with this email id.')
    }
    const salt = await generateSalt()
    const userPassword = await generatePassword(password, salt)

    const { otp, expiry } = generateOtp()
    console.log(otp, expiry)
    // waxepic521@rencr.com
    //Twilio@123456789
    const result = await Customer.create({
        email: email,
        password: userPassword,
        firstName: 'Arjun',
        lastName: 'Das',
        salt: salt,
        address: 'Kolkata',
        phone: phone,
        otp: otp,
        otp_expiery: expiry,
        verified: false,
        lat: 0,
        lng: 0,
        orders: []
    })

    if (result) {
        // send the OTP to customer phone numbsr
        //   await onRequestOtp(otp, phone)

        const signature = await generateSignature({
            _id: result.id,
            email: result.email,
            verified: result.verified
        })
        console.log(signature)
        return res.status(201).json({ signature: signature, verified: result.verified, email: result.email })
    }
    return res.status(400).json({ message: 'Error with signup' })
}


export const customerLogin = async (req: Request, res: Response) => {
    const loginInputs = plainToClass(CustomerLoginInputs, req.body)
    const loginErrors = await validate(loginInputs, { validationError: { target: false } })
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors)
    }
    const { email, password } = loginInputs
    const customer = await Customer.findOne({ email: email })

    if (customer) {
        const validation = await validatePassword(password, customer.password, customer.salt);
        if (validation) {
            const signature = await generateSignature({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified
            })
            console.log(signature)
            return res.status(201).json({ signature: signature, verified: customer.verified, email: customer.email })
        } else {
            //password does not match
        }
    }
    return res.status(404).json({ message: 'Error with login' })
}


export const customerVerify = async (req: Request, res: Response) => {
    const { otp } = req.body
    const customer = req.user

    if (customer) {
        const profile = await Customer.findById(customer._id)
        if (profile) {
            if (profile.otp == parseInt(otp) && profile.otp_expiery >= new Date()) {
                profile.verified = true;
                const updateCustomerResponse = await profile.save();
                const signature = await generateSignature({
                    _id: updateCustomerResponse.id,
                    email: updateCustomerResponse.email,
                    verified: updateCustomerResponse.verified
                });
                return res.status(201).json({ signature: signature, verified: updateCustomerResponse.verified, email: updateCustomerResponse.email })
            }

        }
    }
    return res.status(400).json({ message: 'Error with otp validation' })
}
export const requestOtp = async (req: Request, res: Response) => {
    const customer = req.user;
    if (customer) {
        const profile = await Customer.findById(customer._id)
        if (profile) {
            const { otp, expiry } = generateOtp()
            console.log(otp)
            profile.otp = otp;
            profile.otp_expiery = expiry;
            await profile.save()
            //    await onRequestOtp(otp,profile.phone)

            return res.status(200).json({ message: 'OTP sent your registered phone number.' })

        }
    }
    return res.status(400).json({ message: 'Error with request otp.' })
}


export const getCustomerProfile = async (req: Request, res: Response) => {
    const customer = req.user
    if (customer) {
        const profile = await Customer.findById(customer._id)
        if (profile) {
            return res.status(200).json(profile)

        }
    }
    return res.status(400).json({ message: 'Error with fetch customer profile.' })
}


export const editCustomerProfile = async (req: Request, res: Response) => {
    const customer = req.user
    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body)
    const loginErrors = await validate(profileInputs, { validationError: { target: false } })
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors)
    }
    const { firstName, lastName, address } = profileInputs
    if (customer) {
        const profile = await Customer.findById(customer._id)
        if (profile) {

            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save()

            return res.status(200).json(result)

        }
    }
    return res.status(400).json({ message: 'Error with update customer profile.' })
}


// Food order 

export const orderFood = async (req: Request, res: Response) => {
    // Grab current login customer
    const customer = req.user
    if (customer) {
        // Create an order id
        const orderId = `${Math.floor(Math.random() * 89999) + 10000}`
        const profile = await Customer.findById(customer._id);
        // Grab order items from request [{id:xx, unit:xx}]
        const cart = <[OrderInputs]>req.body

        let cartItems = Array();
        let netamount = 0.0

        // Calculate order amount
        const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec()
        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    netamount += (food.price * unit);
                    cartItems.push({ food, unit })
                }
            })
        })

        // Create order with item description
        if (cartItems) {
            // Create order
            const currentOrder = await Order.create({
                orderId: orderId,
                items: cartItems,
                totalAmount: netamount,
                orderDate: new Date(),
                paidThrough: 'COD',
                paymentResponse: '',
                orderStatus: 'Waiting'
            })

            if (currentOrder) {
                profile.orders.push(currentOrder)
                const profileResponse = await profile.save();

                return res.status(200).json(currentOrder)
            }

        }
        return res.status(400).json({ message: 'Error with create order.' })
    }




    // Finally update order to user account 


}
export const getAllOrder = async (req: Request, res: Response) => {
    const customer = req.user

    if (customer) {
        const profile = await Customer.findById(customer._id).populate("orders");
        if (profile) {
            return res.status(200).json(profile.orders)
        }
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    const customer = req.user
    if (customer) {
        const orderId = req.params.id
        const orderDetails = await Order.findById(orderId).populate('items.food')
        if (orderDetails) {
            return res.status(200).json(orderDetails)
        }
    }
    return res.status(400).json({ message: "Error with get order details." })
}


/* ------------------- Cart Section --------------------- */
export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
    
    if(customer){

        const profile = await Customer.findById(customer._id);
        let cartItems = Array();

        const { _id, unit } = <CartItem>req.body;

        const food = await Food.findById(_id);

        if(food){

            if(profile != null){
                cartItems = profile.cart;

                if(cartItems.length > 0){
                    // check and update
                    let existFoodItems = cartItems.filter((item) => item.food._id.toString() === _id);
                    if(existFoodItems.length > 0){
                        
                        const index = cartItems.indexOf(existFoodItems[0]);
                        
                        if(unit > 0){
                            cartItems[index] = { food, unit };
                        }else{
                            cartItems.splice(index, 1);
                        }

                    }else{
                        cartItems.push({ food, unit})
                    }

                }else{
                    // add new Item
                    cartItems.push({ food, unit });
                }

                if(cartItems){
                    profile.cart = cartItems as any;
                    const cartResult = await profile.save();
                    return res.status(200).json(cartResult.cart);
                }

            }
        }

    }

    return res.status(404).json({ msg: 'Unable to add to cart!'});
}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {

      
    const customer = req.user;
    
    if(customer){
        const profile = await Customer.findById(customer._id);

        if(profile){
            return res.status(200).json(profile.cart);
        }
    
    }

    return res.status(400).json({message: 'Cart is Empty!'})

}

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {

   
    const customer = req.user;

    if(customer){

        const profile = await Customer.findById(customer._id).populate('cart.food').exec();

        if(profile != null){
            profile.cart = [] as any;
            const cartResult = await profile.save();

            return res.status(200).json(cartResult);
        }

    }

    return res.status(400).json({message: 'cart is Already Empty!'})

}
