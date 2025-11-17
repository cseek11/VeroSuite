/**
 * Centralized constants for card system
 * All magic numbers and configuration values should be defined here
 */

export const CARD_CONSTANTS = {
  MINIMIZED: {
    WIDTH: 200,
    HEIGHT: 140,
  },
  GRID: {
    HORIZONTAL_SPACING: 210, // 200px card + 10px gap
    VERTICAL_SPACING: 150,   // 140px card + 10px gap
    CARDS_PER_ROW: 5,
    START_X: 20,
    START_Y: 20,
    TOLERANCE: 5, // Pixel tolerance for position validation
  },
  CANVAS: {
    MIN_HEIGHT: 600,
    PADDING: 20,
    AUTO_EXPAND_THRESHOLD: 30,
    BOTTOM_OFFSET: 100,
  },
  DRAG: {
    THROTTLE_MS: 4, // ~240fps
    SNAP_DISTANCE: 20,
    MIN_GAP: 12,
  },
  RESIZE: {
    MIN_WIDTH: 200,
    MIN_HEIGHT: 120,
    MAX_WIDTH: 1600, // For page cards
    MAX_HEIGHT: 1000, // For page cards
    MAX_WIDTH_SMART_KPI: 800,
    MAX_HEIGHT_SMART_KPI: 600,
    MAX_WIDTH_STANDARD: 500,
    MAX_HEIGHT_STANDARD: 350,
  },
  UNDO_REDO: {
    MAX_HISTORY_SIZE: 50,
  },
  VIRTUAL_SCROLLING: {
    THRESHOLD: 50, // Enable virtual scrolling for 50+ cards
    OVERSCAN: 5,
  },
  AUTO_SCROLL: {
    SPEED: 20,
    BOUNDARY_ZONE: 100,
  },
  PERSISTENCE: {
    DEBOUNCE_MS: 3000, // Debounce localStorage saves
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_BASE_MS: 1000, // Base delay for exponential backoff
  },
} as const;

// Type-safe access
export type CardConstants = typeof CARD_CONSTANTS;








