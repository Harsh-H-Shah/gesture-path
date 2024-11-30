# Virtual Street Explorer with Gesture Control

## Overview

Virtual Street Explorer is an interactive application that combines Google Street View navigation with gesture-based controls, creating an immersive and hands-free way to explore streets and locations. The application is built using PyQt5 and integrates Google Maps APIs to provide a seamless virtual navigation experience.

## Motivation

Traditional street view navigation requires constant interaction with mouse and keyboard, which can be cumbersome and less intuitive. This project aims to make virtual street exploration more natural and engaging by:

- Enabling gesture-based controls for navigation
- Providing an intuitive interface for route planning
- Creating a more immersive exploration experience
- Making virtual navigation more accessible and interactive

## Features

### 1. Interactive Map Interface

- Click-to-navigate functionality
- Visual route planning
- Real-time position tracking
- Integrated street view availability checking

### 2. Gesture Controls

The application supports the following hand gestures:

- **Two fingers up** → Move Forward
- **Two fingers down** → Move Backward
- **Thumb up** → Look Up
- **Thumb down** → Look Down
- **Thumb left** → Turn Left
- **Thumb right** → Turn Right

### 3. Split View Interface

- Map view for route planning and overview
- Street view for immersive exploration
- Progress tracking for navigation
- Real-time gesture visualization

### 4. Navigation Features

- Route calculation between points
- Progress tracking
- Smooth transitions between positions
- Destination arrival notifications

## Technical Implementation

### Core Components

1. **MainWindow** (`main.py`)

   - Manages the main application interface
   - Handles gesture recognition integration
   - Controls camera feed processing

2. **StreetView** (`street_view.py`)

   - Implements Google Street View integration
   - Handles navigation controls
   - Manages route progression

3. **GestureRecognizer** (`gesture_recognizer.py`)

   - Processes camera input
   - Recognizes hand gestures
   - Translates gestures to navigation commands

4. **MapView** (`map_view.py`)
   - Provides interactive map interface
   - Handles destination selection
   - Manages route visualization

## Setup and Usage

### Prerequisites

- Python 3.7+
- Webcam or camera device
- Google Maps API key

### Required Libraries

````

### Configuration
1. Create a `config.py` file with your Google Maps API key:
```python
GOOGLE_MAPS_API_KEY = "your_api_key_here"
WINDOW_TITLE = "Virtual Street Explorer"
WINDOW_SIZE = (1280, 720)
````

### Running the Application

1. Navigate to the project directory
2. Run the main application:

```bash
python kiosk/main.py
```

### Using the Application

1. **Select Destination**

   - Click any point on the map
   - The application will find the nearest street view location
   - A route will be automatically calculated

2. **Navigate**

   - Use the supported hand gestures to move and look around
   - The gesture view panel shows your current hand position
   - Progress bar indicates your position along the route

3. **Track Progress**
   - Monitor your progress on the map
   - Follow the highlighted route
   - Receive notification upon reaching destination

## Future Enhancements

- Additional gesture controls for advanced navigation
- Multi-language support
- Custom route planning
- Virtual reality integration
- Improved gesture recognition accuracy
- Support for multiple simultaneous users

## Contributing

Contributions are welcome! Please feel free to submit pull requests, report bugs, or suggest new features.
