export interface RadialGlow {
  color: string
  position: { x: string; y: string }
  size: string
  opacity: number
}

export interface ParticleSettings {
  density: number // Number of particles (30-60)
  sizeRange: { min: number; max: number }
  opacityRange: { min: number; max: number }
  speed: number // Animation speed multiplier
}

export interface MeshOverlay {
  enabled: boolean
  opacity: number
  color: string
}

export interface BackgroundTheme {
  baseColor: string
  glows: RadialGlow[]
  particles: ParticleSettings
  mesh?: MeshOverlay
}

export const backgroundThemes: Record<string, BackgroundTheme> = {
  home: {
    baseColor: '#FAFAFA',
    glows: [
      {
        color: '#14B8A6', // Teal
        position: { x: '75%', y: '30%' },
        size: '800px',
        opacity: 0.12,
      },
      {
        color: '#1E3A5F', // Navy
        position: { x: '20%', y: '70%' },
        size: '700px',
        opacity: 0.1,
      },
      {
        color: '#0F766E', // Dark teal
        position: { x: '50%', y: '50%' },
        size: '600px',
        opacity: 0.08,
      },
    ],
    particles: {
      density: 45,
      sizeRange: { min: 1.5, max: 3 },
      opacityRange: { min: 0.15, max: 0.4 },
      speed: 1,
    },
    mesh: {
      enabled: false,
      opacity: 0,
      color: '#14B8A6',
    },
  },
  personalLoans: {
    baseColor: '#F8FCFC',
    glows: [
      {
        color: '#14B8A6', // Bright teal
        position: { x: '85%', y: '20%' },
        size: '750px',
        opacity: 0.15,
      },
      {
        color: '#5EEAD4', // Light teal accent
        position: { x: '15%', y: '80%' },
        size: '650px',
        opacity: 0.12,
      },
    ],
    particles: {
      density: 50,
      sizeRange: { min: 1.5, max: 2.5 },
      opacityRange: { min: 0.2, max: 0.45 },
      speed: 1.2,
    },
    mesh: {
      enabled: false,
      opacity: 0,
      color: '#14B8A6',
    },
  },
  businessLoans: {
    baseColor: '#FAFBFC',
    glows: [
      {
        color: '#1E3A5F', // Navy
        position: { x: '25%', y: '25%' },
        size: '900px',
        opacity: 0.13,
      },
      {
        color: '#0F766E', // Dark teal
        position: { x: '80%', y: '75%' },
        size: '700px',
        opacity: 0.11,
      },
      {
        color: '#14B8A6', // Teal
        position: { x: '60%', y: '40%' },
        size: '500px',
        opacity: 0.09,
      },
    ],
    particles: {
      density: 40,
      sizeRange: { min: 2, max: 3.5 },
      opacityRange: { min: 0.18, max: 0.5 },
      speed: 0.9,
    },
    mesh: {
      enabled: true,
      opacity: 0.03,
      color: '#1E3A5F',
    },
  },
  resources: {
    baseColor: '#F9FAFB',
    glows: [
      {
        color: '#0F766E', // Dark teal
        position: { x: '50%', y: '30%' },
        size: '850px',
        opacity: 0.14,
      },
      {
        color: '#14B8A6', // Teal
        position: { x: '70%', y: '70%' },
        size: '600px',
        opacity: 0.1,
      },
    ],
    particles: {
      density: 55,
      sizeRange: { min: 1, max: 2.5 },
      opacityRange: { min: 0.15, max: 0.35 },
      speed: 1.1,
    },
    mesh: {
      enabled: true,
      opacity: 0.025,
      color: '#0F766E',
    },
  },
  about: {
    baseColor: '#FAFAFA',
    glows: [
      {
        color: '#14B8A6', // Teal
        position: { x: '30%', y: '50%' },
        size: '800px',
        opacity: 0.12,
      },
      {
        color: '#1E3A5F', // Navy
        position: { x: '70%', y: '50%' },
        size: '750px',
        opacity: 0.1,
      },
    ],
    particles: {
      density: 35,
      sizeRange: { min: 1.5, max: 3 },
      opacityRange: { min: 0.12, max: 0.3 },
      speed: 0.8,
    },
    mesh: {
      enabled: false,
      opacity: 0,
      color: '#14B8A6',
    },
  },
  faq: {
    baseColor: '#F8FCFC',
    glows: [
      {
        color: '#0F766E', // Dark teal
        position: { x: '20%', y: '30%' },
        size: '700px',
        opacity: 0.11,
      },
      {
        color: '#14B8A6', // Teal
        position: { x: '80%', y: '60%' },
        size: '650px',
        opacity: 0.13,
      },
      {
        color: '#5EEAD4', // Light teal
        position: { x: '50%', y: '85%' },
        size: '500px',
        opacity: 0.09,
      },
    ],
    particles: {
      density: 48,
      sizeRange: { min: 1.2, max: 2.8 },
      opacityRange: { min: 0.18, max: 0.4 },
      speed: 1,
    },
    mesh: {
      enabled: false,
      opacity: 0,
      color: '#0F766E',
    },
  },
  contact: {
    baseColor: '#FAFBFC',
    glows: [
      {
        color: '#1E3A5F', // Navy
        position: { x: '40%', y: '20%' },
        size: '750px',
        opacity: 0.12,
      },
      {
        color: '#14B8A6', // Teal
        position: { x: '60%', y: '80%' },
        size: '700px',
        opacity: 0.11,
      },
    ],
    particles: {
      density: 42,
      sizeRange: { min: 1.5, max: 3 },
      opacityRange: { min: 0.15, max: 0.38 },
      speed: 1,
    },
    mesh: {
      enabled: true,
      opacity: 0.02,
      color: '#1E3A5F',
    },
  },
}

/**
 * Get theme based on pathname
 */
export function getThemeForPath(pathname: string): BackgroundTheme {
  if (pathname === '/') {
    return backgroundThemes.home
  }
  
  if (pathname.startsWith('/loans/personal')) {
    return backgroundThemes.personalLoans
  }
  
  if (pathname.startsWith('/loans/business')) {
    return backgroundThemes.businessLoans
  }
  
  if (pathname.startsWith('/blog') || pathname.startsWith('/resources')) {
    return backgroundThemes.resources
  }
  
  if (pathname === '/about' || pathname === '/aboutus') {
    return backgroundThemes.about
  }
  
  if (pathname === '/faq') {
    return backgroundThemes.faq
  }
  
  if (pathname === '/contact') {
    return backgroundThemes.contact
  }
  
  // Default to home theme
  return backgroundThemes.home
}
