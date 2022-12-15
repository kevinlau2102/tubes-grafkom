const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

cam.position.z = 5;

const renderer = new THREE.WebGLRenderer();


renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new THREE.OrbitControls(cam,renderer.domElement);
controls.update();

document.body.appendChild(renderer.domElement); 
window.addEventListener("resize", function () {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

})
const normal2 = new THREE.TextureLoader().load('assets/rumput_normal.jpg')
const albedo2 = new THREE.TextureLoader().load('assets/rumput_albedo.jpg')

const geometry2 = new THREE.PlaneGeometry( 40, 100 );
const material2 = new THREE.MeshPhongMaterial( { map: albedo2 ,normalMap: normal2, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry2, material2 );
plane.rotation.x = -1.56
plane.position.y = -5
plane.position.z = -15  
scene.add( plane );

const ball = new THREE.GLTFLoader();
ball.load( 'assets/soccer_ball/scene.gltf', function ( gltf ) {
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.y = -2;
    gltf.scene.position.z = -8;

    scene.add( gltf.scene );

}, function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

}, function ( error ) {

    console.error( error );

} );



const light = new THREE.PointLight();
light.intensity = 1;
light.position.set(-4, 15, 1);
scene.add(light);

const light2 = new THREE.PointLight();
light2.intensity = 1;
light2.position.set(0.5, 0.3, 1);
scene.add(light2);

// renderer.setClearColor( 0x87cefa, 1);
function draw() {

    // sphere.rotation.x +=0.05
    renderer.render(scene, cam);
    controls.update();
    requestAnimationFrame(draw);
}
draw();