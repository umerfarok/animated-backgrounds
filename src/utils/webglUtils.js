/**
 * @fileoverview WebGL utilities for high-performance animated backgrounds
 * @module WebGLUtils
 */

/**
 * WebGL shader manager
 */
export class ShaderManager {
  constructor(gl) {
    this.gl = gl;
    this.programs = new Map();
    this.shaders = new Map();
  }

  /**
   * Create and compile shader
   * @param {string} source - Shader source code
   * @param {number} type - Shader type (VERTEX_SHADER or FRAGMENT_SHADER)
   * @returns {WebGLShader} Compiled shader
   */
  createShader(source, type) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compilation error: ${error}`);
    }
    
    return shader;
  }

  /**
   * Create shader program
   * @param {string} vertexSource - Vertex shader source
   * @param {string} fragmentSource - Fragment shader source
   * @returns {WebGLProgram} Shader program
   */
  createProgram(vertexSource, fragmentSource) {
    const gl = this.gl;
    const vertexShader = this.createShader(vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = this.createShader(fragmentSource, gl.FRAGMENT_SHADER);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Program linking error: ${error}`);
    }
    
    // Store attribute and uniform locations
    const programInfo = {
      program,
      attributes: {},
      uniforms: {}
    };
    
    // Get all attributes
    const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttributes; i++) {
      const info = gl.getActiveAttrib(program, i);
      programInfo.attributes[info.name] = gl.getAttribLocation(program, info.name);
    }
    
    // Get all uniforms
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(program, i);
      programInfo.uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
    
    return programInfo;
  }

  /**
   * Get or create program
   * @param {string} name - Program name
   * @param {string} vertexSource - Vertex shader source
   * @param {string} fragmentSource - Fragment shader source
   * @returns {Object} Program info
   */
  getProgram(name, vertexSource, fragmentSource) {
    if (!this.programs.has(name)) {
      this.programs.set(name, this.createProgram(vertexSource, fragmentSource));
    }
    return this.programs.get(name);
  }
}

/**
 * WebGL particle system
 */
export class WebGLParticleSystem {
  constructor(canvas, particleCount = 10000) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }
    
    this.particleCount = particleCount;
    this.shaderManager = new ShaderManager(this.gl);
    this.buffers = {};
    this.textures = {};
    this.frameBuffers = {};
    
    this.time = 0;
    this.isRunning = false;
    
    this.initializeShaders();
    this.initializeBuffers();
  }

  /**
   * Initialize shaders
   */
  initializeShaders() {
    // Particle vertex shader
    const particleVertexShader = `
      attribute vec2 a_position;
      attribute vec2 a_velocity;
      attribute float a_size;
      attribute vec4 a_color;
      attribute float a_life;
      
      uniform mat3 u_transform;
      uniform float u_time;
      uniform vec2 u_resolution;
      
      varying vec4 v_color;
      varying float v_life;
      
      void main() {
        vec2 position = a_position + a_velocity * u_time;
        vec3 transformed = u_transform * vec3(position, 1.0);
        
        gl_Position = vec4(
          (transformed.xy / u_resolution) * 2.0 - 1.0,
          0.0,
          1.0
        );
        
        gl_PointSize = a_size * (1.0 + sin(u_time * 0.01) * 0.2);
        v_color = a_color;
        v_life = a_life;
      }
    `;

    // Particle fragment shader
    const particleFragmentShader = `
      precision mediump float;
      
      varying vec4 v_color;
      varying float v_life;
      
      void main() {
        vec2 center = gl_PointCoord - 0.5;
        float distance = length(center);
        
        if (distance > 0.5) {
          discard;
        }
        
        float alpha = (1.0 - distance * 2.0) * v_color.a * v_life;
        gl_FragColor = vec4(v_color.rgb, alpha);
      }
    `;

    // Background vertex shader
    const backgroundVertexShader = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_uv = (a_position + 1.0) * 0.5;
      }
    `;

    // Animated background fragment shader
    const backgroundFragmentShader = `
      precision mediump float;
      
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform vec3 u_color3;
      
      // Noise function
      float noise(vec2 p) {
        return sin(p.x * 10.0) * sin(p.y * 10.0);
      }
      
      void main() {
        vec2 uv = v_uv;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;
        
        // Animated patterns
        float wave1 = sin(p.x * 3.0 + u_time * 0.002) * 0.5;
        float wave2 = cos(p.y * 2.0 + u_time * 0.003) * 0.5;
        float ripple = sin(length(p) * 5.0 - u_time * 0.01) * 0.3;
        
        float pattern = wave1 + wave2 + ripple;
        
        // Color mixing
        vec3 color = mix(u_color1, u_color2, uv.x);
        color = mix(color, u_color3, uv.y);
        color += pattern * 0.1;
        
        gl_FragColor = vec4(color, 0.8);
      }
    `;

    this.particleProgram = this.shaderManager.getProgram(
      'particles',
      particleVertexShader,
      particleFragmentShader
    );

    this.backgroundProgram = this.shaderManager.getProgram(
      'background',
      backgroundVertexShader,
      backgroundFragmentShader
    );
  }

  /**
   * Initialize buffers
   */
  initializeBuffers() {
    const gl = this.gl;
    
    // Particle data
    const positions = new Float32Array(this.particleCount * 2);
    const velocities = new Float32Array(this.particleCount * 2);
    const sizes = new Float32Array(this.particleCount);
    const colors = new Float32Array(this.particleCount * 4);
    const lives = new Float32Array(this.particleCount);
    
    // Initialize particle data
    for (let i = 0; i < this.particleCount; i++) {
      const i2 = i * 2;
      const i4 = i * 4;
      
      // Random positions
      positions[i2] = Math.random() * this.canvas.width;
      positions[i2 + 1] = Math.random() * this.canvas.height;
      
      // Random velocities
      velocities[i2] = (Math.random() - 0.5) * 2;
      velocities[i2 + 1] = (Math.random() - 0.5) * 2;
      
      // Random sizes
      sizes[i] = Math.random() * 8 + 2;
      
      // Random colors
      colors[i4] = Math.random();
      colors[i4 + 1] = Math.random();
      colors[i4 + 2] = Math.random();
      colors[i4 + 3] = Math.random() * 0.8 + 0.2;
      
      // Random life
      lives[i] = Math.random();
    }
    
    // Create buffers
    this.buffers.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    
    this.buffers.velocity = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.velocity);
    gl.bufferData(gl.ARRAY_BUFFER, velocities, gl.DYNAMIC_DRAW);
    
    this.buffers.size = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.size);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);
    
    this.buffers.color = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
    
    this.buffers.life = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.life);
    gl.bufferData(gl.ARRAY_BUFFER, lives, gl.DYNAMIC_DRAW);
    
    // Background quad
    const quadVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1, -1,
       1,  1,
      -1,  1
    ]);
    
    this.buffers.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.quad);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
  }

  /**
   * Render frame
   */
  render() {
    const gl = this.gl;
    
    // Set viewport
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    
    // Clear
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Render background
    this.renderBackground();
    
    // Render particles
    this.renderParticles();
    
    this.time++;
  }

  /**
   * Render background
   */
  renderBackground() {
    const gl = this.gl;
    const program = this.backgroundProgram;
    
    gl.useProgram(program.program);
    
    // Bind quad vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.quad);
    gl.enableVertexAttribArray(program.attributes.a_position);
    gl.vertexAttribPointer(program.attributes.a_position, 2, gl.FLOAT, false, 0, 0);
    
    // Set uniforms
    gl.uniform1f(program.uniforms.u_time, this.time);
    gl.uniform2f(program.uniforms.u_resolution, this.canvas.width, this.canvas.height);
    gl.uniform3f(program.uniforms.u_color1, 0.1, 0.2, 0.4);
    gl.uniform3f(program.uniforms.u_color2, 0.4, 0.1, 0.6);
    gl.uniform3f(program.uniforms.u_color3, 0.2, 0.5, 0.3);
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /**
   * Render particles
   */
  renderParticles() {
    const gl = this.gl;
    const program = this.particleProgram;
    
    gl.useProgram(program.program);
    
    // Bind attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.enableVertexAttribArray(program.attributes.a_position);
    gl.vertexAttribPointer(program.attributes.a_position, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.velocity);
    gl.enableVertexAttribArray(program.attributes.a_velocity);
    gl.vertexAttribPointer(program.attributes.a_velocity, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.size);
    gl.enableVertexAttribArray(program.attributes.a_size);
    gl.vertexAttribPointer(program.attributes.a_size, 1, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
    gl.enableVertexAttribArray(program.attributes.a_color);
    gl.vertexAttribPointer(program.attributes.a_color, 4, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.life);
    gl.enableVertexAttribArray(program.attributes.a_life);
    gl.vertexAttribPointer(program.attributes.a_life, 1, gl.FLOAT, false, 0, 0);
    
    // Set uniforms
    gl.uniform1f(program.uniforms.u_time, this.time);
    gl.uniform2f(program.uniforms.u_resolution, this.canvas.width, this.canvas.height);
    
    // Identity transform for now
    const transform = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    gl.uniformMatrix3fv(program.uniforms.u_transform, false, transform);
    
    // Draw particles
    gl.drawArrays(gl.POINTS, 0, this.particleCount);
  }

  /**
   * Start animation loop
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    const animate = () => {
      if (!this.isRunning) return;
      
      this.render();
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  /**
   * Stop animation
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Update particle colors
   * @param {Array} colors - Array of RGB colors
   */
  updateColors(colors) {
    const gl = this.gl;
    const colorData = new Float32Array(this.particleCount * 4);
    
    for (let i = 0; i < this.particleCount; i++) {
      const colorIndex = i % colors.length;
      const color = this.hexToRgb(colors[colorIndex]);
      const i4 = i * 4;
      
      colorData[i4] = color.r / 255;
      colorData[i4 + 1] = color.g / 255;
      colorData[i4 + 2] = color.b / 255;
      colorData[i4 + 3] = Math.random() * 0.8 + 0.2;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
    gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.DYNAMIC_DRAW);
  }

  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color string
   * @returns {Object} RGB object
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  /**
   * Resize canvas
   * @param {number} width - New width
   * @param {number} height - New height
   */
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Cleanup resources
   */
  dispose() {
    this.stop();
    
    const gl = this.gl;
    
    // Delete buffers
    Object.values(this.buffers).forEach(buffer => {
      if (buffer) gl.deleteBuffer(buffer);
    });
    
    // Delete programs
    this.shaderManager.programs.forEach(program => {
      if (program.program) gl.deleteProgram(program.program);
    });
  }
}

/**
 * WebGL effect composer
 */
export class WebGLEffectComposer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    this.effects = [];
    this.frameBuffers = [];
    this.currentFrameBuffer = 0;
  }

  /**
   * Add post-processing effect
   * @param {Object} effect - Effect configuration
   */
  addEffect(effect) {
    this.effects.push(effect);
  }

  /**
   * Render with effects
   * @param {Function} renderCallback - Main render function
   */
  render(renderCallback) {
    // Render to first framebuffer
    this.bindFrameBuffer(0);
    renderCallback();
    
    // Apply effects
    this.effects.forEach((effect, index) => {
      const inputBuffer = index;
      const outputBuffer = (index + 1) % 2;
      
      this.bindFrameBuffer(outputBuffer);
      this.applyEffect(effect, this.frameBuffers[inputBuffer].texture);
    });
    
    // Final render to screen
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.renderToScreen(this.frameBuffers[this.effects.length % 2].texture);
  }

  /**
   * Apply single effect
   * @param {Object} effect - Effect to apply
   * @param {WebGLTexture} inputTexture - Input texture
   */
  applyEffect(effect, inputTexture) {
    // Implementation depends on specific effect
    // This is a placeholder for effect processing
  }

  /**
   * Render texture to screen
   * @param {WebGLTexture} texture - Texture to render
   */
  renderToScreen(texture) {
    // Render final result to canvas
  }

  /**
   * Bind framebuffer
   * @param {number} index - Framebuffer index
   */
  bindFrameBuffer(index) {
    if (!this.frameBuffers[index]) {
      this.createFrameBuffer(index);
    }
    
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffers[index].framebuffer);
  }

  /**
   * Create framebuffer
   * @param {number} index - Framebuffer index
   */
  createFrameBuffer(index) {
    const gl = this.gl;
    
    const framebuffer = gl.createFramebuffer();
    const texture = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvas.width, this.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    
    this.frameBuffers[index] = { framebuffer, texture };
  }
}

// Pre-built WebGL effects
export const webglEffects = {
  /**
   * Bloom effect shader
   */
  bloom: {
    fragment: `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform vec2 u_resolution;
      varying vec2 v_uv;
      
      void main() {
        vec4 color = texture2D(u_texture, v_uv);
        float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
        
        if (brightness > 0.8) {
          gl_FragColor = color * 1.5;
        } else {
          gl_FragColor = color;
        }
      }
    `
  },

  /**
   * Blur effect shader
   */
  blur: {
    fragment: `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform vec2 u_resolution;
      uniform float u_blurSize;
      varying vec2 v_uv;
      
      void main() {
        vec4 color = vec4(0.0);
        vec2 texelSize = 1.0 / u_resolution;
        
        for (int x = -2; x <= 2; x++) {
          for (int y = -2; y <= 2; y++) {
            vec2 offset = vec2(float(x), float(y)) * texelSize * u_blurSize;
            color += texture2D(u_texture, v_uv + offset);
          }
        }
        
        gl_FragColor = color / 25.0;
      }
    `
  }
}; 