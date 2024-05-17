"use strict";
//Email
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestOtp = exports.generateOtp = void 0;
//Notification
//OTP
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 100));
    return { otp, expiry };
};
exports.generateOtp = generateOtp;
const onRequestOtp = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSId = '';
    const authToken = '';
    const client = require('twilio')(accountSId, authToken);
    const response = yield client.message.create({
        body: `Your OTP is ${otp}`,
        from: '',
        to: toPhoneNumber
    });
    return response;
});
exports.onRequestOtp = onRequestOtp;
//# sourceMappingURL=notificationUtility.js.map