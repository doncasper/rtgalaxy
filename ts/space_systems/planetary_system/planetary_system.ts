/// <reference path="../../../node_modules/babylonjs/babylon.d.ts" />
/// <reference path="../../celestials/stars/star.ts" />
/// <reference path="../../celestials/planets/planet.ts" />
/// <reference path="../base.ts" />


module PLANETARY_SYSTEM {
    import BaseSystem = SPACE_SYSTEMS.BaseSystem;

    export class PlanetarySystem extends BaseSystem {
        private _planets: { [id: string]: PLANETS.Planet; } = {};
        private _highlightedPlanetId: number;

        constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement, planets: {}[]) {
            super(engine, canvas);

            new STARS.Star(this._scene, "sun", 15, 5, 5, 0);

            for (let i = 0; i < planets.length; i++) {
                let planet = planets[i];
                this._createPlanet(planet["id"], planet["name"], planet["distance"], planet["size"], planet["speed"], planet["angle"]);
            }
        }

        private _createPlanet(id: number, name: string, distance: number, size: number, speed: number, angle: number): void {
            let planet = new PLANETS.Planet(this._scene, id, name, distance, size, speed, angle);
            this._planets[id] = planet;

            planet.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (evt: BABYLON.ActionEvent) => {
                    if (this._highlightedPlanetId !== undefined) {
                        if (planet.id == this._highlightedPlanetId) {
                            return
                        }

                        this._planets[this._highlightedPlanetId].removeHighlight();
                    }

                    planet.addHighlight();
                    this._highlightedPlanetId = planet.id;
                })
            );
        }
    }
}