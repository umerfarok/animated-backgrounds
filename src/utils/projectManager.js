/**
 * @fileoverview Project management and export/import system
 * @module ProjectManager
 */

/**
 * Project configuration class
 */
export class ProjectConfig {
  constructor() {
    this.version = '2.0.0';
    this.name = 'Untitled Project';
    this.description = '';
    this.author = '';
    this.created = new Date().toISOString();
    this.modified = new Date().toISOString();
    this.tags = [];
    
    this.canvas = {
      width: 1920,
      height: 1080,
      background: '#000000',
      fps: 60
    };
    
    this.animation = {
      type: 'particleNetwork',
      duration: 10000,
      loop: true,
      autostart: true
    };
    
    this.theme = {
      name: 'gaming',
      customColors: [],
      customSettings: {}
    };
    
    this.performance = {
      particleCount: 100,
      quality: 'medium',
      enableGPU: true,
      enableAudio: false
    };
    
    this.interactions = {
      enabled: true,
      type: 'attract',
      strength: 1.0,
      radius: 100
    };
    
    this.effects = {
      bloom: false,
      blur: false,
      glow: true,
      trails: false
    };
  }

  /**
   * Update modification timestamp
   */
  touch() {
    this.modified = new Date().toISOString();
  }

  /**
   * Validate configuration
   * @returns {Object} Validation result
   */
  validate() {
    const errors = [];
    const warnings = [];
    
    // Required fields
    if (!this.name || this.name.trim() === '') {
      errors.push('Project name is required');
    }
    
    // Canvas validation
    if (this.canvas.width < 100 || this.canvas.width > 7680) {
      warnings.push('Canvas width should be between 100 and 7680 pixels');
    }
    
    if (this.canvas.height < 100 || this.canvas.height > 4320) {
      warnings.push('Canvas height should be between 100 and 4320 pixels');
    }
    
    if (this.canvas.fps < 1 || this.canvas.fps > 120) {
      warnings.push('FPS should be between 1 and 120');
    }
    
    // Performance validation
    if (this.performance.particleCount < 1 || this.performance.particleCount > 10000) {
      warnings.push('Particle count should be between 1 and 10000');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Clone configuration
   * @returns {ProjectConfig} Cloned configuration
   */
  clone() {
    const cloned = new ProjectConfig();
    Object.assign(cloned, JSON.parse(JSON.stringify(this)));
    cloned.name = `${this.name} Copy`;
    cloned.created = new Date().toISOString();
    cloned.modified = new Date().toISOString();
    return cloned;
  }
}

/**
 * Project manager for handling multiple projects
 */
export class ProjectManager {
  constructor() {
    this.currentProject = null;
    this.projects = new Map();
    this.recentProjects = [];
    this.maxRecentProjects = 10;
    
    this.exportFormats = new Map();
    this.importParsers = new Map();
    
    this.initializeFormats();
    this.loadFromStorage();
  }

  /**
   * Initialize export/import formats
   */
  initializeFormats() {
    // JSON format
    this.exportFormats.set('json', {
      name: 'JSON Project File',
      extension: 'abp',
      mimeType: 'application/json',
      export: this.exportJSON.bind(this),
      import: this.importJSON.bind(this)
    });
    
    // Compressed format
    this.exportFormats.set('compressed', {
      name: 'Compressed Project',
      extension: 'abz',
      mimeType: 'application/octet-stream',
      export: this.exportCompressed.bind(this),
      import: this.importCompressed.bind(this)
    });
    
    // Template format
    this.exportFormats.set('template', {
      name: 'Project Template',
      extension: 'abt',
      mimeType: 'application/json',
      export: this.exportTemplate.bind(this),
      import: this.importTemplate.bind(this)
    });
    
    // Legacy format support
    this.exportFormats.set('legacy', {
      name: 'Legacy Format (v1.x)',
      extension: 'abg',
      mimeType: 'application/json',
      export: this.exportLegacy.bind(this),
      import: this.importLegacy.bind(this)
    });
  }

  /**
   * Create new project
   * @param {string} name - Project name
   * @param {Object} options - Project options
   * @returns {ProjectConfig} New project
   */
  createProject(name = 'New Project', options = {}) {
    const project = new ProjectConfig();
    project.name = name;
    Object.assign(project, options);
    
    this.currentProject = project;
    this.projects.set(project.name, project);
    this.addToRecent(project);
    
    return project;
  }

  /**
   * Load project
   * @param {string} name - Project name
   * @returns {ProjectConfig} Loaded project
   */
  loadProject(name) {
    const project = this.projects.get(name);
    if (project) {
      this.currentProject = project;
      this.addToRecent(project);
      return project;
    }
    throw new Error(`Project '${name}' not found`);
  }

  /**
   * Save current project
   */
  saveProject() {
    if (!this.currentProject) {
      throw new Error('No project to save');
    }
    
    this.currentProject.touch();
    this.projects.set(this.currentProject.name, this.currentProject);
    this.saveToStorage();
  }

  /**
   * Save project as new name
   * @param {string} newName - New project name
   */
  saveProjectAs(newName) {
    if (!this.currentProject) {
      throw new Error('No project to save');
    }
    
    const oldName = this.currentProject.name;
    this.currentProject.name = newName;
    this.currentProject.touch();
    
    this.projects.delete(oldName);
    this.projects.set(newName, this.currentProject);
    this.addToRecent(this.currentProject);
    this.saveToStorage();
  }

  /**
   * Delete project
   * @param {string} name - Project name
   */
  deleteProject(name) {
    if (this.currentProject && this.currentProject.name === name) {
      this.currentProject = null;
    }
    
    this.projects.delete(name);
    this.recentProjects = this.recentProjects.filter(p => p.name !== name);
    this.saveToStorage();
  }

  /**
   * Get all project names
   * @returns {Array} Project names
   */
  getProjectNames() {
    return Array.from(this.projects.keys());
  }

  /**
   * Get project info
   * @param {string} name - Project name
   * @returns {Object} Project info
   */
  getProjectInfo(name) {
    const project = this.projects.get(name);
    if (!project) return null;
    
    return {
      name: project.name,
      description: project.description,
      author: project.author,
      created: project.created,
      modified: project.modified,
      tags: project.tags,
      size: JSON.stringify(project).length
    };
  }

  /**
   * Search projects
   * @param {string} query - Search query
   * @returns {Array} Matching projects
   */
  searchProjects(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.projects.values()).filter(project => 
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Export project to file
   * @param {string} format - Export format
   * @param {ProjectConfig} project - Project to export
   * @returns {Blob} Exported data
   */
  async exportProject(format = 'json', project = this.currentProject) {
    if (!project) {
      throw new Error('No project to export');
    }
    
    const formatter = this.exportFormats.get(format);
    if (!formatter) {
      throw new Error(`Unknown export format: ${format}`);
    }
    
    return await formatter.export(project);
  }

  /**
   * Import project from file
   * @param {File|Blob} file - File to import
   * @param {string} format - Import format (auto-detected if not provided)
   * @returns {ProjectConfig} Imported project
   */
  async importProject(file, format = null) {
    if (!format) {
      format = this.detectFormat(file);
    }
    
    const formatter = this.exportFormats.get(format);
    if (!formatter) {
      throw new Error(`Unknown import format: ${format}`);
    }
    
    const project = await formatter.import(file);
    
    // Ensure unique name
    let baseName = project.name;
    let counter = 1;
    while (this.projects.has(project.name)) {
      project.name = `${baseName} (${counter})`;
      counter++;
    }
    
    this.projects.set(project.name, project);
    this.addToRecent(project);
    this.saveToStorage();
    
    return project;
  }

  /**
   * Export to JSON format
   * @param {ProjectConfig} project - Project to export
   * @returns {Blob} JSON blob
   */
  async exportJSON(project) {
    const data = {
      ...project,
      exportedBy: 'Animated Backgrounds v2.0',
      exportedAt: new Date().toISOString()
    };
    
    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  /**
   * Import from JSON format
   * @param {File|Blob} file - File to import
   * @returns {ProjectConfig} Imported project
   */
  async importJSON(file) {
    const text = await file.text();
    const data = JSON.parse(text);
    
    const project = new ProjectConfig();
    Object.assign(project, data);
    
    return project;
  }

  /**
   * Export to compressed format
   * @param {ProjectConfig} project - Project to export
   * @returns {Blob} Compressed blob
   */
  async exportCompressed(project) {
    const json = JSON.stringify(project);
    const compressed = this.compress(json);
    return new Blob([compressed], { type: 'application/octet-stream' });
  }

  /**
   * Import from compressed format
   * @param {File|Blob} file - File to import
   * @returns {ProjectConfig} Imported project
   */
  async importCompressed(file) {
    const buffer = await file.arrayBuffer();
    const decompressed = this.decompress(new Uint8Array(buffer));
    const data = JSON.parse(decompressed);
    
    const project = new ProjectConfig();
    Object.assign(project, data);
    
    return project;
  }

  /**
   * Export as template
   * @param {ProjectConfig} project - Project to export
   * @returns {Blob} Template blob
   */
  async exportTemplate(project) {
    const template = {
      name: project.name,
      description: project.description,
      tags: ['template', ...project.tags],
      canvas: project.canvas,
      animation: project.animation,
      theme: project.theme,
      performance: project.performance,
      interactions: project.interactions,
      effects: project.effects,
      isTemplate: true,
      templateVersion: '1.0'
    };
    
    const json = JSON.stringify(template, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  /**
   * Import template
   * @param {File|Blob} file - File to import
   * @returns {ProjectConfig} Imported project
   */
  async importTemplate(file) {
    const text = await file.text();
    const template = JSON.parse(text);
    
    const project = new ProjectConfig();
    Object.assign(project, template);
    project.name = `${template.name} Project`;
    project.created = new Date().toISOString();
    project.modified = new Date().toISOString();
    
    return project;
  }

  /**
   * Export to legacy format
   * @param {ProjectConfig} project - Project to export
   * @returns {Blob} Legacy format blob
   */
  async exportLegacy(project) {
    const legacy = {
      version: '1.0',
      settings: {
        animation: project.animation.type,
        theme: project.theme.name,
        particleCount: project.performance.particleCount,
        colors: project.theme.customColors,
        interactive: project.interactions.enabled
      }
    };
    
    const json = JSON.stringify(legacy, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  /**
   * Import from legacy format
   * @param {File|Blob} file - File to import
   * @returns {ProjectConfig} Imported project
   */
  async importLegacy(file) {
    const text = await file.text();
    const legacy = JSON.parse(text);
    
    const project = new ProjectConfig();
    project.name = 'Imported Legacy Project';
    project.animation.type = legacy.settings.animation || 'particleNetwork';
    project.theme.name = legacy.settings.theme || 'gaming';
    project.performance.particleCount = legacy.settings.particleCount || 100;
    project.interactions.enabled = legacy.settings.interactive || false;
    
    if (legacy.settings.colors) {
      project.theme.customColors = legacy.settings.colors;
    }
    
    return project;
  }

  /**
   * Detect file format
   * @param {File} file - File to analyze
   * @returns {string} Detected format
   */
  detectFormat(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    
    switch (ext) {
      case 'abp': return 'json';
      case 'abz': return 'compressed';
      case 'abt': return 'template';
      case 'abg': return 'legacy';
      case 'json': return 'json';
      default: return 'json';
    }
  }

  /**
   * Add project to recent list
   * @param {ProjectConfig} project - Project to add
   */
  addToRecent(project) {
    // Remove if already exists
    this.recentProjects = this.recentProjects.filter(p => p.name !== project.name);
    
    // Add to beginning
    this.recentProjects.unshift({
      name: project.name,
      modified: project.modified,
      description: project.description
    });
    
    // Limit size
    if (this.recentProjects.length > this.maxRecentProjects) {
      this.recentProjects = this.recentProjects.slice(0, this.maxRecentProjects);
    }
  }

  /**
   * Get recent projects
   * @returns {Array} Recent projects
   */
  getRecentProjects() {
    return [...this.recentProjects];
  }

  /**
   * Save to local storage
   */
  saveToStorage() {
    try {
      const data = {
        projects: Object.fromEntries(this.projects),
        recent: this.recentProjects,
        currentProject: this.currentProject?.name || null
      };
      
      localStorage.setItem('animatedBackgrounds_projects', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  /**
   * Load from local storage
   */
  loadFromStorage() {
    try {
      const data = localStorage.getItem('animatedBackgrounds_projects');
      if (!data) return;
      
      const parsed = JSON.parse(data);
      
      // Load projects
      Object.entries(parsed.projects || {}).forEach(([name, projectData]) => {
        const project = new ProjectConfig();
        Object.assign(project, projectData);
        this.projects.set(name, project);
      });
      
      // Load recent projects
      this.recentProjects = parsed.recent || [];
      
      // Load current project
      if (parsed.currentProject && this.projects.has(parsed.currentProject)) {
        this.currentProject = this.projects.get(parsed.currentProject);
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
  }

  /**
   * Simple compression using RLE (Run Length Encoding)
   * @param {string} text - Text to compress
   * @returns {Uint8Array} Compressed data
   */
  compress(text) {
    const bytes = new TextEncoder().encode(text);
    const compressed = [];
    
    let i = 0;
    while (i < bytes.length) {
      const current = bytes[i];
      let count = 1;
      
      // Count consecutive identical bytes
      while (i + count < bytes.length && bytes[i + count] === current && count < 255) {
        count++;
      }
      
      compressed.push(count, current);
      i += count;
    }
    
    return new Uint8Array(compressed);
  }

  /**
   * Decompress RLE data
   * @param {Uint8Array} compressed - Compressed data
   * @returns {string} Decompressed text
   */
  decompress(compressed) {
    const decompressed = [];
    
    for (let i = 0; i < compressed.length; i += 2) {
      const count = compressed[i];
      const byte = compressed[i + 1];
      
      for (let j = 0; j < count; j++) {
        decompressed.push(byte);
      }
    }
    
    return new TextDecoder().decode(new Uint8Array(decompressed));
  }

  /**
   * Generate project statistics
   * @returns {Object} Project statistics
   */
  getStatistics() {
    const projects = Array.from(this.projects.values());
    
    return {
      totalProjects: projects.length,
      totalSize: projects.reduce((sum, p) => sum + JSON.stringify(p).length, 0),
      averageSize: projects.length > 0 ? 
        projects.reduce((sum, p) => sum + JSON.stringify(p).length, 0) / projects.length : 0,
      oldestProject: projects.reduce((oldest, p) => 
        !oldest || new Date(p.created) < new Date(oldest.created) ? p : oldest, null),
      newestProject: projects.reduce((newest, p) => 
        !newest || new Date(p.created) > new Date(newest.created) ? p : newest, null),
      mostRecentlyModified: projects.reduce((recent, p) => 
        !recent || new Date(p.modified) > new Date(recent.modified) ? p : recent, null),
      animationTypes: this.getAnimationTypeStats(projects),
      themes: this.getThemeStats(projects)
    };
  }

  /**
   * Get animation type statistics
   * @param {Array} projects - Projects array
   * @returns {Object} Animation type stats
   */
  getAnimationTypeStats(projects) {
    const stats = {};
    projects.forEach(project => {
      const type = project.animation.type;
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  }

  /**
   * Get theme statistics
   * @param {Array} projects - Projects array
   * @returns {Object} Theme stats
   */
  getThemeStats(projects) {
    const stats = {};
    projects.forEach(project => {
      const theme = project.theme.name;
      stats[theme] = (stats[theme] || 0) + 1;
    });
    return stats;
  }

  /**
   * Clear all data
   */
  clear() {
    this.projects.clear();
    this.recentProjects = [];
    this.currentProject = null;
    localStorage.removeItem('animatedBackgrounds_projects');
  }
}

// Export singleton instance
export const projectManager = new ProjectManager(); 