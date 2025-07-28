# Angular Todo Application

A comprehensive todo application built with Angular 19, featuring user authentication, task management, and modern UI design with Angular Material.

## Features

### Core Functionality
- **User Authentication**
  - User registration with form validation
  - User login with email and password
  - Secure logout functionality
  - Authentication guards protecting routes

- **Task Management**
  - Add new tasks with title, description, and due date
  - Mark tasks as completed/pending
  - Delete tasks with confirmation
  - View tasks in separate completed and pending sections

### Advanced Features (Bonus)
- **Search Functionality**: Search tasks by title or description
- **Filtering**: Filter tasks by All, Completed, or Pending status
- **Due Date Management**: Add due dates to tasks and sort by due date
- **Overdue Indicators**: Visual indicators for overdue tasks
- **Task Statistics**: Dashboard showing total, pending, and completed task counts

### Technical Features
- **Reactive Forms**: Form validation with real-time error messages
- **Angular Material UI**: Professional and responsive design
- **Local Storage**: Data persistence using browser local storage
- **Routing**: Protected routes with authentication guards
- **Responsive Design**: Mobile-friendly interface
- **TypeScript**: Full type safety and modern JavaScript features

## Technology Stack

- **Frontend Framework**: Angular 19
- **UI Library**: Angular Material
- **Styling**: SCSS with custom themes
- **Forms**: Reactive Forms with validation
- **Routing**: Angular Router with guards
- **State Management**: RxJS Observables and Services
- **Data Storage**: Browser Local Storage
- **Build Tool**: Angular CLI with esbuild

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/           # Login component
│   │   ├── signup/          # Registration component
│   │   └── todo/            # Todo list component
│   ├── services/
│   │   ├── auth.ts          # Authentication service
│   │   └── task.ts          # Task management service
│   ├── models/
│   │   ├── user.model.ts    # User interfaces
│   │   └── task.model.ts    # Task interfaces
│   ├── guards/
│   │   └── auth-guard.ts    # Route protection
│   ├── app.routes.ts        # Application routing
│   ├── app.config.ts        # App configuration
│   ├── app.component.*      # Root component
│   └── main.ts              # Application bootstrap
├── styles.scss              # Global styles
└── index.html               # Main HTML file
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (version 19 or higher)

## Installation

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd angular-todo-app
   
   # Or extract the ZIP file and navigate to the project directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally** (if not already installed)
   ```bash
   npm install -g @angular/cli
   ```

## Running the Application

### Development Server

1. **Start the development server**
   ```bash
   ng serve
   ```

2. **Open your browser** and navigate to `http://localhost:4200`

3. **The application will automatically reload** when you make changes to the source files

### Production Build

1. **Build the application for production**
   ```bash
   ng build
   ```

2. **The build artifacts will be stored in the `dist/` directory**

3. **Serve the production build** (optional)
   ```bash
   # Using a simple HTTP server
   npx http-server dist/angular-todo-app
   ```

## Usage Guide

### Getting Started

1. **Registration**
   - Navigate to the signup page
   - Fill in your full name, email, and password
   - Confirm your password
   - Click "Sign Up" to create your account

2. **Login**
   - Enter your email and password
   - Click "Login" to access the todo application

3. **Managing Tasks**
   - Add new tasks using the form at the top
   - Click the checkbox to mark tasks as completed
   - Use the delete button to remove tasks
   - Search for tasks using the search bar
   - Filter tasks by status (All/Completed/Pending)
   - Sort tasks by due date using the sort button

### Form Validations

#### Signup Form
- **Full Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters
- **Confirm Password**: Required, must match password

#### Login Form
- **Email**: Required, valid email format
- **Password**: Required

#### Task Form
- **Title**: Required, cannot be empty
- **Description**: Optional
- **Due Date**: Optional

### Data Storage

- All user data and tasks are stored in the browser's local storage
- Data persists between browser sessions
- Each user's tasks are isolated and secure
- Clearing browser data will remove all stored information

## Development

### Code Structure

The application follows Angular best practices:

- **Modular Architecture**: Components, services, and models are organized in separate directories
- **Reactive Programming**: Uses RxJS Observables for state management
- **Type Safety**: Full TypeScript implementation with interfaces
- **Separation of Concerns**: Business logic in services, UI logic in components

### Key Services

#### AuthService
- Manages user authentication state
- Handles login, logout, and registration
- Provides authentication status observables
- Stores user data securely

#### TaskService
- Manages task CRUD operations
- Provides task filtering and searching
- Handles data persistence
- Maintains task state with observables

### Styling

- Uses Angular Material's Azure/Blue theme
- Custom SCSS for component-specific styles
- Responsive design for mobile and desktop
- Consistent color scheme and typography

## Browser Compatibility

This application is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Issues

- Bundle size warning: The application bundle exceeds the default budget due to Angular Material components
- This is normal for development and can be optimized for production if needed

## Future Enhancements

Potential improvements for the application:

- **Backend Integration**: Replace local storage with a real backend API
- **User Profiles**: Add user profile management and settings
- **Task Categories**: Organize tasks into categories or projects
- **Collaboration**: Share tasks with other users
- **Notifications**: Email or push notifications for due dates
- **Data Export**: Export tasks to CSV or other formats
- **Dark Mode**: Theme switching capability
- **Offline Support**: Progressive Web App (PWA) features

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes and is provided as-is.

## Support

For technical issues or questions:
- Check the browser console for error messages
- Ensure all dependencies are properly installed
- Verify that the Angular CLI version is compatible
- Clear browser cache and local storage if experiencing data issues

---

**Built with ❤️ using Angular and Angular Material**

