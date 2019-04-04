'use strict';

import * as imagedata from '/js/imagedata.js'

export default {}

/** 
 * @class Blur
 * @extends Blur
 * */
export class Blur extends ImageData {
	constructor() {
		super()
		this.cids = 0
		this.ctx = []
		this.buffer = null
		this.imgdata = null
	}
	gaussian(x,y) {
		let e = 2.71828182
		let q = 0.84089642
		let g = (1 / 2 * Math.PI() * q * q) * e - ((x * x + y * y) / (2 * q * 2 * q)
	}
}