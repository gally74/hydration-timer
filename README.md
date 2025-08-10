# 💧 Hydration Timer

A Progressive Web App (PWA) designed to help indoor cyclists stay hydrated during their workouts. Perfect for Zwift, Rouvy, and other indoor cycling platforms.

## 🚀 Features

- **Smart Hydration Reminders**: Automatically calculates optimal drink intervals based on workout duration
- **Workout Timer**: Countdown timer with pause/resume functionality
- **Water Tracking**: Visual water bottle that shows remaining water
- **Creatine Monitoring**: Tracks creatine intake based on water consumption
- **Mobile Optimized**: Designed specifically for iPhone and iPad
- **Offline Support**: Works without internet connection
- **Push Notifications**: Get drink reminders even when the app is in the background
- **Audio & Haptic Feedback**: Sound alerts and vibration for drink reminders

## 🎯 How It Works

1. **Setup**: Enter your planned workout duration, water amount, and creatine dosage
2. **Smart Calculation**: The app automatically determines when you should drink based on workout length:
   - 30min or less: Every 10 minutes
   - 31-60min: Every 12 minutes  
   - 60+ minutes: Every 15 minutes
3. **Active Tracking**: During your workout, get timely reminders to drink
4. **Progress Monitoring**: See your water consumption and workout progress in real-time
5. **Results**: Get a summary of your hydration and creatine intake

## 📱 Mobile Features

- **iOS Optimized**: Touch-friendly interface with iOS-specific enhancements
- **PWA Support**: Can be installed as a home screen app
- **Dark Mode**: Automatically adapts to your device's theme
- **Responsive Design**: Works perfectly on all screen sizes
- **Haptic Feedback**: Vibration alerts for drink reminders

## 🛠️ Setup & Installation

### Option 1: Host on GitHub Pages (Recommended)

1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to "GitHub Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
3. **Wait for deployment** (usually takes a few minutes)
4. **Access your app** at `https://yourusername.github.io/repository-name`

### Option 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/hydration-timer.git
   cd hydration-timer
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     ```

3. **Access at** `http://localhost:8000`

## 📁 File Structure

```
hydration-timer/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── app.js             # JavaScript functionality
├── manifest.json      # PWA manifest
├── sw.js             # Service worker for offline support
├── README.md          # This file
└── icons/            # App icons (you'll need to add these)
    ├── icon-192.png  # 192x192 icon
    └── icon-512.png  # 512x512 icon
```

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
}
```

### Modifying Drink Intervals
Edit the `calculateDrinkIntervals()` method in `app.js`:
```javascript
// Adjust these values to change drink frequency
if (this.workoutDuration <= 30) {
    intervalMinutes = 10; // Every 10 minutes
} else if (this.workoutDuration <= 60) {
    intervalMinutes = 12; // Every 12 minutes
} else {
    intervalMinutes = 15; // Every 15 minutes
}
```

### Adding New Features
The app is built with a modular class structure, making it easy to add new features like:
- Workout history tracking
- Custom drink schedules
- Integration with fitness apps
- Social sharing

## 🔧 Browser Support

- **Chrome**: Full support
- **Safari**: Full support (iOS/macOS)
- **Firefox**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Optimized for iOS Safari and Chrome Mobile

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline**: Works without internet connection
- **Background Sync**: Notifications work even when app is closed
- **App-like Experience**: Full-screen mode and native feel

## 🚨 Troubleshooting

### Notifications Not Working
- Ensure you've granted notification permissions
- Check that your browser supports notifications
- Try refreshing the page and re-enabling notifications

### Audio Not Playing
- Some browsers require user interaction before playing audio
- Check your device's volume settings
- Try clicking the "Start Workout" button first

### App Not Installing
- Make sure you're using a supported browser
- Check that the manifest.json file is accessible
- Try clearing browser cache and cookies

## 🤝 Contributing

Feel free to contribute to this project! Some ideas:
- Add workout templates for different cycling disciplines
- Implement data export/import functionality
- Add integration with popular fitness platforms
- Create different themes and color schemes

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built for the indoor cycling community
- Inspired by the need for better hydration during virtual rides
- Special thanks to Zwift, Rouvy, and other indoor cycling platforms

---

**Happy cycling and stay hydrated! 💧🚴‍♂️**

*Perfect for your Dublin to Cork virtual rides, or those intense sessions on the Wicklow Mountains!*
