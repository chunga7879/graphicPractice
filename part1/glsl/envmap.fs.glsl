in vec3 vcsNormal;
in vec3 vcsPosition;

uniform vec3 lightDirection;
uniform samplerCube skybox;
uniform mat4 matrixWorld;

void main( void ) {

  vec3 normal = normalize(vcsNormal);

  // reflect function in GLSL expects a the incident vector to be in the direction
  // going into the fragment, rather than out of the fragment. 
  vec3 reflected = reflect(normalize(vcsPosition), normal);
  // Qd : Calculate the vector that can be used to sample from the cubemap

  // change to world coordinate
  vec3 relVecWrd = vec3(matrixWorld * vec4(reflected, 0.0));
  gl_FragColor = vec4(texture(skybox, relVecWrd).xyz, 1.0);

}