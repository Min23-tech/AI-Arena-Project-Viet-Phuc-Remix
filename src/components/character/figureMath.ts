export interface Point {
  x: number;
  y: number;
}

// Convert Catmull-Rom spline to Cubic Bézier SVG path string
export function smooth(points: Point[], closed: boolean = false): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
  }

  const pts: Point[] = [];
  if (closed) {
    pts.push(points[points.length - 1], ...points, points[0], points[1]);
  } else {
    pts.push(points[0], ...points, points[points.length - 1]);
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  const n = closed ? points.length : points.length - 1;
  const offset = 1;

  for (let i = 0; i < n; i++) {
    const p0 = pts[i + offset - 1];
    const p1 = pts[i + offset];
    const p2 = pts[i + offset + 1];
    const p3 = pts[i + offset + 2];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  if (closed) {
    d += ' Z';
  }

  return d;
}

// Compute outer and inner offset boundaries along a polyline
export function offsets(
  points: Point[],
  wOut: number | number[],
  wIn: number | number[]
): { outer: Point[]; inner: Point[] } {
  const n = points.length;
  if (n < 2) return { outer: [...points], inner: [...points] };

  const getW = (w: number | number[], i: number) => (Array.isArray(w) ? w[i] : w);

  const normals: Point[] = [];

  for (let i = 0; i < n; i++) {
    let tx = 0;
    let ty = 0;
    if (i === 0) {
      tx = points[1].x - points[0].x;
      ty = points[1].y - points[0].y;
    } else if (i === n - 1) {
      tx = points[n - 1].x - points[n - 2].x;
      ty = points[n - 1].y - points[n - 2].y;
    } else {
      tx = points[i + 1].x - points[i - 1].x;
      ty = points[i + 1].y - points[i - 1].y;
    }

    const len = Math.hypot(tx, ty) || 1;
    // Base normal perpendicular to tangent (-ty, tx)
    let nx = -ty / len;
    let ny = tx / len;

    if (i === 0) {
      // First point: point normal away from center (x < 200 => outward is negative x)
      const outwardSign = points[0].x < 200 ? -1 : 1;
      if (nx * outwardSign < 0) {
        nx = -nx;
        ny = -ny;
      }
    } else {
      // Keep same direction as previous normal
      const prev = normals[i - 1];
      if (nx * prev.x + ny * prev.y < 0) {
        nx = -nx;
        ny = -ny;
      }
    }
    normals.push({ x: nx, y: ny });
  }

  const outer: Point[] = [];
  const inner: Point[] = [];

  for (let i = 0; i < n; i++) {
    const p = points[i];
    const norm = normals[i];
    const wo = getW(wOut, i);
    const wi = getW(wIn, i);

    outer.push({
      x: p.x + norm.x * wo,
      y: p.y + norm.y * wo,
    });
    inner.push({
      x: p.x - norm.x * wi,
      y: p.y - norm.y * wi,
    });
  }

  return { outer, inner };
}

// Tapered capsule connecting a to b with radii wa and wb
export function capsule(a: Point, b: Point, wa: number, wb: number): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const ux = dx / len;
  const uy = dy / len;

  // Tangent points
  const p1 = { x: a.x + nx * wa, y: a.y + ny * wa };
  const p2 = { x: b.x + nx * wb, y: b.y + ny * wb };
  const p3 = { x: b.x - nx * wb, y: b.y - ny * wb };
  const p4 = { x: a.x - nx * wa, y: a.y - ny * wa };

  // Rounded end caps
  const hA = 1.33 * wa;
  const hB = 1.33 * wb;

  // Cap at b: from p2 to p3
  const cpB1 = { x: p2.x + ux * hB, y: p2.y + uy * hB };
  const cpB2 = { x: p3.x + ux * hB, y: p3.y + uy * hB };

  // Cap at a: from p4 to p1
  const cpA1 = { x: p4.x - ux * hA, y: p4.y - uy * hA };
  const cpA2 = { x: p1.x - ux * hA, y: p1.y - uy * hA };

  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} C ${cpB1.x.toFixed(1)} ${cpB1.y.toFixed(1)}, ${cpB2.x.toFixed(1)} ${cpB2.y.toFixed(1)}, ${p3.x.toFixed(1)} ${p3.y.toFixed(1)} L ${p4.x.toFixed(1)} ${p4.y.toFixed(1)} C ${cpA1.x.toFixed(1)} ${cpA1.y.toFixed(1)}, ${cpA2.x.toFixed(1)} ${cpA2.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Z`;
}

// Color helpers
export function adjustHex(hex: string, percent: number): string {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;

  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  if (percent > 0) {
    r = Math.min(255, Math.round(r + (255 - r) * percent));
    g = Math.min(255, Math.round(g + (255 - g) * percent));
    b = Math.min(255, Math.round(b + (255 - b) * percent));
  } else {
    const f = 1 + percent;
    r = Math.max(0, Math.round(r * f));
    g = Math.max(0, Math.round(g * f));
    b = Math.max(0, Math.round(b * f));
  }

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function isColorTooDark(hex: string): boolean {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return false;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  // Perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 48;
}
