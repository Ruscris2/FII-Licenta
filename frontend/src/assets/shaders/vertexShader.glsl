#version 300 es
precision mediump float;

in vec3 vertexPosition;
in vec2 texCoord;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

out vec2 fragTexCoord;

void main()
{
    fragTexCoord = texCoord;
    gl_Position = projMatrix * viewMatrix * worldMatrix * vec4(vertexPosition, 1.0);
}
