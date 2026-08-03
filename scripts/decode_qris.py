import cv2
from pyzbar.pyzbar import decode
from PIL import Image

def main():
    img_path = r'C:\Users\user\.gemini\antigravity-ide\brain\e7c05660-7d62-41d8-90b2-acbc02cbacb0\media__1785566581289.jpg'
    img = cv2.imread(img_path)
    
    # 1. Try OpenCV QRCodeDetector
    detector = cv2.QRCodeDetector()
    val, points, straight_qrcode = detector.detectAndDecode(img)
    if val:
        print("==========================================")
        print("SUCCESS_OPENCV:", val)
        print("==========================================")
        return

    # 2. Try PyZbar
    decoded = decode(Image.open(img_path))
    if decoded:
        for obj in decoded:
            print("==========================================")
            print("SUCCESS_PYZBAR:", obj.data.decode("utf-8"))
            print("==========================================")
            return

    # 3. Try rotating 90, 180, 270
    for angle in [cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_180, cv2.ROTATE_90_COUNTERCLOCKWISE]:
        rotated = cv2.rotate(img, angle)
        val, _, _ = detector.detectAndDecode(rotated)
        if val:
            print("==========================================")
            print("SUCCESS_ROTATED:", val)
            print("==========================================")
            return
        
        d_rot = decode(rotated)
        if d_rot:
            for obj in d_rot:
                print("==========================================")
                print("SUCCESS_PYZBAR_ROTATED:", obj.data.decode("utf-8"))
                print("==========================================")
                return

    print("FAILED_TO_DECODE_ALL")

if __name__ == "__main__":
    main()
