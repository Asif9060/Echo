# Entertainment Hub - Admin Panel

A comprehensive entertainment content management system with MongoDB integration, featuring a modern React frontend and robust Node.js/Express backend.

## 🌟 Features

### Admin Authentication

-  ✅ Secure login system with JWT tokens
-  ✅ Session management
-  ✅ Role-based access control (admin/super_admin)
-  ✅ Password hashing with bcrypt

### Category Management

-  ✅ Full CRUD operations for categories
-  ✅ Category validation and slug generation
-  ✅ Status management (active/inactive)
-  ✅ Search and filtering
-  ✅ Pagination support
-  ✅ Category statistics

### Item Management

-  ✅ Comprehensive item CRUD operations
-  ✅ Rich metadata support (genre, cast, director, etc.)
-  ✅ Image and thumbnail management
-  ✅ Status workflow (draft/active/inactive)
-  ✅ Featured content management
-  ✅ Bulk operations
-  ✅ Advanced search and filtering
-  ✅ Tagging system

### Database & API

-  ✅ MongoDB with Mongoose ODM
-  ✅ RESTful API endpoints
-  ✅ Data validation and sanitization
-  ✅ Error handling and logging
-  ✅ Rate limiting and security
-  ✅ Proper indexing for performance

### Frontend

-  ✅ Modern React with TypeScript
-  ✅ Responsive design with Tailwind CSS
-  ✅ Admin dashboard with statistics
-  ✅ Intuitive navigation and forms
-  ✅ Loading states and error handling
-  ✅ Confirmation dialogs for destructive actions

## 🚀 Getting Started

### Prerequisites

-  Node.js 18+
-  MongoDB (local or Atlas)
-  npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd doingSomething
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

4. **Setup environment variables**

   ```bash
   # In the server directory
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/entertainment-hub
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ADMIN_USERNAME=admin
   ```

5. **Initialize the database**

   ```bash
   # In the server directory
   npm run init-db
   ```

6. **Start the development servers**

   Terminal 1 (Backend):

   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):

   ```bash
   npm run dev
   ```

### Access Points

-  **Frontend**: https://echo-eight-ruddy.vercel.app/
-  **Admin Panel**: https://echo-eight-ruddy.vercel.app/admin
-  **Backend API**: https://echo-server-alhh.onrender.com/api
-  **Health Check**: https://echo-server-alhh.onrender.com/health

### Default Admin Credentials

-  **Email**: admin@example.com
-  **Password**: admin123

## 📁 Project Structure

```
doingSomething/
├── src/                          # Frontend React app
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Public pages
│   ├── admin/                   # Admin panel
│   │   ├── components/         # Admin components
│   │   ├── pages/              # Admin pages
│   │   └── api.ts              # API functions
│   └── App.jsx                 # Main app component
├── server/                      # Backend Node.js app
│   ├── src/
│   │   ├── config/             # Database configuration
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── scripts/            # Utility scripts
│   │   ├── utils/              # Helper utilities
│   │   └── app.ts              # Express app
│   ├── uploads/                # File upload directory
│   └── .env.example           # Environment template
└── README.md
```

## 🔧 API Endpoints

### Authentication

-  `POST /api/auth/login` - Admin login
-  `POST /api/auth/logout` - Admin logout
-  `GET /api/auth/profile` - Get admin profile
-  `PUT /api/auth/profile` - Update admin profile
-  `PUT /api/auth/change-password` - Change password
-  `POST /api/auth/register` - Create new admin (super_admin only)

### Categories

-  `GET /api/categories` - Get all categories (with pagination)
-  `GET /api/categories/:id` - Get single category
-  `POST /api/categories` - Create category
-  `PUT /api/categories/:id` - Update category
-  `DELETE /api/categories/:id` - Delete category
-  `GET /api/categories/stats` - Get category statistics

### Items

-  `GET /api/items` - Get all items (with filters)
-  `GET /api/items/:id` - Get single item
-  `POST /api/items` - Create item
-  `PUT /api/items/:id` - Update item
-  `DELETE /api/items/:id` - Delete item
-  `DELETE /api/items` - Bulk delete items
-  `PATCH /api/items/:id/status` - Update item status
-  `GET /api/items/stats` - Get item statistics

## 🛡️ Security Features

-  JWT-based authentication
-  Password hashing with bcrypt
-  Rate limiting on API endpoints
-  CORS protection
-  Helmet.js security headers
-  Input validation and sanitization
-  SQL injection prevention
-  XSS protection

## 🎨 Frontend Features

-  Modern React with hooks
-  TypeScript support
-  Tailwind CSS for styling
-  Responsive design
-  Loading states and error handling
-  Form validation
-  Confirmation dialogs
-  Search and filtering
-  Pagination
-  Bulk operations

## 📊 Database Schema

### Admin Model

```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'super_admin',
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Category Model

```javascript
{
  name: String,
  slug: String (unique),
  description: String,
  icon: String,
  gradient: String,
  status: 'active' | 'inactive',
  sortOrder: Number,
  itemCount: Number,
  timestamps: true
}
```

### Item Model

```javascript
{
  title: String,
  slug: String (unique),
  description: String,
  category: ObjectId (ref: Category),
  images: [String],
  thumbnail: String,
  status: 'active' | 'inactive' | 'draft',
  featured: Boolean,
  rating: Number,
  tags: [String],
  metadata: {
    genre: [String],
    releaseDate: Date,
    duration: String,
    language: String,
    country: String,
    director: String,
    cast: [String]
  },
  viewCount: Number,
  sortOrder: Number,
  createdBy: ObjectId (ref: Admin),
  timestamps: true
}
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/entertainment-hub
JWT_SECRET=super-secure-production-secret
FRONTEND_URL=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please email admin@entertainmenthub.com or create an issue in the repository.

---

Made with ❤️ for content creators and entertainment enthusiasts.
