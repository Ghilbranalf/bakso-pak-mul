import cv2
from qreader import QReader

def main():
    qreader = QReader()
    img_path = r'C:\Users\user\.gemini\antigravity-ide\brain\e7c05660-7d62-41d8-90b2-acbc02cbacb0\media__1785566581289.jpg'
    img = cv2.imread(img_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    decoded_text = qreader.detect_and_decode(image=img_rgb)
    print("==========================================")
    print("SUCCESS_QREADER:", decoded_text)
    print("==========================================")

if __name__ == "__main__":
    main()
