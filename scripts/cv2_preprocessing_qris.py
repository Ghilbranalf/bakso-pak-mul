import cv2
import numpy as np
from pyzbar.pyzbar import decode

def try_decode(img, name):
    # Try OpenCV QRCodeDetector
    detector = cv2.QRCodeDetector()
    val, _, _ = detector.detectAndDecode(img)
    if val:
        print(f"SUCCESS [{name} - OpenCV]:", val)
        return True

    # Try PyZBar
    decoded = decode(img)
    if decoded:
        for d in decoded:
            print(f"SUCCESS [{name} - PyZBar]:", d.data.decode('utf-8'))
            return True
    return False

def main():
    img_path = r'C:\Users\user\.gemini\antigravity-ide\brain\e7c05660-7d62-41d8-90b2-acbc02cbacb0\media__1785566581289.jpg'
    original = cv2.imread(img_path)
    if original is None:
        print("Image not found")
        return

    # Try original
    if try_decode(original, "Original"): return

    # Gray
    gray = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)
    if try_decode(gray, "Gray"): return

    # Bilateral filter & CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    cl1 = clahe.apply(gray)
    if try_decode(cl1, "CLAHE"): return

    # Thresholding variations
    _, thresh1 = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    if try_decode(thresh1, "BinaryThresh"): return

    adaptive = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    if try_decode(adaptive, "AdaptiveThresh"): return

    # Scaled 2x, 3x
    scaled_2x = cv2.resize(gray, (0,0), fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    if try_decode(scaled_2x, "Scaled2x"): return

    scaled_3x = cv2.resize(gray, (0,0), fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
    if try_decode(scaled_3x, "Scaled3x"): return

    print("Finished all cv2 preprocessing attempts.")

if __name__ == "__main__":
    main()
