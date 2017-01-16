/// <reference path="../node_modules/babylonjs/babylon.d.ts" />
/// <reference path="./celestials/planets/planet.ts" />
/// <reference path="./space_systems/planetary_system/planetary_system.ts" />


const planets: {}[] = [
    {
        "id": 1,
        "name": "mercury",
        "distance": 20,
        "size": 1,
        "speed": 0.0001,
        "angle": 0
    },
    {
        "id": 2,
        "name": "venus",
        "distance": 30,
        "size": 1.2,
        "speed": 0.00009,
        "angle": 3
    },
    {
        "id": 3,
        "name": "earth",
        "distance": 40,
        "size": 1.5,
        "speed": 0.00008,
        "angle": 5
    },
    {
        "id": 4,
        "name": "mars",
        "distance": 50,
        "size": 1.75,
        "speed": 0.00007,
        "angle": 1
    },
    {
        "id": 5,
        "name": "jupiter",
        "distance": 60,
        "size": 2.5,
        "speed": 0.00006,
        "angle": 4.4
    },
    {
        "id": 6,
        "name": "saturn",
        "distance": 70,
        "size": 3,
        "speed": 0.00005,
        "angle": 4
    },
    {
        "id": 7,
        "name": "uranus",
        "distance": 80,
        "size": 3.5,
        "speed": 0.00004,
        "angle": 5.3
    },
    {
        "id": 8,
        "name": "neptune",
        "distance": 90,
        "size": 3.7,
        "speed": 0.00003,
        "angle": .75
    }
];

const scenes: {} = {
    "galaxy": PLANETARY_SYSTEM.PlanetarySystem,
    "star_system": PLANETARY_SYSTEM.PlanetarySystem,
    "planetary_system": PLANETARY_SYSTEM.PlanetarySystem
};

class Game {
    private _engine: BABYLON.Engine;
    private _scenes: {};
    private _currentScene: string;

    constructor(canvas: HTMLCanvasElement) {
        this._engine = new BABYLON.Engine(canvas, true, { stencil: true });

        this._scenes = {
            "planetary_system": new PLANETARY_SYSTEM.PlanetarySystem(this._engine, canvas, planets)
        };

        this._currentScene = "planetary_system";
    }

    public runRenderLoop(): void {
        this._engine.runRenderLoop(() => {
            this._scenes[this._currentScene].render();
        });
    }

    public resize(): void {
        this._engine.resize();
    }
}


window.addEventListener('DOMContentLoaded', () => {
    let canvas = <HTMLCanvasElement>document.getElementById("render");

    let gameScene = new Game(canvas);
    gameScene.runRenderLoop();

    // auto resize window
    this.addEventListener('resize', () => {
        gameScene.resize();
    })
});