# Image-Manipulation
Using Javascript to manipulate images

### Version 1.2.8

This program has a base class to import images and get data.

The first sub class ReduceColors does just that.

The first feature I added was an algorithm that finds the nearest color.
It counts colors of surrounding pixels and uses the most common.

Features:
* Nearest Pixel - Makes a sort of brush blot effect ( might adapt this to brush stroke )
* Grey Scale
* Color Reduction
* Floyd-Steinberg Dithering

Features I plan to add:
* Blur
* Gaussian Blur
* Smear
* Swirl
* Pinch and Punch
* Directional Texturing
* More as I think of them

As of version 1.2.8 It's possible to chain effects together

```javascript
test.load(['images/cat.jpg'])
.then(function(e){
	test.draw(i,e[0].img)
	test.getData(i)
	test.nearestPixel({
			i:j,
			l:N,
			ctx:test._ctx
	})
	.grayScale({
		f:10
	})
	.drawBuffer(test._imgdata,j)
})
```
**04/03/2019** - Added Method Chaining or Factory Functions

**04/02/2019** - Added Floyd-Steinberg Dithering: https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering

**04/01/2019** - Optimized the render process by utilizing the output buffer once operations were complete instead of updating the current pixel in each part of the loop. This is much faster and only uses about 10MB versus 40MB+ the old way.

**04/01/2019** - Added Grey Scale and reduce color effects

![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/impressionism-redlands-trainstation.jpg "Nearest Pixel")

![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/cat-grayscale.jpg "Grey Scale")

![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/fs-dithering.png "Floyd-Steinberg Dithering")

![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/mary-dithering-w-greyscale.png "Floyd-Steinberg Dithering")



