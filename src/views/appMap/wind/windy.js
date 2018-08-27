/**
 * windy
 */
import L from 'leaflet';
import * as d3 from 'd3';
import Product from './products';
import { getWindDirectionStr, getWindLevel } from '../../../util/tools';
import { gradientColor, gradientColarRGBA } from '../../../util/gradientcolor';

// import styles from '../../../styles/views/module/map.less';

const VELOCITY_SCALE = 1 / 60000; // scale for wind velocity (completely arbitrary--this value looks nice)
const OVERLAY_ALPHA = Math.floor(0.5 * 255); // overlay transparency (on scale [0, 255])
const INTENSITY_SCALE_STEP = 17; // step size of particle intensity color scale
const MAX_WIND_INTENSITY = 17; // wind velocity at which particle intensity is maximum (m/s)
const MAX_PARTICLE_AGE = 100; // max number of frames a particle is drawn before regeneration
const PARTICLE_LINE_WIDTH = 0.5; // line width of a drawn particle
const PARTICLE_MULTIPLIER = 7; // particle count scalar (completely arbitrary--this values looks nice)
const PARTICLE_REDUCTION = 0.75; // reduce particle count to this much of normal for mobile devices
const FRAME_RATE = 100; // desired milliseconds per frame
const NULL_WIND_VECTOR = [NaN, NaN, null]; // singleton for no wind in the form: [u, v, magnitude]
const TRANSPARENT_BLACK = [255, 0, 0, 0];

const BMap = window.BMap;
class Windy {

    constructor(params) {
        this._map = params.map;
        this._canvas = params.canvas;
        this._overlayCanvas = params.overlay;
        this._maptype = params.maptype ? params.maptype : 'BD';
        // this._data = params.data;
        this._startcolor = '#2879FF';
        this._endcolor = '#2879FF';
        this._linewidth = PARTICLE_LINE_WIDTH;
        this._type = 'wind';
        this._overlayflag = false;
        this._width = this._map.width;
        this._height = this._map.height;
        this._bounds = [
            [0, 0],
            [this._width, this._height]
        ];

        this._windy = {
            field: null,
        };
    }

    setData(data) {
        this._data = data;
        this.buildGrid(this._data, grid => {
            // interpolateField
            this._grid = grid;
        });
    }

    setColor(startcolor, endcolor, opacity, linewidth) {
        this._startcolor = startcolor;
        this._endcolor = endcolor;
        this._opacity = opacity;
        this._linewidth = linewidth;
    }

    bilinearInterpolateScalar(x, y, g00, g10, g01, g11) {
        const rx = (1 - x);
        const ry = (1 - y);
        return g00 * rx * ry + g10 * x * ry + g01 * rx * y + g11 * x * y;
    }

    bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
        const rx = (1 - x);
        const ry = (1 - y);
        const a = rx * ry;
        const b = x * ry;
        const c = rx * y;
        const d = x * y;
        const u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
        const v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
        return [u, v, Math.sqrt(u * u + v * v)];
    }

    createScalarBuilder(record) {
        const data = record.data;
        return {
            header: record.header,
            data: i => data[i],
            interpolate: this.bilinearInterpolateScalar
        };
    }

    createWindBuilder(uComp, vComp) {
        const uData = uComp.data;
        const vData = vComp.data;
        return {
            header: uComp.header,
            data: i => [uData[i], vData[i]],
            interpolate: this.bilinearInterpolateVector
        };
    }

    createBuilder(data) {
        let uComp = null;
        let vComp = null;
        let scalar = null;
        data.forEach(record => {
            switch (record.header.parameterCategory + ',' + record.header.parameterNumber) {
                case '2,2':
                    uComp = record;
                    break;
                case '2,3':
                    vComp = record;
                    break;
                default:
                    scalar = record;
            }
        });
        return uComp ? this.createWindBuilder(uComp, vComp) : this.createScalarBuilder(scalar);
    }

    buildGrid(data, callback) {
        const builder = this.createBuilder(data);
        const header = builder.header;
        const λ0 = header.lo1;
        const φ0 = header.la1 > header.la2 ? header.la1 : header.la2; // the grid's origin (e.g., 0.0E, 90.0N)
        const Δλ = header.dx;
        const Δφ = header.dy;
        const ni = header.nx;
        const nj = header.ny; // number of grid points W-E and N-S (e.g., 144 x 73)
        const date = new Date(header.refTime);
        date.setHours(date.getHours() + header.forecastTime);

        // Scan mode 0 assumed. Longitude increases from λ0, and latitude decreases from φ0.
        // http://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_table3-4.shtml
        const grid = [];
        let p = 0;
        const isContinuous = Math.floor(ni * Δλ) >= 360;
        if (header.la1 > header.la2) {
            for (let j = 0; j < nj; j++) {
                const row = [];
                for (let i = 0; i < ni; i++, p++) {
                    row[i] = builder.data(p);
                }
                if (isContinuous) {
                    // For wrapped grids, duplicate first column as last column to simplify interpolation logic
                    row.push(row[0]);
                }
                grid[j] = row;
            }
        } else {
            for (let j = nj - 1; j >= 0; j--) {
                const row = [];
                for (let i = 0; i < ni; i++, p++) {
                    row[i] = builder.data(p);
                }
                if (isContinuous) {
                    // For wrapped grids, duplicate first column as last column to simplify interpolation logic
                    row.push(row[0]);
                }
                grid[j] = row;
            }
        }

        function floorMod(a, n) {
            return a - n * Math.floor(a / n);
        }

        function isValue(x) {
            return x !== null && x !== undefined;
        }

        function interpolate(λ, φ) {
            const i = floorMod(λ - λ0, 360) / Δλ; // calculate longitude index in wrapped range [0, 360)
            const j = (φ0 - φ) / Δφ; // calculate latitude index in direction +90 to -90

            const fi = Math.floor(i);
            const ci = fi + 1;
            const fj = Math.floor(j);
            const cj = fj + 1;

            let row;
            // eslint-disable-next-line
            if ((row = grid[fj])) {
                const g00 = row[fi];
                const g10 = row[ci];
                // eslint-disable-next-line
                if (isValue(g00) && isValue(g10) && (row = grid[cj])) {
                    const g01 = row[fi];
                    const g11 = row[ci];
                    if (isValue(g01) && isValue(g11)) {
                        // All four points found, so interpolate the value.
                        return builder.interpolate(i - fi, j - fj, g00, g10, g01, g11);
                    }
                }
            }
            return null;
        }

        callback({
            date,
            interpolate
        });
    }

    /**
     * @returns {Boolean} true if the specified value is not null and not undefined.
     */
    isValue(x) {
        return x !== null && x !== undefined;
    }

    /**
     * @returns {Object} the first argument if not null and not undefined, otherwise the second argument.
     */
    coalesce(a, b) {
        return this.isValue(a) ? a : b;
    }

    /**
     * @returns {Number} returns remainder of floored division, i.e., floor(a / n). Useful for consistent modulo
     *          of negative numbers. See http://en.wikipedia.org/wiki/Modulo_operation.
     */
    floorMod(a, n) {
        return a - n * Math.floor(a / n);
    }

    /**
     * @returns {Number} distance between two points having the form [x, y].
     */
    distance(a, b) {
        const Δx = b[0] - a[0];
        const Δy = b[1] - a[1];
        return Math.sqrt(Δx * Δx + Δy * Δy);
    }

    /**
     * @returns {Number} the value x clamped to the range [low, high].
     */
    clamp(x, range) {
        return Math.max(range[0], Math.min(x, range[1]));
    }

    /**
     * Pad number with leading zeros. Does not support fractional or negative numbers.
     */
    zeroPad(n, width) {
        const s = n.toString();
        const i = Math.max(width - s.length, 0);
        return new Array(i + 1).join('0') + s;
    }

    buildBounds(bounds, width, height) {
        const upperLeft = bounds[0];
        const lowerRight = bounds[1];
        const x = Math.round(upperLeft[0]); // Math.max(Math.floor(upperLeft[0], 0), 0);
        const y = Math.max(Math.floor(upperLeft[1], 0), 0);
        const xMax = Math.min(Math.ceil(lowerRight[0], width), width - 1);
        const yMax = Math.min(Math.ceil(lowerRight[1], height), height - 1);
        return { x, y, xMax: width, yMax, width, height };
    }

    createMask() {
        const canvas = d3.select(document.createElement('canvas')).attr('width', this._width).attr('height', this._height).node();
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(255, 0, 0, 1)';
        context.fill();

        const imageData = context.getImageData(0, 0, this._width, this._height);
        const data = imageData.data;
        return {
            imageData: imageData,
            set: (x, y, rgba) => {
                const i = (y * this._width + x) * 4;
                data[i] = rgba[0];
                data[i + 1] = rgba[1];
                data[i + 2] = rgba[2];
                data[i + 3] = rgba[3];
            }
        };
    }

    gradient(bounds, startcolor, endcolor, opacity) {
        const step = bounds[1] - bounds[0];
        const result = new gradientColarRGBA(startcolor, endcolor, step, Math.floor(opacity * 255));
        result.indexFor = m => Math.floor(Math.min(m, bounds[1]) / bounds[1] * (result.length - 1));
        return result;
    }

    interpolateField(grid, bounds, scale, callback) {
        // const projection = d3.geo.mercator().precision(0.1);
        const projection = d3.geoMercator().precision(0.1);
        const velocityScale = bounds.height * VELOCITY_SCALE;

        let columns = [];
        let point = [];
        // const scale = { bounds }; // grid.recipe.scale; //, gradient = scale.gradient;
        // const scale = this.gradient([0, 1000], '#66B3FF', '#FF2D2D', 0.3);
        const map = this._map;
        const maptype = this._maptype;
        let mask;

        let level = map.getZoom();
        let bdprojection;
        let cpt;
        let b;
        if (maptype === 'BD') {
            bdprojection = new BMap.MercatorProjection();
            let extent = this._map.getBounds();
            let sw = extent.getSouthWest();
            let ne = extent.getNorthEast();
            let swpoint = bdprojection.lngLatToPoint(sw);
            let nepoint = bdprojection.lngLatToPoint(ne);
            cpt = {
                x: (swpoint.x + nepoint.x) / 2,
                y: (swpoint.y + nepoint.y) / 2
            };
            b = Math.pow(2, 18 - level);
        }
        // console.log(sw, ne);
        // console.log(bounds);

        function spread(p, low, high) {
            return p * (high - low) + low;
        }

        if (scale) {
            mask = this.createMask();
        }

        function invert(x) {
            let p = maptype === 'LEAFLET' ? map.containerPointToLatLng(L.point(x[1], x[0])) : map.pixelToPoint(new BMap.Pixel(x[1], x[0]));
            return [p.lng, p.lat];
        }

        function project(x) {
            if (maptype === 'LEAFLAT') {
                let p = map.project(L.latLng(x[1], x[0]));
                p = p._subtract(map.getPixelOrigin());
                p = L.point(p).add(map._getMapPanePos());
                return [p.x, p.y];
            }

            // BDMap
            let pt = bdprojection.lngLatToPoint(new BMap.Point(x[0], x[1]));
            let nx = (pt.x - cpt.x) / b + bounds.width / 2;
            let ny = (cpt.y - pt.y) / b + bounds.height / 2;
            return [nx, ny];
        }

        /**
         * @returns {Boolean} true if the specified value is not null and not undefined.
         */
        function isValue(x) {
            return x !== null && x !== undefined;
        }

        function distortion(projectionname, λ, φ, x, y) {
            const τ = 2 * Math.PI;
            const H = Math.pow(10, -5.2);
            const hλ = λ < 0 ? H : -H;
            const hφ = φ < 0 ? H : -H;
            const pλ = project([λ + hλ, φ]);
            const pφ = project([λ, φ + hφ]);
            // var pλ = projection([λ + hλ, φ]);
            // var pφ = projection([λ, φ + hφ]);

            // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1º λ
            // changes depending on φ. Without this, there is a pinching effect at the poles.
            const k = Math.cos(φ / 360 * τ);
            return [
                (pλ[0] - x) / hλ / k,
                (pλ[1] - y) / hλ / k,
                (pφ[0] - x) / hφ,
                (pφ[1] - y) / hφ
            ];
        }

        /**
         * Calculate distortion of the wind vector caused by the shape of the projection at point (x, y). The wind
         * vector is modified in place and returned by this function.
         */
        function distort(projectionname, λ, φ, x, y, scales, wind) {
            const u = wind[0] * scales;
            const v = wind[1] * scales;
            const d = distortion(projectionname, λ, φ, x, y);

            // Scale distortion vectors by u and v, then add.
            wind[0] = d[0] * u + d[2] * v;
            wind[1] = d[1] * u + d[3] * v;
            return wind;
        }

        function interpolateColumn(x) {
            let column = [];
            for (let y = bounds.y; y <= bounds.yMax; y += 2) {
                point[1] = x;
                point[0] = y;
                const coord = invert(point);
                let color = TRANSPARENT_BLACK;
                if (coord) {
                    const λ = coord[0]; // lng
                    const φ = coord[1]; // lat
                    let scalar;
                    if (isFinite(λ)) {
                        const value = grid.interpolate(λ, φ);
                        if (value && value[2]) {
                            // 风
                            const wind = distort(projection, λ, φ, x, y, velocityScale, value);
                            column[y + 1] = column[y] = wind;
                            scalar = wind[2];
                        } else {
                            scalar = value;
                        }
                        if (scale && isValue(scalar)) {
                            color = scale.gradient(scalar, OVERLAY_ALPHA);
                            mask.set(x, y, color);
                            mask.set(x + 1, y, color);
                            mask.set(x, y + 1, color);
                            mask.set(x + 1, y + 1, color);
                        }
                    }
                }
            }
            columns[x + 1] = columns[x] = column;
        }

        function createField() {
            // console.log('create field');
            /**
             * @returns {Array} wind vector [u, v, magnitude] at the point (x, y), or [NaN, NaN, null] if wind
             *          is undefined at that point.
             */
            function field(x, y) {
                const column = columns[Math.round(x)];
                return column && column[Math.round(y)] || NULL_WIND_VECTOR;
            }

            // Frees the massive "columns" array for GC. Without this, the array is leaked (in Chrome) each time a new
            // field is interpolated because the field closure's context is leaked, for reasons that defy explanation.
            field.release = () => {
                // eslint-disable-next-line
                columns = [];
                if (mask && mask.imageData) {
                    mask.imageData = [];
                }
            };

            field.randomize = o => { // UNDONE: this method is terrible
                let x;
                let y;
                let safetyNet = 0;
                do {
                    x = Math.round(Math.floor(Math.random() * bounds.width) + bounds.x);
                    y = Math.round(Math.floor(Math.random() * bounds.height) + bounds.y);
                } while (field(x, y)[2] === null && safetyNet++ < 30);
                o.x = x;
                o.y = y;
                return o;
            };
            if (scale) {
                field.overlay = mask.imageData;
            }
            // return field;
            callback(bounds, field);
        }

        let xx = bounds.x;
        (function batchInterpolate() {
            try {
                // let start = Date.now();
                while (xx < bounds.width) {
                    interpolateColumn(xx);
                    xx += 2;
                    // if ((Date.now() - start) > 1200) { // MAX_TASK_TIME) {
                    //   // Interpolation is taking too long. Schedule the next batch for later and yield.
                    //   // report.progress((x - bounds.x) / (bounds.xMax - bounds.x));
                    //   console.log('timeout', Date.now() - start);
                    //   // xx = bounds.x;
                    //   setTimeout(() => batchInterpolate(), 20);
                    //   return;
                    // }
                }
                createField();
            } catch (e) {
                console.log('error in batch interp', e);
            }
        }());
    }

    animate(bounds, field, maplevel = 5, that = this) {
        function asColorStyle(r, g, b, a) {
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
        }

        let framerate = FRAME_RATE;
        let opacity = 0.8;
        let particlemultiplier = 10;
        let k = 1;
        let linewidth = that._linewidth;
        if (maplevel <= 3) {
            opacity = 0.8;
            framerate = 60;
            particlemultiplier = 20;
            k = 1.2;
            linewidth = 1.5;
        } else if (maplevel === 4) {
            opacity = 0.8;
            framerate = 60;
            particlemultiplier = 16;
            k = 1.1;
            linewidth = 1.5;
        } else if (maplevel === 5) {
            opacity = 0.8;
            framerate = 75;
            particlemultiplier = 10;
            k = 1;
            linewidth = 1.6;
        } else if (maplevel === 6) {
            opacity = 0.7;
            framerate = 75;
            particlemultiplier = 8;
            k = 0.8;
            linewidth = 1.8;
        } else if (maplevel === 7) {
            opacity = 0.65;
            framerate = 75;
            particlemultiplier = 6;
            k = 0.6;
            linewidth = 1.8;
        } else if (maplevel === 8) {
            opacity = 0.6;
            framerate = 80;
            particlemultiplier = 4;
            k = 0.5;
            linewidth = 1.8;
        } else if (maplevel === 9) {
            opacity = 0.55;
            framerate = 80;
            particlemultiplier = 3;
            k = 0.4;
            linewidth = 2;
        } else if (maplevel === 10) {
            opacity = 0.5;
            framerate = 80;
            particlemultiplier = 2;
            k = 0.3;
            linewidth = 2;
        } else if (maplevel === 11) {
            opacity = 0.4;
            framerate = 100;
            particlemultiplier = 1;
            k = 0.2;
            linewidth = 2.2;
        } else if (maplevel === 12) {
            opacity = 0.3;
            framerate = 100;
            particlemultiplier = 0.8;
            k = 0.1;
            linewidth = 2.3;
        } else if (maplevel === 13) {
            opacity = 0.2;
            framerate = 100;
            particlemultiplier = 0.7;
            k = 0.08;
            linewidth = 2.5;
        } else {
            opacity = 0.1;
            framerate = 120;
            particlemultiplier = 0.5;
            k = 0.05;
            linewidth = 2.6;
        }

        console.log('地图级别:', maplevel, ' 风场透明度:', opacity, ' 风场帧率:', framerate, ' 放大系数:', particlemultiplier, '风速系数:', k, '线宽:', linewidth);
        // console.log(bounds);
        function windIntensityColorScale(step, maxWind) {
            // const result = [];
            if (that._opacity) {
                opacity = that._opacity;
            }

            let startcolor = that._startcolor;
            let endcolor = that._endcolor;

            const result = new gradientColor(startcolor, endcolor, step, opacity);
            result.indexFor = m => Math.floor(Math.min(m, maxWind) / maxWind * (result.length - 1));
            return result;
        }

        const colorStyles = windIntensityColorScale(INTENSITY_SCALE_STEP, MAX_WIND_INTENSITY);
        let buckets = colorStyles.map(() => []);
        const width = bounds.width < 1200 ? bounds.width : 1200;
        const particleCount = Math.round(bounds.width * particlemultiplier * 0.25);
        // console.log(maplevel, particleCount);

        const fadeFillStyle = 'rgba(255, 255, 255, 0.8)';
        // const fadeFillStyle = 'rgba(255, 255, 0, 0.97)';

        let particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(field.randomize({ age: Math.floor(Math.random() * MAX_PARTICLE_AGE) + 0 }));
        }

        function evolve() {
            buckets.forEach(bucket => { bucket.length = 0; });
            particles.forEach(particle => {
                if (particle.age > MAX_PARTICLE_AGE) {
                    field.randomize(particle).age = 0;
                }
                let x = particle.x;
                let y = particle.y;
                let v = field(x, y); // vector at current position
                let m = v[2];
                if (m === null) {
                    particle.age = MAX_PARTICLE_AGE; // particle has escaped the grid, never to return...
                } else {
                    let xt = x + k * v[0];
                    let yt = y + k * v[1];
                    if (field(xt, yt)[2] !== null) {
                        // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
                        particle.xt = xt;
                        particle.yt = yt;
                        buckets[colorStyles.indexFor(m)].push(particle);
                    } else {
                        // Particle isn't visible, but it still moves through the field.
                        particle.x = xt;
                        particle.y = yt;
                    }
                }
                particle.age += 1;
            });
        }

        const g = this._canvas.getContext('2d');
        g.lineWidth = linewidth;
        g.fillStyle = fadeFillStyle;

        function draw() {
            // Fade existing particle trails.
            let prev = g.globalCompositeOperation;
            g.globalCompositeOperation = 'destination-in';
            g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            g.globalCompositeOperation = prev;

            // Draw new particle trails.
            buckets.forEach((bucket, i) => {
                if (bucket.length > 0) {
                    g.beginPath();
                    g.strokeStyle = colorStyles[i];
                    bucket.forEach(particle => {
                        g.moveTo(particle.x, particle.y);
                        g.lineTo(particle.xt, particle.yt);
                        particle.x = particle.xt;
                        particle.y = particle.yt;
                    });
                    g.stroke();
                }
            });
        }

        (function frame() {
            try {
                evolve();
                const flag = draw();
                if (that._windflag) {
                    that._time = setTimeout(frame, framerate);
                } else {
                    console.log('释放内存');
                    particles = [];
                    buckets = [];
                }
                // console.log(Date.parse(new Date()));
            } catch (e) {
                console.error(e);
            }
        }());
    }

    start(bounds, width, height) {
        this._bounds = bounds;
        this._width = width;
        this._height = height;
        this.stop();
        this._windflag = true;
        if (this._grid) {
            let windproduct = false;
            if (this._type === 'wind' && this._overlayflag === true) {
                windproduct = Product(this._type);
            }
            // eslint-disable-next-line
            this.interpolateField(this._grid, this.buildBounds(bounds, width, height), windproduct.scale, (bounds, field) => {
                // animate the canvas with random points
                this._windy.field = field;
                if (windproduct) {
                    const ctx = this._overlayCanvas.getContext('2d');
                    ctx.putImageData(field.overlay, 0, 0);
                }
                this.animate(bounds, field, this._map.getZoom());
            });
        }
        // setTimeout(this.drawOverlay(), 20);
    }

    stop() {
        this._windflag = false;
        if (this._windy.field) {
            this._windy.field.release();
            if (this._time) {
                clearTimeout(this._time);
            }
        }
    }

    setOverlay(type, data) {
        this._overlayData = data;
        this._type = type !== undefined ? type : 'wind';

        if (data) {
            this._overlayflag = true;
            this._overlayProduct = Product(type);
            this.drawOverlay();
        } else {
            this._overlayflag = false;
            this.releaseOverlay();
        }
    }

    drawOverlay() {
        // this._overlay = canvas;
        // this.releaseOverlay();
        if (this._overlayData) {
            this.buildGrid(this._overlayData, grid => {
                this._overlayGrid = grid;
                this.interpolateField(grid, this.buildBounds(this._bounds, this._width, this._height), this._overlayProduct.scale, (bounds, field) => {
                    this._windy.overlayfield = field;
                    const ctx = this._overlayCanvas.getContext('2d');
                    ctx.putImageData(field.overlay, 0, 0);
                });
            });
        }
    }

    releaseOverlay() {
        if (this._windy.overlayfield) {
            this._windy.overlayfield.release();
        }
        this._overlayData = undefined;
        // if (this._overlayCanvas) {
        //   const ctx = this._overlayCanvas.getContext('2d');
        //   ctx.clearRect(0, 0, this._width, this._height);
        //   const colorBar = (d3.select(`.${styles.shadowColor}`)).node();
        //   const g = colorBar.getContext('2d');
        //   g.clearRect(0, 0, colorBar.width, colorBar.height);
        //   $(`.${styles.leveltip} td:nth-child(1)`).html('优');
        //   $(`.${styles.leveltip} td:nth-child(2)`).html('良');
        //   $(`.${styles.leveltip} td:nth-child(3)`).html('轻度');
        //   $(`.${styles.leveltip} td:nth-child(4)`).html('中度');
        //   $(`.${styles.leveltip} td:nth-child(5)`).html('重度');
        //   $(`.${styles.leveltip} td:nth-child(6)`).html('严重');
        // }
    }

    getOverlayByLatlng(lat, lng) {
        const τ = 2 * Math.PI;
        if (!this._overlayGrid) {
            return undefined;
        }
        const val = this._overlayGrid.interpolate(lng, lat);
        const obj = {};
        obj.name = this._overlayProduct.name;
        obj.val = val ? (this._overlayProduct.units[0].conversion(val)).toFixed(this._overlayProduct.units[0].precision) : '-';
        obj.unit = this._overlayProduct.units[0].label;
        return obj;
    }

    getWindByLatlng(lat, lng) {
        const τ = 2 * Math.PI;
        if (!this._grid && !this._overlayGrid) {
            return undefined;
        }
        const wind = this._grid ? this._grid.interpolate(lng, lat) : this._overlayGrid.interpolate(lng, lat);
        if (wind === null) {
            return undefined;
        }
        const d = Math.atan2(-wind[0], -wind[1]) / τ * 360; // calculate into-the-wind cardinal degrees
        const wd = Math.round((d + 360) % 360 / 5) * 5; // shift [-180, 180] to [0, 360], and round to nearest 5.
        const result = {};
        result.wd = getWindDirectionStr(wd);
        result.ws = wind[2] * 3.6;
        result.wl = getWindLevel(result.ws);
        result.unit = 'km/h';
        return result;
    }
}

export default Windy;