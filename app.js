Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNTA4MjRhNS03ZGI0LTQyMGQtODMzMS04MWMxNWJmYmM3OGIiLCJpZCI6ODI2MDksImlhdCI6MTY0NDk2MTQyNH0.mal03n4wQkAJl9uReGnlKtkqXpDl5s57OpXatR8zwaA";

const terrainProvider = Cesium.createWorldTerrain({
    requestVertexNormals: true
});

var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: terrainProvider,
    baseLayerPicker: true
});

// Add OSM 3D buildings
viewer.scene.primitives.add(Cesium.createOsmBuildings());

// Set the initial view to New York City
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(11.592640449882197, 48.1357942171306, 1000),
    orientation: {
        heading: Cesium.Math.toRadians(25.0),
        pitch: Cesium.Math.toRadians(-15.0),
        roll: 0.0
    }
});

// Flood simulation code
const viewModel = {
    waterLevel: 552.0
};

let increasing = true; // To determine if the water level is increasing or decreasing
let animationInterval; // To store the interval ID

function startAnimation() {
    animationInterval = setInterval(() => {
        if (increasing) {
            viewModel.waterLevel += 5; // Adjust this value to control the speed of the animation
            if (viewModel.waterLevel >= 600) {
                increasing = false;
            }
        } else {
            viewModel.waterLevel -= 5; // Adjust this value to control the speed of the animation
            if (viewModel.waterLevel <= 450) {
                increasing = true;
            }
        }
        updateWaterLevel();
    }, 200); // This will update the water level every second. Adjust this value to control the animation speed.
}

// Start the animation when the page loads
startAnimation();

// Add event listener to the slider to stop the animation when touched or clicked
const slider = document.querySelector("input[type='range']");
slider.addEventListener("mousedown", () => {
    clearInterval(animationInterval);
});
slider.addEventListener("touchstart", () => {
    clearInterval(animationInterval);
});

Cesium.knockout.track(viewModel);
const toolbar = document.getElementById('toolbar');
Cesium.knockout.applyBindings(viewModel, toolbar);
Cesium.knockout.getObservable(viewModel, 'waterLevel').subscribe(updateWaterLevel);

function updateWaterLevel() {
    const waterHeight = Number(viewModel.waterLevel);

    // Log the current value of the slider
    console.log("Current water level:", waterHeight);

    const material = Cesium.createElevationBandMaterial({
        scene: viewer.scene,
        layers: [
            {
                entries: [
                    {
                        height: 0,
                        color: new Cesium.Color(0.0, 0.0, 1.0, 0.5)
                    },
                    {
                        height: waterHeight,
                        color: new Cesium.Color(0.0, 0.0, 1.0, 0.5)
                    },
                    {
                        height: waterHeight,
                        color: new Cesium.Color(1.0, 1.0, 1.0, 0.0)
                    },
                    {
                        height: 3000,
                        color: new Cesium.Color(1.0, 1.0, 1.0, 0.0)
                    }
                ]
            }
        ]
    });
    viewer.scene.globe.material = material;
}

updateWaterLevel();
