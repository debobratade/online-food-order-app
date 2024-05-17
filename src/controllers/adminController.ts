import { Request, Response } from "express";
import { createVendorInput } from "../dto";
import { Vandor } from "../models";
import { generatePassword, generateSalt } from "../utility";



// Query function to find vendor by id or email

export const FindVandor = async(id:string | undefined, email?:string)=>{
    if(email){
      return await Vandor.findOne({email:email})
    }else{
      return await Vandor.findById(id)
    }
}
// API to create vandor
export const createVendor = async (req: Request, res: Response) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
    serviceAvailable
  } = <createVendorInput>req.body;

  const exitVandor:any = await FindVandor('',email);
  if (exitVandor !== null) {
    return res
      .status(400)
      .json({ message: "A vandor is already present with this email ID." });
  }

  // Generate salt string for password
  const salt = await generateSalt();
  // Mix the salt with password and make it a bcrypt string
  const userPassword = await generatePassword(password, salt);

  const createVandor = await Vandor.create({
    name: name,
    ownerName: ownerName,
    foodType: foodType,
    pincode: pincode,
    address: address,
    phone: phone,
    email: email,
    password: userPassword,
    salt: salt,
    serviceAvailable: serviceAvailable,
    coverImages: [],
    rating: 0,
    foods:[]
  });
  return res.status(200).json(createVandor);
};


// API to get all vandors
export const getVendors = async (req: Request, res: Response) => {
  const allvandor = await Vandor.find();
  if (allvandor != null) {
    return res.status(200).json(allvandor);
  }

  return res.status(404).json({ message: "Vandors data are not avaliable" });
};


// API to get vandor by database ID
export const getVendorById = async(req: Request, res: Response) => {
    const id = req.params.id
    const getVandorData = await FindVandor(id)

    if(getVandorData!=null){
        return res.status(200).json(getVandorData)
    }
    return res.status(400).json({message:'Vandor data is not avaliable'})
    
};
