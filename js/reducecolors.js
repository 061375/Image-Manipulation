'use strict';

import * as imagedata from '/js/imagedata.js'

export default {}

/** 
 * @class ReduceColors
 * @extends ImageData
 * */
export class ReduceColors extends imagedata.ImageData {
	constructor() {
		super()
		this.cids = 0
		this.ctx = []
		this.buffer = null
		this.imgdata = null
	}
	// ----- Wrappers for private methods that need to be looped using loopPixels in the base class
	/** 
	 * @param {Number} a canvas context index
	 * @param {Number} b nearest pixel range ( size )
	 * @returns {Object}
	 * */
	nearestPixel(a,b) {
		let params = {}
		params.func = this.p_nearestPixel
		params.ctx = this._ctx
		params.i = a 
		params.l = b
		this.loopPixels({buffer:this.buffer,imgdata:this.imgdata},params)
		.then(()=>{})
		return this 
	}
	/** 
	 * @param {Number} a strength
	 * @returns {Object}
	 * */
	grayScale(a) {
		let params = {}
		params.func = this.p_grayScale
		params.f = a
		this.loopPixels({buffer:this.buffer,imgdata:this.imgdata},params)
		.then(()=>{})
		return this 
	}
	/** 
	 * @param {Number} a strength
	 * @returns {Object}
	 * */
	FSDither(a) {
		let params = {}
		params.func = this.p_FSDither
		params.f = a
		this.loopPixels({buffer:this.buffer,imgdata:this.imgdata},params)
		.then(()=>{})
		return this 
	}
	/** 
	 * @param {Number} a strength
	 * @returns {Object}
	 * */
	reduceColor(params) {
		params.func = this.p_reduceColor
		this.loopPixels({buffer:this.buffer,imgdata:this.imgdata},params)
		.then(()=>{})
		return this 
	}

	// ----- PRIVATE
	
	/** 
	 * @param {Object}
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * @param {Object} parameters
	 * @param {Object} reference the calling class
	 * */
	p_nearestPixel(p,w,h,j,params) {
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
		    // loop a section
		    /** 
		     * loop a section of the image and look ahead l pixels
		     *
		     * Example:
		     * 
		     * X###
		     * ####
		     * ####
		     * 
		     * However in reality:
		     * XXXXRGBORGBORGBO
		     * RGBORGBORGBORGBO
		     * RGBORGBORGBORGBO
		     * RGBORGBORGBORGBO
		     * 
		     * Or ... actually because we are using the buffer:
		     * XXXXRGBORGBORGBORGBORGBORGBORGBORGBORGBORGBORGBORGBORGBORGBORGBO
		     *
		     * */
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
	p_FSDither(p,w,h,j,params) {
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
	p_grayScale(p,w,h,j,params) {
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
	p_reduceColor(p,w,h,j,params) {
		p.buffer[j] = Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255/params.f))
		p.buffer[j+1] = Math.floor(Math.round(params.f * p.buffer[j+1] / 255) * (255/params.f))
		p.buffer[j+2] = Math.floor(Math.round(params.f * p.buffer[j+2] / 255) * (255/params.f))		
	}
}