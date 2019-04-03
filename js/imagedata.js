'use strict';

import * as other from '/js/other.js'

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
		return this
	}
	/** 
	 * @param {Number}
	 * */
	getData(i) {
		const imgd = this.ctx[i].getImageData(0,0,this.width, this.height)
		const pix = imgd.data
		const buffer = imgd.data.buffer
		const sourceBuffer8     = new Uint8ClampedArray(buffer);
		this.buffer = sourceBuffer8
		this.imgdata = imgd
		return this
	}
	/**
	 * loops all the pixels of the image and calls functions to act on the pixel
	 * @param {Number}
	 * @param {Number}
	 * @param {Array}
	 * @param {Object}
	 * * */
	loopPixels(p,params) {
		let pr = new Promise((resolve, reject) => {
			let i = 0, j = 0, len = 0, x = 0, y = 0, f
			for(i=0, j=0, len=p.buffer.length / 4; i!=len; i++, j+=4 ) {
				if (typeof params.func === 'function') {
					params.func(p,this.width, this.height,j,params)
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
	drawBuffer(i) {
		this.ctx[i].putImageData(this._imgdata, 0, 0);
	}
	/** 
	 * @return {Number}
	 * */
	get _ctx() {
		return this.ctx
	}
	get _buffer() {
		return this.buffer
	}
	get _imgdata() {
		return this.imgdata
	}
} 
