'use strict';

import * as imagedata from '/js/imagedata.js'

export default {}

/** 
 * @class Trigonometry
 * @extends Trigonometry
 * */
export class Trigonometry extends imagedata.ImageData {
	constructor() {
		super()
		this.cids = 0
		this.ctx = []
		this.buffer = null
		this.imgdata = null
	}
	/** 
	 * @param {Number} s strength of the spin
	 * @param {Number} r radius
	 * @param {Number} w width
	 * @param {Number} h height
	 * @param {Number} x center of spin x
	 * @param {Number} y center of spin y
	 * */
	spiral(s,r,w,h,x=null,y=null) {
		x = (x == null ? w/2 : x) 
		y = (y == null ? h/2 : y) 
		w = w * 4
		let temp = this.buffer
		for(let j=0;j<r;j++) {
			for(let i=0; i<360;i++) {
				let xy = this.trig(x,y,j,i)
				let xy2 = this.trig(x,y,j+s,i)
				let p = (xy[0] + xy[1]) * w - 1
				// get current pixel
				let tR = this.buffer[p]
				let tG = this.buffer[p + 1]
				let tB = this.buffer[p + 2]
				
				let q = (xy2[0] + xy2[1]) * w - 1
				temp[q] = tR
				temp[q + 1] = tG
				temp[q + 2] = tB
			}
		}
		this.buffer = temp
		return this
	}
	/** 
	 * 
	 * @function trig
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * @param {Boolean}
	 * @returns {Mixed} 
	 * */
	static trig(x,y,r,d,array=true) {

		if(d<0)d+=360;
		if(d>360)d-=360;

		let a = d * Math.PI / 180;
		let xpos = r * Math.cos(a);
		let ypos = r * Math.sin(a);

	    if(array) {
	    	return [
	    		~~xpos+x,
	    		~~ypos+y
	    	]
	    }else{
	    	return {
	    		x:~~xpos+x,
	    		y:~~ypos+y
	    	}
	    }
	}
}