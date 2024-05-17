import { Request, Response } from 'express'
import { FoodDoc, Vandor } from '../models'

export const getFoodAvailability = async (req: Request, res: Response) => {

    const pincode = req.params.pincode
    console.log(pincode)
    const result = await Vandor.find({ pincode: pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .populate('foods')

    if (result.length > 0) {
        return res.status(200).json(result)
    }

    return res.status(404).json({ message: "Data not found!" })
}

export const getTopRestaurants = async (req: Request, res: Response) => {

    const pincode = req.params.pincode
    console.log(pincode)
    const result = await Vandor.find({ pincode: pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .populate('foods')

    if (result.length > 0) {
        return res.status(200).json(result)
    }

    return res.status(404).json({ message: "Data not found!" })

}

export const getFoodIn30Min = async (req: Request, res: Response) => {
    const pincode = req.params.pincode
    const result = await Vandor.find({pincode:pincode, serviceAvailable:true})
    .populate('foods')

    if(result.length>0){
        let foodResults:any=[]
        result.map(vandor=>{
            const foods = vandor.foods as [FoodDoc]
            foodResults.push(...foods.filter(food=>food.readyTime<=30))
        })
        return res.status(200).json(foodResults)
    }

    return res.status(404).json({message:"Data not found!"})

}

export const searchFoods = async (req: Request, res: Response) => {
    const pincode = req.params.pincode
    const result = await Vandor.find({pincode:pincode, serviceAvailable:true})
    .populate('foods')

    if(result.length>0){
        let foodBucket:any=[]
      result.map(item=>foodBucket.push(...item.foods))
        return res.status(200).json(foodBucket)
    }

    return res.status(404).json({message:"Data not found!"})
}

export const restaurantById = async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await Vandor.findById(id)
    if(result){
        return res.status(200).json(result)
    }

    return res.status(404).json({message:"Data not found!"})
}

