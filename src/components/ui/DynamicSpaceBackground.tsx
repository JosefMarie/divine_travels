"use client";

import React, { useEffect, useRef } from 'react';

/**
 * DynamicSpaceBackground Component
 * Renders a GPU-accelerated canvas of abstract vectors, points, and geometric shapes
 * that slowly drift and connect, using the theme's color palette.
 */
export const DynamicSpaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;
    const themeColors = {
      primary: '#1B4D3E',
      tertiary: '#B3305B',
      accent: '#D2C5AC',
    };

    const updateThemeColors = () => {
      const style = getComputedStyle(document.documentElement);
      const p = style.getPropertyValue('--primary').trim();
      const t = style.getPropertyValue('--tertiary').trim();
      const a = style.getPropertyValue('--secondary').trim();
      
      if (p) themeColors.primary = p;
      if (t) themeColors.tertiary = t;
      if (a) themeColors.accent = a;
    };

    let particles: Particle[] = [];

    // Highly simplified continental boundaries for a "Technical Radar" aesthetic
    const LAND_POLYGONS = [
      // North America
      [[-168, 72], [-105, 72], [-52, 50], [-52, 15], [-100, 15], [-168, 60]],
      // South America
      [[-81, 12], [-34, 12], [-34, -56], [-81, -56]],
      // Africa
      [[-17, 37], [35, 37], [51, 12], [51, -35], [-17, -35], [-17, 12]],
      // Europe
      [[-10, 71], [40, 71], [40, 36], [-10, 36]],
      // Asia
      [[40, 77], [180, 77], [180, 1], [40, 1]],
      // Australia
      [[113, -10], [154, -10], [154, -44], [113, -44]],
      // Antarctica
      [[-180, -60], [180, -60], [180, -90], [-180, -90]]
    ];

    const isLand = (lon: number, lat: number) => {
      for (const poly of LAND_POLYGONS) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
          const xi = poly[i][0], yi = poly[i][1];
          const xj = poly[j][0], yj = poly[j][1];
          const intersect = ((yi > lat) !== (yj > lat)) && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        if (inside) return true;
      }
      return false;
    };

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      isGeographic: boolean;

      constructor(isGeographic = false) {
        this.isGeographic = isGeographic;
        if (isGeographic) {
          // Find a point on land
          let lon = 0, lat = 0;
          let found = false;
          let attempts = 0;
          while (!found && attempts < 100) {
            lon = Math.random() * 360 - 180;
            lat = Math.random() * 180 - 90;
            if (isLand(lon, lat)) found = true;
            attempts++;
          }
          // Map to screen
          this.baseX = ((lon + 180) / 360) * width;
          this.baseY = ((90 - lat) / 180) * height;
          this.x = this.baseX;
          this.y = this.baseY;
          this.size = Math.random() * 1 + 0.8;
          this.alpha = Math.random() * 0.15 + 0.1;
        } else {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.baseX = this.x;
          this.baseY = this.y;
          this.size = Math.random() * 0.6 + 0.3;
          this.alpha = Math.random() * 0.08 + 0.02;
        }
        
        this.vx = (Math.random() - 0.5) * 0.1;
        this.vy = (Math.random() - 0.5) * 0.1;
        this.color = Math.random() > 0.8 ? themeColors.tertiary : themeColors.primary;
      }

      update() {
        // Drift slightly from base position
        this.x = this.baseX + Math.sin(Date.now() * 0.001 + this.baseX) * 10;
        this.y = this.baseY + Math.cos(Date.now() * 0.001 + this.baseY) * 10;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      updateThemeColors();
      
      particles = [];
      const geographicCount = Math.floor((width * height) / 4000);
      const ambientCount = Math.floor((width * height) / 20000);
      
      for (let i = 0; i < geographicCount; i++) {
        particles.push(new Particle(true));
      }
      for (let i = 0; i < ambientCount; i++) {
        particles.push(new Particle(false));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        
        // Connect nearby geographic nodes for constellation effect
        if (p.isGeographic) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (!p2.isGeographic) continue;

            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 30) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - dist / 30) * 0.08;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="space-vector-bg"
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};
