# VeroPest Suite Frontend

A modern React-based frontend for the VeroPest Suite, a comprehensive pest control management system.

## 🚀 Features

- **Multi-tenant Architecture**: Secure tenant isolation with Row Level Security (RLS)
- **Real-time Dashboard**: Interactive charts and metrics
- **Job Management**: Calendar-based scheduling with drag-and-drop
- **Customer Management**: Complete CRM functionality
- **Mobile Responsive**: Optimized for desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Lucide React icons

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Charts**: Recharts
- **Calendar**: FullCalendar
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VeroField/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_APP_NAME=VeroPest Suite
   VITE_ENABLE_ANALYTICS=false
   VITE_ENABLE_DEBUG_MODE=false
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── routes/             # Page components and routing
├── stores/             # Zustand state management
├── lib/                # API clients and utilities
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── ui/                 # Basic UI components
└── components/dashboard/ # Dashboard-specific components
```

## 🔐 Authentication

The application uses Supabase Auth with JWT tokens. Users must provide:
- Email address
- Password
- Tenant ID (for multi-tenant isolation)

## 🎨 Customization

### Branding
- Logo: Place your logo in `public/branding/`
- Colors: Modify Tailwind config in `tailwind.config.js`
- Theme: Update CSS variables in `src/index.css`

### Styling
- Primary color: Purple (#8b5cf6)
- Secondary color: Gray (#6b7280)
- Accent color: Pink (#ec4899)

## 📱 Mobile Support

The application is fully responsive and includes:
- Touch-friendly interfaces
- Mobile-optimized navigation
- Responsive data tables
- Mobile calendar views

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## 🏭 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔍 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
```

## 🐛 Debugging

Enable debug mode by setting `VITE_ENABLE_DEBUG_MODE=true` in your `.env` file.

## 📊 Performance

- Code splitting with React.lazy()
- Optimized bundle size
- Lazy loading of components
- Efficient state management

## 🔒 Security

- Environment variable validation
- Input sanitization
- XSS protection
- CSRF protection via Supabase
- Secure authentication flow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

## 🔄 Changelog

### v1.0.0
- Initial release
- Multi-tenant architecture
- Job management system
- Customer management
- Dashboard with analytics