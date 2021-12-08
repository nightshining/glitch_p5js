precision mediump float;

// texcoords from the vertex shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;
uniform sampler2D tex1;

// the mouse value between 0 and 1
uniform float mouseX;
uniform float time;


// Source:
// http://coding-experiments.blogspot.com/2010/07/convolution.html

#define EMBOSS_WIDTH  0.0015
#define EMBOSS_HEIGHT 0.0015

// samples a pixel centerd at "uv" and with offset of dx|dy
vec4 sample_pixel(in vec2 uv, in float dx, in float dy)
{
    return texture2D(tex0, uv + vec2(dx, dy));
}

// convolves a SINGLE channel of input color_matrix
float convolve(in float[9] kernel, in vec4[9] color_matrix)
{
   float res = 0.0;
   for (int i=0; i<9; i++)
   {
      res += kernel[i] * color_matrix[i].a;
   }
   return clamp(res + 0.5, 0.0 ,1.0);
}

// builds a 3x3 color matrix centerd at "uv"
void build_color_matrix(in vec2 uv, out vec4[9] color_matrix)
{
    float dxtex = EMBOSS_WIDTH;
    float dytex = EMBOSS_HEIGHT;

  color_matrix[0].rgb = sample_pixel(uv, -dxtex, -dytex)  .rgb;
  color_matrix[1].rgb = sample_pixel(uv, -dxtex,  0.0)  .rgb;
  color_matrix[2].rgb = sample_pixel(uv, -dxtex,  dytex)  .rgb;
  color_matrix[3].rgb = sample_pixel(uv, 0.0,   -dytex) .rgb;
  color_matrix[4].rgb = sample_pixel(uv, 0.0,   0.0)  .rgb;
  color_matrix[5].rgb = sample_pixel(uv, 0.0,   dytex)  .rgb;
  color_matrix[6].rgb = sample_pixel(uv, dxtex,   -dytex) .rgb;
  color_matrix[7].rgb = sample_pixel(uv, dxtex,   0.0)  .rgb;
  color_matrix[8].rgb = sample_pixel(uv, dxtex,   dytex)  .rgb;
}

// builds a mean color matrix (off of .rgb of input).
// NOTE: stores the output in alpha channel
void build_mean_matrix(inout vec4[9] color_matrix)
{
   for (int i=0; i<9; i++)
   {
      color_matrix[i].a = (color_matrix[i].r + color_matrix[i].g + color_matrix[i].b) / 3.;
   }
}


void main() {

  vec2 uv = vTexCoord;
  // // the texture is loaded upside down and backwards by default so lets flip it
   uv = 1.0 - uv;

  // // get the camera and the blurred image as textures
  // vec4 cam = texture2D(tex0, uv);
  // vec4 blur = texture2D(tex1, uv);

  // // calculate an average color for the blurred image
  // // this is essentially the same as saying (blur.r + blur.g + blur.b) / 3.0;
  // float avg = dot(blur.rgb, vec3(0.33333));

  // // mix the blur and camera together according to how bright the blurred image is
  // // use the mouse to control the bloom
  // vec4 bloom = mix(cam, blur, clamp(avg*(1.0 + mouseX), 0.0, 1.0));

  //vec2 uv = gl_FragCoord/vTexCoord.xy;
  
    
     /*  2.  0.  0.
    0.  -1  0.
    0.  0.  -1  */
    
    float kerEmboss[9];
    kerEmboss[0] = 2.0;
    kerEmboss[1] = 0.0;
    kerEmboss[2] = 0.0;
    kerEmboss[3] = 0.0;
    kerEmboss[4] = -1.;
    kerEmboss[5] = 0.0;
    kerEmboss[6] = 0.0;
    kerEmboss[7] = 0.0;
    kerEmboss[8] = -1.;
    
    vec4 pixel_matrix[9];
  
    
    build_color_matrix(uv, pixel_matrix);
    build_mean_matrix(pixel_matrix);
    
    float convolved = convolve(kerEmboss, pixel_matrix);
  gl_FragColor = vec4(vec3(convolved) ,1.0);


}





