```tsx
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, theme } from 'antd';

import { Sparkline } from '@/components/viz';
import type { Status } from '@/models/status';

interface ConnectionsCardProps {
  status: Status;
  tcp: number[];
  udp: number[];
  labels: string[];
  isMobile: boolean;
}

export default function ConnectionsCard({
  status,
  tcp,
  udp,
  labels,
  isMobile,
}: ConnectionsCardProps) {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const accent = token.colorPrimary;
  const udpColor = token.colorTextTertiary;

  const referenceLines = useMemo(
    () => [
      {
        y: status.udpCount,
        color: udpColor,
        dash: '2 4',
      },
      {
        y: status.tcpCount,
        color: accent,
        dash: '2 4',
      },
    ],
    [
      status.tcpCount,
      status.udpCount,
      accent,
      udpColor,
    ],
  );

  const totalConnections =
    status.tcpCount + status.udpCount;

  return (
    <Card
      hoverable
      styles={{
        body: {
          padding: 0,
        },
      }}
      className="connections-glass-card"
    >
      {/* Glass highlight */}
      <div className="connections-glass-highlight" />

      {/* Header */}
      <div className="connections-card-header">
        <div className="connections-card-title">
          <span className="connections-card-icon">
            <span
              className="connections-live-dot"
              style={{
                background: accent,
                boxShadow: `0 0 12px ${accent}`,
              }}
            />
          </span>

          <div>
            <div className="connections-card-label">
              {t('pages.index.connectionCount')}
            </div>

            <div className="connections-card-value">
              {totalConnections.toLocaleString()}
            </div>

            <div className="connections-card-subtitle">
              {t('pages.index.openSockets')}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="ov-conn-legend">
        <div className="ov-legend-label">
          <span
            className="ov-swatch"
            style={{
              background: accent,
              boxShadow: `0 0 8px ${accent}`,
            }}
          />

          <span>TCP</span>

          <span className="ov-legend-num">
            {status.tcpCount.toLocaleString()}
          </span>
        </div>

        <div className="ov-legend-label">
          <span
            className="ov-swatch"
            style={{
              background: udpColor,
            }}
          />

          <span>UDP</span>

          <span className="ov-legend-num">
            {status.udpCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="ov-wide-chart connections-chart-glass">
        <Sparkline
          data={tcp}
          data2={udp}
          labels={labels}
          height={isMobile ? 120 : 170}
          strokeWidth={1.5}
          fillOpacity={0.24}
          showTooltip
          showLegend={false}
          valueMax={null}
          stroke={accent}
          stroke2={udpColor}
          name1="TCP"
          name2="UDP"
          yFormatter={(v) =>
            Math.round(v).toLocaleString()
          }
          referenceLines={referenceLines}
        />
      </div>
    </Card>
  );
}
```

و این CSS را به فایل استایل اصلی کارت‌ها اضافه کن:

```css
/* =========================================================
   CONNECTIONS CARD — iOS 26 LIQUID GLASS
   ========================================================= */

.connections-glass-card {
  position: relative;
  overflow: hidden;

  border-radius: 24px !important;

  border:
    1px solid rgba(255, 255, 255, 0.28) !important;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.30),
      rgba(255, 255, 255, 0.11)
    ) !important;

  -webkit-backdrop-filter:
    blur(28px) saturate(175%) contrast(105%);
  backdrop-filter:
    blur(28px) saturate(175%) contrast(105%);

  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.35) inset,
    0 0 0 1px rgba(255, 255, 255, 0.06) inset,
    0 12px 40px rgba(31, 41, 90, 0.08);

  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

/* Liquid glass reflection */
.connections-glass-card::before {
  content: '';
  position: absolute;
  inset: 0;

  pointer-events: none;
  z-index: 0;

  background:
    linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.25),
      transparent 28%,
      transparent 68%,
      rgba(255, 255, 255, 0.07)
    );

  opacity: 0.8;
}

/* Soft colored glow */
.connections-glass-card::after {
  content: '';
  position: absolute;

  width: 180px;
  height: 180px;

  top: -90px;
  right: -60px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(45, 212, 191, 0.13),
      transparent 70%
    );

  filter: blur(18px);

  pointer-events: none;
}

/* Hover */
.connections-glass-card:hover {
  transform: translateY(-2px);

  border-color:
    rgba(255, 255, 255, 0.40) !important;

  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.42) inset,
    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
    0 18px 50px rgba(31, 41, 90, 0.13);
}

/* =========================================================
   HEADER
   ========================================================= */

.connections-card-header {
  position: relative;
  z-index: 2;

  padding: 20px 22px 10px;
}

.connections-card-title {
  display: flex;
  align-items: center;
  gap: 13px;
}

.connections-card-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background:
    rgba(255, 255, 255, 0.18);

  border:
    1px solid rgba(255, 255, 255, 0.25);

  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.25) inset,
    0 5px 15px rgba(31, 41, 90, 0.07);

  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.connections-live-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;
}

.connections-card-label {
  color: var(--ant-color-text-secondary);

  font-size: 13px;
  font-weight: 500;
}

.connections-card-value {
  margin-top: 2px;

  font-size: 28px;
  line-height: 1.15;

  font-weight: 700;
  letter-spacing: -0.03em;

  color: var(--ant-color-text);
}

.connections-card-subtitle {
  margin-top: 2px;

  font-size: 11px;

  color: var(--ant-color-text-tertiary);
}

/* =========================================================
   LEGEND — GLASS PILLS
   ========================================================= */

.ov-conn-legend {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 22px 12px;
}

.ov-legend-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 5px 9px;

  border-radius: 999px;

  border:
    1px solid rgba(255, 255, 255, 0.20);

  background:
    rgba(255, 255, 255, 0.09);

  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);

  font-size: 11px;
  font-weight: 500;

  color: var(--ant-color-text-secondary);

  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.15) inset;
}

.ov-swatch {
  width: 7px;
  height: 7px;

  border-radius: 50%;
}

.ov-legend-num {
  margin-left: 2px;

  color: var(--ant-color-text);

  font-weight: 650;
}

/* =========================================================
   CHART GLASS AREA
   ========================================================= */

.connections-chart-glass {
  position: relative;
  z-index: 1;

  margin: 0 10px 10px;

  padding: 8px 8px 4px;

  border-radius: 18px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.045)
    );

  border:
    1px solid rgba(255, 255, 255, 0.12);

  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.15) inset;

  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

/* =========================================================
   DARK MODE
   ========================================================= */

body.dark .connections-glass-card {
  background:
    linear-gradient(
      145deg,
      rgba(30, 40, 72, 0.68),
      rgba(9, 16, 36, 0.52)
    ) !important;

  border-color:
    rgba(255, 255, 255, 0.12) !important;

  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.10) inset,
    0 0 0 1px rgba(255, 255, 255, 0.025) inset,
    0 15px 45px rgba(0, 0, 0, 0.20);
}

body.dark .connections-glass-card::before {
  background:
    linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.09),
      transparent 30%,
      rgba(120, 150, 255, 0.025)
    );
}

body.dark .connections-glass-card:hover {
  border-color:
    rgba(255, 255, 255, 0.19) !important;

  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.14) inset,
    0 20px 55px rgba(0, 0, 0, 0.27);
}

body.dark .connections-chart-glass,
body.dark .ov-legend-label,
body.dark .connections-card-icon {
  background:
    rgba(255, 255, 255, 0.055);

  border-color:
    rgba(255, 255, 255, 0.09);
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 768px) {
  .connections-glass-card {
    border-radius: 20px !important;
  }

  .connections-card-header {
    padding: 16px 16px 8px;
  }

  .connections-card-value {
    font-size: 24px;
  }

  .ov-conn-legend {
    padding-left: 16px;
    padding-right: 16px;
  }

  .connections-chart-glass {
    margin-left: 7px;
    margin-right: 7px;
  }
}

/* =========================================================
   REDUCED MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  .connections-glass-card {
    transition: none;
  }
}
```
