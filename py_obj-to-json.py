import json
import argparse

# Set up argument parser
parser = argparse.ArgumentParser(description='Convert a .txt file of vertices and faces to JSON format.')
parser.add_argument('--input', type=str, default='obj/toparse.txt', help='Path to the input .txt file (default: obj/toparse.txt)')

# Parse arguments
args = parser.parse_args()

# Use the input and output file paths from the arguments
input_file_path = f"assets/obj/{args.input}.obj"
output_file_path = f"assets/json/{args.input}.json"

# Initialize lists to store vertex positions and face indices
vertices = []
faces = []

# Open and read the bull2.txt file
with open(input_file_path, 'r') as file:
    for line in file:
        if line.startswith('v '):  # Process lines that define a vertex
            parts = line.split()    # Split the line by whitespace
            # Convert vertex coordinates to float and add to the vertices list
            x, y, z = map(float, parts[1:4])
            vertices.extend([x, y, z])
        elif line.startswith('f '):  # Process lines that define a face
            parts = line.split()[1:]  # Get the indices, ignoring 'f'
            # Convert the vertex indices to integer and adjust for zero-based indexing
            indices = [int(index.split('/')[0]) - 1 for index in parts]
            faces.append(indices)

# Structure the data for JSON output
data = {
    "vertices": vertices,
    "faces": faces  # Include the face indices
}

# Write the JSON data to a file
with open(output_file_path, 'w') as json_file:
    json.dump(data, json_file, indent=4)

print(f'Conversion complete. JSON saved to {output_file_path}')
