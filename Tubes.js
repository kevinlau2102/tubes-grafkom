const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

cam.position.z = 5;

const renderer = new THREE.WebGLRenderer();


renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new THREE.OrbitControls(cam, renderer.domElement);
controls.update();

document.body.appendChild(renderer.domElement);
window.addEventListener("resize", function () {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

})
// const normal2 = new THREE.TextureLoader().load('assets/rumput_normal.jpg')
// const albedo2 = new THREE.TextureLoader().load('assets/rumput_albedo.jpg')

// const geometry2 = new THREE.PlaneGeometry( 40, 100 );
// const material2 = new THREE.MeshPhongMaterial( { map: albedo2 ,normalMap: normal2, side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( geometry2, material2 );
// plane.rotation.x = -1.56
// plane.position.y = -5
// plane.position.z = -15  
// scene.add( plane );



const field = new THREE.GLTFLoader();
field.load('assets/field/scene.gltf', function (gltf) {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.position.y = -7.5;
    gltf.scene.position.z = 26;

    scene.add(gltf.scene);
}, function (xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

}, function (error) {

    console.error(error);

})

const gawang = new THREE.GLTFLoader();
gawang.load('assets/gawang/scene.gltf', function (gltf) {
    gltf.scene.scale.set(0.023, 0.023, 0.023);
    gltf.scene.position.y = -2.9;
    gltf.scene.position.z = -21;
    gltf.scene.position.x = 5.8;
    gltf.scene.rotation.y = 3.15;


    scene.add(gltf.scene);
}, function (xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

}, function (error) {

    console.error(error);

})



const light = new THREE.PointLight();
light.intensity = 1;
light.position.set(-4, 15, 1);
scene.add(light);

const light2 = new THREE.PointLight();
light2.intensity = 1;
light2.position.set(0.5, 0.3, 1);
scene.add(light2);

// renderer.setClearColor( 0x87cefa, 1);

let world = new CANNON.World();
world.gravity.set(0, -10, 0);
world.broadphase = new CANNON.NaiveBroadphase();
let timeStamp = 1 / 60;

const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({ shape: planeShape, mass: 0});
planeBody.position.set(0, -3, 0);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

const gawangBack = new CANNON.Box(new CANNON.Vec3(5.7, 0.1, 2.5));
const gawangBackBody = new CANNON.Body({shape: gawangBack, mass: 0});
gawangBackBody.position.set(0, -0.7, -22.2);
gawangBackBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2.7)
world.addBody(gawangBackBody)

// let cannonBall = new CANNON.Sphere(1);
// let ballBody = new CANNON.Body({shape: cannonBall, mass: 5});
// ballBody.position.set(0, 5, 0);
// world.addBody(ballBody);

let ball = new CANNON.Sphere(0.4);
let ballBody = new CANNON.Body({ shape: ball, mass: 5});
ballBody.position.set(0, -2, -8);
ballBody.linearDamping = 0.31;
world.addBody(ballBody);

// ballBody.addEventListener("collide", function (e) {
//     console.log(Math.abs(e.contact.getImpactVelocityAlongNormal()));
// })

let debugRenderer = new THREE.CannonDebugRenderer(scene, world)

const soccerBall = new THREE.GLTFLoader();
let mesh = new THREE.Object3D();
soccerBall.load('assets/soccer_ball/scene.gltf', function (gltf) {
    mesh = gltf.scene;

    mesh.scale.set(0.4, 0.4, 0.4);
    mesh.position.copy(ballBody.position);
    mesh.quaternion.copy(ballBody.quaternion);

    scene.add(mesh);

}, function (xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

}, function (error) {

    console.error(error);

});

let speed = 0;
let acceleration = 0.002;
let angle = 0;
let maxSpeed = 0.5;

let keyDown = false;
let keyPress = "";

document.onkeydown = (event) => {
    if (event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowRight" || event.key == "ArrowLeft") {
        keyDown = true;
        keyPress = event.key;
    }
    // switch (event.key) {
    //     case "ArrowUp":
    //         speed -= acceleration;
    //         break;
    //     case "ArrowDown":
    //         speed += acceleration;
    //         break;
    //     case "ArrowLeft":
    //         angle += Math.PI / 180;
    //         break;
    //     case "ArrowRight":
    //         angle -= Math.PI / 180;
    //         break;
    // }
}

document.onkeyup = (event) => {
    if (event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowRight") {
        keyDown = false;
    }
}

setInterval(function () {
    if (keyDown) {
        if (keyPress == "ArrowUp") {
            speed -= acceleration;
        }
        if (keyPress == "ArrowDown") {
            speed += acceleration;
        }

    }
})

function moveBall() {

    if (speed > maxSpeed) {
        speed = maxSpeed;
    }
    if (speed < maxSpeed * -1) {
        speed = -maxSpeed;
    }
    if (keyDown == false && speed > 0) {
        if (speed - acceleration < 0) {
            speed = 0
        } else {
            speed -= acceleration;
        }
    }

    if (keyDown == false && speed < 0) {
        if (speed + acceleration > 0) {
            speed = 0
        } else {
            speed += acceleration;
        }
    }
    
    // ballBody.position.x += speed * Math.sin(angle);
    // ballBody.position.z += speed * Math.cos(angle);
    let angularVelocityX = (speed) * 180 / Math.PI;
    ballBody.angularVelocity.set(angularVelocityX, 0, 0);
}


function draw() {
    world.step(timeStamp);
    debugRenderer.update();
    mesh.position.copy(ballBody.position);
    mesh.quaternion.copy(ballBody.quaternion);

    // sphere.rotation.x +=0.05
    renderer.render(scene, cam);
    controls.target.copy(ballBody.position);
    controls.update();

    moveBall();
    requestAnimationFrame(draw);
}

draw();