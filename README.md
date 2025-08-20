# Professional Portfolio Website

A modern, bilingual (Arabic/English) portfolio website built with Vite (React), React Router, TailwindCSS, and an optional Express backend. Features include dark/light theme support, authentication, admin dashboard, and analytics tracking.

## 🚀 Features

- **Bilingual Support**: Full Arabic and English localization with RTL/LTR support
- **Theme Toggle**: Dark and light mode with smooth transitions
- **Authentication**: JWT-based login system with role-based access
- **Admin Dashboard**: Complete admin panel for content and user management
- **Analytics**: Project view tracking and user session analytics
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Animations**: Smooth CSS animations and transitions
- **Contact Form**: Functional contact form with validation
- **Project Showcase**: Detailed project modals with authentication gates

## 🛠️ Tech Stack

### Frontend
- **Vite + React** - Fast dev server and build tool
- **React Router** - Client-side routing
- **TypeScript (optional)** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **React Context** - State management for theme, language, and auth
- **React Toastify** - Toast notifications
- **Lucide React** - Modern icon library

### Backend (optional)
- **Express (Node.js)** - REST API service (see `backend/`)
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **MongoDB via Mongoose** (configurable)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server (frontend)**
   ```bash
   npm run dev
   ```

4. **Backend (optional)**
   ```bash
   cd backend && npm install && npm start
   ```

5. **Open your browser**
   Frontend: http://localhost:5173  |  Backend: http://localhost:5000 (default)

## 🔐 Authentication

### Demo Credentials
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

### Features
- JWT-based authentication
- Role-based access control (admin/user)
- Persistent login sessions
- Secure password hashing

## 🎨 Customization

### Colors
The website uses a navy blue and light blue color scheme defined in CSS variables:
- Primary Navy: `#001F3F`
- Light Blue: `#7FDBFF`

### Fonts
- **English**: Inter font family
- **Arabic**: Cairo font family

### Content
Update the following files to customize content:
- `src/contexts/LanguageContext.jsx` and `src/utils/translations.js` - i18n
- `src/components/sections/about.tsx` (or `src/components/About.jsx`) - About section content
- `src/components/Projects.jsx` - Projects data/view

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🌐 Deployment

- Static site (Vite build): set Publish Directory to `dist` and Build Command to `npm run build` (Render/Netlify/etc.)
- Backend (Express): deploy `backend/` as a separate web service (Render/Heroku/Railway). Set CORS and `VITE_API_URL` in frontend.

## 🔧 Environment Variables

Required environment variables:

\`\`\`env
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=your-database-connection-string
SMTP_HOST=your-smtp-host
SMTP_USER=your-email
SMTP_PASS=your-password
\`\`\`

## 📊 Analytics Integration

The website includes built-in analytics tracking:
- Project view counts
- User session tracking
- Admin dashboard with statistics

For production, integrate with:
- Google Analytics
- Firebase Analytics
- Mixpanel
- Custom analytics solutions

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- XSS protection
- Rate limiting (recommended for production)

## 🚀 Performance

- Vite automatic code splitting and fast HMR
- Tailwind JIT
- Lazy loading for components
- Optimized bundle size

## 📝 API (Express, optional)

Base URL: `${VITE_API_URL}` (e.g., https://your-backend.onrender.com)

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Token verification

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (admin only)

### Analytics
- `POST /api/analytics/project-view` - Track project view
- `GET /api/analytics/project-view` - Get analytics data (admin only)

### Contact
- `POST /api/contact` - Send contact message
- `GET /api/contact` - Get contact messages (admin only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: kh99.wa.bd@gmail.com
- Documentation: [Link to docs]

## 🔄 Updates

The project is actively maintained. Check the changelog for recent updates and new features.

---

Built with ❤️ using Vite, React, and TailwindCSS
