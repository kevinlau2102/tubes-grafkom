
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

let rayCast = new THREE.Raycaster();
let mouse = {};
let selected;
let arrow = new THREE.ArrowHelper(rayCast.ray.direction, cam.position, 300, 0xFF0000);
scene.add(arrow);

addEventListener("click", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * -2 + 1;

    console.log(e.clientX, e.clientY);

    rayCast.setFromCamera(mouse, cam);
    let items = rayCast.intersectObjects(scene.children);
    arrow.setDirection(rayCast.ray.direction);


    if (((mouse.y + 0.25) * 8000) < 2100) {
        ballBody.force.set(Math.sin(mouse.x * 2) * 7600, (mouse.y + 0.25) * 10000, (mouse.y - 1) * 7000)

    } else {
        ballBody.force.set(Math.sin(mouse.x * 2) * 7600, (mouse.y + 0.25) * 8000, (mouse.y - 1) * 7000)


    }


    items.forEach((i) => {
        if (i.object.name == "defaultMaterial") {
            console.log(i.object.name);
            selected = i.object.name
        }
    });
});


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

const gk = new THREE.GLTFLoader();
let meshGoalKeeper = new THREE.Object3D();
let mixer;
gk.load('assets/gk/scene.gltf', function (gltf) {
    meshGoalKeeper = gltf.scene;
    meshGoalKeeper.scale.set(0.023, 0.023, 0.023);
    meshGoalKeeper.position.y = -2.9;
    meshGoalKeeper.position.z = -19;
    meshGoalKeeper.position.x = 0;

    goalKeeperBody.position.copy(meshGoalKeeper);



    scene.add(meshGoalKeeper);
    mixer = new THREE.AnimationMixer(meshGoalKeeper);
    const clips = gltf.animations;
    clips.forEach(function (clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

}, function (xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

}, function (error) {

    console.error(error);

})


// const loader = new THREE.FBXLoader();
// loader.setPath('./assets/orang/');
// loader.load('mremireh_o_desbiens.fbx', (fbx) => {
//   fbx.scale.setScalar(0.1);
//   fbx.traverse(c => {
//     c.castShadow = true;
//   });

//   const params = {
//     target: fbx,
//     camera: this._camera,
//   }
// //   this._controls = new BasicCharacterControls(params);

//   const anim = new THREE.FBXLoader();
//   anim.setPath('./assets/orang/');
//   anim.load('walk.fbx', (anim) => {
//     const m = new THREE.AnimationMixer(fbx);
//     scene.add(m);
//     const idle = m.clipAction(anim.animations[0]);
//     idle.play();
//   });
//   scene.add(fbx);
// });

//     const fbxLoader = new THREE.FBXLoader();
// fbxLoader.setPath('./assets/orang/');
// fbxLoader.load('Ch31_nonPBR.fbx', (fbx) => {
//   fbx.scale.setScalar(0.023);
//   fbx.traverse(c => {
//     c.castShadow = true;
//   });

//   scene.add(fbx);

//   fbxLoader.load('./assets/orang/walk.fbx', (object) => {
//     const animationAction = mixer.clipAction(
//         object.animations[0]
//     )
//     animationActions.push(animationAction)
//   });
// //   this._controls = new BasicCharacterControls(params);


// });




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
const planeBody = new CANNON.Body({ shape: planeShape, mass: 0 });
planeBody.position.set(0, -3, 0);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

const gawangBack = new CANNON.Box(new CANNON.Vec3(5.7, 0.1, 2.5));
const gawangBackBody = new CANNON.Body({ shape: gawangBack, mass: 0 });
gawangBackBody.position.set(0, -0.7, -22.2);
gawangBackBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2.7)
world.addBody(gawangBackBody)

const gawangLeft = new CANNON.Box(new CANNON.Vec3(2.6, 0.1, 2));
const gawangLeftBody = new CANNON.Body({ shape: gawangLeft, mass: 0 });
gawangLeftBody.position.set(-5.7, -0.8, -21.2);
gawangLeftBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
world.addBody(gawangLeftBody)

const gawangRight = new CANNON.Box(new CANNON.Vec3(2.6, 0.1, 2));
const gawangRightBody = new CANNON.Body({ shape: gawangRight, mass: 0 });
gawangRightBody.position.set(5.8, -0.8, -21.2);
gawangRightBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
world.addBody(gawangRightBody)

const gawangTop = new CANNON.Box(new CANNON.Vec3(2, 0.1, 5.7));
const gawangTopBody = new CANNON.Body({ shape: gawangTop, mass: 0 });
gawangTopBody.position.set(0, 1.7, -21.2);
gawangTopBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
world.addBody(gawangTopBody)

const goalKeeper = new CANNON.Box(new CANNON.Vec3(1, 3.7, 0.7));
const goalKeeperBody = new CANNON.Body({ shape: goalKeeper, mass: 0 });
goalKeeperBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0)
world.addBody(goalKeeperBody)
// let cannonBall = new CANNON.Sphere(1);
// let ballBody = new CANNON.Body({shape: cannonBall, mass: 5});
// ballBody.position.set(0, 5, 0);
// world.addBody(ballBody);

let ball = new CANNON.Sphere(0.4);
let ballBody = new CANNON.Body({ shape: ball, mass: 5 });
ballBody.position.set(0, -2, -8);
ballBody.linearDamping = 0.31;
world.addBody(ballBody);

// ballBody.addEventListener("collide", function (e) {
//     console.log(Math.abs(e.contact.getImpactVelocityAlongNormal()));
// })

// let debugRenderer = new THREE.CannonDebugRenderer(scene, world)

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

// let speed = 0;
// let acceleration = 0.002;
// let angle = 0;
// let maxSpeed = 0.5;

// let keyDown = false;
// let keyPress = "";

// document.onkeydown = (event) => {
//     if (event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowRight" || event.key == "ArrowLeft") {
//         keyDown = true;
//         keyPress = event.key;
//     }
//     // switch (event.key) {
//     //     case "ArrowUp":
//     //         speed -= acceleration;
//     //         break;
//     //     case "ArrowDown":
//     //         speed += acceleration;
//     //         break;
//     //     case "ArrowLeft":
//     //         angle += Math.PI / 180;
//     //         break;
//     //     case "ArrowRight":
//     //         angle -= Math.PI / 180;
//     //         break;
//     // }
// }

// document.onkeyup = (event) => {
//     if (event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowRight") {
//         keyDown = false;
//     }
// }

// setInterval(function () {
//     if (keyDown) {
//         if (keyPress == "ArrowUp") {
//             speed -= acceleration;
//         }
//         if (keyPress == "ArrowDown") {
//             speed += acceleration;
//         }

//     }
// })

// const search = [];
// const lag = 0.02;

// for (let i = 0; i < 360; i += 3) {
//     search[i] = new THREE.Vector3(Math.cos(i), 0, Math.sin(i));
// }

// function checkForTarget() {
//     search.forEach((direction) => {
//         rayCast.set(ballBody.position, direction, 0, 50);


//         let items = rayCast.intersectObjects(scene.children, false);


//         items.forEach((i) => {
//             if (i.object.name) {
//                 console.log("test");
//                 ballBody.position.x += (direction.x * lag);
//                 ballBody.position.z += (direction.z * lag);
//             }
//         });

//     });
// }



// function moveBall() {

//     if (speed > maxSpeed) {
//         speed = maxSpeed;
//     }
//     if (speed < maxSpeed * -1) {
//         speed = -maxSpeed;
//     }
//     if (keyDown == false && speed > 0) {
//         if (speed - acceleration < 0) {
//             speed = 0
//         } else {
//             speed -= acceleration;
//         }
//     }

//     if (keyDown == false && speed < 0) {
//         if (speed + acceleration > 0) {
//             speed = 0
//         } else {
//             speed += acceleration;
//         }
//     }

//     // ballBody.position.x += speed * Math.sin(angle);
//     // ballBody.position.z += speed * Math.cos(angle);
//     let angularVelocityX = (speed) * 180 / Math.PI;


//     // if (selected == "defaultMaterial") {

//     //     ballBody.force.set(0, 0, 100);
//     // }
// }

const clock = new THREE.Clock();
function draw() {
    world.step(timeStamp);
    // debugRenderer.update();
    mesh.position.copy(ballBody.position);
    mesh.quaternion.copy(ballBody.quaternion);
    goalKeeperBody.position.copy(meshGoalKeeper.position);
    if (mixer)
        mixer.update(clock.getDelta());

    // sphere.rotation.x +=0.05
    renderer.render(scene, cam);
    // controls.target.copy(ballBody.position);
    // controls.update();
    // moveBall();
    // checkForTarget();
    requestAnimationFrame(draw);
}

draw();