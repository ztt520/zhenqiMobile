function colorInterpolator(start, end) {
  const r = start[0];
  const g = start[1];
  const b = start[2];
  const Δr = end[0] - r;
  const Δg = end[1] - g;
  const Δb = end[2] - b;
  return (i, a) => {
    return [Math.floor(r + i * Δr), Math.floor(g + i * Δg), Math.floor(b + i * Δb), a];
  };
}

/**
 * Produces a color style in a rainbow-like trefoil color space. Not quite HSV, but produces a nice
 * spectrum. See http://krazydad.com/tutorials/makecolors.php.
 *
 * @param hue the hue rotation in the range [0, 1]
 * @param a the alpha value in the range [0, 255]
 * @returns {Array} [r, g, b, a]
 */
function sinebowColor(hue, a) {
  // Map hue [0, 1] to radians [0, 5/6τ]. Don't allow a full rotation because that keeps hue == 0 and
  // hue == 1 from mapping to the same color.
  const τ = 2 * Math.PI;
  let rad = hue * τ * 5 / 6;
  rad *= 0.75;  // increase frequency to 2/3 cycle per rad

  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const r = Math.floor(Math.max(0, -c) * 255);
  const g = Math.floor(Math.max(s, 0) * 255);
  const b = Math.floor(Math.max(c, 0, -s) * 255);
  return [r, g, b, a];
}

const BOUNDARY = 0.45;
const fadeToWhite = colorInterpolator(sinebowColor(1.0, 0), [255, 255, 255]);

/**
 * Interpolates a sinebow color where 0 <= i <= j, then fades to white where j < i <= 1.
 *
 * @param i number in the range [0, 1]
 * @param a alpha value in range [0, 255]
 * @returns {Array} [r, g, b, a]
 */
function extendedSinebowColor(i, a) {
  return i <= BOUNDARY ?
    sinebowColor(i / BOUNDARY, a) :
    fadeToWhite((i - BOUNDARY) / (1 - BOUNDARY), a);
}

/**
 * @returns {Number} the value x clamped to the range [low, high].
 */
function clamp(x, low, high) {
  return Math.max(low, Math.min(x, high));
}

/**
 * @returns {number} the fraction of the bounds [low, high] covered by the value x, after clamping x to the
 *          bounds. For example, given bounds=[10, 20], this method returns 1 for x>=20, 0.5 for x=15 and 0
 *          for x<=10.
 */
function proportion(x, low, high) {
  return (clamp(x, low, high) - low) / (high - low);
}

/**
 * Creates a color scale composed of the specified segments. Segments is an array of two-element arrays of the
 * form [value, color], where value is the point along the scale and color is the [r, g, b] color at that point.
 * For example, the following creates a scale that smoothly transitions from red to green to blue along the
 * points 0.5, 1.0, and 3.5:
 *
 *     [ [ 0.5, [255, 0, 0] ],
 *       [ 1.0, [0, 255, 0] ],
 *       [ 3.5, [0, 0, 255] ] ]
 *
 * @param segments array of color segments
 * @returns {Function} a function(point, alpha) that returns the color [r, g, b, alpha] for the given point.
 */
function segmentedColorScale(segments) {
  const points = [];
  const interpolators = [];
  const ranges = [];
  for (let i = 0; i < segments.length - 1; i++) {
    points.push(segments[i + 1][0]);
    interpolators.push(colorInterpolator(segments[i][1], segments[i + 1][1]));
    ranges.push([segments[i][0], segments[i + 1][0]]);
  }

  return (point, alpha) => {
    let i;
    for (i = 0; i < points.length - 1; i++) {
      if (point <= points[i]) {
        break;
      }
    }
    const range = ranges[i];
    return interpolators[i](proportion(point, range[0], range[1]), alpha);
  };
}

const FACTORIES = {
  wind: {
    filed: 'scalar',
    type: 'wind',
    name: '风场',
    units: [
      { label: 'km/h', conversion: x => { return x * 3.6; }, precision: 0 }
    ],
    scale: {
      bounds: [0, 50],
      gradient: (v, a) => {
        return extendedSinebowColor(Math.min(v, 50) / 50, a);
      }
    },
  },

  temp: {
    filed: 'scalar',
    type: 'temp',
    name: '温度',
    units: [
      { label: '°C', conversion: x => { return x - 273.15; }, precision: 1 }
    ],
    scale: {
      bounds: [193, 328],
      gradient: segmentedColorScale([
        [193, [37, 4, 42]],
        [206, [41, 10, 130]],
        [219, [81, 40, 40]],
        [233.15, [192, 37, 149]],  // -40 C/F
        [255.372, [70, 215, 215]], // 0 F
        [273.15, [21, 84, 187]],   // 0 C
        [275.15, [24, 132, 14]],   // just above 0 C
        [291, [247, 251, 59]],     //
        [298, [235, 167, 21]],
        [311, [230, 71, 39]],
        [328, [88, 27, 67]]
      ])
    },
  },

  humi: {
    filed: 'scalar',
    type: 'humi',
    name: '湿度',
    units: [
      { label: '%', conversion: x => { return x; }, precision: 0 }
    ],
    scale: {
      bounds: [0, 100],
      gradient: segmentedColorScale([
        [0, [230, 165, 30]],
        [25, [120, 100, 95]],
        [60, [40, 44, 92]],
        [75, [21, 13, 193]],
        [90, [75, 63, 235]],
        [100, [25, 255, 255]]
      ])
    },
  },

  dswrf: {
    filed: 'scalar',
    type: 'dswrf',
    name: '辐射',
    units: [
      { label: 'W/m²', conversion: x => { return x; }, precision: 0 }
    ],
    scale: {
      bounds: [0, 1200],
      gradient: segmentedColorScale([
        [0, [0, 0, 181]],
        [100, [80, 148, 181]],
        [200, [59, 155, 189]],
        [300, [90, 216, 117]],
        [400, [137, 215, 79]],
        [500, [186, 222, 73]],
        [600, [239, 247, 71]],
        [700, [241, 180, 52]],
        [800, [248, 125, 32]],
        [900, [212, 77, 11]],
        [1000, [191, 56, 8]],
        [1100, [184, 31, 13]],
        [1200, [148, 7, 9]]
      ])
    },
  },

  pres: {
    filed: 'scalar',
    type: 'pres',
    name: '气压',
    units: [
      { label: 'hPa', conversion: x => { return x / 100; }, precision: 0 }
    ],
    scale: {
      bounds: [80000, 103000],
      gradient: segmentedColorScale([
        [80000, [156, 197, 203]],
        [99000, [138, 197, 200]],
        [100000, [74, 178, 180]],
        [101000, [62, 105, 142]],
        [102000, [180, 168, 68]],
        [103000, [104, 66, 89]]
      ])
    },
  },

  apcp: {
    filed: 'scalar',
    type: 'apcp',
    name: '降雨',
    units: [
      { label: 'mm', conversion: x => { return x; }, precision: 0 }
    ],
    scale: {
      bounds: [0, 50],
      gradient: segmentedColorScale([
        [0.1, [117, 117, 117]],
        [0.2, [91, 87, 137]],
        [0.5, [73, 102, 170]],
        [1, [70, 153, 171]],
        [2, [83, 184, 100]],
        [4, [145, 206, 76]],
        [6, [206, 218, 62]],
        [8, [220, 182, 64]],
        [10, [219, 158, 69]],
        [15, [217, 121, 77]],
        [20, [210, 96, 95]],
        [30, [179, 56, 103]],
        [40, [147, 23, 78]],
        [50, [84, 16, 41]]
      ])
    }
  }
};

export function Product(type) {
  return FACTORIES[type.toLowerCase()];
}

export default Product;
