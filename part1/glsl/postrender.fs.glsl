in vec2 v_UV;
in vec4 lightSpaceCoords;

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;

void main() {

    vec4 dptTex = texture(tDepth, v_UV);

    float depth = dptTex.x;
    gl_FragColor = vec4(vec3(depth), 1.0);
}