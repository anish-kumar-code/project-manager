// src/setupTests.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock for window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// --- ADD THIS NEW MOCK ---
// Mock for window.getComputedStyle
Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: (prop: any) => {
      return "";
    },
  }),
});
