'use strict';
import { Public } from '../js/_config.js';
export default {};
/**
 * gets the image data, creates a canvas and addss data to a buffer, then draws data
 * @class ImageData
 * */
export class ImageData {
    /**
     *
     * @param $t
     * @param w
     * @param h
     * @returns
     */
    canvas($t, w, h, ctxObj) {
        let cid = Public.CIDS;
        // create canvas
        let c = document.createElement('canvas');
        c.setAttribute('width', w);
        c.setAttribute('height', h);
        c.setAttribute('id', `c${Public.CIDS}`);
        c.setAttribute('data-id', `${Public.CIDS}`);
        $t.appendChild(c);
        Public.CANVAS.push(c);
        Public.CIDS++;
        Public.CTX.push(c.getContext("2d", ctxObj));
        return cid;
    }
    /**
     * load multiple images
     * @param src
     * @returns
     */
    load(src) {
        const paths = Array.isArray(src) ? src : [src];
        const promise = [];
        paths.forEach((path) => {
            promise.push(new Promise((resolve, reject) => {
                const img = new Image();
                img.src = path;
                img.onload = () => {
                    resolve({
                        img: img,
                        path: path,
                        status: 'ok'
                    });
                };
            }));
        });
        return Promise.all(promise);
    }
    /**
     * Draw the image to the canvas
     * @param i
     * @param img
     * @returns
     */
    draw(i, img) {
        Public.CTX[i].drawImage(img, 0, 0, Public.CANVAS[i].width, Public.CANVAS[i].height);
        return this;
    }
    /**
     * @param {Number}
     * */
    getData(i) {
        const imgd = Public.CTX[i].getImageData(0, 0, Public.CANVAS[i].width, Public.CANVAS[i].height);
        const pix = imgd.data;
        const buffer = imgd.data.buffer;
        const sourceBuffer8 = new Uint8ClampedArray(buffer);
        Public.BUFFER = sourceBuffer8;
        Public.IMGDATA = imgd;
        return this;
    }
    /**
     * loops all the pixels of the image and calls functions to act on the pixel
     * @param p
     * @param params
     * @returns
     */
    /**
 * Loops through all the pixels of an image and calls a provided function for each pixel.
 * @param p - An object containing the image data, including the pixel buffer.
 * @param params - An object containing parameters for the pixel processing function, including:
 *   - func: A function to be called for each pixel, with the following parameters:
 *     - p: The image data object
 *     - Public.CANVAS[params.i].width: The width of the canvas
 *     - Public.CANVAS[params.i].height: The height of the canvas
 *     - j: The index of the current pixel in the pixel buffer
 *     - params: The parameters object
 *   - i: The index of the canvas to use
 *   - skip: The number of pixels to skip between each processed pixel
 * @returns A Promise that resolves with the modified image data object.
 */
    loopPixels(p, params) {
        let pr = new Promise((resolve, reject) => {
            let skip = (undefined == params.skip) ? 0 : params.skip;
            let i = 0, j = 0, len = 0, x = 0, y = 0, xx = 0, yy = 0;
            for (i = 0, j = 0, len = p.buffer.length / 4; i != len; i++, j += 4) {
                if (typeof params.func === 'function') {
                    params.x = x;
                    params.y = y;
                    params.xx = xx;
                    params.yy = yy;
                    params.func(p, Public.CANVAS[params.i].width, Public.CANVAS[params.i].height, j, params);
                }
                x++;
                if (x >= Public.CANVAS[params.i].width) {
                    xx = x + skip;
                    yy = y + skip;
                    y++;
                    x = 0;
                }
            }
            resolve(p);
        });
        return pr;
    }
    /**
     * this loops the pixels in the buffer and then calls a callback. This callback can perform various specific functions
     * these function will always involve modifying the image buffer so this makes sense.
     * @param param0 {Object} - pixel data object
     * @param step {Number}
     * @returns {Promise}
     */
    loopPixels2({ pdata }, step = 1) {
        //This method loops over pixels in a similar way to loopPixels, but takes pixel data as a parameter rather than relying on global state. 
        //It can be used by passing the relevant pixel
        let pr = new Promise((resolve, reject) => {
            let t = 0;
            // Loop over pixels with optional step this allows processing pixels in blocks rather than individually for better performance and to achieve the desired result
            for (let y = 0; y < pdata.canvas.height; y += step) {
                for (let x = 0; x < pdata.canvas.width; x += step) {
                    t += step;
                    // pass the current x,y coordinates and pixel index to the callback
                    if (typeof pdata.cb_params.func === 'function') {
                        pdata.cb_params.x = x;
                        pdata.cb_params.y = y;
                        pdata.cb_params.t = t;
                        pdata.cb_params.func(pdata.buffer, pdata.canvas.width, pdata.canvas.height, pdata.cb_params);
                    }
                }
            }
            resolve(pdata.buffer);
        });
        return pr;
    }
    /**
     *
     * @param i
     */
    drawBuffer(i) {
        Public.CTX[i].putImageData(Public.IMGDATA, 0, 0);
        return this;
    }
}
//# sourceMappingURL=imagedata.js.map