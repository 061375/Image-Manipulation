'use strict';
import {ImageData} from '../js/imagedata.js'
import {Public} from '../js/_config.js'
export default {};
/**
 * @class Trigonometry
 * @extends ImageData
 * */
export class Trigonometry extends ImageData {
    constructor() {
        super();
    }
    /**
     * @param {Number} s strength of the spin
     * @param {Number} r radius
     * @param {Number} w width
     * @param {Number} h height
     * @param {Number} x center of spin x
     * @param {Number} y center of spin y
     * */
    spiral(s:number, r:number, w:number, h:number, x = null, y = null) {
        x = (x == null ? w / 2 : x);
        y = (y == null ? h / 2 : y);
        w = w * 4;
        let temp = Public.BUFFER;
        for (let j = 0; j < r; j++) {
            for (let i = 0; i < 360; i++) {
                let xy = Trigonometry.trig(x, y, j, i);
                let xy2 = Trigonometry.trig(x, y, j + s, i);
                let p = (xy[0] + xy[1]) * w - 1;
                // get current pixel
                let tR = Public.BUFFER[p];
                let tG = Public.BUFFER[p + 1];
                let tB = Public.BUFFER[p + 2];
                let q = (xy2[0] + xy2[1]) * w - 1;
                temp[q] = tR;
                temp[q + 1] = tG;
                temp[q + 2] = tB;
            }
        }
        Public.BUFFER = temp;
        return this;
    }
    /**
	 * 
	 * @param x 
	 * @param y 
	 * @param r 
	 * @param d 
	 * @param array 
	 * @returns 
	 */
    static trig(x:number, y:number, r:number, d:number, array:boolean = true): number[] | { x: number; y: number; } {
        if (d < 0)
            d += 360;
        if (d > 360)
            d -= 360;
        let a = d * Math.PI / 180;
        let xpos = r * Math.cos(a);
        let ypos = r * Math.sin(a);
        if (array) {
            return [
                ~~xpos + x,
                ~~ypos + y
            ];
        }
        else {
            return {
                x: ~~xpos + x,
                y: ~~ypos + y
            };
        }
    }
}