# SIMPLESHOP

## MERN Stack E-Commerce Website

SIMPLESHOP is a full-stack e-commerce website developed using the MERN stack. The project provides an online shopping platform for perfumes with product browsing, user authentication, search, wishlist, shopping cart, checkout, and order management.

## Features

* User registration and login
* JWT-based authentication
* Product browsing
* Product details
* Men's and Women's collections
* New Arrivals
* Best Sellers
* Product search
* Wishlist
* Shopping cart
* Checkout
* Order placement
* Order history
* Admin product management
* Product image management
* Responsive design for desktop and mobile
* Contact section
* Journal section
* About section

## Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* React Router
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* CORS
* dotenv

## Project Structure

```text
SIMPLESHOP/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   │   └── products/
│   ├── app.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd SIMPLESHOP
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

## Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not upload the `.env` file to GitHub.

## Running the Project

### Start Backend

Inside the `server` folder:

```bash
node app.js
```

The backend runs on:

```text
https://avernus-api.onrender.com
```

### Start Frontend

Inside the `client` folder:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API Routes

Main API routes include:

```text
/api/products
/api/auth
/api/orders
/api/admin
```

## Product Management

The application supports product management through the backend, including:

* Adding products
* Viewing products
* Updating products
* Deleting products
* Managing product stock
* Product images
* Fragrance notes
* Product categories

## Authentication

SIMPLESHOP uses JWT authentication for protected user functionality.

Users can:

* Register
* Login
* Access their account
* View orders
* Manage their shopping activity

## Shopping Cart

Users can:

* Add products to the cart
* Increase product quantity
* Decrease quantity
* Remove products
* View the cart
* Continue to checkout

## Wishlist

Users can save products to their wishlist and remove them whenever needed.

## Checkout and Orders

The checkout system allows users to enter shipping information, review their order, and place an order.

Users can also view their previous orders through the order history section.

## Responsive Design

SIMPLESHOP is designed to work on:

* Desktop
* Laptop
* Tablet
* Mobile

The interface uses responsive layouts to provide a consistent shopping experience across different screen sizes.

## Development

Frontend:

```bash
cd client
npm run dev
```

Backend:

```bash
cd server
node app.js
```

## Production Build

To create a production build of the frontend:

```bash
cd client
npm run build
```

The production files will be generated in:

```text
client/dist/
```

## Security

The project uses:

* JWT authentication
* Password hashing
* Environment variables
* Protected routes
* CORS configuration

Sensitive information such as database credentials and secret keys should never be committed to GitHub.

## Future Improvements

Possible future improvements include:

* Online payment integration
* Product reviews and ratings
* Discount and coupon system
* Email notifications
* Advanced admin analytics
* Inventory notifications
* Cloud image storage
* Custom domain deployment

## Project Purpose

SIMPLESHOP was developed as a full-stack e-commerce project to demonstrate practical implementation of frontend, backend, database, authentication, product management, shopping cart, checkout, and order management functionality using the MERN stack.

## Author

**SIMPLESHOP**

A MERN stack e-commerce project focused on creating a modern and responsive online perfume shopping experience.

## License

This project is developed as an academic/software development project.
