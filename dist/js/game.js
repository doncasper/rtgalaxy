var elements = 16;
var k = 1.6568542;
var orbitColor = new BABYLON.Color3(0.25, 0.25, 0.45);
var Planet = (function () {
    function Planet(scene, name, distance, size, speed, angle) {
        var _this = this;
        this._scene = scene;
        this._radius = distance;
        this._speed = speed;
        this._angle = angle;
        this._planet = BABYLON.Mesh.CreateSphere(name, elements, size, scene);
        this._planet.position.x = distance;
        this._getOrbitCurve();
        this._moveByOrbit();
        this._scene.registerBeforeRender(function () { _this._moveByOrbit(); });
    }
    Planet.prototype._moveByOrbit = function () {
        this._planet.position.x = this._radius * Math.sin(this._angle);
        this._planet.position.z = this._radius * Math.cos(this._angle);
        this._angle += this._speed;
    };
    Planet.prototype._getOrbitCurve = function () {
        var tangent = this._radius * k;
        var hermite1 = BABYLON.Curve3.CreateHermiteSpline(new BABYLON.Vector3(this._radius, 0, 0), new BABYLON.Vector3(0, 0, tangent), new BABYLON.Vector3(0, 0, this._radius), new BABYLON.Vector3(-tangent, 0, 0), 20);
        var hermite2 = BABYLON.Curve3.CreateHermiteSpline(new BABYLON.Vector3(0, 0, this._radius), new BABYLON.Vector3(-tangent, 0, 0), new BABYLON.Vector3(-this._radius, 0, 0), new BABYLON.Vector3(0, 0, -tangent), 20);
        var hermite3 = BABYLON.Curve3.CreateHermiteSpline(new BABYLON.Vector3(-this._radius, 0, 0), new BABYLON.Vector3(0, 0, -tangent), new BABYLON.Vector3(0, 0, -this._radius), new BABYLON.Vector3(tangent, 0, 0), 20);
        var hermite4 = BABYLON.Curve3.CreateHermiteSpline(new BABYLON.Vector3(0, 0, -this._radius), new BABYLON.Vector3(tangent, 0, 0), new BABYLON.Vector3(this._radius, 0, 0), new BABYLON.Vector3(0, 0, tangent), 20);
        var myFullCurve = hermite1.continue(hermite2).continue(hermite3).continue(hermite4);
        var hermiteCurve = BABYLON.Mesh.CreateLines("hermiteCurve", myFullCurve.getPoints(), this._scene);
        hermiteCurve.color = orbitColor;
    };
    return Planet;
}());
var _this = this;
var planets = [
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
var Galaxy = (function () {
    function Galaxy(canvas) {
        this._engine = new BABYLON.Engine(canvas);
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
        this._camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 20, BABYLON.Vector3.Zero(), this._scene);
        this._camera.attachControl(canvas, true);
        this._camera.lowerBetaLimit = 0.1;
        this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        this._camera.lowerRadiusLimit = 3;
        this._camera.upperRadiusLimit = 55;
        this._camera.wheelPrecision = 10;
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