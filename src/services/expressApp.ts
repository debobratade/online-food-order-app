import express,{Application} from 'express';
import { adminRoutes, customerRoute, shoppingRoute, vendorRoutes } from '../routes';
import path from 'path';



export default async(app:Application)=>{
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/images', express.static(path.join(__dirname, '../images')))

    app.use('/admin', adminRoutes);
    app.use('/vendor', vendorRoutes);
    app.use('/shopping', shoppingRoute);
    app.use('/customer', customerRoute);

    return app
    
}