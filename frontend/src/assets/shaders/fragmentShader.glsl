#version 300 es
precision mediump float;

in vec3 fragTexCoord;

uniform sampler2D sampler;

uniform UBO
{
	float mode;
	float modeExtra;
	float modeExtra2;
	float modeExtra3;
	float opacity;
} ubo;

out vec4 color;

// SURSA COD FUNCTII RGB2HSV SI HSV2RGB - https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
vec3 rgb2hsv(vec3 v)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(v.bg, K.wz), vec4(v.gb, K.xy), step(v.b, v.g));
    vec4 q = mix(vec4(p.xyw, v.r), vec4(v.r, p.yzx), step(p.x, v.r));

    float delta = q.x - min(q.w, q.y);
    float expo = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * delta + expo)), delta / (q.x + expo), q.x);
}

vec3 hsv2rgb(vec3 v)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(v.xxx + K.xyz) * 6.0 - K.www);
    return v.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), v.y);
}

void main () 
{
	vec2 stq;
	stq.x = fragTexCoord.x / fragTexCoord.z;
	stq.y = fragTexCoord.y / fragTexCoord.z;
	color = texture(sampler, stq);
	
	vec3 colorHSV = rgb2hsv(color.rgb);
	colorHSV.x += ubo.modeExtra;
	colorHSV.yz *= vec2(ubo.modeExtra2, ubo.modeExtra3);
	colorHSV.xyz = mod(colorHSV.xyz, 1.0);
	color = vec4(hsv2rgb(colorHSV), clamp(color.a * ubo.opacity, 0.0, 1.0));
	
	if(ubo.mode == 1.0)
	{
		color = vec4(ubo.modeExtra, 0.0, 0.0, 1.0);
	}
	else if(ubo.mode == 2.0)
	{
		color = vec4(1.0, 0.3, 0.3, 1.0);
	}
	else if(ubo.mode == 3.0)
	{
		color = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, clamp(color.a * ubo.opacity, 0.0, 1.0));
	}
	else if(ubo.mode == 4.0)
	{
		color = vec4(ubo.modeExtra, ubo.modeExtra2, ubo.modeExtra3, clamp(color.a * ubo.opacity, 0.0, 1.0));
	}
}
