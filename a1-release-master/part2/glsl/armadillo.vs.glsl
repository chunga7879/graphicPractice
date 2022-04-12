// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 orbPosition;

// This is a "varying" variable and interpolated between vertices and across fragments.
// The shared variable is initialized in the vertex shader and passed to the fragment shader.
out float vcolor;
out float orbDistance;

void main() {

    // Q1C:
    // HINT: GLSL PROVIDES THE DOT() FUNCTION 
  	// HINT: SHADING IS CALCULATED BY TAKING THE DOT PRODUCT OF THE NORMAL AND LIGHT DIRECTION VECTORS
    vec4 positionWorldFrame =  modelMatrix * vec4(position, 1.0); // transforming position from model frame to world frame
    vec3 dirVector = orbPosition - vec3(positionWorldFrame.xyz); // casting vec4 to vec3 for dot product calculation later

    vec4 normalByWorldMiddle= transpose(inverse(modelMatrix)) * vec4(normal, 0.0); // transforming normal from model frame to world frame (inverse transport)
    vec3 normalByWorld = vec3(normalByWorldMiddle.xyz); // casting vec4 to vec

    vcolor = dot(dirVector, normalByWorld) / (length(dirVector) * length(normalByWorld)); // cos of angle between

    // Q1D:
    // HINT: Compute distance in World coordinate to make the magnitude easier to interpret
    // HINT: GLSL has a build-in distance() function
//     orbDistance = 1.0;// REPLACE ME proximity - check the distance of amadillo with within certain distance with sphere
    vec3 vecFromVexToOrb = orbPosition - vec3(positionWorldFrame.xyz);
    orbDistance = length(vecFromVexToOrb);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
