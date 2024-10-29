class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.spheres = [];
        this.lines = null;
        this.modelMesh = null;
        this.vertices = null;
        this.faces = null;
        this.targetPositions = [];
    }

    // Loading JSON method
    async loadJSON(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Error loading JSON:', error);
            return null;
        }
    }

    updateScene(data) {
        // Clear existing spheres and lines
        this.clearScene();

        // Create model and spheres
        this.vertices = data.vertices;
        this.faces = data.faces;

        // Ensure faces is defined and iterable
        if (!Array.isArray(this.faces)) {
            console.error("Faces data is not in expected array format:", this.faces);
            return; // Exit if faces are not iterable
        }

        this.createModelMesh();
        this.createSpheres();
        this.createLines(0.08);
    }

    clearScene() {
        this.spheres.forEach(sphere => this.scene.remove(sphere));
        if (this.lines) this.scene.remove(this.lines);
        if (this.modelMesh) this.scene.remove(this.modelMesh);
    }

    createModelMesh() {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
        const indices =
        geometry.setIndex(this.createIndices());

        const material = new THREE.MeshPhongMaterial({
            color: 0x6dd8fc,
            transparent: true, // Allow transparency
            opacity: 0, // Make the mesh invisible
            depthWrite: false, // Enable to true for cool dynamic mesh effect, and set minOpacity to 0.3 or something 
            flatShading: true
        });

        this.modelMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.modelMesh);
    }

    createIndices() {
        const indices = [];

        this.faces.forEach(face => {
            if (face.length === 3) {
                // Add indices for a triangle, 3 vertices
                indices.push(...face);
            } else if (face.length === 4) {
                // For quads, split into 2 triangles
                indices.push(face[0], face[1], face[2], face[2], face[3], face[0]);
            }
        });

        return indices;
    }

    createSpheres() {
        const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x6dd8fc });

        this.vertices.forEach((_, i) => {
            if (i % 3 === 0) {
                const x = this.vertices[i];
                const y = this.vertices[i + 1];
                const z = this.vertices[i + 2];
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.set(x, y, z);

                // Unique seeds for each sphere for mathematical effects
                sphere.seed = Math.random() * 2 * Math.PI;
                sphere.seed2 = Math.random();
                sphere.seed3 = Math.random() * 2 * Math.PI;
                sphere.seed4 = Math.random();

                this.scene.add(sphere);
                this.spheres.push(sphere);

                this.targetPositions.push(sphere.position.clone());
            }
        });
    }

    createLines(opac)
    {
        if (this.lines) {
            this.scene.remove(this.lines);
            this.lines.geometry.dispose(); // Dispose the geometry to free memory
            this.lines.material.dispose(); // Dispose the material to free memory
            this.lines = null; // Set lines to null after removal
        }


        const lineGeometry = new THREE.BufferGeometry();
        const lineVertices = [];
        let spheres = this.spheres;

        // Loop through each face
        for (const face of this.faces) {
            for (let j = 0; j < face.length; j++) {
                const startIndex = face[j]; // Get vertex index for the start of the line
                const endIndex = face[(j + 1) % face.length]; // Wrap around to connect the last vertex to the first
                
                // Ensure startIndex and endIndex are valid
                if (startIndex < spheres.length && endIndex < spheres.length) {
                    const startPos = spheres[startIndex].position;
                    const endPos = spheres[endIndex].position;

                    // Push vertex positions to the line vertices array
                    lineVertices.push(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z);

                } 
            }
        }

        // Map the average line length to an opacity value (adjust this mapping as needed)
            // This is to provide that initial brightness boost
            const minOpacity = 0; // Minimum opacity for very short lines
            const maxOpacity = 1; // Maximum opacity for very long lines
            const opacity = Math.min(maxOpacity, Math.max(minOpacity, opac));


            // Set the vertices to the line geometry
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
            
            // Create line material with transparency and opacity
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0xffffff, 
                transparent: true, // Enable transparency
                // opacity: 0.08 // Set opacity (0 = transparent, 1 = opaque)
                opacity: opacity // Set opacity (0 = transparent, 1 = opaque)
            });
            lineMaterial.depthWrite = false;
            
            this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
            this.scene.add(this.lines);
    }
}
export default ModelLoader;