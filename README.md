# Image-Manipulation
Using Javascript to manipulate images

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
* Smear
* Swirl
* Pinch and Punch
* Directional Texturing
* More as I think of them

It's possible to chain effects together however, not in the normal manner.

**Ideally it should be something like:** 

```javascript 
test.load('image.jpg').effect({params}).anotherEffect({params}).drawBuffer() 
```

But currently it's more clunky:

```javascript
test.load(['images/cat.jpg'])
			.then(function(e){
				test.draw(i,e[0].img)
				test.loopPixels(test.getData(i),[{
					f:test.nearestPixel,
					params:{
						i:j,
						l:N,
						ctx:test._ctx
					}
				},{
					f:test.reduceColor,
					params:{
						f:4
					}
				}]).then(function(p) {
					test.drawBuffer(p,j)
				})
				
			})
```
**04/02/2019** - Added Floyd-Steinberg Dithering: https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering

**04/01/2019** - Optimized the render process by utilizing the output buffer once operations were complete instead of updating the current pixel in each part of the loop. This is much faster and only uses about 10MB versus 40MB+ the old way.

**04/01/2019** - Added Grey Scale and reduce color effects

![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/impressionism-redlands-trainstation.jpg "Nearest Pixel")

![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/cat-grayscale.jpg "Grey Scale")

![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/fs-dithering.png "Floyd-Steinberg Dithering")

![alt text](https://raw.githubusercontent.com/061375/Image-Manipulation/master/images/mary-dithering-w-greyscale.png "Floyd-Steinberg Dithering")



