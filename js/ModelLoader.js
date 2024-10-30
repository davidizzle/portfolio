class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.spheres = [];
        this.lines = null;
        this.modelMesh = null;
        this.vertices = null;
        this.faces = null;
        this.targetPositions = [];
        this.currentIndex = 0;
        this.jsonFiles = [
            'assets/json/nothing.json', 
            'assets/json/daggerComp4.json', 
            'assets/json/crankshaftnew.json', 
            'assets/json/bullnew.json', 
            'assets/json/antenna.json'
        ];  // List of JSON files to toggle between
        this.modelLinks = [
            'https://blank.page/',
            'https://github.com/davidizzle/GSoC-Dagger.jl-Blog',
            'https://blank.page/',
            'https://blank.page/',
            'https://blank.page/'
        ];
        this.modelDescriptions = [
            {
                left: "Model 1 Description: This is a detailed description of Model 1.",
                right: "Learn more about Model 1 [here](https://example.com/model1)."
            },
            {
                left: "Model 2 Description: This model is great for text generation tasks.",
                right: "Find the documentation [here](https://example.com/model2)."
            },
            {
                left: "Model 3 Description: This model excels at chat-based interactions.",
                right: "Check the details [here](https://example.com/model3)."
            },
            {
                left: "Model 3 Description: This model excels at chat-based interactions.",
                right: "Check the details [here](https://example.com/model3)."
            }
        ];
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

    // Function to handle loading new JSON data
    loadNewJSON(up) {
        this.currentIndex = (this.currentIndex + up) % this.jsonFiles.length;
        // currentIndex = (currentIndex < 0) ? (jsonFiles.length + currentIndex) : currentIndex;
        this.loadJSON(this.jsonFiles[this.currentIndex]) // Replace with the path to your new JSON file
            .then(data => {
                this.scene.remove(this.lines);
                this.lines.geometry.dispose(); // Dispose the geometry to free memory
                this.lines.material.dispose(); // Dispose the material to free memory
                this.lines = null; // Set lines to null after removal
                this.faces = data.faces;
                this.transitionToNewPositions(data.vertices);
            });
    }

    transitionToNewPositions(newVertices) {

        this.scene.remove(this.modelMesh);
        const newTargetPositions = [];

        // Update target positions based on new vertex data
        for (let i = 0; i < newVertices.length; i += 3) {
            const x = newVertices[i];
            const y = newVertices[i + 1];
            const z = newVertices[i + 2];
            
            // Set the target position for each sphere
            newTargetPositions[i / 3] = new THREE.Vector3(x, y, z);
        }
        this.targetPositions = newTargetPositions; // Update the target positions

        // Create a new buffer geometry for the model
        const geometry = new THREE.BufferGeometry();
        // Convert vertices array into a Float32Array and add to the geometry
        const positions = new Float32Array(newVertices);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Create an index array for faces
        const indices = [];
        this.faces.forEach(face => {
            if (face.length === 3) {
                // Add indices for a triangle (three vertices)
                indices.push(face[0], face[1], face[2]);
            } else if (face.length === 4) {
                // For quads, split into two triangles
                indices.push(face[0], face[1], face[2]);
                indices.push(face[2], face[3], face[0]);
            }
        });

        // Set the index for the geometry to use the faces
        geometry.setIndex(indices);

        // Create a material for the model
        const material = new THREE.MeshPhongMaterial({
            color: 0x6dd8fc,
            transparent: true, // Allow transparency
            opacity: 0, // Make the mesh invisible
            depthWrite: false, // Enable to true for cool dynamic mesh effect, and set minOpacity to 0.3 or something 
            flatShading: true
        });

        // Create the mesh and add it to the scene
        this.modelMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.modelMesh);
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