import '@testing-library/jest-dom';

// Optional: Configure or mock ResizeObserver, window.matchMedia, etc. if needed by components
if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
    };
  };
}
