const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

cam.position.z = 5;

const renderer = new THREE.WebGLRenderer({alpha:true});


renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement); 
window.addEventListener("resize", function () {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

})