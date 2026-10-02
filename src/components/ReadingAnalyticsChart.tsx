import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { BookOpen, Layers, TrendingUp, Sparkles, Award } from 'lucide-react';
import { ReadingListEntry } from '../types';
import { getComicById, getNovelById } from '../data';

interface ReadingAnalyticsChartProps {
  readingList: ReadingListEntry[];
  className?: string;
}

type MetricMode = 'all' | 'chapters' | 'volumes';

const CATEGORY_META: Record<string, { label: string; color: string; hoverColor: string; description: string }> = {
  manga: {
    label: 'Manga',
    color: '#F09BC5',
    hoverColor: '#F472B6',
    description: 'Japanese Manga'
  },
  manhwa: {
    label: 'Manhwa',
    color: '#9F7AEA',
    hoverColor: '#A855F7',
    description: 'Korean Webtoons'
  },
  manhua: {
    label: 'Manhua',
    color: '#38BDF8',
    hoverColor: '#0EA5E9',
    description: 'Chinese Manhua'
  },
  novel: {
    label: 'Novels',
    color: '#FBBF24',
    hoverColor: '#F59E0B',
    description: 'Web & Light Novels'
  }
};

export const ReadingAnalyticsChart: React.FC<ReadingAnalyticsChartProps> = ({
  readingList,
  className = ''
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('all');

  // Compute category statistics from readingList
  const categoryStats = useMemo(() => {
    const categories: Record<string, {
      category: string;
      label: string;
      chapters: number;
      volumes: number;
      titlesCount: number;
      completedCount: number;
      color: string;
    }> = {
      manga: { category: 'manga', label: 'Manga', chapters: 0, volumes: 0, titlesCount: 0, completedCount: 0, color: CATEGORY_META.manga.color },
      manhwa: { category: 'manhwa', label: 'Manhwa', chapters: 0, volumes: 0, titlesCount: 0, completedCount: 0, color: CATEGORY_META.manhwa.color },
      manhua: { category: 'manhua', label: 'Manhua', chapters: 0, volumes: 0, titlesCount: 0, completedCount: 0, color: CATEGORY_META.manhua.color },
      novel: { category: 'novel', label: 'Novels', chapters: 0, volumes: 0, titlesCount: 0, completedCount: 0, color: CATEGORY_META.novel.color }
    };

    readingList.forEach((entry) => {
      // Determine work category
      let category = entry.type;
      if (!category) {
        const comic = getComicById(entry.workId);
        if (comic) {
          category = comic.type;
        } else {
          const novel = getNovelById(entry.workId);
          if (novel) category = 'novel';
        }
      }

      if (category && categories[category]) {
        categories[category].titlesCount += 1;
        categories[category].chapters += entry.progressChapters || 0;
        categories[category].volumes += entry.progressVolumes || 0;
        if (entry.status === 'Completed') {
          categories[category].completedCount += 1;
        }
      }
    });

    return Object.values(categories);
  }, [readingList]);

  // Totals
  const totalChapters = useMemo(() => {
    return categoryStats.reduce((sum, item) => sum + item.chapters, 0);
  }, [categoryStats]);

  const totalVolumes = useMemo(() => {
    return categoryStats.reduce((sum, item) => sum + item.volumes, 0);
  }, [categoryStats]);

  const mostReadCategory = useMemo(() => {
    if (categoryStats.every(c => c.chapters === 0 && c.volumes === 0)) return null;
    return [...categoryStats].sort((a, b) => b.chapters - a.chapters)[0];
  }, [categoryStats]);

  // Format data for Recharts
  const chartData = useMemo(() => {
    return categoryStats.map((item) => ({
      name: item.label,
      category: item.category,
      chapters: item.chapters,
      volumes: item.volumes,
      titles: item.titlesCount,
      completed: item.completedCount,
      fill: item.color
    }));
  }, [categoryStats]);

  // Custom Dark Glassmorphism Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#160D20]/95 border border-[#F09BC5]/40 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl text-xs space-y-2 min-w-[180px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#241238]">
            <span className="font-bold text-[#F8F5FC] text-sm flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: data.fill }}
              />
              {data.name}
            </span>
            <span className="text-[10px] text-[#B8AFC4] uppercase font-semibold">
              {data.titles} title{data.titles === 1 ? '' : 's'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[#F09BC5]">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Chapters Read:</span>
              </span>
              <strong className="font-mono text-sm">{data.chapters}</strong>
            </div>

            <div className="flex justify-between items-center text-[#B794F4]">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Volumes Read:</span>
              </span>
              <strong className="font-mono text-sm">{data.volumes}</strong>
            </div>

            {data.completed > 0 && (
              <div className="flex justify-between items-center text-emerald-300 pt-1 border-t border-[#241238]">
                <span>Completed Works:</span>
                <strong className="font-mono">{data.completed}</strong>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-[#160D20] border border-[#241238] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-72 h-44 bg-gradient-to-r from-[#9F7AEA]/10 via-[#F09BC5]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#241238] relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9F7AEA] to-[#F09BC5] flex items-center justify-center text-white shadow-md shadow-[rgba(240,155,197,0.3)]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#F8F5FC] font-display flex items-center gap-1.5">
              <span>Reading Analytics</span>
              <span className="text-[#F09BC5] text-xs">✦ Recharts</span>
            </h3>
          </div>
          <p className="text-xs text-[#B8AFC4]">
            Visual breakdown of chapters & volumes completed across comic & novel categories
          </p>
        </div>

        {/* View mode toggle pills */}
        <div className="flex items-center gap-1 p-1 bg-[#1B1126] border border-[#241238] rounded-2xl self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setMetricMode('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              metricMode === 'all'
                ? 'bg-gradient-to-r from-[#9F7AEA] to-[#F09BC5] text-white shadow-md'
                : 'text-[#B8AFC4] hover:text-[#F8F5FC]'
            }`}
          >
            All Metrics
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('chapters')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
              metricMode === 'chapters'
                ? 'bg-gradient-to-r from-[#DB2777] to-[#F09BC5] text-white shadow-md'
                : 'text-[#B8AFC4] hover:text-[#F09BC5]'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Chapters</span>
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('volumes')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
              metricMode === 'volumes'
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#9F7AEA] text-white shadow-md'
                : 'text-[#B8AFC4] hover:text-[#B794F4]'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Volumes</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#1B1126] border border-[#241238]">
          <span className="text-[10px] text-[#B8AFC4] uppercase tracking-wider block font-semibold">
            Total Chapters Read
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-[#F09BC5] font-mono">
              {totalChapters}
            </span>
            <span className="text-[11px] text-[#B8AFC4]">ch.</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1B1126] border border-[#241238]">
          <span className="text-[10px] text-[#B8AFC4] uppercase tracking-wider block font-semibold">
            Total Volumes Read
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-[#B794F4] font-mono">
              {totalVolumes}
            </span>
            <span className="text-[11px] text-[#B8AFC4]">vols.</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1B1126] border border-[#241238]">
          <span className="text-[10px] text-[#B8AFC4] uppercase tracking-wider block font-semibold">
            Top Category
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base sm:text-lg font-bold text-[#F8F5FC] truncate">
              {mostReadCategory ? mostReadCategory.label : 'None yet'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1B1126] border border-[#241238]">
          <span className="text-[10px] text-[#B8AFC4] uppercase tracking-wider block font-semibold">
            Tracked Titles
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-[#F8F5FC] font-mono">
              {readingList.length}
            </span>
            <span className="text-[11px] text-emerald-400">works</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="pt-2">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 15, left: -10, bottom: 5 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#241238" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#B8AFC4"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#241238' }}
              />
              <YAxis
                stroke="#B8AFC4"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#241238' }}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(159, 122, 234, 0.08)' }}
              />

              {metricMode === 'all' && (
                <>
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                    formatter={(value) => (
                      <span className="text-xs font-semibold text-[#B8AFC4] capitalize">
                        {value === 'chapters' ? 'Chapters Read' : 'Volumes Read'}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="chapters"
                    name="chapters"
                    fill="#F09BC5"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                  <Bar
                    dataKey="volumes"
                    name="volumes"
                    fill="#9F7AEA"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </>
              )}

              {metricMode === 'chapters' && (
                <Bar
                  dataKey="chapters"
                  name="Chapters Read"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-ch-${index}`}
                      fill={CATEGORY_META[entry.category]?.color || '#F09BC5'}
                    />
                  ))}
                </Bar>
              )}

              {metricMode === 'volumes' && (
                <Bar
                  dataKey="volumes"
                  name="Volumes Read"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-vol-${index}`}
                      fill={CATEGORY_META[entry.category]?.color || '#9F7AEA'}
                    />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pills Footer Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#241238] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {categoryStats.map((cat) => (
            <div
              key={cat.category}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1B1126] border border-[#241238]"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-bold text-[#F8F5FC]">{cat.label}:</span>
              <span className="text-[#B8AFC4]">
                {cat.chapters} ch{cat.volumes > 0 ? ` • ${cat.volumes} vol` : ''}
              </span>
            </div>
          ))}
        </div>

        <span className="text-[11px] text-[#B8AFC4]/80 italic">
          Updates instantly as you track your reading progress ✦
        </span>
      </div>
    </div>
  );
};
