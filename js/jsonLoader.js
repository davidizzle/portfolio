export function loadJSON(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Error loading JSON:', error));
}

export async function transitionToNewPositions(newVertices) {
            
    // If this is a dynamic model
    const randomIndex = Math.floor(Math.random() * 3);
    if ( jsonFiles[currentIndex] == 'assets/json/antennabase.json')
    {
        // console.log(auxJsonDynamic[jsonFiles[currentIndex]][randomIndex])
        await loadJSON(auxJsonDynamic[jsonFiles[currentIndex]][randomIndex]) // Replace with the path to your new JSON file
            .then( data => {
                const initialVertexCount = newVertices.length;
                newVertices.push(...data.vertices);
                const newFaces = data.faces.map(face => 
                    face.map(index => (index + initialVertexCount / 3) % newVertices.length) // Adjust indices
                );
                faces.push(...newFaces);
            });
    }

    const newTargetPositions = [];

    // Update target positions based on new vertex data
    for (let i = 0; i < newVertices.length; i += 3) {
        const x = newVertices[i];
        const y = newVertices[i + 1];
        const z = newVertices[i + 2];
        
        // Set the target position for each sphere
        newTargetPositions[i / 3] = new THREE.Vector3(x, y, z);
    }

    targetPositions = newTargetPositions; // Update the target positions
}