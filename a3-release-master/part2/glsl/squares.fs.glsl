// HINT: Don't forget to define the uniforms here after you pass them in in A3.js
uniform vec3 squareColor;
uniform vec3 squareColor2;
uniform float ticks;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 vertexPosition;

void main() {
    // HINT: Compute the light intensity the current fragment by determining
    // the cosine angle between the surface normal and the light vector.
    float intensity = dot(interpolatedNormal, lightDirection); // length is 1 because they are normalized;

    // HINT: Pick any two colors and blend them based on light intensity
    // to give the 3D model some color and depth.
    vec3 out_Stripe = mix(squareColor, squareColor2, 1.0 - intensity);

    //to discard gap between squares
    if ((mod(vertexPosition.x * abs(sin(ticks)), 0.02)  > 0.01) || (mod(vertexPosition.y * abs(sin(ticks)), 0.02) > 0.01)) {
        discard;
    }

     // HINT: Set final rendered colour
    gl_FragColor = vec4(out_Stripe, 1.0);
}
