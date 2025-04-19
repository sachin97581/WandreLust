# Wanderlust

Wanderlust is a web application designed to help users explore and book unique travel accommodations, such as beachfront cottages, mountain retreats, and private islands. The application allows users to create, view, edit, and delete listings, as well as leave reviews for accommodations.

## Features

- **User Authentication**: Users can sign up, log in, and log out securely using `passport-local-mongoose`.
- **Listings Management**: Users can create, edit, and delete listings with details like title, description, price, location, category, and images.
- **Image Uploads**: Images are uploaded and stored using Cloudinary.
- **Reviews**: Users can leave reviews with ratings and comments for listings.
- **Category Filtering**: Listings are categorized (e.g., "Camping", "Farms", "Mountains") for easy browsing.
- **Responsive Design**: The application is styled with CSS and is mobile-friendly.
- **Error Handling**: Custom error handling is implemented for a better user experience.

---

## Project Structure

### Root Directory

- **`.env`**: Contains environment variables like database URLs and Cloudinary credentials.
  ```
  CLOUD_NAME=<your-cloudinary-cloud-name>
  CLOUD_API_KEY=<your-cloudinary-api-key>
  CLOUD_API_SECRET=<your-cloudinary-api-secret>
  ATLASDB_URL=<your-mongodb-atlas-url>
  SECRET=<your-session-secret>
  ```
- **`cloudConfig.js`**: Configures Cloudinary for image uploads.
- **`index.js`**: The main entry point of the application.
- **`middlewares.js`**: Contains middleware functions for authentication, validation, and authorization.
- **`schema.js`**: Defines validation schemas for listings and reviews using Joi.
- **`package.json`**: Lists project dependencies and scripts.
- **`README.MD`**: This file, which explains the project.

---

### Folders

#### `controllers/`
Contains logic for handling requests and responses.

- **`listing.js`**: Handles CRUD operations for listings.
- **`review.js`**: Manages review creation and deletion.
- **`users.js`**: Handles user authentication and session management.

#### `init/`
Contains initialization scripts.

- **`data.js`**: Sample data for seeding the database.
- **`index.js`**: Initializes the database with sample data.

#### `models/`
Defines Mongoose schemas and models.

- **`listing.js`**: Schema for listings, including fields like title, description, price, category, and owner.
- **`review.js`**: Schema for reviews, including fields like rating, comment, and author.
- **`user.js`**: Schema for users, with `passport-local-mongoose` integration for authentication.

#### `public/`
Contains static assets like CSS and JavaScript files.

- **`css/`**: Stylesheets for the application.
- **`js/`**: JavaScript files for client-side functionality.

#### `routes/`
Defines application routes.

- **`listing.js`**: Routes for listing-related operations (e.g., create, edit, delete).
- **`review.js`**: Routes for review-related operations.
- **`user.js`**: Routes for user authentication.

#### `uploads/`
Stores uploaded files temporarily before they are processed by Cloudinary.

#### `utils/`
Contains utility functions.

- **`ExpressError.js`**: Custom error class for handling errors.
- **`wrapAsync.js`**: Utility to wrap asynchronous route handlers for error handling.

#### `views/`
Contains EJS templates for rendering HTML.

- **`error.ejs`**: Template for displaying error messages.
- **`category/`**: Templates for displaying listings by category.
- **`listing/`**: Templates for listing-related pages (e.g., create, edit, show).
- **`users/`**: Templates for user-related pages (e.g., login, signup).

---

## Key Functionalities

### User Authentication
- **Signup**: Users can register with a username, email, and password.
- **Login**: Users can log in securely using `passport-local-mongoose`.
- **Logout**: Users can log out, and their session is cleared.

### Listings
- **Create**: Users can create new listings with details like title, description, price, location, category, and images.
- **Edit**: Users can edit their existing listings.
- **Delete**: Users can delete their listings.
- **View**: Listings are displayed with details and images.

### Reviews
- **Add Review**: Users can leave reviews with ratings and comments.
- **Delete Review**: Users can delete their own reviews.

### Image Uploads
- Images are uploaded to Cloudinary using `multer-storage-cloudinary`.

### Error Handling
- Custom error handling is implemented using `ExpressError`.

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wanderlust
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUD_API_KEY=<your-cloudinary-api-key>
   CLOUD_API_SECRET=<your-cloudinary-api-secret>
   ATLASDB_URL=<your-mongodb-atlas-url>
   SECRET=<your-session-secret>
   ```
4. Seed the database with sample data:
   ```bash
   node init/index.js
   ```
5. Start the application:
   ```bash
   npm start
   ```
6. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```


## Dependencies

Express: Web framework for Node.js.
Mongoose: MongoDB object modeling tool.
Passport: Authentication middleware.
Cloudinary: Image hosting and processing.
Multer: Middleware for handling file uploads.
Joi: Data validation library.
EJS: Templating engine for rendering HTML.

## Future Enhancements

Add search functionality for listings.
Implement user roles (e.g., admin, regular user).
Add pagination for listings and reviews.
Enhance the UI with more interactive elements.