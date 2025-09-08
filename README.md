# Aura - Modern Fashion Shopping App

A beautiful React Native mobile app for fashion shopping, built with TypeScript and Expo. Designed for young women who love chic, trendy, and luxurious shopping experiences.

## 🎨 Design Features

- **Pastel Color Palette**: Soft beige, blush pink, and light lavender for comfort and elegance
- **Accent Colors**: Trendy lavender purple and gold for highlights and CTAs
- **Modern Typography**: Clean, readable sans-serif fonts with elegant hierarchy
- **Smooth Animations**: Lottie animations and React Native Reanimated for fluid interactions

## 🚀 Features

### User Flow

1. **Splash Screen**: Beautiful Lottie animation with pastel background
2. **Authentication**: Login/Signup with form validation
3. **Home Screen**: Add products from external stores (Shein, etc.)
4. **Order Management**: Track orders through status timeline
5. **Admin Panel**: Approve and manage orders (demo implementation)

### Core Functionality

- Add products with link, price, quantity, color, and size
- Real-time order tracking with animated status updates
- User authentication with demo credentials
- Admin approval workflow
- Responsive design with smooth animations

## 🛠 Tech Stack

- **React Native** with TypeScript
- **Expo** for cross-platform development
- **React Navigation** for navigation
- **React Native Reanimated** for animations
- **Lottie** for complex animations
- **React Hook Form** with Yup validation
- **Context API** for state management
- **Linear Gradients** for beautiful backgrounds

## 📱 Getting Started

### Prerequisites

- Node.js (v14 or later)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Aura
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## 🎭 Demo Credentials

### User Account

- **Email**: `sophia@example.com`
- **Password**: Any password (demo mode)

### Admin Account

- **Email**: `admin@aura.com`
- **Password**: Any password (demo mode)

## 📁 Project Structure

```
src/
├── assets/           # Images, animations, fonts
├── components/       # Reusable UI components
├── constants/        # Colors, typography, theme
├── context/          # React Context for state management
├── navigation/       # Navigation configuration
├── screens/          # App screens and pages
├── services/         # API calls and data services
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## 🎯 Key Screens

### 1. Splash Screen

- Animated logo with Lottie
- Pastel gradient background
- Smooth loading animation

### 2. Authentication

- Login and signup forms
- Form validation with Yup
- Animated inputs and buttons

### 3. Home Screen

- Product addition form
- Hero section with call-to-action
- Tips and current order summary

### 4. Orders Screen

- Order history with status badges
- Current cart items
- Track order functionality

### 5. Profile Screen

- User information display
- Settings and preferences
- Logout functionality

## 🎨 Design System

### Colors

- **Primary**: Beige (#F5F1E8), Blush Pink (#F8E8E5), Light Lavender (#F0EBFF)
- **Accent**: Lavender (#A855F7), Gold (#F59E0B)
- **Status**: Success, Warning, Error colors for order tracking

### Typography

- **Headers**: Bold modern sans-serif
- **Body**: Light, readable sans-serif
- **Accent**: Medium weight for important information

### Components

- Rounded corners and soft shadows
- Card-based layouts
- Gradient buttons and backgrounds
- Animated micro-interactions

## 🔄 Order Status Flow

1. **Pending** → Order submitted, awaiting review
2. **Approved** → Admin approved, ready to order
3. **Ordered** → Order placed with supplier
4. **Shipped** → Package in transit
5. **Delivered** → Package delivered

## 🚧 Future Enhancements

- Real payment integration
- Push notifications
- Product image recognition
- Social sharing features
- Wishlist functionality
- Advanced search and filters
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern fashion apps
- Lottie animations from the community
- Icons from Expo Vector Icons
- Beautiful gradients and color palettes

---

Made with 💜 for fashion lovers everywhere
