'use strict'
class Keys {
    constructor() {
        var c = 'a'.charCodeAt(0);
        var capC = 'A'.charCodeAt(0);
        for (var i = 0; i < 26; i++) {
            var charString = String.fromCharCode(c);
            this[charString] = charString.charCodeAt(0);
            charString = String.fromCharCode(capC);
            this[charString] = charString.charCodeAt(0);
            c++;
            capC++;
        }
    }    
}
class AppController {
    constructor() {
        this.keys = new Keys();
    }
    
    init() {
        window.addEventListener("keydown", this.onKeyDown, false);
        window.addEventListener("keyup", this.onKeyUp, false);        
    }
    
    onKeyDown(event){
        var keyCode = event.keyCode;
        var keys = window.wolfie3d.controller.keys;
        var camera = window.wolfie3d.graphics.camera;
        switch(keyCode) {
            // Move forward
            case keys.W:
            case keys.w:
                camera.moveForward();
                break;
            // Rotate left
            case keys.A:
            case keys.a:
                camera.lookLeft();
                break;
            // Move backward
            case keys.S:
            case keys.s:
                camera.moveBackward();
                break;
            // Rotate right
            case keys.D:
            case keys.d:
                camera.lookRight();
                break;
        }
    }

    onKeyUp(event){
        var keyCode = event.keyCode;
        var keys = window.wolfie3d.controller.keys;
        switch(keyCode) {
            // DID THEY PRESS W or w?
            case keys.W:
            case keys.w:
                console.log("W or w up?");
                break;
        
            // DID THEY PRESS A or a?
            case keys.A:
            case keys.a:
                console.log("A or a up?");
                break;
        }
    }
}