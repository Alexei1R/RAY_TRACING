uniform vec2 u_resolution;
uniform vec3 u_mouse;
uniform float u_time;
 


void main() {
    vec2 uv = (gl_FragCoord-0.5 * u_resolution) / u_resolution.y;
    vec3 rayOrigin = vec3(0.0,0.0,0.0);
    vec3 rayDirection = normalize(vec3(uv,1));

    vec3 col = vec3(0.0);

    vec3 s= vec3(0.0,0.0,4.0);
    float r = 1;
    float t = dot(s-rayOrigin,rayDirection);
    vec3 p = rayOrigin + rayDirection* t;
    float y = length(s-p);

    if(y<r){
        float x = sqrt(r*r -y*y);
        float t1 = t-x;
        float t2 = t+x;
        col = vec3(1);
    }

    gl_FragColor = vec4(col,1.0);
} 




uniform vec2 u_resolution;
uniform vec3 u_mouse;
uniform float u_time;
 
 vec2 sIntersect(vec3 ro, vec3 rd,vec3 ce, float ra )
{
    vec3 v = ro - ce;
    float a = dot(rd,rd);
    float b = 2 * dot(v , rd);
    float c = dot(v,v) - ra*ra;

    float delta = b*b - 4*a*c;
    if(delta<0){ 
        return vec2(-1.0);
    }
    else{
        return vec2((-b + sqrt(delta))/(2.0*a)   ,   (-b - sqrt(delta))/(2.0*a));
    }
}

vec2 sphIntersect(in vec3 ro, in vec3 rd, float ra) {
	float b = dot(ro, rd);
	float c = dot(ro, ro) - ra * ra;
	float h = b * b - c;
	if(h < 0.0) return vec2(-1.0);
	h = sqrt(h);
	return vec2(-b - h, -b + h);
}


vec3 castRay(vec3 ro,vec3 rd){
    vec3 sPos = vec3(0.0,0.0,-4.0);

    vec2 it = sphIntersect(ro,rd,1.0);
    if(it.x < 0.0){ 
        return vec3(0.2,0.5,0.3);
    }
    else{
        return vec3(0.0,0.0,1.0);
    }
}



void main() {
    vec2 uv = (gl_FragCoord.xy-0.5) * u_resolution/u_resolution.y;
    //vec2 uv = gl_FragCoord.xy;
    vec3 rayOrigin = vec3(0.0,0.0,10.0);
    vec3 rayDirection = normalize(vec3(uv,1));


    vec3 col = castRay(rayOrigin,rayDirection);

    gl_FragColor = vec4(col,1.0);
} 