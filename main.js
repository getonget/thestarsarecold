let scene, camera, renderer, controls;
let star;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFB7C5); 

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    // Create star shape
    const starShape = new THREE.Shape();
    const points = 5;
    const outerRadius = 1;
    const innerRadius = 0.4;
    
    // Move to first point
    starShape.moveTo(outerRadius, 0);

    // Create star points
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? innerRadius : outerRadius;
        const angle = ((i + 1) * Math.PI) / points;
        starShape.lineTo(
            radius * Math.cos(angle),
            radius * Math.sin(angle)
        );
    }
    starShape.lineTo(outerRadius, 0); // Close the shape

    // Extrude settings
    const extrudeSettings = {
        steps: 1,
        depth: 0.5,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.2,
        bevelSegments: 5
    };

    // Create geometry
    const geometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);

    // Create material with better shading
    const material = new THREE.MeshStandardMaterial({
        color: 0xffd700, // Golden yellow
        metalness: 0.3,
        roughness: 0.4,
    });

    // Create star mesh
    star = new THREE.Mesh(geometry, material);
    
    // Center the geometry
    geometry.center();
    
    // Add the star to the scene
    scene.add(star);

    // Add lights
    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 0, 2);
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 0, -2);
    scene.add(backLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 2, 0);
    scene.add(topLight);

    scene.add(new THREE.AmbientLight(0x404040));

    // Add event listener for window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls
    renderer.render(scene, camera);
}

function showMessage(message) {
    const content = document.getElementById('chat-content');
    // Remove old message if it exists
    const oldMessage = content.querySelector('div');
    if (oldMessage) {
        oldMessage.style.opacity = '0';
        oldMessage.style.transform = 'translateY(20px)';
    }

    // Add new message with animation
    setTimeout(() => {
        content.innerHTML = `
            <div class="message-animation" 
                 style="padding: 10px; 
                        background-color: rgba(255, 255, 255, 0.1); 
                        border-radius: 5px;">
                ${message}
            </div>`;
    }, oldMessage ? 300 : 0);
}

init();
animate();
