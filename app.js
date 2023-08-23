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
    destination: Cesium.Cartesian3.fromDegrees(-74.01, 40.71, 1500),
    orientation: {
        heading: Cesium.Math.toRadians(20.0),
        pitch: Cesium.Math.toRadians(-35.0),
        roll: 0.0
    }
});

// Flood simulation code
const viewModel = {
    waterLevel: 0.0
};

Cesium.knockout.track(viewModel);
const toolbar = document.getElementById('toolbar');
Cesium.knockout.applyBindings(viewModel, toolbar);
Cesium.knockout.getObservable(viewModel, 'waterLevel').subscribe(updateWaterLevel);

function updateWaterLevel() {
    const waterHeight = Number(viewModel.waterLevel);

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
                        height: 10000,
                        color: new Cesium.Color(1.0, 1.0, 1.0, 0.0)
                    }
                ]
            }
        ]
    });
    viewer.scene.globe.material = material;
}

updateWaterLevel();
