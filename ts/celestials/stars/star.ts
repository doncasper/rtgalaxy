/// <reference path="../../../node_modules/babylonjs/babylon.d.ts" />

module STARS {
    const segments: number = 20;
    const materialAlpha: number = 1;
    const position: BABYLON.Vector3 = BABYLON.Vector3.Zero();

    export class Star {
        private _star: BABYLON.Mesh;
        private _color: BABYLON.Color3;
        private _scene: BABYLON.Scene;
        private _size: number;
        private _name: string;

        constructor(scene: BABYLON.Scene, name: string, size: number, red: number, green: number, blue: number) {
            this._color = Star._getColor(red, green, blue);
            this._size = size;
            this._scene = scene;
            this._name = name;

            this._star = BABYLON.Mesh.CreateSphere(this._name, segments, size, this._scene);
            this._star.material = this._getMaterial();
            this._star.position.y = 0;

            let sunLight = new BABYLON.PointLight(this._name + "Light", position, this._scene);
            sunLight.diffuse = new BABYLON.Color3(.5, .5, .5);
            sunLight.specular = new BABYLON.Color3(0, 0, 0);
        }

        private static _getColor(red: number, green: number, blue: number): BABYLON.Color3 {
            return new BABYLON.Color3(red, green, blue);
        }

        private _getMaterial(): BABYLON.Material {
            let material = new BABYLON.StandardMaterial(this._name + "Material", this._scene);
            material.alpha = materialAlpha;
            material.diffuseColor = this._color;

            return material;
        }
    }
}