#version 300 es
precision mediump float;

in vec3 fragVertexColor;
in vec3 fragVertexNormal;

out vec4 color;

void main () 
{
	vec3 normal = normalize(fragVertexNormal);
	
	float lightIntensity = dot(normal, vec3(0.5, 0.7, 1)) * 0.75;
	
	color = vec4(fragVertexColor.r, fragVertexColor.g, fragVertexColor.b, 1.0);
	color = vec4(color.rgb * lightIntensity, 1.0);
}
