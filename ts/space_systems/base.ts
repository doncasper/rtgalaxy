/// <reference path="../../node_modules/babylonjs/babylon.d.ts" />


module SPACE_SYSTEMS {
    const background: BABYLON.Color3 = new BABYLON.Color3(.08, .08, .1);
    const lightDiffuse: BABYLON.Color3 = new BABYLON.Color3(.35, .35, .35);
    const lightSpecular: BABYLON.Color3 = new BABYLON.Color3(0, 0, 0);
    const topLightPosition: BABYLON.Vector3 = new BABYLON.Vector3(0, 1, 0);
    const bottomLightPosition: BABYLON.Vector3 = new BABYLON.Vector3(0, -1, 0);

    export class BaseSystem {
        protected _scene: BABYLON.Scene;
        protected _camera: BABYLON.ArcRotateCamera;
        protected _topLight: BABYLON.Light;
        protected _bottomLight: BABYLON.Light;

        constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
            this._scene = new BABYLON.Scene(engine);
            this._scene.clearColor = background;

            this._setUpCamera(canvas);
            this._setUpLight();
        }

        protected _setUpCamera(canvas: HTMLCanvasElement): void {
            // ArcRotateCamera >> Camera turning around a 3D point with mouse and cursor keys
            this._camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 130, BABYLON.Vector3.Zero(), this._scene);

            // attach the camera to the canvas
            this._camera.attachControl(canvas, true);
            this._camera.lowerBetaLimit = 0.1;
            this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
            this._camera.lowerRadiusLimit = 3;
            this._camera.upperRadiusLimit = 200;
            this._camera.wheelPrecision = 10;
        }

        protected _setUpLight(): void {
            this._topLight = new BABYLON.HemisphericLight('topLight', topLightPosition, this._scene);
            this._topLight.diffuse = lightDiffuse;
            this._topLight.specular = lightSpecular;

            this._bottomLight = new BABYLON.HemisphericLight('bottomLight', bottomLightPosition, this._scene);
            this._bottomLight.diffuse = lightDiffuse;
            this._bottomLight.specular = lightSpecular;
        }

        public render(): void {
            this._scene.render();
        }
    }
}