import sys
import base64
import cv2
import numpy as np
import warnings
warnings.filterwarnings('ignore')

face_cascade = cv2.CascadeClassifier('AI_smart_stopwatch/python/haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('AI_smart_stopwatch/python/haarcascade_eye.xml')

inputs = sys.stdin.read()
binary_arry = base64.b64decode(inputs)
binary_np = np.frombuffer(binary_arry, dtype=np.uint8)
img_np = cv2.imdecode(binary_np, cv2.IMREAD_ANYCOLOR)
gray = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)

face, eye = 0,0
faces = face_cascade.detectMultiScale(gray, 1.03, 10)
if faces !=():
    face=1
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y + h//2, x:x + w]
        eyes=eye_cascade.detectMultiScale(roi_gray, 1.05, 10)
        if eyes !=():
            eye=1

print(face*2+eye)
