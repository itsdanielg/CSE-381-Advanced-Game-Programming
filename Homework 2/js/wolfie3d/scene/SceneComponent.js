'use strict'
/*
 * SceneComponent.js
 * 
 * A scene stores all of the renderable, collidable objects that are part of
 * the simulation. Note that shader programs and model types are shared among
 * scene objects and so we keep a library of all those loaded here.
 */
class SceneComponent {
    constructor() {}
    
    init() {
        // THESE ARE THE MAIN INGREDIENTS FOR BUILDING SCENE OBJECTS
        // AND COMPLEX SCENE OBJECTS
        this.shaderPrograms = new Array();
        this.modelTypes = new Array();
        
        // THESE WILL STORE OUR SCENE DATA
        this.sceneObjects = new Map();    
        this.sceneCounter = 0;
        
        // THIS CAN BE USED TO BUILD SCENE OBJECTS
        this.builder = new SceneBuilder();
    }
    
    addShaderProgram(name, shaderProgram) {
        this.shaderPrograms[name] = shaderProgram;
    }
    
    addModelType(name, modelType) {
        this.modelTypes[name] = modelType;
    }
    
    getShaderProgram(name) {
        return this.shaderPrograms[name];
    }
    
    getModelType(name) {
        return this.modelTypes[name];
    }
    
    getNumberOfShaderPrograms() {
        return this.shaderPrograms.length;
    }

    addSceneObject(sceneObjectToAdd) {
        this.sceneObjects.set(this.sceneCounter, sceneObjectToAdd);
        sceneObjectToAdd.sceneId = this.sceneCounter;
        this.sceneCounter++;
    }

    getSceneObject(sceneObjectId) {
        return this.sceneObjects[sceneObjectId];
    }

    // FOR NOW WE LET ALL SCENE OBJECTS THROUGH
    scope(potentiallyVisibleSet) {   
        var sceneObjectsIt = this.sceneObjects.values();
        for (let sceneObject of sceneObjectsIt) {
            potentiallyVisibleSet.push(sceneObject);
        }
    }
}