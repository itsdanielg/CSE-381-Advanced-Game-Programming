'use strict'

class TextToRender {
    constructor(id, text, x, y, update) {
        this.id = id;
        this.text = text;
        this.x = x;
        this.y = y;
        this.update = update;
    }
}

class TextRenderer {
    constructor(textCanvasId, fontFamily, fontSize, fontColor) {
        this.textToRender = new Array();
        this.textCanvas = document.getElementById(textCanvasId);
        var workspace = document.getElementById("workspace");
        var workspaceWidth = workspace.getBoundingClientRect().width;
        var workspaceHeight = workspace.getBoundingClientRect().height;
        this.textCanvas.setAttribute('width', workspaceWidth);
        this.textCanvas.setAttribute('height', workspaceHeight*.2);
        this.canvasWidth = this.textCanvas.width;
        this.canvasHeight = this.textCanvas.height;
        this.textCtx = this.textCanvas.getContext("2d");
        this.defaultFontFamily = fontFamily;
        this.defaultFontSize = fontSize;
        this.defaultFontColor = fontColor;
    }
    
    addTextToRender(textToAdd) {
        if (!textToAdd.hasOwnProperty("fontFamily"))
            textToAdd.fontFamily = this.defaultFontFamily;
        if (!textToAdd.hasOwnProperty("fontSize"))
            textToAdd.fontSize = this.defaultFontSize;
        if (!textToAdd.hasOwnProperty("fontColor"))
            textToAdd.fontColor = this.defaultFontColor;
        this.textToRender.push(textToAdd);
    }

    clear() {
        this.textToRender.length = 0;
    }

    render() {
        this.textCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        for (var i = 0; i < this.textToRender.length; i++) {
            var textToRender = this.textToRender[i];
            textToRender.update();
            this.textCtx.font = "" + textToRender.fontSize + "px " + textToRender.fontFamily;
            this.textCtx.fillStyle = textToRender.fontColor;
            this.textCtx.fillText(textToRender.text, textToRender.x, textToRender.y);
        }
    }
}