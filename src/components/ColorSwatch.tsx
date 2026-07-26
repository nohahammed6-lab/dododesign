import React from 'react';
import { ProductColor } from '../types';
import { getSwatchStyle } from '../utils/colorUtils';
import { Check } from 'lucide-react';

interface ColorSwatchProps {
  color: ProductColor;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showCheck?: boolean;
  showTitle?: boolean;
  lang?: 'ar' | 'en';
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  isSelected = false,
  onClick,
  size = 'md',
  className = '',
  showCheck = false,
  showTitle = true,
  lang = 'ar',
}) => {
  const { style, isMultiColor } = getSwatchStyle(color.hex, color.nameAr, color.nameEn);
  const colorName = lang === 'ar' ? color.nameAr : color.nameEn;

  const bgStr = String(style.backgroundColor || style.background || '').toLowerCase();
  const isLightBg =
    bgStr.includes('#ffffff') ||
    bgStr.includes('rgb(255, 255, 255)') ||
    bgStr.includes('#f5f5f0') ||
    bgStr.includes('#f5f5dc') ||
    bgStr.includes('#c0c0c0') ||
    bgStr.includes('#e8a5b8');

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      title={showTitle ? colorName : undefined}
      className={`relative ${sizeClasses} rounded-full border transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
        isLightBg ? 'border-[#80725b]' : 'border-[#4d4436]'
      } ${
        onClick ? 'cursor-pointer hover:scale-115 hover:border-[#d4af37]' : ''
      } ${
        isSelected
          ? 'ring-2 ring-[#d4af37] ring-offset-2 ring-offset-[#131216] border-[#d4af37] scale-110 shadow-lg shadow-[#d4af37]/30'
          : ''
      } ${className}`}
      style={style}
    >
      {isSelected && showCheck && (
        <Check
          className={`${
            isLightBg ? 'text-zinc-950 font-black' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
          } ${size === 'lg' ? 'w-4 h-4' : size === 'md' ? 'w-3 h-3' : 'w-2.5 h-2.5'}`}
        />
      )}

      {/* Multi-color indicator dot if small */}
      {isMultiColor && !isSelected && size === 'xs' && (
        <span className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-[#d4af37] rounded-full" />
      )}
    </button>
  );
};

