//Email

//Notification

//OTP
export const generateOtp=()=>{
    const otp = Math.floor(100000 + Math.random()*900000)
    let expiry = new Date()
    expiry.setTime(new Date().getTime()+ (30*60*100))
    return {otp, expiry}
}

export const onRequestOtp = async (otp:number, toPhoneNumber:string|number)=>{

    const accountSId=''
    const authToken=''
    const client= require('twilio')(accountSId, authToken);

    const response = await client.message.create({
        body:`Your OTP is ${otp}`,
        from:'',
        to:toPhoneNumber
    })
    return response
}