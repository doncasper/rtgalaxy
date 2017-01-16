/// <reference path="../../../node_modules/babylonjs/babylon.d.ts" />

module PLANETS {
    const segments: number = 16;
    const k: number = 1.6568542; // Geometric constant for drawing planet orbit
    const orbitColor: BABYLON.Color3 = new BABYLON.Color3(0.25, 0.25, 0.25);
    const sizeScale: number = 10000;
    const speedScale: number = 10000;
    const orbitScale: number = 10;

    export class Planet {
        private _scene: BABYLON.Scene;

        public id: number;
        public actionManager: BABYLON.ActionManager;
        public isHighlighted: boolean;

        private _name: string;
        private _planet: BABYLON.Mesh;
        private _material: BABYLON.StandardMaterial;
        private _size: number;
        private _orbitSize: number;
        private _angle: number;
        private _tangent: number;
        private _speed: number;
        private _highlight: BABYLON.HighlightLayer;

        constructor(scene: BABYLON.Scene, id: number, name: string, orbitSize: number, size: number, speed: number, angle: number) {
            this.id = id;

            this._scene = scene;
            this._name = name;
            this._size = size;
            this._orbitSize = orbitSize;
            this._speed = speed;
            this._angle = angle;
            this._tangent = this._orbitSize * k;


            this._planet = BABYLON.Mesh.CreateSphere(this._name, segments, this._size, this._scene);
            this._planet.position.x = this._orbitSize;
            this._showOrbitCurve();

            this._setColor();

            this._highlight = new BABYLON.HighlightLayer(this._name + "Highlight", this._scene);

            this.actionManager = new BABYLON.ActionManager(this._scene);
            this._planet.actionManager = this.actionManager;

            this._scene.registerBeforeRender(() => {
                this._moveByOrbit()
            });
        }

        public addHighlight(): void {
            this._highlight.addMesh(this._planet, BABYLON.Color3.Green());
        }

        public removeHighlight(): void {
            this._highlight.removeMesh(this._planet);
        }

        private _setColor(): void {
            this._material = new BABYLON.StandardMaterial(this._name + "Color", this._scene);
            this._material.alpha = 1;
            this._material.diffuseColor = new BABYLON.Color3(1, 1, 1);
            this._planet.material = this._material;
        }

        private _moveByOrbit(): void {
            this._planet.position.x = this._orbitSize * Math.sin(this._angle);
            this._planet.position.z = this._orbitSize * Math.cos(this._angle);
            this._angle += this._speed;
        }

        private _showOrbitCurve(): void {
            let hermite1 = BABYLON.Curve3.CreateHermiteSpline(
                new BABYLON.Vector3(this._orbitSize, 0, 0),
                new BABYLON.Vector3(0, 0, this._tangent),
                new BABYLON.Vector3(0, 0, this._orbitSize),
                new BABYLON.Vector3(-this._tangent, 0, 0), segments);

            let hermite2 = BABYLON.Curve3.CreateHermiteSpline(
                new BABYLON.Vector3(0, 0, this._orbitSize),
                new BABYLON.Vector3(-this._tangent, 0, 0),
                new BABYLON.Vector3(-this._orbitSize, 0, 0),
                new BABYLON.Vector3(0, 0, -this._tangent), segments);

            let hermite3 = BABYLON.Curve3.CreateHermiteSpline(
                new BABYLON.Vector3(-this._orbitSize, 0, 0),
                new BABYLON.Vector3(0, 0, -this._tangent),
                new BABYLON.Vector3(0, 0, -this._orbitSize),
                new BABYLON.Vector3(this._tangent, 0, 0), segments);

            let hermite4 = BABYLON.Curve3.CreateHermiteSpline(
                new BABYLON.Vector3(0, 0, -this._orbitSize),
                new BABYLON.Vector3(this._tangent, 0, 0),
                new BABYLON.Vector3(this._orbitSize, 0, 0),
                new BABYLON.Vector3(0, 0, this._tangent), segments);

            let orbitCurve = hermite1.continue(hermite2).continue(hermite3).continue(hermite4);

            let orbit = BABYLON.Mesh.CreateLines(this._name + "Orbit", orbitCurve.getPoints(), this._scene);
            orbit.color = orbitColor;
        }
    }
}