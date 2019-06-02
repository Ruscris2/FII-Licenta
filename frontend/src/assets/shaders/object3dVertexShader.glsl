#version 300 es
precision mediump float;

in vec3 vertexPosition;
in vec3 vertexColor;
in vec3 vertexNormal;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

out vec3 fragVertexColor;
out vec3 fragVertexNormal;

void main()
{
	fragVertexNormal = projMatrix * viewMatrix * worldMatrix * vertexNormal;
    fragVertexColor = vertexColor;
    gl_Position = projMatrix * viewMatrix * worldMatrix * vec4(vertexPosition, 1.0);
}
