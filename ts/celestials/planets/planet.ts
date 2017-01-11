/// <reference path="../../../node_modules/babylonjs/babylon.d.ts" />

const segments: number = 16;
const k: number = 1.6568542; // Geometric constant for drawing planet orbit
const orbitColor: BABYLON.Color3 = new BABYLON.Color3(0.25, 0.25, 0.25);
const sizeScale: number = 10000;
const speedScale: number = 10000;
const orbitScale: number = 10;

class Planet {
    private _scene: BABYLON.Scene;

    private _name: string;

    private _planet: BABYLON.Mesh;
    private _material: BABYLON.StandardMaterial;
    private _size: number;
    private _orbitSize: number;
    private _angle: number;
    private _tangent: number;
    private _speed: number;
    private _hl: BABYLON.HighlightLayer;

    constructor(scene: BABYLON.Scene, name: string, orbitSize: number, size: number, speed: number, angle: number) {
        this._scene = scene;
        this._name = name;
        this._size = size / sizeScale;
        this._orbitSize = orbitSize / orbitScale;
        this._speed = speed / speedScale;
        this._angle = angle;
        this._tangent = this._orbitSize * k;


        this._planet = BABYLON.Mesh.CreateSphere(this._name, segments, this._size, this._scene);
        this._planet.position.x = this._orbitSize;
        this._showOrbitCurve();

        this._setColor();

        this._hl = new BABYLON.HighlightLayer(this._name+"_hl", this._scene);

        this._planet.actionManager = new BABYLON.ActionManager(this._scene);
        this._planet.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (evt: BABYLON.ActionEvent) => {
                this._hl.addMesh(this._planet, BABYLON.Color3.Green());
            })
        );

        this._scene.registerBeforeRender(() => {this._moveByOrbit()});
    }

    private _setColor(): void {
        this._material = new BABYLON.StandardMaterial(this._name+"Color", this._scene);
        this._material.alpha = 1;
        this._material.diffuseColor = new BABYLON.Color3(1, 1, 2);
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

        let orbit = BABYLON.Mesh.CreateLines(this._name+"Orbit", orbitCurve.getPoints(), this._scene);
        orbit.color = orbitColor;
    }
}