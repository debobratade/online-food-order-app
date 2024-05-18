# Online Food Order App

This project is an online food ordering application developed with TypeScript. The application encompasses several key functionalities to manage vendors, customers, orders, and deliveries effectively.

## Features

### Vendor Module
- **Add Shops**: Register and manage food vendors.
- **Vendor Availability**: Find vendors based on their availability.

### Customer Module
- **Customer Management**: Register and manage customer profiles.
- **Order Food**: Browse menus, place orders, and track order status.
- **Create Offers**: Generate and manage special offers and discounts.
- **Payments**: Integrate and manage payment processes.

### Delivery Module
- **Add Delivery Personnel**: Register and manage delivery personnel.
- **Login for Delivery Personnel**: Secure login for delivery staff.
- **Assign Deliveries**: Assign delivery personnel to orders for efficient food delivery.

## Getting Started

### Prerequisites
- Node.js
- TypeScript

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/debobratade/online-food-order-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd online-food-order-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Compile TypeScript:
   ```bash
   npm run build
   ```
5. Start the application:
   ```bash
   npm start
   ```

## API Endpoints

### Admin Routes

- **Vendors**
  - `POST /vendor`: Add a new vendor
  - `GET /vendors`: Get all vendors
  - `GET /vendor/:id`: Get vendor by ID

- **Transactions**
  - `GET /transactions`: Get all transactions
  - `GET /transaction/:id`: Get transaction by ID

- **Delivery Personnel**
  - `PUT /delivery/verify`: Verify delivery personnel
  - `GET /delivery/users`: Get all delivery personnel

### Customer Routes

- **Authentication**
  - `POST /signup`: Customer sign-up
  - `POST /login`: Customer login

- **Verification**
  - `PATCH /verify`: Verify customer account
  - `GET /otp`: Request OTP

- **Profile**
  - `GET /profile`: Get customer profile
  - `PATCH /profile`: Edit customer profile

- **Cart**
  - `POST /cart`: Add to cart
  - `GET /cart`: Get cart items
  - `DELETE /cart`: Delete cart items

- **Offers**
  - `GET /offer/verify/:id`: Verify offer

- **Payments**
  - `POST /create-payment`: Create payment

- **Orders**
  - `POST /create-order`: Create order
  - `GET /orders`: Get all orders
  - `GET /order/:id`: Get order by ID

### Vendor Routes

- **Authentication**
  - `GET /login`: Vendor login

- **Profile**
  - `GET /profile`: Get vendor profile
  - `PATCH /profile`: Update vendor profile
  - `PATCH /coverimage`: Update vendor cover image
  - `PATCH /service`: Update vendor service

- **Food Management**
  - `POST /food`: Add food items
  - `GET /food`: Get all food items

- **Orders**
  - `GET /orders`: Get all orders
  - `PUT /order/:id/process`: Process order
  - `GET /order/:id`: Get order details

- **Offers**
  - `GET /offers`: Get all offers
  - `POST /offer`: Add offer
  - `PUT /offer/:id`: Edit offer

### Shopping Routes

- **Food Availability**
  - `GET /:pincode`: Get food availability by pincode

- **Top Restaurants**
  - `GET /top-restaurant/:pincode`: Get top restaurants by pincode

- **Food in 30 Minutes**
  - `GET /foods-in-30-min/:pincode`: Get foods available in 30 minutes

- **Search Foods**
  - `GET /search/:pincode`: Search foods by pincode

- **Offers**
  - `GET /offers/:pincode`: Get available offers by pincode

- **Restaurant by ID**
  - `GET /restaurant/:id`: Find restaurant by ID

### Delivery Routes

- **Authentication**
  - `POST /signup`: Delivery personnel sign-up
  - `POST /login`: Delivery personnel login

- **Profile**
  - `GET /profile`: Get delivery personnel profile
  - `PATCH /profile`: Edit delivery personnel profile

- **Service Status**
  - `PUT /change-status`: Change service status

## Future Enhancements
- Real-time order tracking
- Advanced analytics and reporting
- Customer reviews and ratings for vendors

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
