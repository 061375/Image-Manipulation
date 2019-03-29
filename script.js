'use strict';

export default {}

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
	draw(i,img,w = null,h = null) {
		this.ctx[i].drawImage(img, 0, 0, w, h)
	}
	/** 
	 * @param {Number}
	 * */
	getData(i,w,h) {
		const imgd = this.ctx[i].getImageData(0,0,w,h)
		const pix = imgd.data
		let j, n, x = 0, y = 0, pixels = [[]]
		// Loop over each pixel and set a transparent red.
		for (j = 0; n = pix.length, j < n; j += 4) {
		    pixels[y][x] = [pix[j],pix[j+1],pix[j+2],pix[j+3]];
		    x++;
		    if (x == w) {
			x = 0;
			y++;
			pixels[y] = [];
		    }
		}   
		return pixels;
	}
	/**
	 * loops all the pixels of the image and calls functions to act on the image
	 * @param {Number}
	 * @param {Number}
	 * @param {Array}
	 * @param {Object}
	 * * */
	loopPixels(w,h,p,funcs) {
		let x, y, f
		for (y = 0; y<h;y++) {
			for (x = 0; x<w;x++) {
				for(f = 0; f<funcs.length;f++){
					if (typeof funcs[f].f === 'function') {
						
						funcs[f].f(p,x,y,funcs[f].params)
					}
				}
			}
		}
	}
	get _ctx() {
		return this.ctx
	}
} 

export class ReduceColors extends ImageData {
	constructor() {
		super()
		this.cids = 0
		this.ctx = []
	}
	nearestPixel(p,x,y,params) {
		let c = {},
		    l = params.l,
		    yy,
		    xx,
		    q;
		for(yy=y-l;yy<y+l;yy++) {
			for( xx=x-l;xx<x+l;xx++){
				if (undefined !== p[yy]) {
					if (undefined !== p[yy][xx]) {
						q = p[yy][xx][0]+p[yy][xx][1]+p[yy][xx][2];
						// increment a count of the color of this pixel
						if (c[q] === undefined) {
						    c[q] = {
							c:p[yy][xx],
							i:1
						    };
						}else{
						    c[q].i++;
						}
					}
				}
			}
		}
		// @param {Object}
		let max = {
		    i:0,
		    c:null
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
		params.ctx[params.i].fillStyle=Colors.rgbToHex(max.c[0],max.c[1],max.c[2]);
                params.ctx[params.i].fillRect(x,y,1,1);
	}
}
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
	static random() {
		let c = [];
		for(let i=0; i<3;i++) {
		  c.push(~~(Math.random() * 255));
		}
		return this.rgbToHex(c[0],c[1],c[2]);
	}

}