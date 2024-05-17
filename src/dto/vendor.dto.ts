export interface createVendorInput{
    name:string;
    ownerName:string;
    foodType:string;
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;
    serviceAvailable:boolean
}

export interface loginVandor{
    email:string;
    password:string;
}

export interface EditVendorInputs{
    name:string;
    address:string;
    phone:string;
    foodType:[string];
}

export interface vandorPayload{
    _id:string;
    email:string;
    name:string;
    foodType:[string];
}