import cv2 as cv
import numpy as np
import sys


def rotateImage(image, angle):
    image_center = tuple(np.array(image.shape[1::-1]) / 2)
    rot_mat = cv.getRotationMatrix2D(image_center, angle, 1.0)
    result = cv.warpAffine(
        image, rot_mat, image.shape[1::-1], flags=cv.INTER_LINEAR)
    return result


def flipImage(image, flipX, flipY):
    if flipX and flipY:
        return cv.flip(image, -1)
    elif flipX:
        return cv.flip(image, 1)
    elif flipY:
        return cv.flip(image, 0)
    else:
        return image


# Args > filePath outPath selectedWidth selectedHeight startPointX startPointY endPointX endPointY rotateDegrees flipX flipY
if len(sys.argv) != 12:
    print("Usage: filePath outPath selectedWidth selectedHeight startPointX startPointY endPointX endPointY rotateDegrees flipX flipY")
    sys.exit()

filePath = sys.argv[1]
outPath = sys.argv[2]
selectedWidth = int(sys.argv[3])
selectedHeight = int(sys.argv[4])
startPointX = int(sys.argv[5])
startPointY = int(sys.argv[6])
endPointX = int(sys.argv[7])
endPointY = int(sys.argv[8])
rotateDegrees = int(sys.argv[9])
flipX = sys.argv[10] == "true"
flipY = sys.argv[11] == "true"

# print(filePath, outPath, selectedWidth, selectedHeight, startPointX,
#       startPointY, endPointX, endPointY, rotateDegrees, flipX, flipY)


image = cv.imread(filePath)
resized = cv.resize(image, (selectedWidth, selectedHeight),
                    interpolation=cv.INTER_AREA)
cropped = resized[startPointY:endPointY, startPointX:endPointX]

rotated = rotateImage(cropped, -rotateDegrees)
flipped = flipImage(rotated, flipX, flipY)

cv.imwrite(outPath, flipped)
