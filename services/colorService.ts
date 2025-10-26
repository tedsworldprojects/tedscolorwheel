import { ColorHarmony } from '../constants';
import { HSLColor } from '../types';

// FIX: Define d3 namespace and types to resolve compilation errors.
declare namespace d3 {
  interface Color {
    h: number;
    s: number;
    l: number;
    copy(props?: { h?: number; s?: number; l?: number }): Color;
    formatHex(): string;
    rgb(): { r: number; g: number; b: number; opacity: number };
    toString(): string;
  }
  function hsl(h: number, s: number, l: number): Color;
  function hsl(color: any): Color;
}

const wrapHue = (hue: number): number => (hue + 360) % 360;

export const calculateHarmony = (baseColor: HSLColor, harmony: ColorHarmony): d3.Color[] => {
  const d3Color = d3.hsl(baseColor.h, baseColor.s, baseColor.l);

  switch (harmony) {
    case ColorHarmony.COMPLEMENTARY:
      return [
        d3Color,
        d3Color.copy({ h: wrapHue(d3Color.h + 180) }),
      ];
    case ColorHarmony.ANALOGOUS:
      return [
        d3Color.copy({ h: wrapHue(d3Color.h - 30) }),
        d3Color,
        d3Color.copy({ h: wrapHue(d3Color.h + 30) }),
      ];
    case ColorHarmony.TRIADIC:
      return [
        d3Color,
        d3Color.copy({ h: wrapHue(d3Color.h + 120) }),
        d3Color.copy({ h: wrapHue(d3Color.h + 240) }),
      ];
    case ColorHarmony.TETRADIC:
      return [
        d3Color,
        d3Color.copy({ h: wrapHue(d3Color.h + 90) }),
        d3Color.copy({ h: wrapHue(d3Color.h + 180) }),
        d3Color.copy({ h: wrapHue(d3Color.h + 270) }),
      ];
    case ColorHarmony.SPLIT_COMPLEMENTARY:
      return [
        d3Color,
        d3Color.copy({ h: wrapHue(d3Color.h + 150) }),
        d3Color.copy({ h: wrapHue(d3Color.h + 210) }),
      ];
    case ColorHarmony.MONOCHROMATIC:
       return [
        d3Color.copy({ l: Math.max(0, d3Color.l - 0.2) }),
        d3Color.copy({ l: Math.max(0, d3Color.l - 0.1) }),
        d3Color,
        d3Color.copy({ l: Math.min(1, d3Color.l + 0.1) }),
        d3Color.copy({ l: Math.min(1, d3Color.l + 0.2) }),
      ];
    default:
      return [d3Color];
  }
};
