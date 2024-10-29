class sceneManager {
    constructor() {
        // Scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(30, 70, 100);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        // Now, the renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        // Now, the lighting: soft white lighting
        const ambientLight   = new THREE.AmbientLight(0x404040, 1);
        const light          = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();

        this.scene.add(ambientLight);
        this.scene.add(light);
    }

    update() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

export default sceneManager;