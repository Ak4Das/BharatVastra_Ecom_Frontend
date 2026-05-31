# BharatVastra

BharatVastra is a modern and responsive full-stack E-Commerce web application built to provide a seamless online shopping experience. The platform enables users to browse products, manage carts and wishlists, place orders, see previously done orders and edit existing orders while ensuring excellent performance, scalability, and user experience.

Built using modern frontend and backend technologies, the project follows component-based architecture, clean coding practices, efficient state management, optimized API handling, and scalable folder structures. The application is designed to simulate a production-ready online shopping platform with robust user interactions and responsive design.

## Demo Link

Deployed project **[Live Demo](https://e-commerce-website-frontend-vert.vercel.app)**

## Frontend Setup

```bash
git clone https://github.com/Ak4Das/BharatVastra_Ecom_Frontend.git
cd BharatVastra_Ecom_Frontend
npm install
touch .env
put 'VITE_MODE = DEVELOPMENT' in your .env file
npm run dev
```

## Backend Setup

```bash
git clone https://github.com/Ak4Das/BharatVastra_Ecom_Backend.git
cd BharatVastra_Ecom_Backend
npm install
touch .env
put 'MONGODB = <your mongodbUri>' in your .env file
node index.js
```

## Tech Stack

#### These are the main technologies used to build the application:

#### *Frontend*

* **JavaScript (ES6+)**
* **React.js**
* **HTML5**
* **CSS3**
* **Bootstrap**

#### *Backend*

* **Node.js**
* **Express.js**

#### *Database*

* **MongoDB**

## Libraries & Tools

#### These help implement specific features:

* **React Router** (*routing*)
* **React Toastify** (*notifications*)
* **Bootstrap Icons** (*Icons*)

## Demo Video

Watch a walkthrough (5 - 7 minutes) of all major features of this app: **[Loom Video Link](YOUR_VIDEO_LINK_HERE)**

## Key Features

* Responsive and modern UI (Responsive till **320px**)
* Product browsing and searching
* Product filtering and sorting
* Shopping cart management
* Wishlist management
* User profile management
* Order placement workflow
* Optimized API requests with AbortController
* Retry mechanisms for failed requests
* SPA routing support
* Scalable and maintainable architecture

## Detailed Features

The application includes features such as product browsing, filtering, cart management, wishlist functionality, order processing, asynchronous data handling, and optimized API communication. It is designed with performance, maintainability, and user experience in mind.

**Home Page**

* Displays main categories of products
* Displays **carousel of diwali sale**
* Contains **New Arrival** and **Diwali Sale** section

![Home](./screenshots/HomePage1.png)
![Home](./screenshots/HomePage2.png)

**Products Page**

* Displays all available products of the selected main category
* Supports **filtering** and **sorting**
* Includes **search** functionality

![Products](./screenshots/ProductListingPage1.png)
![Products](./screenshots/ProductListingPage2.png)

**Product Details Page**

* Displays detailed information about a selected product
* Shows **product images**, **description**, **pricing**, **offer**, and **ratings**
* Contains **Add to Cart** and **Add to Wishlist** and **Buy Now** functionality
* Contains **Frequnetly Bought Together** Section, **Product Information** Section, **Compare Similar Items** Section and **More Items** Section

![Product Details](./screenshots/ProductDetailsPage1.png)
![Product Details](./screenshots/ProductDetailsPage2.png)
![Product Details](./screenshots/ProductDetailsPage3.png)
![Product Details](./screenshots/ProductDetailsPage4.png)

**Payment Method Page**

* Displays **different payment methods** like COD, NetBanking, Credit or Debit card
* You can **change address**, **increase quantity** of product or **remove product** from your list, **apply coupon**
* Displays **Total order Invoice**

![Payment](./screenshots/PaymentMethodPage.png)

**Cart Page**

* Displays all products added to the cart
* Supports **quantity and size updates**
* Contains **Remove From Card** and **Move To Wishlist** buttons
* Displays **total cart value**

![Cart](./screenshots/CartPage.png)

**Wishlist Page**

* Displays all wishlist items
* Contains **Add To Cart** and **Remove From Wishlist** buttons

![Wishlist](./screenshots/WishlistPage.png)

**User Page**

* Displays user details
* Allows profile updates
* Contains **Your Orders**, **Your Addresses**, **Contact Us** cards

![User](./screenshots/UserPage.png)

**Your Orders Page**

* Displays all **previously done orders**
* You can navigate to **Order Details** Page
* Contains **View or Edit Order** and **Cancel Order** buttons

![Orders](./screenshots/YourOrdersPage.png)

**Order Details Page**

* Displays all informations about a particular order
* Contains **View or Edit Order** and **Cancel Order** buttons

![Order Details](./screenshots/OrderDetailsPage.png)

**Edit Order Page**

* You can **change address and payment method**
* Supports **quantity and size updates** and **remove items from order**

![Edit Order](./screenshots/EditOrderPage.png)

**User Addresses Page**

* Displays all registered Addresses
* You can **add new address**

![User Addresses](./screenshots/UserAddressesPage.png)

**ContactUs Page**

* Supports **send email using Formspree**
* Displays company location and all contact info

![Contact Us](./screenshots/ContactUsPage1.png)
![Contact Us](./screenshots/ContactUsPage2.png)

**New Arrival Page**

* Displays all the newly arrived products
* Support **Add To Cart** and **Add To Wishlist** products

![New Arrival](./screenshots/NewArrivalPage.png)

**Diwali Sale Page**

* Displays categories which are in sale
* Contain **coupon**

![Diwali Sale](./screenshots/DiwaliSalePage1.png)
![Diwali Sale](./screenshots/DiwaliSalePage2.png)

**Sale Products Page**

* Displays all the products which are in sale under the selected category
* Support **Add To Cart** and **Add To Wishlist** products
* Support gender wise filtering

![Sale Products](./screenshots/SaleProductsPage.png)

**Request Optimization**

* Optimize requests with AbortController
* Retry mechanisms for failed requests

**Error Handling**

* Error handling using state management

**Code Structure**

* Clean, scalable, maintainable, and easy-to-understand code structure

**Responsiveness**

* App is responsive till **320px**

* **Tab View**

![Tab View](./screenshots/TabView.png)

* **Mobile View**

![Mobile View](./screenshots/MobileView.png)

## Architecture Highlights

* Component-based React architecture
* Modular API service layer
* Centralized error handling
* Feature-based folder structure
* Component-based Style Modules
* Reusable functions
* Reusable UI components
* Reusable server request functions

## Engineering Highlights

* **Request cancellation** using AbortController
* **Retry mechanism** for failed requests
* **Optimized API handling** for slow servers
* Prevention of unnecessary **request stacking**
* **Improved user experience** during loading/error states
* **Protected route handling**
* Reusable UI components
* Responsive design down to **320px**

## API Reference

#### **GET /cloth/:id** (Get cloth by id)

Sample Response:

```javascript
{
    success: true,
    message: "Cloth fetched successfully",
    respondedData: { _id, url, name, price, ... }
}
```

#### **GET createOrder/:userId** (Get createOrder by userId)

Sample Response:

```javascript
{
    success: true,
    message: "CreateOrder fetched successfully",
    respondedData: [{_id, products, userId,...}]
}
```

#### **POST /user/saveUser** (Post new user)

Sample Response:

```javascript
{
    success: true,
    message: "User saved successfully",
    respondedData: { _id, name, email, password, addToCartItems, addToWishlistItems ... }
}
```

#### **PATCH /order/update/:id** (Update order by id)

Sample Response:

```javascript
{
    success: true,
    message: "Order updated successfully"
    respondedData: {_id, deliveryCharge, deliveryDate, item, paymentMethod, address,...}
}
```

#### **DELETE /order/delete/:id** (Delete order by id)

Sample Response:

```javascript
{
    success: true,
    message: "Order deleted successfully",
    respondedData: {_id, deliveryCharge, deliveryDate, item, paymentMethod, address,...}
}
```

## Goal of the Project

The goal of this project is to build a production-ready E-Commerce platform that demonstrates modern frontend and backend engineering practices, efficient API handling, scalable architecture, clean UI/UX design, secure authentication, and real-world online shopping workflows.

## Contact

For bugs or feature requests, please reach out to **[akashdas02052@gmail.com](mailto:akashdas02052@gmail.com)**
