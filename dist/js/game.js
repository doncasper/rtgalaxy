var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PLANETS;
(function (PLANETS) {
    var segments = 16;
    var k = 1.6568542;
    var orbitColor = new BABYLON.Color3(0.25, 0.25, 0.25);
    var sizeScale = 10000;
    var speedScale = 10000;
    var orbitScale = 10;
    var Planet = (function () {
        function Planet(scene, id, name, orbitSize, size, speed, angle) {
            var _this = this;
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
            this._scene.registerBeforeRender(function () {
                _this._moveByOrbit();
            });
        }
        Planet.prototype.addHighlight = function () {
            this._highlight.addMesh(this._planet, BABYLON.Color3.Green());
        };
        Planet.prototype.removeHighlight = function () {
            this._highlight.removeMesh(this._planet);
        };
        Planet.prototype._setColor = function () {
            this._material = new BABYLON.StandardMaterial(this._name + "Color", this._scene);
            this._material.alpha = 1;
            this._material.diffuseColor = new BABYLON.Color3(1, 1, 1);
            this._planet.material = this._material;
        };
        Planet.prototype._moveByOrbit = function () {
            this._planet.position.x = this._orbitSize * Math.sin(this._angle);
            this._planet.position.z = this._orbitSize * Math.cos(this._angle);
            this._angle += this._speed;
        };
        Planet.prototype._showOrbitCurve = function () {
            var hermite1 = BABYLON.Curve3.CreateHermiteSpline(new BABYLON.Vector3(this._orbitSize, 0, 0), new BABYLON.Vector3(0, 0, this._tangent), new BABYLON.Vector3(0, 0, this._orbitSize), new BABYLON.Vector3(-this._tangent, 0, 0), segments);
            var hermite2 = BABYLON.Curve3.CreateHermiteSpline(new BABYLON.Vector3(0, 0, this._orbitSize), new BABYLON.Vector3(-this._tangent, 0, 0), new BABYLON.Vector3(-this._orbitSize, 0, 0), new BABYLON.Vector3(0, 0, -this._tangent), segments);
            var hermite3 = BABYLON.Curve3.CreateHermiteSpline(new BABYLON.Vector3(-this._orbitSize, 0, 0), new BABYLON.Vector3(0, 0, -this._tangent), new BABYLON.Vector3(0, 0, -this._orbitSize), new BABYLON.Vector3(this._tangent, 0, 0), segments);
            var hermite4 = BABYLON.Curve3.CreateHermiteSpline(new BABYLON.Vector3(0, 0, -this._orbitSize), new BABYLON.Vector3(this._tangent, 0, 0), new BABYLON.Vector3(this._orbitSize, 0, 0), new BABYLON.Vector3(0, 0, this._tangent), segments);
            var orbitCurve = hermite1.continue(hermite2).continue(hermite3).continue(hermite4);
            var orbit = BABYLON.Mesh.CreateLines(this._name + "Orbit", orbitCurve.getPoints(), this._scene);
            orbit.color = orbitColor;
        };
        return Planet;
    }());
    PLANETS.Planet = Planet;
})(PLANETS || (PLANETS = {}));
var STARS;
(function (STARS) {
    var segments = 20;
    var materialAlpha = 1;
    var position = BABYLON.Vector3.Zero();
    var Star = (function () {
        function Star(scene, name, size, red, green, blue) {
            this._color = Star._getColor(red, green, blue);
            this._size = size;
            this._scene = scene;
            this._name = name;
            this._star = BABYLON.Mesh.CreateSphere(this._name, segments, size, this._scene);
            this._star.material = this._getMaterial();
            this._star.position.y = 0;
            var sunLight = new BABYLON.PointLight(this._name + "Light", position, this._scene);
            sunLight.diffuse = new BABYLON.Color3(.5, .5, .5);
            sunLight.specular = new BABYLON.Color3(0, 0, 0);
        }
        Star._getColor = function (red, green, blue) {
            return new BABYLON.Color3(red, green, blue);
        };
        Star.prototype._getMaterial = function () {
            var material = new BABYLON.StandardMaterial(this._name + "Material", this._scene);
            material.alpha = materialAlpha;
            material.diffuseColor = this._color;
            return material;
        };
        return Star;
    }());
    STARS.Star = Star;
})(STARS || (STARS = {}));
var SPACE_SYSTEMS;
(function (SPACE_SYSTEMS) {
    var background = new BABYLON.Color3(.08, .08, .1);
    var lightDiffuse = new BABYLON.Color3(.35, .35, .35);
    var lightSpecular = new BABYLON.Color3(0, 0, 0);
    var topLightPosition = new BABYLON.Vector3(0, 1, 0);
    var bottomLightPosition = new BABYLON.Vector3(0, -1, 0);
    var BaseSystem = (function () {
        function BaseSystem(engine, canvas) {
            this._scene = new BABYLON.Scene(engine);
            this._scene.clearColor = background;
            this._setUpCamera(canvas);
            this._setUpLight();
        }
        BaseSystem.prototype._setUpCamera = function (canvas) {
            this._camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 130, BABYLON.Vector3.Zero(), this._scene);
            this._camera.attachControl(canvas, true);
            this._camera.lowerBetaLimit = 0.1;
            this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
            this._camera.lowerRadiusLimit = 3;
            this._camera.upperRadiusLimit = 200;
            this._camera.wheelPrecision = 10;
        };
        BaseSystem.prototype._setUpLight = function () {
            this._topLight = new BABYLON.HemisphericLight('topLight', topLightPosition, this._scene);
            this._topLight.diffuse = lightDiffuse;
            this._topLight.specular = lightSpecular;
            this._bottomLight = new BABYLON.HemisphericLight('bottomLight', bottomLightPosition, this._scene);
            this._bottomLight.diffuse = lightDiffuse;
            this._bottomLight.specular = lightSpecular;
        };
        BaseSystem.prototype.render = function () {
            this._scene.render();
        };
        return BaseSystem;
    }());
    SPACE_SYSTEMS.BaseSystem = BaseSystem;
})(SPACE_SYSTEMS || (SPACE_SYSTEMS = {}));
var PLANETARY_SYSTEM;
(function (PLANETARY_SYSTEM) {
    var BaseSystem = SPACE_SYSTEMS.BaseSystem;
    var PlanetarySystem = (function (_super) {
        __extends(PlanetarySystem, _super);
        function PlanetarySystem(engine, canvas, planets) {
            var _this = _super.call(this, engine, canvas) || this;
            _this._planets = {};
            new STARS.Star(_this._scene, "sun", 15, 5, 5, 0);
            for (var i = 0; i < planets.length; i++) {
                var planet = planets[i];
                _this._createPlanet(planet["id"], planet["name"], planet["distance"], planet["size"], planet["speed"], planet["angle"]);
            }
            return _this;
        }
        PlanetarySystem.prototype._createPlanet = function (id, name, distance, size, speed, angle) {
            var _this = this;
            var planet = new PLANETS.Planet(this._scene, id, name, distance, size, speed, angle);
            this._planets[id] = planet;
            planet.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
                if (_this._highlightedPlanetId !== undefined) {
                    if (planet.id == _this._highlightedPlanetId) {
                        return;
                    }
                    _this._planets[_this._highlightedPlanetId].removeHighlight();
                }
                planet.addHighlight();
                _this._highlightedPlanetId = planet.id;
            }));
        };
        return PlanetarySystem;
    }(BaseSystem));
    PLANETARY_SYSTEM.PlanetarySystem = PlanetarySystem;
})(PLANETARY_SYSTEM || (PLANETARY_SYSTEM = {}));
var _this = this;
var planets = [
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
var scenes = {
    "galaxy": PLANETARY_SYSTEM.PlanetarySystem,
    "star_system": PLANETARY_SYSTEM.PlanetarySystem,
    "planetary_system": PLANETARY_SYSTEM.PlanetarySystem
};
var Game = (function () {
    function Game(canvas) {
        this._engine = new BABYLON.Engine(canvas, true, { stencil: true });
        this._scenes = {
            "planetary_system": new PLANETARY_SYSTEM.PlanetarySystem(this._engine, canvas, planets)
        };
        this._currentScene = "planetary_system";
    }
    Game.prototype.runRenderLoop = function () {
        var _this = this;
        this._engine.runRenderLoop(function () {
            _this._scenes[_this._currentScene].render();
        });
    };
    Game.prototype.resize = function () {
        this._engine.resize();
    };
    return Game;
}());
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById("render");
    var gameScene = new Game(canvas);
    gameScene.runRenderLoop();
    _this.addEventListener('resize', function () {
        gameScene.resize();
    });
});
//# sourceMappingURL=game.js.map