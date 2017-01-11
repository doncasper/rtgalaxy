var segments = 16;
var k = 1.6568542;
var orbitColor = new BABYLON.Color3(0.25, 0.25, 0.25);
var sizeScale = 10000;
var speedScale = 10000;
var orbitScale = 10;
var Planet = (function () {
    function Planet(scene, name, orbitSize, size, speed, angle) {
        var _this = this;
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
        this._hl = new BABYLON.HighlightLayer(this._name + "_hl", this._scene);
        this._planet.actionManager = new BABYLON.ActionManager(this._scene);
        this._planet.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
            _this._hl.addMesh(_this._planet, BABYLON.Color3.Green());
        }));
        this._scene.registerBeforeRender(function () { _this._moveByOrbit(); });
    }
    Planet.prototype._setColor = function () {
        this._material = new BABYLON.StandardMaterial(this._name + "Color", this._scene);
        this._material.alpha = 1;
        this._material.diffuseColor = new BABYLON.Color3(1, 1, 2);
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
var _this = this;
var planets = [
    {
        "name": "mercury",
        "distance": 34.5,
        "size": 2439,
        "speed": 47.36,
        "angle": 0
    },
    {
        "name": "venus",
        "distance": 54,
        "size": 6051,
        "speed": 35.02,
        "angle": 3.1
    },
    {
        "name": "earth",
        "distance": 76,
        "size": 6378,
        "speed": 29.78,
        "angle": 4.6
    },
    {
        "name": "mars",
        "distance": 124,
        "size": 3396,
        "speed": 24.13,
        "angle": 5.3
    },
    {
        "name": "jupiter",
        "distance": 408,
        "size": 71492,
        "speed": 0.0019,
        "angle": 5.7
    },
    {
        "name": "saturn",
        "distance": 756.5,
        "size": 60268,
        "speed": 0.0021,
        "angle": 4.7
    },
    {
        "name": "uranus",
        "distance": 1502,
        "size": 25559,
        "speed": 0.0016,
        "angle": 3.7
    },
    {
        "name": "neptune",
        "distance": 2276.5,
        "size": 24764,
        "speed": 0.0015,
        "angle": 2.7
    }
];
var Galaxy = (function () {
    function Galaxy(canvas) {
        this._engine = new BABYLON.Engine(canvas, true, { stencil: true });
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.clearColor = new BABYLON.Color3(.08, .08, .1);
        this._setUpCamera(canvas);
        this._setUpLight();
        this._createSun(3);
        for (var i = 0; i < planets.length; i++) {
            var planet = planets[i];
            this._createPlanet(planet.name, planet.distance, planet.size, planet.speed, planet.angle);
        }
    }
    Galaxy.prototype.runRenderLoop = function () {
        var _this = this;
        this._engine.runRenderLoop(function () {
            _this._scene.render();
        });
    };
    Galaxy.prototype.resize = function () {
        this._engine.resize();
    };
    Galaxy.prototype._createPlayer = function () {
        var playerColor = new BABYLON.StandardMaterial("texturePlayer", this._scene);
        playerColor.alpha = 1;
        playerColor.diffuseColor = new BABYLON.Color3(0, 3, 0);
        var player = BABYLON.Mesh.CreateBox('player', 0.3, this._scene);
        player.material = playerColor;
        player.position.x = 10;
        player.position.y = 0;
        player.actionManager = new BABYLON.ActionManager(this._scene);
        player.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnPickTrigger, player, "position.x", 3));
    };
    Galaxy.prototype._setUpSkyBox = function () {
        var skybox = BABYLON.Mesh.CreateBox('skybox', 1000, this._scene);
        var skyboxMaterial = new BABYLON.StandardMaterial('skyboxMat', this._scene);
        skyboxMaterial.backFaceCulling = false;
        skybox.infiniteDistance = true;
        skybox.material = skyboxMaterial;
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/textures/stars/skybox', this._scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    };
    Galaxy.prototype._setUpLight = function () {
        this._topLight = new BABYLON.HemisphericLight('topLight', new BABYLON.Vector3(0, 1, 0), this._scene);
        this._topLight.diffuse = new BABYLON.Color3(.5, .5, .5);
        this._topLight.specular = new BABYLON.Color3(0, 0, 0);
        this._bottomLight = new BABYLON.HemisphericLight('bottomLight', new BABYLON.Vector3(0, -1, 0), this._scene);
        this._bottomLight.diffuse = new BABYLON.Color3(.5, .5, .5);
        this._bottomLight.specular = new BABYLON.Color3(0, 0, 0);
    };
    Galaxy.prototype._setUpCamera = function (canvas) {
        this._camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 350, BABYLON.Vector3.Zero(), this._scene);
        this._camera.attachControl(canvas, true);
        this._camera.lowerBetaLimit = 0.1;
        this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        this._camera.lowerRadiusLimit = 3;
        this._camera.upperRadiusLimit = 500;
        this._camera.wheelPrecision = 20;
    };
    Galaxy.prototype._createPlanet = function (name, distance, size, speed, angle) {
        new Planet(this._scene, name, distance, size, speed, angle);
    };
    Galaxy.prototype._createSun = function (size) {
        var materialSun = new BABYLON.StandardMaterial("textureSun", this._scene);
        materialSun.alpha = 1;
        materialSun.diffuseColor = new BABYLON.Color3(2, 2, 0);
        var sun = BABYLON.Mesh.CreateSphere('sun', 20, size, this._scene);
        sun.material = materialSun;
        sun.position.y = 0;
        var sunLight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3(0, 0, 0), this._scene);
        sunLight.diffuse = new BABYLON.Color3(.3, .3, 0);
        sunLight.specular = new BABYLON.Color3(.2, .2, 0);
    };
    ;
    return Galaxy;
}());
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById("render");
    var scene = new Galaxy(canvas);
    scene.runRenderLoop();
    _this.addEventListener('resize', function () {
        scene.resize();
    });
});
//# sourceMappingURL=game.js.map