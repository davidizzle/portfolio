class RaycasterManager{
    constructor(sceneManager, modelLoader) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersectedObject = null;
        this.camera = sceneManager.camera;
        this.scene = sceneManager.scene;
        this.modelLoader = modelLoader;
        this.colorTransition = { r: 0.427, g: 0.847, b: 0.988 };
        // To detect double-click
        this.lastClick = 0;

        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onObjectClick.bind(this));
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight ) * 2 + 1;
    }

    onObjectClick(event) {
        if (this.intersectedObject && (performance.now() - this.lastClick) < 200 ) {
            const url = this.modelLoader.modelLinks[this.modelLoader.currentIndex];
            if (url) window.open(url, '_blank');
        }
        this.lastClick = performance.now();
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.modelLoader.modelMesh);

        if (intersects.length > 0) {
            gsap.to(this.colorTransition, {
                r: 1,
                g: 0,
                b: 0,
                duration: 3.0,
                ease: "power2.out",
                onUpdate: () => {
                    // Apply the interpolated color to each sphere
                    this.modelLoader.spheres.forEach(sphere => {
                        sphere.material.color.setRGB(this.colorTransition.r, this.colorTransition.g, this.colorTransition.b);
                        });
                    }
                });
            document.body.style.cursor = 'pointer';
            this.intersectedObject = 1;
        } else {
            gsap.to(this.colorTransition, {
                r: 0.427,
                g: 0.847,
                b: 0.988,
                duration: 0.3,
                ease: "power2.out",
                onUpdate: () => {
                    // Apply the interpolated color to each sphere
                    this.modelLoader.spheres.forEach(sphere => {
                        sphere.material.color.setRGB(this.colorTransition.r, this.colorTransition.g, this.colorTransition.b);
                    });
                }
            });
            document.body.style.cursor = 'default';
            this.intersectedObject = null;
        }
    }
}
export default RaycasterManager;