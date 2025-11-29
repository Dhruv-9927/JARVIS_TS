import React, { useEffect, useState } from 'react';
import InfoPanel from './InfoPanel';
import { Activity, Cpu, Wifi } from 'lucide-react';

interface SystemStatsProps {
    isLightMode: boolean;
}

const SystemStats: React.FC<SystemStatsProps> = ({ isLightMode }) => {
    const [stats, setStats] = useState({ cpu: 12, mem: 45, net: 240 });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats({
                cpu: Math.floor(10 + Math.random() * 30),
                mem: Math.floor(40 + Math.random() * 10),
                net: Math.floor(200 + Math.random() * 500)
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const Bar = ({ val }: { val: number }) => (
        <div className="flex items-center gap-2 mb-2">
            <div className={`h-1 flex-1 rounded overflow-hidden ${isLightMode ? 'bg-slate-200' : 'bg-cyan-950'}`}>
                <div 
                    className={`h-full transition-all duration-1000 ${isLightMode ? 'bg-cyan-600' : 'bg-cyan-400'}`} 
                    style={{ width: `${val}%` }}
                ></div>
            </div>
            <span className={`text-xs font-mono w-8 text-right ${isLightMode ? 'text-slate-500' : 'text-cyan-300'}`}>{val}%</span>
        </div>
    );

    const textColor = isLightMode ? 'text-slate-700' : 'text-cyan-300';
    const iconColor = isLightMode ? 'text-cyan-600' : 'text-cyan-400';

    return (
        <InfoPanel title="System Diagnostics" side="left" isLightMode={isLightMode}>
            <div className="space-y-4">
                <div className={`flex items-center justify-between ${textColor}`}>
                    <div className="flex items-center gap-2">
                        <Cpu size={16} className={iconColor} />
                        <span className="text-sm font-bold">CPU CORE</span>
                    </div>
                    <span className="text-xs font-mono">{stats.cpu}.4 GHz</span>
                </div>
                <Bar val={stats.cpu} />

                <div className={`flex items-center justify-between ${textColor}`}>
                    <div className="flex items-center gap-2">
                        <Activity size={16} className={iconColor} />
                        <span className="text-sm font-bold">MEMORY</span>
                    </div>
                    <span className="text-xs font-mono">{stats.mem} TB</span>
                </div>
                <Bar val={stats.mem} />

                <div className={`flex items-center justify-between ${textColor}`}>
                    <div className="flex items-center gap-2">
                        <Wifi size={16} className={iconColor} />
                        <span className="text-sm font-bold">UPLINK</span>
                    </div>
                    <span className="text-xs font-mono">{stats.net} Mbps</span>
                </div>
                <div className={`h-10 flex items-end gap-1 mt-2 border-b pb-1 ${isLightMode ? 'border-slate-200' : 'border-cyan-900/50'}`}>
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-full transition-all duration-300 ${isLightMode ? 'bg-cyan-400/50' : 'bg-cyan-500/50'}`}
                            style={{ height: `${Math.random() * 100}%` }}
                        ></div>
                    ))}
                </div>
            </div>
        </InfoPanel>
    );
};

export default SystemStats;