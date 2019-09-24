'use strict'

class Texture {
    constructor(index) {
        this.index = index;
    }

    isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }

    /*
     * Initialize a texture and load an image.
     * When the image finished loading copy it into the texture.
     */
    loadTexture(path, callback) {
        var webGL = window.wolfie3d.graphics.webGL;
        this.webGLtexture = webGL.createTexture();
        webGL.bindTexture(webGL.TEXTURE_2D, this.webGLtexture);

        // Because images have to be download over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = webGL.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = webGL.RGBA;
        const srcType = webGL.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        webGL.texImage2D(webGL.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType, pixel);

        const image = new Image();
        var thisImage = this;
        image.onload = function() {
            webGL.bindTexture(webGL.TEXTURE_2D, thisImage.webGLtexture);
            webGL.texImage2D(webGL.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (thisImage.isPowerOf2(image.width) && thisImage.isPowerOf2(image.height)) {
                // Yes, it's a power of 2. Generate mips.
                webGL.generateMipmap(webGL.TEXTURE_2D);
            } else {
                // No, it's not a power of 2. Turn of mips and set
                // wrapping to clamp to edge
                webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_S, webGL.CLAMP_TO_EDGE);
                webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_T, webGL.CLAMP_TO_EDGE);
                webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER, webGL.LINEAR);
            }
            callback();
        };
        image.src = path;
    }
}