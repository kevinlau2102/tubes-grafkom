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
const normal2 = new THREE.TextureLoader().load('assets/rumput_normal.jpg')
const albedo2 = new THREE.TextureLoader().load('assets/rumput_albedo.jpg')

const geometry2 = new THREE.PlaneGeometry( 30, 9 );
const material2 = new THREE.MeshPhongMaterial( { map: albedo2 ,normalMap: normal2} );
const plane = new THREE.Mesh( geometry2, material2 );
plane.rotation.x = -1
plane.position.y = -5
scene.add( plane );



const light = new THREE.PointLight();
light.intensity = 1;
light.position.set(-4, 0.5, 1);
scene.add(light);

const light2 = new THREE.PointLight();
light.intensity = 1;
light.position.set(0.5, 0.3, 2);
scene.add(light2);

// renderer.setClearColor( 0x87cefa, 1);
function draw() {

    // sphere.rotation.x +=0.05
    renderer.render(scene, cam);
    requestAnimationFrame(draw);
}
draw();