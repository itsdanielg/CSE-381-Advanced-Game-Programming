'use strict'

var Wolfie3dStatus = {
    CONSTRUCTED:    'CONSTRUCTED',
    LOADED:         'LOADED',
    FAILED:         'FAILED'
};

class Wolfie3d {
    constructor() {
        // FIRST LET'S MAKE THIS OBJECT EASY TO FIND
        window.RESOURCES_DIR = "resources/";
        window.SHADERS_DIR = RESOURCES_DIR + "shaders/";
        window.TEXTURES_DIR = RESOURCES_DIR + "textures/";
        
        // CONSTRUCT OUR AFG COMPONENTS
        this.files = new FilesComponent();
        this.math = new WolfieMath();
        this.graphics = new GraphicsComponent();
        this.scene = new SceneComponent();
    }

    init() {
        // INITIALIZE THE SUBSYSTEMS ONE AT A TIME, IN THE PROPER ORDER

        // FIRST THE GRAPHICS SUBSYSTEM
        this.graphics.init("demo_canvas");
        
        // THEN THE SCENE GRAPH MANAGER
        this.scene.init();
                
        // THEN THE CONTROLLER FOR RESPONDING TO EVENTS
        this.controller = new AppController();
    }
    
    step() {
        
    }
}