const dbRef = firebase.database().ref(code);
const usersRef = firebase.database().ref("users");

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Background
const loader = new THREE.TextureLoader();
const bgTexture = loader.load("background.jpg");
bgTexture.blur = 0.5;

// Set the texture as the background color of the scene
scene.background = bgTexture;

const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,500);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Grid
const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

// transformControls
const transformControls = new THREE.TransformControls(
  camera,
  renderer.domElement
);

transformControls.setSize(2); // 2x default size

// geometry from stick3d.js data
const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(stick3D.data.attributes.position.array, 3)
);
geometry.scale(0.04, 0.04, 0.04);
geometry.computeVertexNormals(); //!!!!SHADOWS!!!! (THE MAGIC LINE)

// Ambient light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color and intensity of ambient light
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("wood.jpg");
const material = new THREE.MeshBasicMaterial({
  map: texture,
});

// Draggable sticks.
const draggableObjects = [];

// Drag controls
const dragControls = new THREE.DragControls(
  draggableObjects,
  camera,
  renderer.domElement
);

dragControls.addEventListener("dragstart", function (event) {
  //controls.enabled = false;
  console.log("Controls disabled");
});
// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
raycaster.setFromCamera(mouse, camera); //Raycasting on mouse click to better detect the arrows:
raycaster.intersectObject(transformControls);

// Update scene sticks whenever there is a change in the database
dbRef.on("value", function (snapshot) {
  // Clear the scene before adding sticks again
  draggableObjects.forEach((objeto) => {
    scene.remove(objeto);
  });
  draggableObjects.length = 0;

  snapshot.forEach(function (SticK) {
    const cubo = new THREE.Mesh(geometry, material);
    cubo.position.set(
      SticK.val().posicao.x,
      SticK.val().posicao.y,
      SticK.val().posicao.z
    );
    cubo.rotation.set(
      SticK.val().rotacao.x,
      SticK.val().rotacao.y,
      SticK.val().rotacao.z
    );
    cubo.userData.id = SticK.key; //  ID userData
    draggableObjects.push(cubo);
    scene.add(cubo);
    console.log("Add Stick from FB!");
  });
});
dragControls.enabled = false; // Disable dragging

// Adding a new stick
function addSticks() {

  const currentUser = firebase.auth().currentUser;

  if (!currentUser) {

    alert("You need to be logged in to add a stick!"); //Alert for Login if not logged in
    //window.location.href = "index.html";

    GoogleLogin();
    return;
  }
  const cubo = new THREE.Mesh(geometry, material);
  cubo.position.set(0, 0.05, 0);
  const novoPalitoRef = dbRef.push();
  const novoPalitoId = novoPalitoRef.key;
  cubo.userData.id = novoPalitoId; // ID  userData
  draggableObjects.push(cubo);
  scene.add(cubo);

  // entry for this user in the users table, with the project ID
  const userId = currentUser.uid;

  usersRef.child(userId).transaction((projetos) => {
    if (projetos) {
      projetos.push(code);
    } else {
      projetos = [code];
    }

    return projetos;
  });
  // Add new Stick
  novoPalitoRef.set({
    posicao: {
      x: cubo.position.x,
      y: cubo.position.y,
      z: cubo.position.z,
    },
    rotacao: {
      x: cubo.rotation.x,
      y: cubo.rotation.y,
      z: cubo.rotation.z,
    },
    idStick: novoPalitoId,
    idUser: currentUser.uid,
  });
  console.log("Add Stick!");
}

// Adding a new Robot
const RobotGeometry = new THREE.BoxGeometry(1, 1, 1);
const RobotMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

let robotCube;

function addRobot() {

  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    
    alert("You need to be logged in to add a Robot!"); //Alert for Login if not logged in
    GoogleLogin();
    return;
  }

  const RoboT = new THREE.Mesh(RobotGeometry, RobotMaterial);
  RoboT.position.set(0, 1, 0);
  scene.add(RoboT);

  console.log("Add Robot!");
}
function CodeShow() {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    alert("You need to be logged in to add a Robot!"); //Alert for Login if not logged in
    //window.location.href = "index.html";

    GoogleLogin();
    return;
  }
  const codeDiv = document.querySelector(".code");
  codeDiv.removeAttribute("hidden");
  console.log("Code Show!");
}
//saveRotacao function that updates the database:
function salvarRotacao() {
  if (stickSelected) {
    const rotacao = stickSelected.rotation;

    const id = stickSelected.userData.id;

    const ref = firebase.database().ref(code + "/" + id);

    ref.update({
      rotacao: {
        x: rotacao.x,
        y: rotacao.y,
        z: rotacao.z,
      },
    });
  }
}

// Variable to store the selected stick
let stickSelected = null;

// Variable to control the direction of rotation
let direcaoGiro = 1;

// Variable to control the rotation direction
function selectStick(SticK) {
  // Mostrar botões de mover

  //XYZ Gizmo
  transformControls.attach(SticK);
  scene.add(transformControls);
  dragControls.enabled = false;

  deselectStick();

  if (stickSelected) {
    //stickSelected.material.color.set(0x00ff00); // Set the color back to the original
  }
  stickSelected = SticK;
  //SticK.material.color.set(0xffff00); // Set the color of the selected stick

  console.log("Selected");
  const buttonContainer = document.getElementById("button-container");
  buttonContainer.removeAttribute("hidden");
}

// Function to rotate the selected stick
function rotatestickSelected(direcao) {
  if (stickSelected) {
    stickSelected.rotation.y += THREE.MathUtils.degToRad(5 * direcao); // Rotate the selected stick by 5 degrees in the current direction
    salvarRotacao();
  }
}

// Function to rotate the selected stick vertically forward
function girarPalitoFrente() {
  if (stickSelected) {
    stickSelected.rotation.x += THREE.MathUtils.degToRad(5); // Rotate the selected stick vertically forward by 5 degrees
    salvarRotacao();
  }
}

// Function to rotate the selected stick vertically backward
function girarPalitoAtras() {
  if (stickSelected) {
    stickSelected.rotation.x -= THREE.MathUtils.degToRad(5); // Rotate the selected stick vertically backward by 5 degrees
    salvarRotacao();
  }
}

// Add functionality to the new buttons
//Add Stick for Add

document.getElementById("addStickButton").addEventListener("click", addSticks);
document.getElementById("addRobotButton").addEventListener("click", addRobot);
document.getElementById("CodeRobotButton").addEventListener("click", CodeShow);

document
  .getElementById("girar-esquerda")
  .addEventListener("click", () => rotatestickSelected(-1));
document
  .getElementById("girar-direita")
  .addEventListener("click", () => rotatestickSelected(1));
document
  .getElementById("girar-frente")
  .addEventListener("click", girarPalitoFrente);
document
  .getElementById("girar-atras")
  .addEventListener("click", girarPalitoAtras);

// Function to deselect the currently selected stick
function deselectStick() {
  //hides the move buttons

  if (stickSelected) {
    //stickSelected.material.color.set(0x00ff00); // Redefine a cor para a original
    stickSelected = null; // Rotate the selected stick by 5 degrees in the current direction
  }
}
// Hammer.js
const mc = new Hammer(renderer.domElement);

mc.on("tap", function (ev) {
  // Convert touch coordinates to mouse position
  const x = ev.center.x;
  const y = ev.center.y;

  const mouse = new THREE.Vector2();
  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;

  // Call click function
  clickOntheStick({ clientX: x, clientY: y });
});

function clickOntheStick(event) {
  // Logic for selecting sticks...

  raycaster.setFromCamera(mouse, camera);
}

// Function to handle stick clicks
function clickOntheStick(event) {
  // Calculate the click position on the canvas
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Calculate the click position on the screen
  mouse.set(x, y);

  // Perform raycasting to check for intersection with the stick
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(draggableObjects);

  if (intersects.length > 0) {
    const clickedStick = intersects[0].object;
    selectStick(clickedStick);
    // Change the color of the stick to a random color
    //const newColor = new THREE.Color(0xffffff);
    //clickedStick.material.color.copy(newColor);
  } else {
    // deselect the stick

    console.log("Click outside Sticks");
    // Remove transformControls affter click ouside
    scene.remove(transformControls);

    //transformControls.detach();
  }
}

renderer.domElement.addEventListener("click", clickOntheStick, false); // Clicks

// Render
function render() {
  renderer.render(scene, camera);
}

// Animation
function animate() {
  requestAnimationFrame(animate);

  controls.update(); // Orbit controls
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  render(); // Render
}

transformControls.addEventListener("dragging-changed", function (event) {
  controls.enabled = true;
  console.log("dragging changed");
  if (event.value) {
    // Transformation in progress, do nothing
    controls.enabled = false; /// Disable controls during dragging
  } else {
    // Transformation finished
    controls.enabled = true;
    // Get the object that was transformed
    const transformedObject = transformControls.object;

    // Get the new position and rotation
    const newPosition = transformedObject.position;
    const newRotation = transformedObject.rotation;

    // Get the object ID
    const objectId = transformedObject.userData.id;

    // Update the database
    const dbRef = firebase.database().ref(code + "/" + objectId);
    dbRef.update({
      posicao: {
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z,
      },
      rotacao: {
        x: newRotation.x,
        y: newRotation.y,
        z: newRotation.z,
      },
    });

    // Re-enable drag controls
  }
});
// Start animation
animate();

function saveProjectName() {

  var projectName = document.getElementById('projectName').value;
  
  // Save to Firebase
  dbRef.update({
      projectName: projectName
  }).then(() => {
      alert('Project Name Saved');
  }).catch((error) => {
      console.error("Error saving project name: ", error);
  });
}

function populateProjectName() {

  dbRef.once('value', (snapshot) => {

    const data = snapshot.val();

    if (data && data.projectName) {

      document.getElementById('projectName').value = data.projectName;
    }
  }, (error) => {
    console.error("Error reading project name: ", error);
  });
}

// Call this function when the page loads
populateProjectName();
