#version 300 es
precision mediump float;

in vec2 fragTexCoord;

uniform sampler2D sampler;

uniform UBO
{
	float mode;
	float modeExtra;
} ubo;

out vec4 color;

void main () 
{
	if(ubo.mode == 0.0) {
		color = texture(sampler, fragTexCoord);
	}
	else
	{
		color = vec4(ubo.modeExtra, 0.0, 0.0, 1.0);
	}
}
