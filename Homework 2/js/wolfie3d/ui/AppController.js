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
        var keys = window.wolfie3d.ui.controller.keys;
        switch(keyCode) {
            // DID THEY PRESS W or w?
            case keys.W:
            case keys.w:
                console.log("W or w down?");
                break;
        
            // DID THEY PRESS A or a?
            case keys.A:
            case keys.a:
                console.log("A or a down?");
                break;
        }
    }

    onKeyUp(event){
        var keyCode = event.keyCode;
        var keys = window.wolfie3d.ui.controller.keys;
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