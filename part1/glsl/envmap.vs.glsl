out vec3 vcsNormal;
out vec3 vcsPosition;


void main() {

	vcsNormal = normalMatrix * normal;
	vcsPosition = vec3(modelViewMatrix * vec4(position, 1.0));

	// Qe pass varying variables to fs in view coordinate system
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}