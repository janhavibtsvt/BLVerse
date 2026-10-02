import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  icon?: LucideIcon;
  badge?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'View All',
  icon: Icon,
  badge
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2.5 border-b border-[#241238] gap-2">
      <div>
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon className="w-5 h-5 text-[#F09BC5]" />
          ) : (
            <span className="text-[#F09BC5] text-sm select-none">✦</span>
          )}
          <h2 className="text-xl sm:text-2xl font-black text-[#F8F5FC] tracking-tight font-display">
            {title}
          </h2>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#241238] to-[#9F7AEA]/30 text-[#F09BC5] border border-[#F09BC5]/40 shadow-sm">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#B8AFC4] mt-1 font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#F09BC5] hover:text-[#F8F5FC] transition-colors group shrink-0"
        >
          <span>{viewAllText}</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#B794F4]" />
        </Link>
      )}
    </div>
  );
};
