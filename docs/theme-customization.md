# UI Themes and Customization

## Overview

The Visa Bot Admin Dashboard now includes comprehensive theme customization options allowing users to personalize their experience with different color schemes and appearance modes.

## Features Added

### 1. Theme Mode Options

Three theme modes are available:
- **Light Mode**: Bright, clean interface with high contrast
- **Dark Mode**: Reduced eye strain and battery consumption with dark background
- **System Mode**: Automatically matches your operating system's theme preferences

### 2. Color Scheme Options

Six color schemes are available, each affecting the primary colors, buttons, and accents:
- **Blue** (Default): Professional and calm
- **Green**: Fresh and environmental
- **Purple**: Creative and bold
- **Orange**: Energetic and warm
- **Red**: Vibrant and attention-grabbing
- **Slate**: Neutral and corporate

### 3. Interface Options

Additional customization features include:
- **Compact View**: Condense UI elements to fit more content on screen
- **Interface Animations**: Enable/disable UI animations for smoother transitions
- **Large Text**: Increase text size for better readability and accessibility

### 4. Quick Theme Toggle

A convenient theme toggle button has been added to the sidebar, allowing users to quickly switch between light and dark modes without navigating to the settings page.

## Technical Implementation

### Architecture

- **Theme Provider**: A React context provider manages theme state
- **Local Storage**: User preferences are saved to local storage for persistence
- **CSS Variables**: Theme colors are implemented using CSS variables for easy switching
- **Responsive Design**: All theme options are fully responsive on mobile devices

### Dark Mode Implementation

The dark mode implementation uses:
- CSS variables with different values for light and dark themes
- A `.dark` class applied to the HTML element to toggle between themes
- System preference detection via `prefers-color-scheme` media query
- Smooth transitions between themes

### Color Scheme Implementation

Color schemes are implemented using:
- CSS data attributes (`data-color-scheme="blue"`) on the document root
- Separate sets of CSS variables for each color scheme
- Automatic application to all themed components throughout the application
- Appropriate contrast ratios for accessibility in both light and dark modes

## How to Use

1. **Quick Theme Toggle**:
   - Click the sun/moon icon in the sidebar to toggle between light and dark mode

2. **Advanced Customization**:
   - Navigate to Settings > Appearance
   - Choose your preferred theme mode (Light, Dark, System)
   - Select a color scheme from the available options
   - Configure additional interface options as desired

## Future Enhancements

Planned future enhancements include:
- Custom theme creator for advanced users
- Font size and font family options
- High contrast mode for improved accessibility
- Custom sidebar width settings
- Theme export/import functionality
