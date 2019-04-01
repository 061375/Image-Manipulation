# Image-Manipulation
Using Javascript to manipulate images

This program has a base class to import images and get data.

The first sub class ReduceColors does just that.

The first feature I added was an algorithm that finds the nearest color.
It counts colors of surrounding pixels and uses the most common.

I plan to add reduce color and dithering soon.

04/01/2019 - Optimized the render process by utilizing the output buffer once operations were complete instead of updating the current pixel in each part of the loop. This is much faster and only uses about 10MB versus 40+ the old way.

![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/impressionism-redlands-trainstation.jpg "Nearest Pixel")




