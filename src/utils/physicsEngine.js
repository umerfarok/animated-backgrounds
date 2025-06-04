/**
 * @fileoverview Advanced physics engine for particle simulations
 * @module PhysicsEngine
 */

/**
 * Vector2D utility class
 */
export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Add another vector
   * @param {Vector2D} vector - Vector to add
   * @returns {Vector2D} New vector
   */
  add(vector) {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  /**
   * Subtract another vector
   * @param {Vector2D} vector - Vector to subtract
   * @returns {Vector2D} New vector
   */
  subtract(vector) {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }

  /**
   * Multiply by scalar
   * @param {number} scalar - Scalar value
   * @returns {Vector2D} New vector
   */
  multiply(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  /**
   * Divide by scalar
   * @param {number} scalar - Scalar value
   * @returns {Vector2D} New vector
   */
  divide(scalar) {
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  /**
   * Get magnitude
   * @returns {number} Magnitude
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalize vector
   * @returns {Vector2D} Normalized vector
   */
  normalize() {
    const mag = this.magnitude();
    return mag > 0 ? this.divide(mag) : new Vector2D(0, 0);
  }

  /**
   * Get distance to another vector
   * @param {Vector2D} vector - Other vector
   * @returns {number} Distance
   */
  distanceTo(vector) {
    return this.subtract(vector).magnitude();
  }

  /**
   * Dot product
   * @param {Vector2D} vector - Other vector
   * @returns {number} Dot product
   */
  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
   * Cross product (2D returns scalar)
   * @param {Vector2D} vector - Other vector
   * @returns {number} Cross product
   */
  cross(vector) {
    return this.x * vector.y - this.y * vector.x;
  }

  /**
   * Rotate vector
   * @param {number} angle - Angle in radians
   * @returns {Vector2D} Rotated vector
   */
  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  /**
   * Clone vector
   * @returns {Vector2D} Cloned vector
   */
  clone() {
    return new Vector2D(this.x, this.y);
  }
}

/**
 * Physics particle class
 */
export class PhysicsParticle {
  constructor(x, y, mass = 1) {
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.acceleration = new Vector2D(0, 0);
    this.force = new Vector2D(0, 0);
    
    this.mass = mass;
    this.radius = Math.sqrt(mass) * 2;
    this.restitution = 0.8; // Bounce factor
    this.friction = 0.98; // Air resistance
    this.damping = 0.99; // Velocity damping
    
    this.color = '#ffffff';
    this.alpha = 1.0;
    this.lifespan = Infinity;
    this.age = 0;
    
    this.fixed = false; // Immovable particle
    this.active = true;
    
    // Trail effect
    this.trail = [];
    this.maxTrailLength = 10;
  }

  /**
   * Apply force to particle
   * @param {Vector2D} force - Force vector
   */
  applyForce(force) {
    this.force = this.force.add(force);
  }

  /**
   * Update particle physics
   * @param {number} deltaTime - Time step
   */
  update(deltaTime) {
    if (!this.active || this.fixed) return;
    
    // Update age
    this.age += deltaTime;
    
    // Check lifespan
    if (this.age > this.lifespan) {
      this.active = false;
      return;
    }
    
    // Calculate acceleration from force (F = ma)
    this.acceleration = this.force.divide(this.mass);
    
    // Update velocity
    this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime));
    
    // Apply friction and damping
    this.velocity = this.velocity.multiply(this.friction * this.damping);
    
    // Update position
    const deltaPosition = this.velocity.multiply(deltaTime);
    this.position = this.position.add(deltaPosition);
    
    // Update trail
    this.updateTrail();
    
    // Reset force for next frame
    this.force = new Vector2D(0, 0);
  }

  /**
   * Update particle trail
   */
  updateTrail() {
    this.trail.push(this.position.clone());
    
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }

  /**
   * Check collision with another particle
   * @param {PhysicsParticle} other - Other particle
   * @returns {boolean} Collision detected
   */
  collidesWith(other) {
    const distance = this.position.distanceTo(other.position);
    return distance < (this.radius + other.radius);
  }

  /**
   * Resolve collision with another particle
   * @param {PhysicsParticle} other - Other particle
   */
  resolveCollision(other) {
    const distance = this.position.distanceTo(other.position);
    const minDistance = this.radius + other.radius;
    
    if (distance >= minDistance) return;
    
    // Calculate collision normal
    const normal = other.position.subtract(this.position).normalize();
    
    // Separate particles
    const overlap = minDistance - distance;
    const separation = normal.multiply(overlap * 0.5);
    
    if (!this.fixed) this.position = this.position.subtract(separation);
    if (!other.fixed) other.position = other.position.add(separation);
    
    // Calculate relative velocity
    const relativeVelocity = other.velocity.subtract(this.velocity);
    const velocityAlongNormal = relativeVelocity.dot(normal);
    
    // Don't resolve if velocities are separating
    if (velocityAlongNormal > 0) return;
    
    // Calculate restitution
    const e = Math.min(this.restitution, other.restitution);
    
    // Calculate impulse scalar
    let j = -(1 + e) * velocityAlongNormal;
    j /= 1 / this.mass + 1 / other.mass;
    
    // Apply impulse
    const impulse = normal.multiply(j);
    
    if (!this.fixed) {
      this.velocity = this.velocity.subtract(impulse.divide(this.mass));
    }
    if (!other.fixed) {
      other.velocity = other.velocity.add(impulse.divide(other.mass));
    }
  }

  /**
   * Apply gravitational force from another particle
   * @param {PhysicsParticle} other - Other particle
   * @param {number} G - Gravitational constant
   */
  applyGravity(other, G = 0.1) {
    const direction = other.position.subtract(this.position);
    const distance = direction.magnitude();
    
    if (distance === 0) return;
    
    const force = G * this.mass * other.mass / (distance * distance);
    const forceVector = direction.normalize().multiply(force);
    
    this.applyForce(forceVector);
  }

  /**
   * Bounce off boundaries
   * @param {number} width - Boundary width
   * @param {number} height - Boundary height
   */
  bounceOffBoundaries(width, height) {
    if (this.position.x - this.radius < 0) {
      this.position.x = this.radius;
      this.velocity.x *= -this.restitution;
    } else if (this.position.x + this.radius > width) {
      this.position.x = width - this.radius;
      this.velocity.x *= -this.restitution;
    }
    
    if (this.position.y - this.radius < 0) {
      this.position.y = this.radius;
      this.velocity.y *= -this.restitution;
    } else if (this.position.y + this.radius > height) {
      this.position.y = height - this.radius;
      this.velocity.y *= -this.restitution;
    }
  }

  /**
   * Wrap around boundaries
   * @param {number} width - Boundary width
   * @param {number} height - Boundary height
   */
  wrapAroundBoundaries(width, height) {
    if (this.position.x < -this.radius) {
      this.position.x = width + this.radius;
    } else if (this.position.x > width + this.radius) {
      this.position.x = -this.radius;
    }
    
    if (this.position.y < -this.radius) {
      this.position.y = height + this.radius;
    } else if (this.position.y > height + this.radius) {
      this.position.y = -this.radius;
    }
  }
}

/**
 * Force generators for physics system
 */
export class ForceGenerator {
  /**
   * Gravity force
   * @param {number} strength - Gravity strength
   * @returns {Vector2D} Gravity force
   */
  static gravity(strength = 9.81) {
    return new Vector2D(0, strength);
  }

  /**
   * Wind force
   * @param {number} strength - Wind strength
   * @param {number} direction - Wind direction in radians
   * @returns {Vector2D} Wind force
   */
  static wind(strength = 1, direction = 0) {
    return new Vector2D(
      Math.cos(direction) * strength,
      Math.sin(direction) * strength
    );
  }

  /**
   * Magnetic field force
   * @param {Vector2D} fieldCenter - Center of magnetic field
   * @param {Vector2D} particlePos - Particle position
   * @param {number} strength - Field strength
   * @returns {Vector2D} Magnetic force
   */
  static magneticField(fieldCenter, particlePos, strength = 1) {
    const direction = fieldCenter.subtract(particlePos);
    const distance = direction.magnitude();
    
    if (distance === 0) return new Vector2D(0, 0);
    
    const force = strength / (distance * distance);
    return direction.normalize().multiply(force);
  }

  /**
   * Turbulence force
   * @param {Vector2D} position - Particle position
   * @param {number} strength - Turbulence strength
   * @param {number} time - Current time
   * @returns {Vector2D} Turbulence force
   */
  static turbulence(position, strength = 1, time = 0) {
    const x = Math.sin(position.x * 0.01 + time * 0.001) * strength;
    const y = Math.cos(position.y * 0.01 + time * 0.001) * strength;
    return new Vector2D(x, y);
  }

  /**
   * Vortex force
   * @param {Vector2D} center - Vortex center
   * @param {Vector2D} particlePos - Particle position
   * @param {number} strength - Vortex strength
   * @returns {Vector2D} Vortex force
   */
  static vortex(center, particlePos, strength = 1) {
    const direction = particlePos.subtract(center);
    const distance = direction.magnitude();
    
    if (distance === 0) return new Vector2D(0, 0);
    
    const force = strength / distance;
    return direction.rotate(Math.PI / 2).normalize().multiply(force);
  }

  /**
   * Spring force
   * @param {Vector2D} anchor - Spring anchor point
   * @param {Vector2D} particlePos - Particle position
   * @param {number} restLength - Spring rest length
   * @param {number} stiffness - Spring stiffness
   * @returns {Vector2D} Spring force
   */
  static spring(anchor, particlePos, restLength = 0, stiffness = 0.1) {
    const direction = anchor.subtract(particlePos);
    const distance = direction.magnitude();
    const extension = distance - restLength;
    
    return direction.normalize().multiply(extension * stiffness);
  }

  /**
   * Electromagnetic force
   * @param {PhysicsParticle} particle1 - First particle
   * @param {PhysicsParticle} particle2 - Second particle
   * @param {number} k - Coulomb's constant
   * @returns {Vector2D} Electromagnetic force
   */
  static electromagnetic(particle1, particle2, k = 1) {
    const direction = particle2.position.subtract(particle1.position);
    const distance = direction.magnitude();
    
    if (distance === 0) return new Vector2D(0, 0);
    
    // Assume particles have charge proportional to mass
    const force = k * particle1.mass * particle2.mass / (distance * distance);
    return direction.normalize().multiply(force);
  }
}

/**
 * Advanced physics engine
 */
export class PhysicsEngine {
  constructor() {
    this.particles = [];
    this.constraints = [];
    this.forces = [];
    this.bounds = { width: 800, height: 600 };
    this.boundaryMode = 'bounce'; // 'bounce', 'wrap', 'none'
    
    this.gravity = new Vector2D(0, 0);
    this.globalFriction = 1.0;
    this.timeStep = 1/60;
    
    this.spatialGrid = new SpatialGrid(50); // For collision optimization
  }

  /**
   * Add particle to simulation
   * @param {PhysicsParticle} particle - Particle to add
   */
  addParticle(particle) {
    this.particles.push(particle);
  }

  /**
   * Remove particle from simulation
   * @param {PhysicsParticle} particle - Particle to remove
   */
  removeParticle(particle) {
    const index = this.particles.indexOf(particle);
    if (index > -1) {
      this.particles.splice(index, 1);
    }
  }

  /**
   * Add global force
   * @param {Function} forceFunction - Function that returns force vector
   */
  addForce(forceFunction) {
    this.forces.push(forceFunction);
  }

  /**
   * Set boundary behavior
   * @param {string} mode - Boundary mode ('bounce', 'wrap', 'none')
   */
  setBoundaryMode(mode) {
    this.boundaryMode = mode;
  }

  /**
   * Set simulation boundaries
   * @param {number} width - Boundary width
   * @param {number} height - Boundary height
   */
  setBounds(width, height) {
    this.bounds.width = width;
    this.bounds.height = height;
  }

  /**
   * Update physics simulation
   * @param {number} deltaTime - Time step
   */
  update(deltaTime = this.timeStep) {
    // Apply global forces
    this.applyGlobalForces();
    
    // Update particle positions
    this.updateParticles(deltaTime);
    
    // Handle collisions
    this.handleCollisions();
    
    // Apply boundary conditions
    this.applyBoundaryConditions();
    
    // Remove inactive particles
    this.removeInactiveParticles();
  }

  /**
   * Apply global forces to all particles
   */
  applyGlobalForces() {
    this.particles.forEach(particle => {
      if (!particle.active || particle.fixed) return;
      
      // Apply gravity
      particle.applyForce(this.gravity.multiply(particle.mass));
      
      // Apply custom forces
      this.forces.forEach(forceFunction => {
        const force = forceFunction(particle);
        if (force) particle.applyForce(force);
      });
    });
  }

  /**
   * Update all particles
   * @param {number} deltaTime - Time step
   */
  updateParticles(deltaTime) {
    this.particles.forEach(particle => {
      particle.update(deltaTime);
    });
  }

  /**
   * Handle particle collisions
   */
  handleCollisions() {
    // Use spatial grid for optimization
    this.spatialGrid.clear();
    this.particles.forEach(particle => {
      this.spatialGrid.insert(particle);
    });
    
    // Check collisions only for nearby particles
    this.particles.forEach(particle => {
      const nearby = this.spatialGrid.getNearby(particle);
      nearby.forEach(other => {
        if (particle !== other && particle.collidesWith(other)) {
          particle.resolveCollision(other);
        }
      });
    });
  }

  /**
   * Apply boundary conditions
   */
  applyBoundaryConditions() {
    this.particles.forEach(particle => {
      if (!particle.active) return;
      
      switch (this.boundaryMode) {
        case 'bounce':
          particle.bounceOffBoundaries(this.bounds.width, this.bounds.height);
          break;
        case 'wrap':
          particle.wrapAroundBoundaries(this.bounds.width, this.bounds.height);
          break;
        // 'none' - particles can move freely outside bounds
      }
    });
  }

  /**
   * Remove inactive particles
   */
  removeInactiveParticles() {
    this.particles = this.particles.filter(particle => particle.active);
  }

  /**
   * Create particle explosion effect
   * @param {Vector2D} center - Explosion center
   * @param {number} particleCount - Number of particles
   * @param {number} force - Explosion force
   */
  createExplosion(center, particleCount = 20, force = 100) {
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = new Vector2D(
        Math.cos(angle) * force,
        Math.sin(angle) * force
      );
      
      const particle = new PhysicsParticle(center.x, center.y, Math.random() * 2 + 1);
      particle.velocity = velocity;
      particle.lifespan = Math.random() * 3000 + 2000;
      particle.color = `hsl(${Math.random() * 60 + 15}, 100%, 60%)`; // Orange/red colors
      
      this.addParticle(particle);
    }
  }

  /**
   * Create particle fountain effect
   * @param {Vector2D} source - Fountain source
   * @param {number} particlesPerFrame - Particles spawned per frame
   */
  createFountain(source, particlesPerFrame = 3) {
    for (let i = 0; i < particlesPerFrame; i++) {
      const angle = -Math.PI/2 + (Math.random() - 0.5) * 0.5; // Upward with spread
      const speed = Math.random() * 50 + 30;
      
      const velocity = new Vector2D(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
      
      const particle = new PhysicsParticle(
        source.x + (Math.random() - 0.5) * 10,
        source.y,
        Math.random() + 0.5
      );
      
      particle.velocity = velocity;
      particle.lifespan = Math.random() * 4000 + 3000;
      particle.color = `hsl(${200 + Math.random() * 60}, 70%, 60%)`; // Blue colors
      
      this.addParticle(particle);
    }
  }

  /**
   * Get all particles
   * @returns {Array} Array of particles
   */
  getParticles() {
    return this.particles;
  }

  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
  }

  /**
   * Get simulation statistics
   * @returns {Object} Simulation stats
   */
  getStats() {
    return {
      particleCount: this.particles.length,
      activeParticles: this.particles.filter(p => p.active).length,
      boundaryMode: this.boundaryMode,
      bounds: this.bounds
    };
  }
}

/**
 * Spatial grid for collision optimization
 */
class SpatialGrid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  /**
   * Clear the grid
   */
  clear() {
    this.grid.clear();
  }

  /**
   * Insert particle into grid
   * @param {PhysicsParticle} particle - Particle to insert
   */
  insert(particle) {
    const cellX = Math.floor(particle.position.x / this.cellSize);
    const cellY = Math.floor(particle.position.y / this.cellSize);
    const key = `${cellX},${cellY}`;
    
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    
    this.grid.get(key).push(particle);
  }

  /**
   * Get nearby particles
   * @param {PhysicsParticle} particle - Reference particle
   * @returns {Array} Nearby particles
   */
  getNearby(particle) {
    const cellX = Math.floor(particle.position.x / this.cellSize);
    const cellY = Math.floor(particle.position.y / this.cellSize);
    const nearby = [];
    
    // Check surrounding cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cellX + dx},${cellY + dy}`;
        if (this.grid.has(key)) {
          nearby.push(...this.grid.get(key));
        }
      }
    }
    
    return nearby;
  }
}

// Export singleton instance
export const physicsEngine = new PhysicsEngine(); 