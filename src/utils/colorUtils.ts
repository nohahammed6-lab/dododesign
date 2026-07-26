// Utility for parsing color hexes and combination color names (e.g., "أبيض واسود", "ذهبي وأسود")
import React from 'react';

export interface ColorStyleResult {
  style: React.CSSProperties;
  isMultiColor: boolean;
  colors: string[];
}

const COLOR_DICTIONARY: Record<string, string> = {
  // Arabic names
  أبيض: '#ffffff',
  ابيض: '#ffffff',
  'أوف وايت': '#f5f5f0',
  'اوف وايت': '#f5f5f0',
  وايت: '#ffffff',
  أسود: '#000000',
  اسود: '#000000',
  بلاك: '#000000',
  ملكي: '#000000',
  ذهبي: '#d4af37',
  مذهب: '#d4af37',
  جولد: '#d4af37',
  أحمر: '#cc0000',
  احمر: '#cc0000',
  ريد: '#cc0000',
  نبيتي: '#800020',
  عنابي: '#800020',
  بوردو: '#800020',
  كحلي: '#1a2b4c',
  أزرق: '#1e40af',
  ازرق: '#1e40af',
  بلو: '#1e40af',
  أخضر: '#1b4d3e',
  اخضر: '#1b4d3e',
  جرين: '#1b4d3e',
  زيتي: '#556b2f',
  فضي: '#c0c0c0',
  فضية: '#c0c0c0',
  سيلفر: '#c0c0c0',
  وردي: '#e8a5b8',
  بنك: '#e8a5b8',
  بيج: '#f5f5dc',
  بني: '#654321',
  براون: '#654321',
  رمادي: '#808080',
  رصاصي: '#808080',
  جراي: '#808080',
  سماوي: '#38bdf8',
  موف: '#8b5cf6',
  بنفسجي: '#8b5cf6',
  برتقالي: '#f97316',
  أصفر: '#eab308',
  اصفر: '#eab308',

  // English names
  white: '#ffffff',
  black: '#000000',
  gold: '#d4af37',
  red: '#cc0000',
  navy: '#1a2b4c',
  blue: '#1e40af',
  green: '#1b4d3e',
  silver: '#c0c0c0',
  pink: '#e8a5b8',
  beige: '#f5f5dc',
  brown: '#654321',
  burgundy: '#800020',
  olive: '#556b2f',
  gray: '#808080',
  grey: '#808080',
  purple: '#8b5cf6',
  cyan: '#38bdf8',
  yellow: '#eab308',
  orange: '#f97316',
};

export function getSwatchStyle(hex?: string, nameAr?: string, nameEn?: string): ColorStyleResult {
  const cleanHex = (hex || '').trim();
  const cleanAr = (nameAr || '').trim();
  const cleanEn = (nameEn || '').trim();

  // 1. If hex is already a gradient string
  if (cleanHex.toLowerCase().includes('gradient')) {
    return {
      style: { background: cleanHex },
      isMultiColor: true,
      colors: [],
    };
  }

  // 2. If hex contains multiple values separated by commas, slashes, or pluses
  if (cleanHex.includes(',') || cleanHex.includes('/') || cleanHex.includes('+')) {
    const parts = cleanHex
      .split(/[,/\\+]/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (parts.length >= 2) {
      if (parts.length === 2) {
        return {
          style: { background: `linear-gradient(135deg, ${parts[0]} 50%, ${parts[1]} 50%)` },
          isMultiColor: true,
          colors: parts,
        };
      } else {
        const step = 100 / parts.length;
        const stops = parts.map((col, idx) => `${col} ${(idx * step).toFixed(1)}% ${((idx + 1) * step).toFixed(1)}%`).join(', ');
        return {
          style: { background: `linear-gradient(135deg, ${stops})` },
          isMultiColor: true,
          colors: parts,
        };
      }
    }
  }

  // 3. Inspect nameAr / nameEn for color keywords (e.g. "أبيض", "اسود", "أبيض واسود", "ذهبي")
  const textToScan = `${cleanAr} ${cleanEn}`.toLowerCase();

  // Normalize text to separate conjoined words like "واسود", "وأسود", "وذهبي", "وابيض", "وأبيض"
  const normalizedText = textToScan
    .replace(/وا/g, ' و ا')
    .replace(/وأ/g, ' و أ')
    .replace(/&/g, ' و ')
    .replace(/\+/g, ' و ')
    .replace(/\//g, ' و ');

  const words = normalizedText.split(/[\s,]+/);
  const foundHexes: string[] = [];

  for (const word of words) {
    const cleanWord = word.trim();
    if (!cleanWord || cleanWord === 'و' || cleanWord === 'and' || cleanWord === 'مع') continue;

    // Check direct match in dictionary
    if (COLOR_DICTIONARY[cleanWord]) {
      const matchedHex = COLOR_DICTIONARY[cleanWord];
      if (!foundHexes.includes(matchedHex)) {
        foundHexes.push(matchedHex);
      }
    } else {
      // Substring check
      for (const [key, val] of Object.entries(COLOR_DICTIONARY)) {
        if (cleanWord.includes(key) && !foundHexes.includes(val)) {
          foundHexes.push(val);
          break;
        }
      }
    }
  }

  // Multi-color composite found in text (e.g., "أبيض واسود")
  if (foundHexes.length >= 2) {
    if (foundHexes.length === 2) {
      return {
        style: { background: `linear-gradient(135deg, ${foundHexes[0]} 50%, ${foundHexes[1]} 50%)` },
        isMultiColor: true,
        colors: foundHexes,
      };
    } else {
      const step = 100 / foundHexes.length;
      const stops = foundHexes.map((col, idx) => `${col} ${(idx * step).toFixed(1)}% ${((idx + 1) * step).toFixed(1)}%`).join(', ');
      return {
        style: { background: `linear-gradient(135deg, ${stops})` },
        isMultiColor: true,
        colors: foundHexes,
      };
    }
  }

  // Single color matched from name (e.g. "أبيض" -> #ffffff)
  if (foundHexes.length === 1) {
    return {
      style: { backgroundColor: foundHexes[0] },
      isMultiColor: false,
      colors: [foundHexes[0]],
    };
  }

  // Fallback to cleanHex if present and valid, otherwise default to black
  const singleHex = cleanHex && cleanHex.startsWith('#') ? cleanHex : '#000000';
  return {
    style: { backgroundColor: singleHex },
    isMultiColor: false,
    colors: [singleHex],
  };
}

export function parseColorName(inputName: string): { nameAr: string; nameEn: string; hex: string } {
  const name = inputName.trim();
  if (!name) {
    return { nameAr: 'أسود', nameEn: 'Black', hex: '#000000' };
  }

  const swatchRes = getSwatchStyle('', name, name);

  let hexResult = '#000000';
  if (swatchRes.colors && swatchRes.colors.length > 0) {
    hexResult = swatchRes.colors.join(',');
  }

  return {
    nameAr: name,
    nameEn: name,
    hex: hexResult,
  };
}


