#version 330

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;



const float MAX_DIST = 99999.0;
const int MAX_REF = 8;


//matrix for rotation
mat2 rot(float teta) {
    if(teta = 0){
        return mat2(1,0,1,0);
    }
    
	float s = sin(teta);
	float c = cos(teta);
    
	return mat2(c, -s, s, c);
}


 vec2 sphIntersect(vec3 ro, vec3 rd,vec3 ce, float ra )
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

vec2 boxIntersection(vec3 ro, vec3 rd, vec3 rad, out vec3 oN)  {
	vec3 m = 1.0 / rd;
	vec3 n = m * ro;
	vec3 k = abs(m) * rad;
	vec3 t1 = -n - k;
	vec3 t2 = -n + k;
	float tN = max(max(t1.x, t1.y), t1.z);
	float tF = min(min(t2.x, t2.y), t2.z);
	if(tN > tF || tF < 0.0) return vec2(-1.0);
	oN = -sign(rd) * step(t1.yzx, t1.xyz) * step(t1.zxy, t1.xyz);
	return vec2(tN, tF);
}

vec2 plaIntersect(vec3 ro, vec3 rd, vec4 p) {
	return vec2(-(dot(ro, p.xyz) + p.w) / dot(rd, p.xyz),1.0);
}





vec3 castRay(vec3 ro,vec3 rd){
    vec3 objColor;
    vec2 minIt = vec2(MAX_DIST);
    vec2 it;
    vec3 lightPos = normalize(vec3(-5.0,-2.0,3.0));
    vec3 n;


    vec3 sPos = vec3(0.0,0.0,0.0);
    

    it = sphIntersect(ro - sPos,rd,sPos,1.0);
    if(it.x > 0.0 && it.x < minIt.x){ 
        minIt = it;
        vec3 itPos = ro -rd * it.x;
        n = itPos - sPos;

        objColor = vec3(0.0,0.0,1.0);
    }
    //box
    vec3 boxN;
    vec3 boxPos = vec3(0.0,2.0,0.0);
    it = boxIntersection(ro - boxPos,rd,vec3(1.0,1.0,1.0),boxN);
    if(it.x > 0.0 && it.x < minIt.x){ 
        minIt = it;
        n = boxN;

        objColor = vec3(0.0,1.0,0.0);
    }
    //plane
    vec3 planeNormal = vec3(0.0,0.0,1.0);
    it = plaIntersect(ro,rd,vec4(planeNormal,1.0));
    if(it.x > 0.0 && it.x < minIt.x){ 
        minIt = it;
        n = planeNormal;

        objColor = vec3(1.0,0.0,0.0);
    }


    //else{
    //    return vec3(0.0,0.0,1.0);
    //}
    objColor = vec3(1.0,1.0,1.0);



    //light color
    vec3 lightColor = vec3(1.0,1.0,1.0);
    //object color
    



    //light
    //ambient
    float ambientStrength = 0.01;
    vec3 ambient = ambientStrength * lightColor;

    //difuse
    vec3 norm = normalize(n);
    float diff = max(dot(norm,lightPos),0.0);
    vec3 diffuse = diff * lightColor;

    //specular
    vec3 reflected = reflect(norm,rd);
    float spec = pow(max(dot(rd,reflected),0.0),32);
    vec3 specular = spec * lightColor;


    vec3 result = (ambient + diffuse + specular) * objColor;
    return result;
}

void main() {
	vec2 uv = (gl_TexCoord[0].xy - 0.5) * u_resolution / u_resolution.y;
	vec3 rayOrigin = vec3(-5.0,0.0,0.0);
	vec3 rayDirection = normalize(vec3(1.0,uv));
    rayDirection.zx *= rot(-u_mouse.y);
	rayDirection.xy *= rot(u_mouse.x);
    //rayDirection.zx *= rot(sin(u_time));
	//rayDirection.xy *= rot(sin(u_time));



    //rayDirection.zx *= rot(0);
	//rayDirection.xy *= rot(100);


	vec3 col = castRay(rayOrigin,rayDirection);



    vec3 col2 = vec3(u_mouse.x,u_mouse.y,1.0);
	gl_FragColor = vec4(col, 1.0);
}