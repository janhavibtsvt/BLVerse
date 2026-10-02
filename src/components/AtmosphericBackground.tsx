import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AtmosphericBackground: React.FC = () => {
  const { theme } = useTheme();
  const { colors, backgroundPattern, glowIntensity, isLight } = theme;

  if (glowIntensity === 'none' && backgroundPattern === 'minimal') {
    return null;
  }

  const opacityMultiplier = glowIntensity === 'none' ? 0 : glowIntensity === 'subtle' ? 0.5 : glowIntensity === 'intense' ? 1.3 : glowIntensity === 'ultra' ? 1.7 : 1.0;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-700 ease-out select-none">
      {/* Pattern 1: Atmospheric Nebula Glows */}
      {backgroundPattern === 'nebula' && (
        <div style={{ opacity: opacityMultiplier }}>
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[650px] rounded-full filter blur-3xl transition-colors duration-700"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow1}, transparent 70%)`
            }}
          />
          <div
            className="absolute top-1/3 -right-32 w-[650px] h-[650px] rounded-full filter blur-3xl transition-colors duration-700"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow2}, transparent 70%)`
            }}
          />
          <div
            className="absolute bottom-10 -left-32 w-[700px] h-[700px] rounded-full filter blur-3xl transition-colors duration-700"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.accentPrimary}22, transparent 70%)`
            }}
          />
        </div>
      )}

      {/* Pattern 2: Stars Cosmos */}
      {backgroundPattern === 'stars' && (
        <div style={{ opacity: opacityMultiplier }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(1px 1px at 20px 30px, ${colors.textPrimary} 50%, transparent 100%),
                                radial-gradient(1.5px 1.5px at 100px 150px, ${colors.accentSecondary} 50%, transparent 100%),
                                radial-gradient(1px 1px at 240px 80px, ${colors.accentTertiary} 50%, transparent 100%),
                                radial-gradient(2px 2px at 320px 280px, ${colors.textPrimary} 60%, transparent 100%),
                                radial-gradient(1.5px 1.5px at 450px 120px, ${colors.accentPrimary} 50%, transparent 100%),
                                radial-gradient(1px 1px at 600px 350px, ${colors.textPrimary} 50%, transparent 100%),
                                radial-gradient(2px 2px at 780px 190px, ${colors.accentSecondary} 50%, transparent 100%),
                                radial-gradient(1px 1px at 900px 420px, ${colors.accentTertiary} 50%, transparent 100%)`,
              backgroundSize: '800px 500px'
            }}
          />
          {/* Subtle cosmic center haze */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] filter blur-3xl"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow1}, transparent 75%)`
            }}
          />
        </div>
      )}

      {/* Pattern 3: Sakura Blossom Drift */}
      {backgroundPattern === 'sakura' && (
        <div style={{ opacity: opacityMultiplier }}>
          {/* Soft blushing pink atmospheric halo */}
          <div
            className="absolute -top-20 right-1/4 w-[800px] h-[550px] filter blur-3xl"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow1}, transparent 70%)`
            }}
          />
          <div
            className="absolute bottom-20 left-10 w-[600px] h-[600px] filter blur-3xl"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow2}, transparent 70%)`
            }}
          />
          {/* Subtle floating petal shapes */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(ellipse 4px 8px at 50px 100px, ${colors.accentSecondary} 40%, transparent 80%),
                                radial-gradient(ellipse 5px 10px at 180px 240px, ${colors.accentPrimary} 40%, transparent 80%),
                                radial-gradient(ellipse 4px 7px at 350px 90px, ${colors.accentTertiary} 40%, transparent 80%),
                                radial-gradient(ellipse 6px 11px at 520px 380px, ${colors.accentSecondary} 40%, transparent 80%),
                                radial-gradient(ellipse 4px 8px at 700px 160px, ${colors.accentPrimary} 40%, transparent 80%),
                                radial-gradient(ellipse 5px 9px at 850px 440px, ${colors.accentTertiary} 40%, transparent 80%)`,
              backgroundSize: '900px 600px'
            }}
          />
        </div>
      )}

      {/* Pattern 4: Cyber Matrix Grid */}
      {backgroundPattern === 'grid' && (
        <div style={{ opacity: opacityMultiplier }}>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.borderColor} 1px, transparent 1px),
                                linear-gradient(to bottom, ${colors.borderColor} 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          <div
            className="absolute -top-32 left-1/3 w-[800px] h-[450px] filter blur-3xl"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow1}, transparent 70%)`
            }}
          />
          <div
            className="absolute bottom-0 inset-x-0 h-48 opacity-40"
            style={{
              background: `linear-gradient(to top, ${colors.glow1}, transparent)`
            }}
          />
        </div>
      )}

      {/* Pattern 5: Aurora Waves */}
      {backgroundPattern === 'aurora' && (
        <div style={{ opacity: opacityMultiplier }}>
          <div
            className="absolute -top-40 inset-x-0 h-[500px] filter blur-3xl transition-colors duration-700"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${colors.accentPrimary}33 0%, transparent 60%),
                           radial-gradient(circle at 70% 20%, ${colors.accentSecondary}33 0%, transparent 60%),
                           radial-gradient(circle at 50% 80%, ${colors.accentTertiary}22 0%, transparent 70%)`
            }}
          />
          <div
            className="absolute bottom-10 right-10 w-[600px] h-[600px] filter blur-3xl"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow2}, transparent 70%)`
            }}
          />
        </div>
      )}

      {/* Pattern 6: Minimal Clean */}
      {backgroundPattern === 'minimal' && (
        <div style={{ opacity: opacityMultiplier * 0.4 }}>
          {/* Only very faint single subtle center ambient glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] filter blur-3xl"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow1}, transparent 70%)`
            }}
          />
        </div>
      )}

      {/* Light Mode Vignette overlay */}
      {isLight && (
        <div className="absolute inset-0 bg-white/20 backdrop-contrast-105 pointer-events-none" />
      )}
    </div>
  );
};
