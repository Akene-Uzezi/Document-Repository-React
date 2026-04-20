# Document Repository React

A full-stack web application for uploading, viewing, downloading, and managing documents with a modern React frontend and Express.js backend.

## Features

- **File Management**: Upload, view, download, and delete documents
- **Organization**: Group files by month and day for easy navigation
- **Recent Uploads**: Quick access to recently uploaded files
- **User Authentication**: Secure login system with password hashing
- **Admin Management**: Administrative user management capabilities
- **Responsive Design**: Built with React and Tailwind CSS for a modern UI
- **File Storage**: Secure file storage with MongoDB database

## Tech Stack

### Frontend
- **React** 19.2.4 - UI library
- **Vite** 8.0 - Build tool with HMR
- **React Router DOM** 7.13 - Routing
- **Tailwind CSS** 4.2 - Styling
- **Motion** 12.38 - Animations
- **Lucide React** 1.7 - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** 5.1 - Web framework
- **MongoDB** 6.20 - Database
- **Multer** 2.0 - File upload handling
- **bcrypt** 6.0 - Password hashing
- **JWT** 9.0 - Authentication tokens
- **Nodemailer** 8.0 - Email notifications

## Project Structure

```
Document-Repository-React/
├── src/                    # React frontend source code
├── api/                    # Express backend application
│   ├── config/            # Session and configuration setup
│   ├── controllers/       # Route controller functions
│   ├── database/          # Database connection management
│   ├── models/            # Data models and methods
│   ├── public/            # Static files
│   ├── routes/            # API route definitions
│   ├── views/             # EJS templates
│   ├── app.js             # Main application file
│   └── package.json       # Backend dependencies
├── public/                # Frontend static assets
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
├── index.html             # HTML entry point
└── vercel.json            # Vercel deployment config
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Akene-Uzezi/Document-Repository-React.git
   cd Document-Repository-React
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env.local` file** in the root directory with the following variables:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Backend Setup

1. **Navigate to the api directory**:
   ```bash
   cd api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `api/` directory with the following variables:
   ```
   DB_NAME=your_database_name
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret_key
   APP_PASSWORD=your_google_app_password
   ADMIN_EMAIL=admin@example.com
   ```

4. **Create an `uploads/` folder** in the `api/` directory:
   ```bash
   mkdir uploads
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

### Environment Variables

#### Backend (.env)
- `DB_NAME`: MongoDB database name
- `MONGODB_URI`: MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
- `SESSION_SECRET`: Secret key for session management (use a strong random string)
- `APP_PASSWORD`: Google App Password for Nodemailer (see instructions below)
- `ADMIN_EMAIL`: Admin user email address (typically a Gmail address)

#### Frontend (.env.local)
- `VITE_API_BASE_URL`: Backend API URL (default: `http://localhost:3000`)

### How to Create a Google App Password

The application uses Nodemailer to send emails. To do this, you need a Google App Password:

1. **Enable 2-Step Verification**:
   - Go to your [Google Account](https://myaccount.google.com/)
   - Click on **Security** in the left sidebar
   - Enable **2-Step Verification** if not already enabled

2. **Generate App Password**:
   - Go to your [Google Account Security settings](https://myaccount.google.com/security)
   - Scroll to **App passwords** (only appears if 2-Step Verification is enabled)
   - Select **Mail** and **Windows Computer** (or your device type)
   - Click **Generate**
   - Google will display a 16-character password

3. **Copy and Use**:
   - Copy the 16-character password shown
   - Paste it as the `APP_PASSWORD` value in your `.env` file
   - **Do not share this password** - treat it like a secret key

Example:
```
APP_PASSWORD=abcd efgh ijkl mnop
```

## Running the Application

1. Start the backend server (from `api/` directory):
   ```bash
   npm run dev
   ```

2. In another terminal, start the frontend (from root directory):
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server

## Contributing

Contributions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests with improvements
- Suggest enhancements

## License

This project is licensed under the ISC License.

## Support

For issues or questions, please open an issue on the GitHub repository.