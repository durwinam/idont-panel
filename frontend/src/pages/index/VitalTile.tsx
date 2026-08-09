```tsx
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Card, theme } from 'antd';

import { Sparkline } from '@/components/viz';
import { mean, peak } from './useOverviewHistory';

interface VitalTileProps {
  icon: ReactNode;
  label: string;
  percent: number;
  statusColor: string;
  detail: string;
  footLeft: string;
  footRight: string;
  data: number[];
  isMobile: boolean;
}

export default function VitalTile({
  icon,
  label,
  percent,
  statusColor,
  detail,
  footLeft,
  footRight,
  data,
  isMobile,
}: VitalTileProps) {
  const { token } = theme.useToken();

  const meanColor = token.colorTextTertiary;

  const referenceLines = useMemo(
    () =>
      data.length > 1
        ? [
            {
              y: mean(data),
              dash: '3 4',
              color: meanColor,
            },
          ]
        : [],
    [data, meanColor],
  );

  return (
    <Card
      hoverable
      className="ov-tile ov-glass-card"
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div className="ov-tile-inner">
        {/* Header */}
        <div className="ov-tile-header">
          <div className="ov-tile-heading">
            <span
              className="ov-tile-icon"
              style={{
                color: statusColor,
                borderColor: `${statusColor}30`,
                background: `${statusColor}12`,
              }}
            >
              {icon}
            </span>

            <span className="ov-tile-label">{label}</span>
          </div>

          <span
            className="ov-tile-status-dot"
            style={{
              background: statusColor,
              boxShadow: `0 0 10px ${statusColor}66`,
            }}
          />
        </div>

        {/* Main value */}
        <div className="ov-tile-value">
          <span
            className="ov-tile-number"
            style={{
              color: statusColor,
              textShadow: `0 0 18px ${statusColor}22`,
            }}
          >
            {percent.toFixed(1)}
          </span>

          <span className="ov-tile-unit">%</span>
        </div>

        {/* Detail */}
        <div className="ov-tile-detail">{detail}</div>

        {/* Footer statistics */}
        <div className="ov-tile-foot">
          <span>{footLeft}</span>

          <span className="ov-tile-foot-separator" />

          <span>{footRight}</span>
        </div>

        {/* Chart */}
        <div className="ov-tile-chart">
          <Sparkline
            data={data}
            height={isMobile ? 48 : 62}
            strokeWidth={1.5}
            fillOpacity={0.3}
            showGrid={false}
            showMarker={false}
            valueMax={peak(data) > 0 ? null : 100}
            stroke={statusColor}
            referenceLines={referenceLines}
            yFormatter={(v) => `${v.toFixed(0)}%`}
            name1={label}
          />
        </div>
      </div>
    </Card>
  );
}
```

### CSS لازم برای `VitalTile`

این بخش را در `IndexPage.css` یا فایل CSS اصلی داشبورد اضافه کن. اگر کلاس‌های `ov-tile` از قبل وجود دارند، این قسمت را **بعد از CSS فعلی آنها** قرار بده تا override شود.

```css
/* =========================================================
   VITAL TILE — iOS 26 LIQUID GLASS
   ========================================================= */

.ov-tile.ov-glass-card {
  position: relative;
  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.34) !important;
  border-radius: 22px !important;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.46),
      rgba(255, 255, 255, 0.18)
    ) !important;

  -webkit-backdrop-filter:
    blur(26px) saturate(165%);

  backdrop-filter:
    blur(26px) saturate(165%);

  box-shadow:
    0 10px 35px rgba(31, 38, 135, 0.08),
    0 2px 8px rgba(31, 38, 135, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.48),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08);

  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

/* Glass highlight */
.ov-tile.ov-glass-card::before {
  content: '';

  position: absolute;
  inset: 0;

  pointer-events: none;

  background:
    linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.30),
      transparent 35%,
      transparent 70%,
      rgba(255, 255, 255, 0.06)
    );

  opacity: 0.8;
}

/* Subtle glass reflection */
.ov-tile.ov-glass-card::after {
  content: '';

  position: absolute;

  top: -70px;
  right: -80px;

  width: 180px;
  height: 180px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(255, 255, 255, 0.18),
      transparent 68%
    );

  pointer-events: none;
}

/* Hover */
.ov-tile.ov-glass-card:hover {
  transform: translateY(-3px);

  border-color: rgba(255, 255, 255, 0.52) !important;

  box-shadow:
    0 18px 45px rgba(31, 38, 135, 0.12),
    0 5px 15px rgba(31, 38, 135, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.58);
}

/* Inner */
.ov-tile-inner {
  position: relative;
  z-index: 1;

  padding: 17px 18px 13px;
}

/* Header */
.ov-tile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 30px;
}

.ov-tile-heading {
  display: inline-flex;
  align-items: center;
  gap: 9px;

  min-width: 0;
}

.ov-tile-icon {
  display: inline-flex;

  width: 30px;
  height: 30px;

  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  border: 1px solid;
  border-radius: 10px;

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    0 4px 12px rgba(0, 0, 0, 0.04);
}

.ov-tile-icon .anticon {
  font-size: 15px;
}

.ov-tile-label {
  color: var(--ant-color-text);

  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.01em;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ov-tile-status-dot {
  width: 6px;
  height: 6px;

  flex: 0 0 auto;

  border-radius: 50%;

  opacity: 0.9;
}

/* Main number */
.ov-tile-value {
  display: flex;
  align-items: baseline;

  margin-top: 14px;

  line-height: 1;
}

.ov-tile-number {
  font-size: 31px;
  font-weight: 700;

  letter-spacing: -0.045em;

  font-variant-numeric: tabular-nums;
}

.ov-tile-unit {
  margin-left: 3px;

  color: var(--ant-color-text-tertiary);

  font-size: 14px;
  font-weight: 600;
}

/* Detail */
.ov-tile-detail {
  margin-top: 7px;

  color: var(--ant-color-text-secondary);

  font-size: 11px;
  font-weight: 500;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Footer */
.ov-tile-foot {
  display: flex;
  align-items: center;

  margin-top: 13px;

  color: var(--ant-color-text-tertiary);

  font-size: 10px;
  font-weight: 500;

  white-space: nowrap;
}

.ov-tile-foot > span:not(.ov-tile-foot-separator) {
  overflow: hidden;
  text-overflow: ellipsis;
}

.ov-tile-foot-separator {
  width: 3px;
  height: 3px;

  margin: 0 8px;

  flex: 0 0 auto;

  border-radius: 50%;

  background: var(--ant-color-text-quaternary);

  opacity: 0.7;
}

/* Chart */
.ov-tile-chart {
  position: relative;

  margin-top: 5px;
  margin-left: -7px;
  margin-right: -7px;
  margin-bottom: -2px;

  overflow: hidden;

  border-radius: 12px;
}

/* =========================================================
   DARK LIQUID GLASS
   ========================================================= */

body.dark .ov-tile.ov-glass-card {
  border-color: rgba(255, 255, 255, 0.105) !important;

  background:
    linear-gradient(
      145deg,
      rgba(30, 38, 72, 0.68),
      rgba(13, 20, 43, 0.54)
    ) !important;

  -webkit-backdrop-filter:
    blur(28px) saturate(155%);

  backdrop-filter:
    blur(28px) saturate(155%);

  box-shadow:
    0 16px 45px rgba(0, 0, 0, 0.20),
    0 3px 12px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.075),
    inset 0 -1px 0 rgba(255, 255, 255, 0.025);
}

body.dark .ov-tile.ov-glass-card::before {
  background:
    linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.075),
      transparent 38%,
      transparent 70%,
      rgba(129, 140, 248, 0.035)
    );
}

body.dark .ov-tile.ov-glass-card:hover {
  border-color: rgba(255, 255, 255, 0.17) !important;

  box-shadow:
    0 20px 55px rgba(0, 0, 0, 0.28),
    0 5px 18px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.11);
}

/* =========================================================
   ULTRA DARK
   ========================================================= */

html[data-theme='ultra-dark'] body.dark .ov-tile.ov-glass-card {
  background:
    linear-gradient(
      145deg,
      rgba(15, 22, 45, 0.78),
      rgba(7, 12, 27, 0.68)
    ) !important;

  border-color: rgba(255, 255, 255, 0.075) !important;
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 768px) {
  .ov-tile.ov-glass-card {
    border-radius: 19px !important;
  }

  .ov-tile-inner {
    padding: 15px 15px 11px;
  }

  .ov-tile-number {
    font-size: 28px;
  }

  .ov-tile-icon {
    width: 28px;
    height: 28px;

    border-radius: 9px;
  }

  .ov-tile-foot {
    font-size: 9px;
  }
}

/* =========================================================
   REDUCED MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  .ov-tile.ov-glass-card {
    transition: none;
  }

  .ov-tile.ov-glass-card:hover {
    transform: none;
  }
}
```
