'use strict';
import { ImageData } from '../js/imagedata.js';
import { Public } from './_config.js';
export default {};
/**
 * @class Font
 * @extends ImageData
 * */
/**
 * The `Font` class extends `ImageData` and provides functionality for rendering text as pixel data.
 *
 * The class allows for the following operations:
 * - Calculating the weight (pixel coverage) of each character in a font
 * - Drawing a table of characters based on the calculated weights
 * - Drawing the characters directly to a canvas or HTML table
 * - Determining the nearest pixel color for a given position
 *
 * The class can be configured with a font name and weight, and provides methods for controlling the rendering of negative/inverted text.
 */
export class Font extends ImageData {
    /**
     *
     * @param ctx
     * @param canvas
     * @param font
     * @param fweight
     * @returns
     */
    constructor(ctx, canvas, font = "Arial", fweight = 16) {
        super();
        this.ctx = ctx;
        this.canvas = canvas;
        this.font = font;
        this.fweight = fweight;
        this.chrmax = 256;
        this.weights = [];
        this._pixels = [" "];
        this._nearest = [];
        this.xy = 10;
        this.xymax = 50;
        this.xmax = 0;
        this.ymax = 0;
        this.xmin = 0;
        this.ymin = 0;
        this.hastable = false;
        this._negative = false;
        this.xmin = this.xymax;
        this.ymin = this.xymax;
        this.ctx.font = `${fweight}px ${font}`;
        for (var i = 0; i < this.chrmax; i++) {
            this.weights[i] = {
                letter: String.fromCharCode(i),
                weight: 0
            };
        }
    }
    /**
     * a bridge to the private method.
     * @param {Number} a canvas context index
     * @param {Number} b nearest pixel range ( size )
     * @returns {Object}
     * */
    nearestPixel(a, b) {
        super.loopPixels2({
            pdata: {
                buffer: Public.BUFFER,
                canvas: { width: Public.CANVAS[a].width, height: Public.CANVAS[a].height },
                cb_params: {
                    func: this.p_nearestPixel,
                    ctx: Public.CTX,
                    i: a,
                    l: b,
                    parent: this,
                    distance: b
                }
            }
        }, b).then(() => { });
        return this;
    }
    weighLetters() {
        this._pixels = [" "]; // Initialize with a single space to match original logic
        // First loop: Calculate weight and map letter to its weight for later use
        let letterToWeightMap = new Map();
        this.weights.forEach(weightObj => {
            const w = this.getLetterWeight(weightObj.letter) + 1;
            weightObj.weight = w;
            letterToWeightMap.set(w, weightObj.letter); // Assuming unique weights for simplification
        });
        // Convert the map to an array of letters ordered by weight
        let orderedLetters = Array.from(letterToWeightMap.values());
        const c = 255 * 3;
        let x = Math.ceil(c / (orderedLetters.length + 1));
        // Function to push letters or spaces a certain number of times
        const pushPixels = (letter, count) => {
            for (let j = 0; j < count; j++) {
                this._pixels.push(letter);
            }
        };
        // The logic for negative and non-negative can be combined into a single logic block
        // Since the only difference is the order of iteration
        const loopThroughLetters = (start, end, step) => {
            for (let i = start; i !== end; i += step) {
                const letter = orderedLetters[i] || " "; // Use space if letter is undefined
                pushPixels(letter, x);
            }
        };
        if (this._negative) {
            loopThroughLetters(orderedLetters.length - 1, -1, -1); // Loop backwards for negative
        }
        else {
            pushPixels(" ", x); // Add initial spaces once
            loopThroughLetters(0, orderedLetters.length, 1); // Loop forwards otherwise
        }
        return this;
    }
    /**
     *
     * @param width
     * @param height
     * @param target
     * @returns
     */
    drawTable(width, height, target) {
        let table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.setAttribute("id", "img_table");
        for (let x = 0; x < width; x++) {
            let tr = table.insertRow();
            for (let y = 0; y < height; y++) {
                let td = tr.insertCell();
                td.setAttribute("id", `c${y}_${x}`);
            }
        }
        document.querySelector(target).appendChild(table);
        this.hastable = true;
        let style = document.getElementById("imgdata_style");
        style.sheet.insertRule(`#img_table {
            background:#000;
            font-family:${this.font};
        }`);
        style.sheet.insertRule(`#img_table td {
            font-size: ${this.fweight}px;
            width: ${this.fweight / 2}px;
            height: ${this.fweight / 16}px;
            color: #fff;
        }`);
        return this;
    }
    /**
     *
     * @param i
     * @returns
     */
    drawPixels(i = 0) {
        let line = "";
        let y = 0;
        if (!this.hastable)
            Public.CTX[i].font = `${this.fweight}px ${this.font}`;
        for (let j = 0; j < this._nearest.length; j += (this.hastable ? 1 : this.fweight)) {
            let pixel = Public.ASCII_PIXELS[this.nearest[j].mx];
            if (pixel) {
                if (!this.hastable) {
                    Public.CTX[i].fillText(pixel, this.nearest[j].x, this.nearest[j].y);
                }
                else {
                    let c = document.getElementById(`c${this.nearest[j].x}_${this.nearest[j].y}`);
                    c.innerHTML = pixel;
                    c.style.color = `rgb(${this.nearest[j].color[0]},${this.nearest[j].color[1]},${this.nearest[j].color[2]})`;
                }
            }
        }
        return this;
    }
    /**
     *
     * @param {*} letter
     * @returns
     */
    getLetterWeight(letter) {
        // Clear the entire canvas to ensure no residual drawing affects the count
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw the letter at a consistent position
        this.ctx.fillText(letter, this.xy, this.xy);
        // Adjust the getImageData area if necessary to fully cover the drawn glyph
        const imageData = this.ctx.getImageData(this.xy, this.xy, this.xymax, this.xymax).data;
        let count = 0;
        let x = 0, y = 0;
        for (let i = 0; i < imageData.length; i += 4) {
            x++;
            if (x >= Math.floor(this.xy / 4)) {
                y++;
                if (imageData[i + 3] > 0) {
                    count += imageData[i + 3];
                }
                x = 0;
            }
        }
        return count;
    }
    /**
     * traverses nearby pixels and tries to determine the most common color
     * @param buffer
     * @param width
     * @param height
     * @param params
     * @returns
     */
    p_nearestPixel(buffer, width, height, params) {
        const colorCounts = new Map();
        let rTotal = 0, gTotal = 0, bTotal = 0;
        //let count = 0;
        for (let y = params.y - params.distance; y <= params.y + params.distance; y++) {
            //console.log("params.y",params.y,params.distance);
            for (let x = params.x - params.distance; x <= params.x + params.distance; x++) {
                // Check boundaries
                if (x >= 0 && x < width && y >= 0 && y < width) {
                    const index = (y * width + x) * 4; // Calculate the index for the RGBA values
                    const colorKey = `${buffer[index]},${buffer[index + 1]},${buffer[index + 2]}`;
                    // Increment the color count
                    colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1);
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
            x: Math.floor(params.x), // round x and y to the nearest pixel
            y: Math.floor(params.y),
            mx: mx[0] + mx[1] + mx[2], // sum the most common color into one number
            color: mx
        });
    }
    get pixels() {
        return this._pixels;
    }
    get nearest() {
        return this._nearest;
    }
    /**
     *
     * @param b
     */
    negative(b) {
        this._negative = b;
    }
}
//# sourceMappingURL=font.js.map