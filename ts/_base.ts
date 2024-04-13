'use strict';

import {Public} from '../js/_config.js'
import {Helpers} from '../js/_helpers.js'
import {ImageData} from '../js/imagedata.js'
import {ReduceColors} from '../js/reducecolors.js'
import {Blur} from '../js/blur.js'
import {Font} from '../js/font.js'
export default {}

/** 
 * @class ImageData
 * */
/**
 * The `Base` class extends the `ImageData` class and provides a set of utility methods for working with image data.
 * 
 * The class includes methods for:
 * - Reducing the number of colors in an image
 * - Applying grayscale and dithering effects
 * - Handling font rendering and nearest pixel calculations
 * - Providing utility methods for logging and timing
 * 
 * The `Base` class is a foundational component of the larger image processing library, providing a set of common functionality that can be used by other classes and modules.
 */
export class Base extends ImageData {
    private _reduceColors: ReduceColors = new ReduceColors();
    private _font: Font;
    private fnegative: boolean = false;
    constructor() {
        super()
        let style = document.createElement("style");
        style.setAttribute("id", "imgdata_style");
        document.body.appendChild(style);
    }
    /**
     * 
     * @param t 
     * @param m 
     * @returns 
     */
    done(t: string, m: string = null): this {
        Helpers.done(t, m);
        return this;
    }
    /**
     * 
     * @param m 
     * @returns 
     */
    now(m: string = null): this {
        Helpers.now(m);
        return this;
    }
    /** 
     * @param {Number} a canvas context index
     * @param {Number} b nearest pixel range ( size )
     * @returns {Object}
     * */
    nearestPixel(a: number, b: number): this {
        this._reduceColors.nearestPixel(a, b);
        return this;
    }
    /**
     * 
     * @param i 
     * @param a 
     * @returns 
     */
    greyScale(i: number, a: number) : this {
        this._reduceColors.greyScale(i, a);
        return this;
    }
    /**
     * 
     * @param i 
     * @param a 
     * @returns 
     */
    FSDither(i: number, a: number): this {
        this._reduceColors.FSDither(i, a);
        return this;
    }
    /**
     * 
     * @param i 
     * @param params 
     * @returns 
     */
    reduceColor(i: number, a:number): this {
        this._reduceColors.reduceColor(i, a);
        return this;
    }
    /**
     * 
     * @param b 
     * @returns 
     */
    setFontNegative(b: boolean = true): this {
        this.fnegative = b;
        return this;
    }
    /**
     * 
     * @param i 
     * @param font 
     * @param fweight 
     * @returns 
     */
    getFontPixels(i: number, font: string = "Arial", fweight: number = 16): this {
        this._font = new Font(Public.CTX[i], Public.CANVAS[i], font, fweight);
        this._font.negative(this.fnegative);
        this._font.weighLetters();
        Public.ASCII_PIXELS = this._font.pixels;
        return this;
    }
    /**
     * 
     * @param img 
     * @param fontcanvas 
     * @param range 
     * @param font 
     * @param fweight 
     * @returns 
     */
    fontNearestPixel(img: number, fontcanvas: number, range: number, font: string = "Arial", fweight: number = 16): this {
        this.getFontPixels(fontcanvas, font, fweight);
        this._font.nearestPixel(img, range);
        return this;
    }
    /**
     * 
     * @param i 
     * @returns 
     */
    drawFontPixels(i: number = 0): this {
        this._font.drawPixels(i);
        return this;
    }
    /**
     * 
     * @param width 
     * @param height 
     * @param target 
     * @returns 
     */
    drawTable(width: number, height: number, target: string) :this {
        this._font.drawTable(width, height, target);
        return this;
    }
}