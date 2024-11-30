# kiosk_ui.py

import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl

class KioskUI(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("GesturePath Kiosk")
        self.setGeometry(100, 100, 1024, 768)

        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)

        self.web_view = QWebEngineView()
        layout.addWidget(self.web_view)

        # Load OpenStreetMap
        self.web_view.setUrl(QUrl("https://www.openstreetmap.org/"))

        # Add a button for demonstration
        self.button = QPushButton("Generate QR Code")
        layout.addWidget(self.button)
        # TODO: Connect this button to QR code generation function

    def load_google_maps(self):
        # This method will be implemented later when we integrate Google Maps API
        pass

if __name__ == "__main__":
    app = QApplication(sys.argv)
    kiosk = KioskUI()
    kiosk.show()
    sys.exit(app.exec_())