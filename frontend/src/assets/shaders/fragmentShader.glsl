#version 300 es
precision mediump float;

in vec3 fragTexCoord;

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
		vec2 stq;
		stq.x = fragTexCoord.x / fragTexCoord.z;
		stq.y = fragTexCoord.y / fragTexCoord.z;
		color = texture(sampler, stq);
	}
	else if(ubo.mode == 1.0)
	{
		color = vec4(ubo.modeExtra, 0.0, 0.0, 1.0);
	}
	else
	{
		color = vec4(1.0, 0.3, 0.3, 1.0);
	}
}
