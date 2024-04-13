# Image-Manipulation

Using Javascript to manipulate images

### Version 3.0.0
 - :cat: ASCII art ability added. Converts image to ASCII characters
 - :cat: Converted to TypeScript
 - :cat: Actual base class to tie every subclass together and make things easier
 - :cat: **loopPixels2** is faster and easier to understand than **loopPixels**
 - :cat: Font ability to convert an image to ASCII ... this is still in development. There are two versions. The HTML version works quite well. The version that writes to canvas looks great at a 1 to 1 with the resolution set to 1px but any larger and it gets distorted.

### Version 2.0.1
This program has a base class to import images and get data.
#### Note: This uses import and therefore needs to be run in a server environment or you will get a CORS error
The first sub class ReduceColors does just that.
The first feature I added was an algorithm that finds the nearest color.
It counts colors of surrounding pixels and uses the most common.
Features:
* Nearest Pixel - Makes a sort of brush blot effect ( might adapt this to brush stroke )
* Grey Scale
* Color Reduction
* Floyd-Steinberg Dithering

Features I plan to add:

* ASCII art
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
		.then(function(images){
			test.draw(i,images[0].img)
				.getData(i)
				.nearestPixel(i,15)
				.greyScale(3)
				.FSDither(10)
					.drawBuffer(j)
						.done("#message',"I'm done...")

		})

```

**06/08/2023** - Paths weren't correct for nested folder

  

**04/03/2019** - Spread code out over multiple files

  

**04/03/2019** - remove need to call context in drawBuffer

  

**04/03/2019** - remove need to include context when calling nearestPixel

  

**04/03/2019** - Added Method Chaining or Factory Functions

  

**04/02/2019** - Added Floyd-Steinberg Dithering: https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering

  

**04/01/2019** - Optimized the render process by utilizing the output buffer once operations were complete instead of updating the current pixel in each part of the loop. This is much faster and only uses about 10MB versus 40MB+ the old way.


**04/01/2019** - Added Grey Scale and reduce color effects


![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/impressionism-redlands-trainstation.jpg  "Nearest Pixel")


![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/cat-grayscale.jpg  "Grey Scale")


![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/fs-dithering.png  "Floyd-Steinberg Dithering")


![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/mary-dithering-w-greyscale.png  "Floyd-Steinberg Dithering")