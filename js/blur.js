'use strict';

import * as imagedata from '/js/imagedata.js'

export default {}

/** 
 * @class Blur
 * @extends Blur
 * */
export class Blur extends imagedata.ImageData {
	constructor() {
		super()
		this.cids = 0
		this.ctx = []
		this.buffer = null
		this.imgdata = null
	}
	box() {

	}
	gaussian(size,k = 3) {
		if(k!=3 && k!=5) {
			// throw error
			console.log('parameter must be 3 or 5');
			return false
		}
		let params = {}
		params.func = this.p_gaussian
		params.k = k
		params.l = size
		this.loopPixels({buffer:this.buffer,imgdata:this.imgdata},params)
		.then(()=>{})
		return this 
	}


	// ---- PRIVATE

	//https://en.wikipedia.org/wiki/Gaussian_blur
	//https://en.wikipedia.org/wiki/Kernel_(image_processing)
	//https://developer.apple.com/library/archive/documentation/Performance/Conceptual/vImage/ConvolutionOperations/ConvolutionOperations.html
	//https://en.wikipedia.org/wiki/Luma_(video)
	p_gaussian(p,w,h,j,params) {
		var xx, yy, pos
		let k = params.k
		let l = params.l
		let kernel = [[1,2,1],[2,4,2],[1,2,1]]
		//let kernel = [[-4,0,0],[0,0,0],[0,0,-4]]
		//let kernel = [[1,1,1],[1,1,1],[1,1,1]]
		if(k == 5)
			kernel = [[1,4,6,4,1],[4,16,24,16,4],[6,24,36,24,6],[4,16,24,16,4],[1,4,6,4,1]]
		
		w = w * 4
		
		let ac = [0,0,0]
		let acc = 0
		for(yy=(-l/2);yy<(l/2);yy++) {
		    for(xx=(-l/2);xx<(l*2);xx+=4) {
		    	pos = j + (w*yy) + xx
		    	if(undefined !== p.buffer[pos] && undefined !== p.buffer[pos+1] && undefined !== p.buffer[pos+2]) {
		    		let ltmp = p.buffer[pos] + p.buffer[pos+1] + p.buffer[pos+2]
		    		for(let yyy=0;yyy<k;yyy++) {
		    			for(let xxx=0; xxx<k;xxx++) {
							let ktmp = kernel[yyy][xxx]
				    		acc += ktmp * ltmp 
		    			}
		    		}
		    		
					/*
					ac[0] += kernel[yy][xxx] * p.buffer[pos]
					ac[1] += kernel[yy][xxx] * p.buffer[pos+1]
					ac[2] += kernel[yy][xxx] * p.buffer[pos+2]
					*/	
		    	}
		    }
		}
		p.buffer[j]   += ((acc / 765) / l)
		p.buffer[j+1] += ((acc / 765) / l)
		p.buffer[j+2] += ((acc / 765) / l)
	}
}