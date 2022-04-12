uniform float time;

out vec3 interpolatedNormal;

void main() {

    // TODO Q4 transform the vertex position to create deformations
    // Make sure to change the size of the orb sinusoidally with time.
    // The deformation must be a function on the vertice's position on the sphere.
//    vec3 modifiedPos = /* TODO Q4 */ position;
    interpolatedNormal = normal;

    // weight by time and needs to be sinusoidally with time
    float pct = abs(sin(time));
//    vec3 modifiedPos = mix(normalize(normal), position, pct);
    float x = position.x * sqrt(1.0 - pow(position.y, 2.0) / 2.0 - pow(position.z, 2.0) / 2.0 + pow(position.y, 2.0) * pow(position.z, 2.0) /3.0);
    float y = position.y * sqrt(1.0 - pow(position.z, 2.0) / 2.0 - pow(position.x, 2.0) / 2.0 + pow(position.z, 2.0) * pow(position.x, 2.0) /3.0);
    float z = position.z * sqrt(1.0 - pow(position.x, 2.0) / 2.0 - pow(position.y, 2.0) / 2.0 + pow(position.x, 2.0) * pow(position.y, 2.0) /3.0);

    // mix is the function for the linear interpolation between first and second element using pct to weight between.
    // times with sin(time) function again to change the size by time
    vec3 modifiedPos = (1.0 + 0.5 * sin(time)) * mix(vec3(x, y, z), position, pct);

    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position.
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(modifiedPos, 1.0);
}
