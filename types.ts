
export interface LogMessage {
  id: string;
  sender: 'user' | 'jarvis' | 'system';
  text: string;
  timestamp: Date;
  sources?: { title: string; url: string }[];
}

export interface SystemStatus {
  cpu: number;
  memory: number;
  network: number;
  activeModules: string[];
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

export interface AudioVisualizerData {
  buffer: Uint8Array;
}
