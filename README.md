# Blog Management System API

This is a RESTful API for a blog management system built with Express and MongoDB. It supports user authentication, role-based access control, and blog management functionalities.

## Features
- User Sign-Up and Login
- User Authentication with JWT
- Role-Based Access Control
- Blog Post Creation and Retrieval

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- MongoDB Atlas account with a cluster and user set up.

### Steps
1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd blog-management-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root of your project and add your environment variables:
    ```plaintext
    MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/your_dbname?retryWrites=true&w=majority
    JWT_SECRET=your_secret_key
    ```

4. Start the server:
    ```bash
    node app.js
    ```
