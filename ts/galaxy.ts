/// <reference path="../bower_components/babylonjs/dist/babylon.2.5.d.ts" />
/// <reference path="./planet.ts" />

const planets: any = [
    {
        "name": "planet1",
        "distance": 5,
        "size": 1,
        "speed": 0.006,
        "angle": 0
    },
    {
        "name": "planet2",
        "distance": 8,
        "size": 1.3,
        "speed": 0.009,
        "angle": 3.1
    },
    {
        "name": "planet3",
        "distance": 11,
        "size": 1.7,
        "speed": 0.0034,
        "angle": 4.6
    },
    {
        "name": "planet4",
        "distance": 14,
        "size": 2,
        "speed": 0.0028,
        "angle": 5.3
    },
    {
        "name": "planet5",
        "distance": 17,
        "size": 1.7,
        "speed": 0.0019,
        "angle": 5.7
    }
];

class Galaxy {
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;

    private _camera: BABYLON.ArcRotateCamera;
    private _topLight: BABYLON.HemisphericLight;
    private _bottomLight: BABYLON.HemisphericLight;

    constructor(canvas: HTMLCanvasElement) {
        this._engine = new BABYLON.Engine(canvas);
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.clearColor = new BABYLON.Color3(.08, .08, .1);

        this._setUpCamera(canvas);
        this._setUpLight();

        // this._setUpSkyBox();

        this._createSun(3);

        for (let i = 0; i < planets.length; i++) {
            let planet = planets[i];
            this._createPlanet(planet.name, planet.distance, planet.size, planet.speed, planet.angle);
        }
    }

    public runRenderLoop(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }

    public resize(): void {
        this._engine.resize();
    }

    private _setUpSkyBox(): void {
        let skybox = BABYLON.Mesh.CreateBox('skybox', 1000, this._scene);
        let skyboxMaterial = new BABYLON.StandardMaterial('skyboxMat', this._scene);

        // Don't render what we cannot see
        skyboxMaterial.backFaceCulling = false;

        // Move with camera
        skybox.infiniteDistance = true;

        skybox.material = skyboxMaterial;

        // Remove reflection
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

        // Texture for skybox
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/textures/stars/skybox', this._scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    }

    private _setUpLight(): void {
        this._topLight = new BABYLON.HemisphericLight('topLight', new BABYLON.Vector3(0, 1, 0), this._scene);
        this._topLight.diffuse = new BABYLON.Color3(.5, .5, .5);
        this._topLight.specular = new BABYLON.Color3(0, 0, 0);

        this._bottomLight = new BABYLON.HemisphericLight('bottomLight', new BABYLON.Vector3(0, -1, 0), this._scene);
        this._bottomLight.diffuse = new BABYLON.Color3(.5, .5, .5);
        this._bottomLight.specular = new BABYLON.Color3(0, 0, 0);
    }

    private _setUpCamera(canvas: HTMLCanvasElement): void {
        // ArcRotateCamera >> Camera turning around a 3D point (here Vector zero) with mouse and cursor keys
        // Parameters : name, alpha, beta, radius, target, scene
        this._camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 20, BABYLON.Vector3.Zero(), this._scene);

        // attach the camera to the canvas
        this._camera.attachControl(canvas, true);
        this._camera.lowerBetaLimit = 0.1;
        this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        this._camera.lowerRadiusLimit = 3;
        this._camera.upperRadiusLimit = 55;
        this._camera.wheelPrecision = 10;
    }

    private _createPlanet(name: string, distance: number, size: number, speed: number, angle: number): void {
        new Planet(this._scene, name, distance, size, speed, angle)
    }

    private _createSun(size: number): void {
        let materialSun = new BABYLON.StandardMaterial("textureSun", this._scene);
        materialSun.alpha = 1;
        materialSun.diffuseColor = new BABYLON.Color3(2, 2, 0);

        let sun = BABYLON.Mesh.CreateSphere('sun', 20, size, this._scene);
        sun.material = materialSun;
        sun.position.y = 0;

        let sunLight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3(0, 0, 0), this._scene);
        sunLight.diffuse = new BABYLON.Color3(.3, .3, 0);
        sunLight.specular = new BABYLON.Color3(.2, .2, 0);
    };
}


window.addEventListener('DOMContentLoaded', () => {
    let canvas = <HTMLCanvasElement>document.getElementById("render");

    let scene = new Galaxy(canvas);
    scene.runRenderLoop();

    // auto resize window
    this.addEventListener('resize', () => {
        scene.resize();
    })
});