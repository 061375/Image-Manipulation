'use strict';

export default {}

/** 
 * gets the image data, creates a canvas and addss data to a buffer, then draws data
 * @class ImageData
 * */
export class ImageData {
	/** 
	 * add a canvas to the target
	 * @param {Object} DOM object
	 * @param {Number}
	 * @param {Number}
	 * @returns {Number}
	 * */
	canvas($t,w,h) {

		let cid = this.cids

		let c = document.createElement('canvas');
			c.setAttribute('width',w)
			c.setAttribute('height',h)
			c.setAttribute('id','c'+this.cids)
			c.setAttribute('data-id',this.cids)
		$t.appendChild(c)

		this.cids++;

		this.ctx.push(c.getContext("2d"))

		this.width = w 
		this.height = h

		return cid;
	}
	/**  
	 * load multiple images
	 * @param {Array} list of images 
	 * @todo maybe the Array should be a set
	 * @return {Promise}
	 * */
	load(src) {
		const paths = Array.isArray(src) ? src : [src];
		const promise = [];
		paths.forEach((path) => {
			promise.push(new Promise((resolve, reject) => {
				const img = new Image()
				img.src = path
				img.onload = () => {
					resolve({
						img:img,
						path:path,
						status:'ok'
					})
				}
			}))
		})

		return Promise.all(promise);
	}
	/** 
	 * draw the image to the canvas
	 * @param {Number} the ctx ID
	 * @param {Object} the image object
	 * @param {Number} width
	 * @param {Number} height
	 * */
	draw(i,img) {
		this.ctx[i].drawImage(img, 0, 0, this.width, this.height)
	}
	/** 
	 * @param {Number}
	 * */
	getData(i) {
		const imgd = this.ctx[i].getImageData(0,0,this.width, this.height)
		const pix = imgd.data
		const buffer = imgd.data.buffer
		const sourceBuffer8     = new Uint8ClampedArray(buffer);
		return {
			buffer:sourceBuffer8,
			imgdata:imgd
		}
	}
	/**
	 * loops all the pixels of the image and calls functions to act on the pixel
	 * @param {Number}
	 * @param {Number}
	 * @param {Array}
	 * @param {Object}
	 * * */
	loopPixels(p,funcs) {
		let pr = new Promise((resolve, reject) => {
			let i = 0, j = 0, len = 0, x = 0, y = 0, f
			for(i=0, j=0, len=p.buffer.length / 4; i!=len; i++, j+=4 ) {
				for(f = 0; f<funcs.length;f++){
					if (typeof funcs[f].f === 'function') {
						
						funcs[f].f(p,this.width, this.height,j,funcs[f].params,this)
					}
				}
				x++
				if(x>=this.width) {
					y++
					x=0
				}
			}
			resolve(p)
		})
		return pr
	}
	/** 
	 * @param {Object}
	 * @param {Number}
	 * */
	drawBuffer(p,i) {
		this.ctx[i].putImageData(p.imgdata, 0, 0);
	}
	/** 
	 * @return {Number}
	 * */
	get _ctx() {
		return this.ctx
	}
} 
/** 
 * @class ReduceColors
 * @extends ImageData
 * */
export class ReduceColors extends ImageData {
	constructor() {
		super()
		this.cids = 0
		this.ctx = []
	}
	/** 
	 * @param {Object}
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * @param {Object} parameters
	 * @param {Object} reference the calling class
	 * */
	nearestPixel(p,w,h,j,params,$t) {
		// @var 
		var c = {},
		    l = params.l,
		    yy,
		    xx,
		    xxx = 0,
		    q,
		    pos;
		    // each pixel is 3 colors and opacity ... handle it here
		    w = w * 4
		    // loop
		    for(yy=0;yy<l;yy++) {
			    for(xx=0;xx<(l*2);xx+=4) {
			    	pos = j + (w*yy) + xx
			    	if(undefined !== p.buffer[pos] && undefined !== p.buffer[pos+1] && undefined !== p.buffer[pos+2]) {
			    		q = p.buffer[pos] + p.buffer[pos+1] + p.buffer[pos+2]	
			    		if (c[q] === undefined) {
							c[q] = {
								c:[p.buffer[pos],p.buffer[pos+1],p.buffer[pos+2]],
								i:1
						    };
						}else{
						    c[q].i++;
						}
			    	}
			    	
			    }
			}
			
			// @param {Object}
			let max = {
			    i:0,
			    c:[0,0,0]
			}
			// loop the colors to see which is the most common
			for(let i in c) {
			    if (c.hasOwnProperty(i)) {
					// if this color was found more often than max then replace it
					if(c[i].i > max.i) {
					    max.i = c[i].i
					    max.c = c[i].c;
					}
			    }
			}
			p.buffer[j] = max.c[0]
			p.buffer[j+1] = max.c[1]
			p.buffer[j+2] = max.c[2]
	}
	/** 
	 * Floyd-Steinberg Dithering
	 * @param {Object}
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * @param {Object} parameters
	 * @param {Object} reference the calling class
	 * */
	FSDither(p,w,h,j,params,$t) {
		// each pixel is 3 colors and opacity ... handle it here
		    w = w * 4
		let oldp = p.buffer[j] + p.buffer[j+1] + p.buffer[j+2]
		let newp = (Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255/params.f))) * 3;
		let qerror = oldp - newp

		// r
		if(undefined !== p.buffer[j+4])
			p.buffer[j+4] += qerror   * 7 / 16 
		if(undefined !== p.buffer[p.buffer[j-4+w]])
			p.buffer[j-4+w] += qerror * 3 / 16 
		if(undefined !== p.buffer[j+w])
			p.buffer[j+w] += qerror   * 5 / 16 
		if(undefined !== p.buffer[j+4+w])
			p.buffer[j+4+w] += qerror * 1 / 16
		// g
		if(undefined !== p.buffer[j+1+4])
			p.buffer[j+1+4] += qerror   * 7 / 16 
		if(undefined !== p.buffer[p.buffer[j-4+1+w]])
			p.buffer[j-4+1+w] += qerror * 3 / 16 
		if(undefined !== p.buffer[j+w])
			p.buffer[j+1+w] += qerror   * 5 / 16 
		if(undefined !== p.buffer[j+4+1+w])
			p.buffer[j+4+1+w] += qerror * 1 / 16
		// b
		if(undefined !== p.buffer[j+2+4])
			p.buffer[j+2+4] += qerror   * 7 / 16 
		if(undefined !== p.buffer[p.buffer[j-4+2+w]])
			p.buffer[j-4+2+w] += qerror * 3 / 16 
		if(undefined !== p.buffer[j+2+w])
			p.buffer[j+2+w] += qerror   * 5 / 16 
		if(undefined !== p.buffer[j+4+2+w])
			p.buffer[j+4+2+w] += qerror * 1 / 16
	}
	/** 
	 * @param {Object}
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * @param {Object} parameters
	 * @param {Object} reference the calling class
	 * */
	grayScale(p,w,h,j,params,$t) {
		p.buffer[j] = Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255/params.f))
		p.buffer[j+1] = Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255/params.f))
		p.buffer[j+2] = Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255/params.f))		
	}
	/** 
	 * @param {Object}
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * @param {Object} parameters
	 * @param {Object} reference the calling class
	 * */
	reduceColor(p,w,h,j,params,$t) {
		p.buffer[j] = Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255/params.f))
		p.buffer[j+1] = Math.floor(Math.round(params.f * p.buffer[j+1] / 255) * (255/params.f))
		p.buffer[j+2] = Math.floor(Math.round(params.f * p.buffer[j+2] / 255) * (255/params.f))		
	}
}
/** 
 * @class Colors
 * */
export class Colors {
	/**
	 * returns a color hex value from an integer
	 * @param {Number}
	 *
	 * @returns {String}
	 * */
	static componentToHex(c) {
		c = parseInt(c);
		let hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
	/**
	 * returns a color hex value from an 3 integers
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 *
	 * @returns {String}
	 * */
	static rgbToHex(r, g, b) {
		return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
	}
	/**
	 * returns a random color
	 * @returns {String}
	 * */
	static random(hex = true) {
		let c = [];
		for(let i=0; i<3;i++) {
		  c.push(~~(Math.random() * 255));
		}
		if(hex) {
			return this.rgbToHex(c[0],c[1],c[2])
		}else{
			return c
		}
	}
}