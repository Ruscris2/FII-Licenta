#version 300 es
precision mediump float;

in vec4 vertexPosition;
in vec3 texCoord;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

out vec3 fragTexCoord;

void main()
{
    fragTexCoord = texCoord;
    gl_Position = projMatrix * viewMatrix * worldMatrix * vertexPosition;
}
