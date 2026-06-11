// Sphere tracing scene from my BSc dissertation "Introduction to Sphere Tracing" (2022).
// Ported from Shadertoy: iChannel0 cubemap replaced with a procedural environment,
// and the raymarch loop condition fixed (was `1<MAX_STEPS`, a typo for `i<MAX_STEPS`).

export const VERT = `#version 300 es
void main() {
  vec2 v = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(v * 2.0 - 1.0, 0.0, 1.0);
}`;

export const FRAG = `#version 300 es
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
out vec4 outColor;

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .01
#define NUM_OF_REFLECTION 2

const int MAT_cuboid=1;
const int MAT_torus=2;
const int MAT_sphere=3;
const int MAT_capsule=4;
const int MAT_cylinder=5;
const int MAT_plane=6;

// procedural environment (replaces the Shadertoy cubemap)
vec3 env(vec3 rd)
{
    float t = clamp(rd.y * .5 + .5, 0., 1.);
    vec3 sky = mix(vec3(0.16, 0.14, 0.12), vec3(0.02, 0.02, 0.024), t);
    float glow = pow(clamp(dot(rd, normalize(vec3(0.4, 0.25, -0.6))), 0., 1.), 6.);
    return sky + vec3(0.79, 0.49, 0.31) * glow * 0.4;
}

mat2 rotation (float a)
{
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}

float sdCapsule (vec3 p, vec3 a, vec3 b, float r)
{
    vec3 ab = b-a;
    vec3 ap = p-a;
    float t = dot(ab, ap) / dot(ab, ab);
    t = clamp(t,0.,1.);
    vec3 c = a + t*ab;
    return length(p-c) - r;
}

float sdTorus (vec3 p, vec2 r)
{
    float x = length(p.xz)-r.x;
    return length(vec2(x,p.y))-r.y;
}

float sdBox(vec3 p, vec3 b)
{
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0)-.5;
}

float sdCylinder (vec3 p, vec3 a, vec3 b, float r)
{
    vec3 ab = b-a;
    vec3 ap = p-a;
    float t = dot(ab, ap) / dot(ab, ab);
    vec3 c = a + t*ab;
    float x = length(p-c) - r;
    float y = (abs(t-.5)-.5)*length(ab);
    float e = length(max(vec2(x,y),0.));
    float i = min(max(x,y), 0.);
    return e+i;
}

vec2 GetDist(vec3 p)
{
    vec4 s = vec4(2, 1, 6, 1);
    vec3 rp = p-vec3(0,1,0);
    rp.xz *= rotation(iTime);

    float sphereDist = length(p-s.xyz)-s.w;
    float capDist = sdCapsule(p, vec3(0 ,1 ,6), vec3(0, 2, 6), 0.5);
    float torDist = sdTorus(p-vec3(-2,.5, 6), vec2(1.,.5));
    float boxDist = sdBox(p-vec3(-2,1,12), vec3(2,4,2));
    float cylDist = sdCylinder(p, vec3(0, .3, 3), vec3(3, .3, 5), .3);
    float planeDist = p.y;

    float d;
    d = min(capDist, planeDist);
    d = min(d, torDist);
    d = min(d, sphereDist);
    d = min(d, boxDist);
    d = min(d, cylDist);

    int mat = 0;
    if (d==boxDist)        mat = MAT_cuboid;
    else if (d==torDist)   mat = MAT_torus;
    else if (d==sphereDist) mat = MAT_sphere;
    else if (d==capDist)   mat = MAT_capsule;
    else if (d==cylDist)   mat = MAT_cylinder;
    else if (d==planeDist) mat = MAT_plane;

    return vec2(d, float(mat));
}

vec2 SphereTrace(vec3 ro, vec3 rd)
{
    float d0 = 0.;
    vec2 dSMat = vec2(0);
    for(int i=0; i<MAX_STEPS; i++)
    {
        vec3 p = ro + rd*d0;
        dSMat = GetDist(p);
        d0 += dSMat.x;
        if(d0>MAX_DIST || dSMat.x<SURF_DIST) break;
    }
    return vec2(d0, dSMat.y);
}

vec3 GetNormal(vec3 p)
{
    float d = GetDist(p).x;
    vec2 e = vec2(.01, 0);
    vec3 n = d - vec3(
       GetDist(p-e.xyy).x,
       GetDist(p-e.yxy).x,
       GetDist(p-e.yyx).x);
    return normalize(n);
}

float GetLight (vec3 p, vec3 viewer)
{
    vec3 lightPos = vec3(5, 20, -5);
    lightPos.xz += vec2(sin(iTime), cos(iTime))*10.;
    vec3 l = normalize(lightPos-p);
    vec3 n = GetNormal(p);
    float dif = clamp(dot(n, l), 0., 1.);
    vec3 refl = 2.*dot(n, l)*n - l;
    vec2 d = SphereTrace(p+n*SURF_DIST*2., l);
    if(d.x<length(lightPos-p)) dif *= .5;
    return .5*dif + 0.75*pow(clamp(dot(refl, -viewer), 0., 1.), 30.0);
}

vec3 Render(inout vec3 ro, inout vec3 rd, inout vec3 refFact)
{
    vec3 col = env(rd);
    vec2 dMat = SphereTrace(ro,rd);
    vec3 p = ro + rd * dMat.x;
    vec3 n = GetNormal(p);
    vec3 r = reflect(rd, n);
    p += n*0.001;

    float fresnel = pow(clamp(1.-dot(n, -rd), 0., 1.), 5.);
    refFact = vec3(0);

    if(dMat.x<MAX_DIST)
    {
        float dif = GetLight(p, rd);
        col = vec3(dif);
        int mat = int(dMat.y);
        if(mat==MAT_cuboid)        { col *= vec3(0.5,1,1);  refFact = vec3(.1); }
        else if (mat==MAT_sphere)  { refFact = vec3(.75); }
        else if (mat==MAT_torus)   { col *= vec3(1,0,1);    refFact = vec3(.3); }
        else if (mat==MAT_capsule) { col *= vec3(.5,0,0);   refFact = vec3(.2); }
        else if (mat==MAT_cylinder){ col *= vec3(0,.5,1);   refFact = vec3(.1); }
        else if (mat==MAT_plane)   { refFact = vec3(mix(.01, .2, fresnel)); }
    }

    ro = p+n*SURF_DIST;
    rd = r;
    return col;
}

vec3 defrd(vec2 uv, vec3 p, vec3 l, float z)
{
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = f*z,
        i = normalize(c + uv.x*r + uv.y*u);
    return i;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    vec2 m = iMouse.xy/iResolution.xy;
    vec3 ro = vec3(0, 3, -3);
    ro.yz *= rotation(-m.y*3.14+1.);
    ro.xz *= rotation(-m.x*6.2831);
    ro.y = max(ro.y, .1);

    vec3 rd = defrd(uv, ro, vec3(0, 2, 6), .5);

    vec3 refFact = vec3(0);
    vec3 filt = vec3(1);
    vec3 col = Render(ro, rd, refFact);

    for(int i=0; i<NUM_OF_REFLECTION; i++)
    {
        filt *= refFact;
        vec3 reflected = filt*Render(ro, rd, refFact);
        col += reflected*.75;
    }

    fragColor = vec4(col,1.0);
}

void main() {
    mainImage(outColor, gl_FragCoord.xy);
}`;
