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

let degree = 0;
let continueMoving = true; // Flag to determine if the camera should continue moving

const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

// Stop the camera movement on left click
handler.setInputAction(() => {
    continueMoving = false;
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Stop the camera movement on right click
handler.setInputAction(() => {
    continueMoving = false;
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

function moveCamera() {
    // If the flag is set to false, stop the camera movement
    if (!continueMoving) {
        return;
    }

    // Calculate the new heading based on the degree
    const heading = Cesium.Math.toRadians(degree);

    // Update the camera's position
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(11.55 + 0.05 * Math.cos(heading), 48.13 + 0.05 * Math.sin(heading), 1000),
        orientation: {
            heading: heading,
            pitch: Cesium.Math.toRadians(-15.0),
            roll: 0.0
        },
        duration: 7, // Duration for each segment of the movement
        complete: () => {
            degree += 25; // Increment the degree for the next movement
            if (degree < 360) {
                moveCamera(); // Continue moving the camera only if the flag is true
            }
            if (!continueMoving) {
                return;
            }
        }
    });
}

// Start the camera movement
moveCamera();



// Flood simulation code
const viewModel = {
    waterLevel: 390
};

let increasing = true; // To determine if the water level is increasing or decreasing
let animationInterval; // To store the interval ID

function startAnimation() {
    animationInterval = setInterval(() => {
        if (increasing) {
            viewModel.waterLevel += 2; // Adjust this value to control the speed of the animation
            if (viewModel.waterLevel >= 600) {
                increasing = false;
            }
        } else {
            viewModel.waterLevel -= 2; // Adjust this value to control the speed of the animation
            if (viewModel.waterLevel <= 500) {
                increasing = true;
            }
        }
        updateWaterLevel();
    }, 100); // This will update the water level every second. Adjust this value to control the animation speed.
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

let modalShown = false;

document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('alertModal').style.display = 'none';
});


function updateWaterLevel() {
    const waterHeight = Number(viewModel.waterLevel);

    // Check if water level hits 600 and modal hasn't been shown before
    if (waterHeight >= 600 && !modalShown) {
        document.getElementById('alertModal').style.display = 'block';
        modalShown = true; // Set the flag to true

        // Hide the modal after 4 seconds
        setTimeout(() => {
            document.getElementById('alertModal').style.display = 'none';
        }, 5000);
    }



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
