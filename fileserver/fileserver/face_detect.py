import sys
import numpy as np
import cv2 as cv

face_cascade = cv.CascadeClassifier('haarcascade_face.xml')
img = cv.imread(sys.argv[1])
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

faces = face_cascade.detectMultiScale(gray, 1.3, 5)

outputFile = open("output.data", "w")
for (x,y,w,h) in faces:
	outputFile.write(str(x) + " " + str(y) + " " + str(w) + " " + str(h) + "\n")
	
outputFile.close()