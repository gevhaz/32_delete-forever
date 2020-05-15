#version 450

uniform vec2 u_resolution;
uniform float u_time;
uniform float centr;
uniform float bass;
uniform float bass_beat_fade;
uniform float mids;
uniform float high;

in vec2 v_texcoord;
out vec4 fragmentColor;

float random (float x) 
{
    return fract(sin(x)*100000.0);
}

float random(vec2 p) 
{
    return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 random2(vec2 p) 
{
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float noise (float x) 
{
    float i = floor(x);  // integer
    float f = fract(x);  // fraction
    float y = mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
    return y;
}

mat2 rot (float theta) {
    return mat2(cos(theta), sin(theta), -sin(theta), cos(theta));
}

float glowsquare (vec2 _st, float squares)
{
    float shrink = 0.3 * squares;
    vec2 tr = smoothstep(vec2(0.1), vec2(0.2+shrink), _st);
    vec2 bl =  smoothstep(vec2(0.1), vec2(0.2+shrink), vec2(1.0) - _st);
    return round(bl.x * bl.y * tr.x * tr.y);
}

float glowsquare (vec2 _st)
{
    vec2 tr = smoothstep(vec2(0.1), vec2(0.2), _st);
    vec2 bl =  smoothstep(vec2(0.1), vec2(0.2), vec2(1.0) - _st);
    return round(bl.x * bl.y * tr.x * tr.y);
}

float square (vec2 _st)
{
    vec2 tr = step(vec2(0.1), _st);
    vec2 bl =  step(vec2(0.1), vec2(1.0) - _st);
    return round(bl.x * bl.y * tr.x * tr.y);
}

void main () 
{
    vec2 st = v_texcoord.xy;
    vec2 scale = vec2(16.0, 9.0);
    scale *= 10.0;
    st.x *= scale.x;
    st.y *= scale.y;

    // rotate coordinate system
    //st = rot(bass_beat_fade) * st;

    // What rows should be messed with
    float use_row = step(0.5, random(floor(st.y)));

    // factor to give rows random length
    float rowdependence = (0.7 + pow(random(floor(st.y + 1000.0)*6.28), 2.0));

    // product is zero for unaffected rows
    float lengthen = 1.0 + use_row * -0.9 * rowdependence;

    float shortones =  high * use_row * step(lengthen, 0.10);
    float mediumones = mids * use_row * (step(0.10, lengthen) - step(0.35,
                lengthen));
    float longones =   bass * use_row * step(0.35, lengthen);

    float music_impact = shortones + mediumones + longones;

    st.x += music_impact  * u_time * sin(random(floor(st.y + 1000.0))*6.28) * 4.0;
    st.x *= lengthen;

    // float selectrow = step(29.0, st.y) - step(30.0, st.y);
    // st.x += mids * 0.5 * selectrow * u_time;
    // st.x *= 1.0 + selectrow * -0.8;

    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    vec3 color = vec3(0.0);

    vec3 c = vec3(glowsquare(f_st, bass_beat_fade * (1.0-use_row)));

    float transparency = 1.0;
    transparency *= mod(i_st.y, 2.0);

    // transparency += step(4.0, i_st.x);
    // transparency += step(4.0, i_st.y);
    // transparency -= step(5.0 + floor(20.0*bass), i_st.y);
    // transparency -= step(50.0, i_st.x);

    transparency *= step(0.5, random(i_st));
    
    float r = random(i_st+vec2(500.0));
    vec3 coladjust = vec3(
            step(0.00, r) -
            step(0.16, r),
            step(0.16, r) -
            step(0.32, r),
            step(0.32, r) -
            step(0.50, r));

    coladjust += step(0.50, random(i_st+vec2(501.0)));

    c *= coladjust;

    //color *= border * 10.0;
    //color -= vec3(0.02 * bass_beat_fade, 0.14 * bass_beat_fade, 0.04 * bass_beat_fade);

    vec3 lightblue = vec3(165, 240, 255);
    vec3 violet =    vec3(222, 184, 255);
    vec3 matteblue = vec3(157, 146, 220);

    mat3 change_color = mat3(lightblue, violet, matteblue);

    // change_color = mat3(208, 259, 255,
    //                     131,  59, 255,
    //                     255, 139, 214); // Dark red

    change_color /= 256;

    color = change_color * c;

    fragmentColor = vec4(color, transparency);
}
