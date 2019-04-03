'use strict';

export default {}

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
/** 
 * @class General
 * */
export class General {
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