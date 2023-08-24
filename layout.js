const sideMenu = document.getElementById('sideMenu');
const hamburgerMenu = document.getElementById('hamburgerMenu');

hamburgerMenu.addEventListener('click', () => {
    if (sideMenu.classList.contains('open')) {
        sideMenu.classList.remove('open');
        // Adjust Cesium container to take full width
        document.getElementById('cesiumContainer').style.left = '0';
    } else {
        sideMenu.classList.add('open');
        // Adjust Cesium container to account for side menu width
        document.getElementById('cesiumContainer').style.left = '250px'; // This should match the width of the side menu
    }
});
