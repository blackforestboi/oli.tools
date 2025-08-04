# Oli.Tools Web App

A modern React + TypeScript + Vite web application with styled-components and interactive image functionality.

## Features

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Styled Components** for CSS-in-JS styling
- **ESLint** for code quality
- **Hot Module Replacement (HMR)** for fast development
- **Interactive Image System** with hover areas
- **Admin Dashboard** for drawing and managing hover areas

## Interactive Image Features

### Main Image Display

- Full-screen image display with responsive sizing
- Invisible hover areas that maintain relative positioning
- Tooltip display on hover
- Click handling for interactive areas

### Admin Dashboard

- Visual rectangle drawing tool
- Real-time area management
- JSON export functionality
- Area labeling and editing
- Live preview of hover areas

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Using the Interactive Image

1. **View Mode**: The main image displays with any configured hover areas
2. **Admin Mode**: Click the "Admin Dashboard" button to enter drawing mode
3. **Drawing Areas**:
   - Click and drag to draw rectangles
   - Areas are automatically saved as percentages for responsive positioning
   - Use the sidebar to edit labels and manage areas
4. **Export**: Use the "Export JSON" button to copy area definitions to clipboard
5. **Save**: Areas are automatically saved when you close the admin dashboard

### Adding Hover Areas to Constants

1. Use the admin dashboard to draw your areas
2. Export the JSON using the "Export JSON" button
3. Copy the JSON into `src/constants/hoverAreas.ts`
4. The areas will be loaded automatically on app restart

## Building

Build the app for production:

```bash
npm run build
```

The built files will be in the `build` directory.

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── App.tsx                    # Main app component
├── main.tsx                   # App entry point
├── components/
│   ├── InteractiveImage.tsx   # Interactive image component
│   └── AdminDashboard.tsx     # Admin drawing dashboard
├── constants/
│   └── hoverAreas.ts         # Hover area definitions
├── features/                  # Feature components
├── hooks/                     # Custom React hooks
├── services/                  # Application services
├── storage/                   # Storage utilities
├── utils/                     # Utility functions
└── assets/                    # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **ESLint** - Code linting

## Image Requirements

Place your main image as `public/main_image.png` to use it with the interactive system.
