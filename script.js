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
} 

export class ReduceColors extends ImageData {
	constructor() {
		super()
		this.cids = 0
		this.ctx = []
	}
}