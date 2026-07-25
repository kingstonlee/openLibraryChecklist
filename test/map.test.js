'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { project, buildMapSvg, withCoords, BOUNDS, SIZE } = require('../static-version/map.js');

test('project maps the bounds corners to the padded SVG box', () => {
  const pad = SIZE.pad;
  // North-west corner → top-left (inside padding).
  const nw = project(BOUNDS.minLon, BOUNDS.maxLat);
  assert.strictEqual(nw.x, pad);
  assert.strictEqual(nw.y, pad);
  // South-east corner → bottom-right (inside padding).
  const se = project(BOUNDS.maxLon, BOUNDS.minLat);
  assert.strictEqual(se.x, SIZE.width - pad);
  assert.strictEqual(se.y, SIZE.height - pad);
});

test('project increases x with longitude and y downward as latitude drops', () => {
  const west = project(BOUNDS.minLon, 37);
  const east = project(BOUNDS.maxLon, 37);
  assert.ok(east.x > west.x);
  const north = project(-120, BOUNDS.maxLat);
  const south = project(-120, BOUNDS.minLat);
  assert.ok(south.y > north.y);
});

test('withCoords drops entries lacking numeric coordinates', () => {
  const input = [
    { name: 'A', latitude: 34, longitude: -118 },
    { name: 'B', latitude: null, longitude: -120 },
    { name: 'C' },
    { name: 'D', latitude: 'x', longitude: 'y' }
  ];
  assert.deepStrictEqual(withCoords(input).map((l) => l.name), ['A']);
});

test('buildMapSvg renders one dot per plotted library plus the outline', () => {
  const libs = [
    { id: 1, name: 'One', latitude: 34.05, longitude: -118.25 },
    { id: 2, name: 'Two', latitude: 37.77, longitude: -122.42 },
    { id: 3, name: 'No coords' }
  ];
  const svg = buildMapSvg(libs);
  assert.match(svg, /<svg/);
  assert.match(svg, /class="ca-outline"/);
  const dotCount = (svg.match(/class="map-dot"/g) || []).length;
  assert.strictEqual(dotCount, 2);
  assert.match(svg, /data-id="1"/);
  assert.match(svg, /data-id="2"/);
});

test('buildMapSvg escapes library names in the tooltip', () => {
  const svg = buildMapSvg([
    { id: 9, branch_name: '<img src=x onerror=alert(1)>', latitude: 36, longitude: -119 }
  ]);
  assert.ok(!svg.includes('<img'));
  assert.match(svg, /&lt;img/);
});

test('buildMapSvg is safe with empty/undefined input', () => {
  assert.match(buildMapSvg([]), /<svg/);
  assert.match(buildMapSvg(undefined), /<svg/);
});
