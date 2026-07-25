// Self-contained SVG map of California with a dot per library. No external
// dependencies or tile servers — works fully offline. Usable in the browser
// (global `libraryMap`) and under Node's test runner (module.exports).
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.libraryMap = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  // Simplified California border as [lon, lat] pairs (public-domain US state
  // boundary data, embedded once so there is no runtime fetch).
  const CA_OUTLINE = [[-123.233,42.006],[-122.379,42.012],[-121.037,41.995],[-120.002,41.995],[-119.996,40.265],[-120.002,38.999],[-118.715,38.101],[-117.499,37.219],[-116.54,36.502],[-115.85,35.971],[-114.634,35.001],[-114.634,34.875],[-114.47,34.711],[-114.333,34.448],[-114.136,34.306],[-114.257,34.174],[-114.415,34.108],[-114.536,33.933],[-114.498,33.698],[-114.525,33.55],[-114.728,33.407],[-114.662,33.035],[-114.525,33.029],[-114.47,32.843],[-114.525,32.756],[-114.722,32.717],[-116.048,32.624],[-117.126,32.537],[-117.247,32.668],[-117.252,32.876],[-117.329,33.123],[-117.472,33.298],[-117.784,33.539],[-118.184,33.763],[-118.26,33.703],[-118.414,33.741],[-118.392,33.84],[-118.567,34.043],[-118.802,33.999],[-119.219,34.147],[-119.279,34.267],[-119.558,34.415],[-119.876,34.41],[-120.139,34.475],[-120.473,34.448],[-120.648,34.579],[-120.61,34.859],[-120.67,34.903],[-120.632,35.1],[-120.895,35.248],[-120.906,35.45],[-121.004,35.461],[-121.168,35.637],[-121.283,35.675],[-121.333,35.784],[-121.716,36.195],[-121.897,36.316],[-121.935,36.639],[-121.859,36.611],[-121.787,36.803],[-121.93,36.978],[-122.105,36.956],[-122.335,37.115],[-122.417,37.241],[-122.401,37.362],[-122.516,37.521],[-122.516,37.783],[-122.33,37.783],[-122.406,38.15],[-122.488,38.112],[-122.505,37.931],[-122.702,37.893],[-122.938,38.03],[-122.976,38.265],[-123.129,38.452],[-123.332,38.567],[-123.441,38.698],[-123.737,38.956],[-123.688,39.032],[-123.825,39.366],[-123.765,39.553],[-123.852,39.832],[-124.11,40.106],[-124.362,40.259],[-124.411,40.44],[-124.159,40.878],[-124.11,41.026],[-124.159,41.141],[-124.066,41.442],[-124.148,41.716],[-124.257,41.782],[-124.214,42.001],[-123.233,42.006]];

  // Geographic bounds (a little padding beyond the outline extent).
  const BOUNDS = { minLon: -124.5, maxLon: -114.0, minLat: 32.4, maxLat: 42.1 };
  const SIZE = { width: 600, height: 640, pad: 16 };

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Equirectangular projection of [lon, lat] to SVG {x, y} within `size`.
  // Longitude increases left→right; latitude is flipped so north is up.
  function project(lon, lat, bounds = BOUNDS, size = SIZE) {
    const pad = size.pad || 0;
    const w = size.width - pad * 2;
    const h = size.height - pad * 2;
    const x = pad + ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * w;
    const y = pad + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * h;
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
  }

  function outlinePath(bounds = BOUNDS, size = SIZE) {
    return CA_OUTLINE.map(([lon, lat], i) => {
      const p = project(lon, lat, bounds, size);
      return `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
    }).join(' ') + ' Z';
  }

  // Keep only libraries with usable numeric coordinates.
  function withCoords(libraries) {
    return (libraries || []).filter((l) =>
      typeof l.latitude === 'number' && typeof l.longitude === 'number' &&
      !Number.isNaN(l.latitude) && !Number.isNaN(l.longitude));
  }

  // Build the full SVG markup. Each library becomes a clickable circle carrying
  // data-id, with a <title> for a native hover tooltip.
  function buildMapSvg(libraries, opts = {}) {
    const bounds = opts.bounds || BOUNDS;
    const size = opts.size || SIZE;
    const plotted = withCoords(libraries);

    const dots = plotted.map((l) => {
      const p = project(l.longitude, l.latitude, bounds, size);
      const label = escapeHtml(l.branch_name || l.name || 'Library');
      return `<circle class="map-dot" data-id="${escapeHtml(l.id)}" cx="${p.x}" cy="${p.y}" r="5"><title>${label}</title></circle>`;
    }).join('');

    return `<svg class="ca-map" viewBox="0 0 ${size.width} ${size.height}" ` +
      `xmlns="http://www.w3.org/2000/svg" role="img" ` +
      `aria-label="Map of California showing ${plotted.length} libraries">` +
      `<path class="ca-outline" d="${outlinePath(bounds, size)}" />` +
      dots +
      `</svg>`;
  }

  return { project, buildMapSvg, outlinePath, withCoords, CA_OUTLINE, BOUNDS, SIZE };
});
