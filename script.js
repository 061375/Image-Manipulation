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
		const buffer = imgd.data.buffer
		//console.log(buffer);
		const sourceBuffer8     = new Uint8ClampedArray(buffer);
		console.log(sourceBuffer8);
		return {
			buffer:sourceBuffer8,
			imgdata:imgd
		}
		/*
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
		*/
	}
	/**
	 * loops all the pixels of the image and calls functions to act on the image
	 * @param {Number}
	 * @param {Number}
	 * @param {Array}
	 * @param {Object}
	 * * */
	loopPixels(w,h,p,funcs) {
		let pr = new Promise((resolve, reject) => {
			/*
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
			*/
			let i = 0, j = 0, len = 0, x = 0, y = 0, f
			for(i=0, j=0, len=p.buffer.length / 4; i!=len; i++, j+=4 ) {
				//console.log(p.buffer[j],p.buffer[j+1],p.buffer[j+2],p.buffer[j+3]);
				for(f = 0; f<funcs.length;f++){
					if (typeof funcs[f].f === 'function') {
						
						funcs[f].f(p,w,h,j,funcs[f].params,this)
					}
				}
				x++
				if(x>=w) {
					y++
					x=0
				}
				//console.log(x,y);
			}
			resolve(p)
		})
		return pr
	}
	drawBuffer(p,i) {
		console.log(p);
		this.ctx[i].putImageData(p.imgdata, 0, 0);
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
	nearestPixel(p,w,h,j,params,$t) {
		var c = {},
		    l = params.l,
		    yy,
		    xx,
		    xxx = 0,
		    q,
		    pos;
		    w = w * 4
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
	hack(p,pos,c) {
		if(undefined !== p.buffer[pos] && undefined !== p.buffer[pos+1] && undefined !== p.buffer[pos+2]) {
    		let q = p.buffer[pos] + p.buffer[pos+1] + p.buffer[pos+2]	
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