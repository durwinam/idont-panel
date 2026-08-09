import { NumberFormatter } from '@/utils';

export const USAGE_WARN_PERCENT = 80;
export const USAGE_CRIT_PERCENT = 90;

export const USAGE_NORMAL_COLOR = '#22d3ee';
export const USAGE_WARN_COLOR = '#f59e0b';
export const USAGE_CRIT_COLOR = '#ef4444';

export class CurTotal {
  current: number;
  total: number;

  constructor(current: number, total: number) {
    this.current = current;
    this.total = total;
  }

  get percent(): number {
    if (this.total === 0) return 0;

    return NumberFormatter.toFixed(
      (this.current / this.total) * 100,
      2,
    );
  }

  get color(): string {
    const p = this.percent;

    if (p < USAGE_WARN_PERCENT) {
      return USAGE_NORMAL_COLOR;
    }

    if (p < USAGE_CRIT_PERCENT) {
      return USAGE_WARN_COLOR;
    }

    return USAGE_CRIT_COLOR;
  }
}

const XRAY_STATE_COLORS: Record<string, string> = {
  running: '#22d3ee',
  stop: '#f59e0b',
  error: '#ef4444',
};

export interface NetIO {
  up: number;
  down: number;
}

export interface NetTraffic {
  sent: number;
  recv: number;
}

export interface PublicIP {
  ipv4: string | number;
  ipv6: string | number;
}

export interface AppStats {
  threads: number;
  mem: number;
  uptime: number;
}

export interface XrayInfo {
  state: 'running' | 'stop' | 'error' | string;
  errorMsg: string;
  version: string;
  color: string;
}

interface StatusInput {
  cpu?: number;
  cpuCores?: number;
  logicalPro?: number;
  cpuSpeedMhz?: number;

  disk?: {
    current?: number;
    total?: number;
  };

  loads?: number[];

  mem?: {
    current?: number;
    total?: number;
  };

  netIO?: NetIO;
  netTraffic?: NetTraffic;
  publicIP?: PublicIP;

  swap?: {
    current?: number;
    total?: number;
  };

  tcpCount?: number;
  udpCount?: number;
  uptime?: number;
  appUptime?: number;

  appStats?: AppStats;

  xray?: Partial<XrayInfo>;
}

export class Status {
  cpu: CurTotal = new CurTotal(0, 0);

  cpuCores = 0;
  logicalPro = 0;
  cpuSpeedMhz = 0;

  disk: CurTotal = new CurTotal(0, 0);

  loads: number[] = [0, 0, 0];

  mem: CurTotal = new CurTotal(0, 0);

  netIO: NetIO = {
    up: 0,
    down: 0,
  };

  netTraffic: NetTraffic = {
    sent: 0,
    recv: 0,
  };

  publicIP: PublicIP = {
    ipv4: 0,
    ipv6: 0,
  };

  swap: CurTotal = new CurTotal(0, 0);

  tcpCount = 0;
  udpCount = 0;

  uptime = 0;
  appUptime = 0;

  appStats: AppStats = {
    threads: 0,
    mem: 0,
    uptime: 0,
  };

  xray: XrayInfo = {
    state: 'stop',
    errorMsg: '',
    version: '',
    color: XRAY_STATE_COLORS.stop,
  };

  constructor(data?: StatusInput | null) {
    if (data == null) return;

    this.cpu = new CurTotal(
      data.cpu ?? 0,
      100,
    );

    this.cpuCores = data.cpuCores ?? 0;
    this.logicalPro = data.logicalPro ?? 0;
    this.cpuSpeedMhz = data.cpuSpeedMhz ?? 0;

    this.disk = new CurTotal(
      data.disk?.current ?? 0,
      data.disk?.total ?? 0,
    );

    this.loads = (
      data.loads ?? [0, 0, 0]
    ).map((value) =>
      NumberFormatter.toFixed(value, 2),
    );

    this.mem = new CurTotal(
      data.mem?.current ?? 0,
      data.mem?.total ?? 0,
    );

    this.netIO = {
      ...this.netIO,
      ...(data.netIO ?? {}),
    };

    this.netTraffic = {
      ...this.netTraffic,
      ...(data.netTraffic ?? {}),
    };

    this.publicIP = {
      ...this.publicIP,
      ...(data.publicIP ?? {}),
    };

    this.swap = new CurTotal(
      data.swap?.current ?? 0,
      data.swap?.total ?? 0,
    );

    this.tcpCount = data.tcpCount ?? 0;
    this.udpCount = data.udpCount ?? 0;

    this.uptime = data.uptime ?? 0;
    this.appUptime = data.appUptime ?? 0;

    this.appStats = {
      ...this.appStats,
      ...(data.appStats ?? {}),
    };

    this.xray = {
      ...this.xray,
      ...(data.xray ?? {}),
    };

    this.xray.color =
      XRAY_STATE_COLORS[this.xray.state] ??
      '#94a3b8';
  }
}
