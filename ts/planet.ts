/// <reference path="../bower_components/babylonjs/dist/babylon.2.5.d.ts" />

const elements: number = 16;
const k: number = 1.6568542;
const orbitColor: BABYLON.Color3 = new BABYLON.Color3(0.25, 0.25, 0.45);

class Planet {
    private _scene: BABYLON.Scene;

    private _planet: BABYLON.Mesh;
    // private _material: BABYLON.Mesh;
    private _radius: number;
    private _angle: number;
    private _speed: number;

    constructor(scene: BABYLON.Scene, name: string, distance: number, size: number, speed: number, angle: number) {
        this._scene = scene;
        this._radius = distance;
        this._speed = speed;
        this._angle = angle;

        this._planet = BABYLON.Mesh.CreateSphere(name, elements, size, scene);
        this._planet.position.x = distance;
        this._getOrbitCurve();
        this._moveByOrbit();

        this._scene.registerBeforeRender(() => {this._moveByOrbit()});
    }

    private _moveByOrbit(): void {
        this._planet.position.x = this._radius * Math.sin(this._angle);
        this._planet.position.z = this._radius * Math.cos(this._angle);
        this._angle += this._speed;
    }

    private _getOrbitCurve(): void {
        let tangent = this._radius * k;

        let hermite1 = BABYLON.Curve3.CreateHermiteSpline(
            new BABYLON.Vector3(this._radius, 0, 0),
            new BABYLON.Vector3(0, 0, tangent),
            new BABYLON.Vector3(0, 0, this._radius),
            new BABYLON.Vector3(-tangent, 0, 0), 20);

        let hermite2 = BABYLON.Curve3.CreateHermiteSpline(
            new BABYLON.Vector3(0, 0, this._radius),
            new BABYLON.Vector3(-tangent, 0, 0),
            new BABYLON.Vector3(-this._radius, 0, 0),
            new BABYLON.Vector3(0, 0, -tangent), 20);

        let hermite3 = BABYLON.Curve3.CreateHermiteSpline(
            new BABYLON.Vector3(-this._radius, 0, 0),
            new BABYLON.Vector3(0, 0, -tangent),
            new BABYLON.Vector3(0, 0, -this._radius),
            new BABYLON.Vector3(tangent, 0, 0), 20);

        let hermite4 = BABYLON.Curve3.CreateHermiteSpline(
            new BABYLON.Vector3(0, 0, -this._radius),
            new BABYLON.Vector3(tangent, 0, 0),
            new BABYLON.Vector3(this._radius, 0, 0),
            new BABYLON.Vector3(0, 0, tangent), 20);

        let myFullCurve = hermite1.continue(hermite2).continue(hermite3).continue(hermite4);

        let hermiteCurve = BABYLON.Mesh.CreateLines("hermiteCurve", myFullCurve.getPoints(), this._scene);
        hermiteCurve.color = orbitColor;
    }
}