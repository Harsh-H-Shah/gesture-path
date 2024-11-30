# qr_generator.py

import qrcode
from PyQt5.QtGui import QPixmap
from PyQt5.QtWidgets import QLabel

def generate_qr_code(data):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    return img

def display_qr_code(parent_widget, data):
    qr_image = generate_qr_code(data)
    qr_pixmap = QPixmap.fromImage(qr_image.toqimage())
    qr_label = QLabel(parent_widget)
    qr_label.setPixmap(qr_pixmap)
    parent_widget.layout().addWidget(qr_label)