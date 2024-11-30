MAIN_STYLE = """
QMainWindow {
    background-color: #2c3e50;
}

QLabel {
    color: #ecf0f1;
    font-family: 'Segoe UI', Arial, sans-serif;
}

QProgressBar {
    border: 2px solid #16a085;
    border-radius: 5px;
    text-align: center;
    background-color: #2c3e50;
    color: white;
    font-weight: bold;
}

QProgressBar::chunk {
    background-color: #1abc9c;
    border-radius: 3px;
}

.title-label {
    font-size: 24px;
    font-weight: bold;
    color: #ecf0f1;
    padding: 10px;
}

.info-panel {
    background-color: rgba(44, 62, 80, 0.9);
    border-radius: 10px;
    padding: 15px;
    margin: 10px;
}

.gesture-view {
    border: 3px solid #1abc9c;
    border-radius: 10px;
    padding: 5px;
    background-color: #34495e;
}

.current-gesture {
    font-size: 18px;
    font-weight: bold;
    color: #1abc9c;
}
"""

WELCOME_MESSAGE = """
<div style="background-color: rgba(44, 62, 80, 0.95); padding: 20px; border-radius: 15px; max-width: 600px;">
    <h2 style="color: #1abc9c; text-align: center; margin-bottom: 20px;">Welcome to Virtual Street Explorer</h2>
    
    <p style="color: #ecf0f1; font-size: 16px; line-height: 1.6;">
        Experience an immersive street-level navigation using hand gestures! 
        Follow these simple steps:
    </p>
    
    <ol style="color: #ecf0f1; font-size: 16px; line-height: 1.8;">
        <li>Click anywhere on the map to set your destination</li>
        <li>Use hand gestures to navigate through the streets</li>
        <li>Follow the progress bar to track your journey</li>
    </ol>
    
    <div style="margin-top: 20px; padding: 15px; background-color: rgba(26, 188, 156, 0.1); border-radius: 10px;">
        <p style="color: #1abc9c; font-weight: bold; margin-bottom: 10px;">Tips:</p>
        <ul style="color: #ecf0f1; list-style-type: none; padding-left: 0;">
            <li>✨ Make gestures clear and deliberate</li>
            <li>✨ Keep your hand within the camera frame</li>
            <li>✨ Maintain good lighting conditions</li>
        </ul>
    </div>
</div>
""" 