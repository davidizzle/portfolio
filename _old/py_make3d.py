import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import binvox_rw
from scipy.spatial.transform import Rotation as R
import json

# Full rotation matrix input parameters
theta_x = 0
theta_y = 0
theta_z = 0

# ot_x = np.array([[1, 0, 0]
# Don't do full rotation matrix just import it from SciPy

rotation = R.from_euler('xyz', [theta_x, theta_y, theta_z])
rotation_matrix = rotation.as_matrix()

with open('todo.binvox', 'rb') as f:
    md = binvox_rw.read_as_coord_array(f)

# Rotate
md.data = np.dot(rotation_matrix, md.data)

x = md.data[0,:]
y = md.data[1,:]
z = md.data[2,:]

# grid_size = (50, 50, 50)
grid_size = (30, 30, 30)

# Initialize an empty voxel grid with False values
voxel_grid = np.zeros(grid_size, dtype=bool)

# Normalize coordinates to fit the grid (you may need to scale your data)
x_norm = np.interp(x, (x.min(), x.max()), (0, grid_size[0]-1)).astype(int)
y_norm = np.interp(y, (y.min(), y.max()), (0, grid_size[1]-1)).astype(int)
z_norm = np.interp(z, (z.min(), z.max()), (0, grid_size[2]-1)).astype(int)
print(x_norm.shape)
# Mark the corresponding voxel grid points as True
voxel_grid[x_norm, y_norm, z_norm] = True

# Set up the 3D plot
fig = plt.figure(figsize=(10, 10))
ax = fig.add_subplot(111, projection='3d')

# Create the voxel plot
ax.voxels(voxel_grid, facecolors='blue', edgecolor='k')

ax.set_xlabel('X axis')
ax.set_ylabel('Y axis')
ax.set_zlabel('Z axis')

plt.show()


# array = voxel_grid.astype(int)
array = np.where(voxel_grid == True)
result = []
result.append([int(k) - 15 for k in array[0].tolist()])
result.append([int(k) - 15 for k in array[1].tolist()])
result.append([int(k) - 24 for k in array[2].tolist()])

# Save the array as a JSON file
with open('array_data.json', 'w') as json_file:
    json.dump(result, json_file)
