'use strict';
import { ImageData } from '../js/imagedata.js';
import { Public } from '../js/_config.js';
export default {};
/**
 * @class ReduceColors
 * @extends ImageData
 * */
export class ReduceColors extends ImageData {
    constructor() {
        super();
        this._nearest = [];
    }
    // ----- Wrappers for private methods that need to be looped using loopPixels in the base class
    /**
     * @param {Number} a canvas context index
     * @param {Number} b nearest pixel range ( size )
     * @returns {Object}
     * */
    nearestPixel(a, b) {
        // let params = {
        // 	func:this.p_nearestPixel,
        // 	ctx:Public.CTX,
        // 	i:a, 
        // 	l:b
        // }
        // super.loopPixels({buffer:Public.BUFFER,imgdata:Public.IMGDATA},params)
        // .then(()=>{})
        super.loopPixels2({
            pdata: {
                buffer: Public.BUFFER,
                canvas: { width: Public.CANVAS[a].width, height: Public.CANVAS[a].height },
                cb_params: {
                    func: this.p_nearestPixel2,
                    ctx: Public.CTX,
                    i: a,
                    l: b,
                    parent: this,
                    distance: b
                }
            }
        }, b).then((e) => {
            //console.log(this._nearest)
            // draw the new buffer
            for (let j = 0; j < this._nearest.length; j++) {
                for (let k = 0; k < this._nearest[j].indexes.length; k++) {
                    Public.BUFFER[this._nearest[j].indexes[k]] = this._nearest[j].color[0];
                    Public.BUFFER[this._nearest[j].indexes[k] + 1] = this._nearest[j].color[1];
                    Public.BUFFER[this._nearest[j].indexes[k] + 2] = this._nearest[j].color[2];
                }
                // Public.BUFFER[this._nearest[j].i] = this._nearest[j].color[0];
                // Public.BUFFER[this._nearest[j].i + 1] = this._nearest[j].color[1];
                // Public.BUFFER[this._nearest[j].i + 2] = this._nearest[j].color[2];
            }
            // /console.log('done',Public.BUFFER,e);
            Public.CTX[1].putImageData(Public.IMGDATA, 0, 0);
            return this;
        });
    }
    /**
     * @param {Number} a strength
     * @returns {Object}
     * */
    greyScale(i, a) {
        let params = {
            func: this.p_greyScale,
            f: a,
            i: i
        };
        super.loopPixels({ buffer: Public.BUFFER, imgdata: Public.IMGDATA }, params)
            .then(() => { });
        return this;
    }
    /**
     * @param {Number} a strength
     * @returns {Object}
     * */
    FSDither(i, a) {
        let params = {
            func: this.p_FSDither,
            f: a,
            i: i
        };
        super.loopPixels({ buffer: Public.BUFFER, imgdata: Public.IMGDATA }, params)
            .then(() => { });
        return this;
    }
    /**
     *
     * @param params
     * @returns
     */
    reduceColor(i, a) {
        let params = {
            func: this.p_reduceColor,
            f: a,
            i: i
        };
        super.loopPixels({ buffer: Public.BUFFER, imgdata: Public.IMGDATA }, params)
            .then(() => { });
        return this;
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
    p_nearestPixel(p, w, h, j, params) {
        // @var 
        var c = {}, l = params.l, yy, xx, xxx = 0, q, pos;
        // each pixel is 3 colors and opacity ... handle it here
        w = w * 4;
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
        for (yy = 0; yy < l; yy++) {
            for (xx = 0; xx < (l * 2); xx += 4) {
                pos = j + (w * yy) + xx;
                if (undefined !== p.buffer[pos] && undefined !== p.buffer[pos + 1] && undefined !== p.buffer[pos + 2]) {
                    q = p.buffer[pos] + p.buffer[pos + 1] + p.buffer[pos + 2];
                    if (c[q] === undefined) {
                        c[q] = {
                            c: [p.buffer[pos], p.buffer[pos + 1], p.buffer[pos + 2]],
                            i: 1
                        };
                    }
                    else {
                        c[q].i++;
                    }
                }
            }
        }
        // @param {Object}
        let max = {
            i: 0,
            c: [0, 0, 0]
        };
        // loop the colors to see which is the most common
        for (let i in c) {
            if (c.hasOwnProperty(i)) {
                // if this color was found more often than max then replace it
                if (c[i].i > max.i) {
                    max.i = c[i].i;
                    max.c = c[i].c;
                }
            }
        }
        p.buffer[j] = max.c[0];
        p.buffer[j + 1] = max.c[1];
        p.buffer[j + 2] = max.c[2];
    }
    /**
     * traverses nearby pixels and tries to determine the most common color
     * @param buffer
     * @param width
     * @param height
     * @param params
     * @returns
     */
    p_nearestPixel2(buffer, width, height, params) {
        const indexes = [];
        const colorCounts = new Map();
        let rTotal = 0, gTotal = 0, bTotal = 0, index = 0;
        //let count = 0;
        for (let y = params.y - params.distance; y <= params.y + params.distance; y++) {
            //console.log("params.y",params.y,params.distance);
            for (let x = params.x - params.distance; x <= params.x + params.distance; x++) {
                // Check boundaries
                if (x >= 0 && x < width && y >= 0 && y < width) {
                    index = (y * width + x) * 4; // Calculate the index for the RGBA values
                    const colorKey = `${buffer[index]},${buffer[index + 1]},${buffer[index + 2]}`;
                    // Increment the color count
                    colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1);
                    indexes.push(index);
                }
            }
        }
        // Determine the most common color
        let mostCommonColor = null;
        let maxCount = 0;
        for (const [color, count] of colorCounts) {
            if (count > maxCount) {
                mostCommonColor = color;
                maxCount = count;
            }
        }
        // make sure the most common color is within a threshold of the average color
        if (mostCommonColor === null)
            return null;
        let mx = mostCommonColor.split(',').map(Number);
        params.parent._nearest.push({
            indexes: indexes,
            x: Math.floor(params.x), // round x and y to the nearest pixel
            y: Math.floor(params.y),
            mx: mx[0] + mx[1] + mx[2], // sum the most common color into one number
            color: mx
        });
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
    p_FSDither(p, w, h, j, params) {
        // each pixel is 3 colors and opacity ... handle it here
        w = w * 4;
        let oldp = p.buffer[j] + p.buffer[j + 1] + p.buffer[j + 2];
        let newp = (Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255 / params.f))) * 3;
        let qerror = oldp - newp;
        // r
        if (undefined !== p.buffer[j + 4])
            p.buffer[j + 4] += qerror * 7 / 16;
        if (undefined !== p.buffer[p.buffer[j - 4 + w]])
            p.buffer[j - 4 + w] += qerror * 3 / 16;
        if (undefined !== p.buffer[j + w])
            p.buffer[j + w] += qerror * 5 / 16;
        if (undefined !== p.buffer[j + 4 + w])
            p.buffer[j + 4 + w] += qerror * 1 / 16;
        // g
        if (undefined !== p.buffer[j + 1 + 4])
            p.buffer[j + 1 + 4] += qerror * 7 / 16;
        if (undefined !== p.buffer[p.buffer[j - 4 + 1 + w]])
            p.buffer[j - 4 + 1 + w] += qerror * 3 / 16;
        if (undefined !== p.buffer[j + w])
            p.buffer[j + 1 + w] += qerror * 5 / 16;
        if (undefined !== p.buffer[j + 4 + 1 + w])
            p.buffer[j + 4 + 1 + w] += qerror * 1 / 16;
        // b
        if (undefined !== p.buffer[j + 2 + 4])
            p.buffer[j + 2 + 4] += qerror * 7 / 16;
        if (undefined !== p.buffer[p.buffer[j - 4 + 2 + w]])
            p.buffer[j - 4 + 2 + w] += qerror * 3 / 16;
        if (undefined !== p.buffer[j + 2 + w])
            p.buffer[j + 2 + w] += qerror * 5 / 16;
        if (undefined !== p.buffer[j + 4 + 2 + w])
            p.buffer[j + 4 + 2 + w] += qerror * 1 / 16;
    }
    /**
     * @param {Object}
     * @param {Number}
     * @param {Number}
     * @param {Number}
     * @param {Object} parameters
     * @param {Object} reference the calling class
     * */
    p_greyScale(p, w, h, j, params) {
        p.buffer[j] = Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255 / params.f));
        p.buffer[j + 1] = Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255 / params.f));
        p.buffer[j + 2] = Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255 / params.f));
    }
    /**
     * @param {Object}
     * @param {Number}
     * @param {Number}
     * @param {Number}
     * @param {Object} parameters
     * @param {Object} reference the calling class
     * */
    p_reduceColor(p, w, h, j, params) {
        p.buffer[j] = Math.floor(Math.round(params.f * p.buffer[j] / 255) * (255 / params.f));
        p.buffer[j + 1] = Math.floor(Math.round(params.f * p.buffer[j + 1] / 255) * (255 / params.f));
        p.buffer[j + 2] = Math.floor(Math.round(params.f * p.buffer[j + 2] / 255) * (255 / params.f));
    }
}
//# sourceMappingURL=reducecolors.js.map