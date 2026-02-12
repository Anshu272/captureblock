import React from 'react';

function Sidebar({ myColor, myBlocksCount, stats, connectedUsers }) {
    return (
        <aside className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0">
            <div className="bg-bg-glass backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col gap-4">
                <h2 className="text-xl font-bold text-text-primary tracking-wide border-b border-white/5 pb-2 flex items-center gap-2 bg-clip-text text-transparent bg-accent-gradient drop-shadow-gold">
                    Your Stats
                </h2>
                <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary text-sm font-medium">Your Color</span>
                    <div
                        className="w-8 h-8 rounded-full border-2 border-white/20 shadow-gold transition-transform hover:scale-110"
                        style={{ backgroundColor: myColor }}
                    ></div>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/5 pt-2 mt-1">
                    <span className="text-text-secondary text-sm font-medium">Blocks Claimed</span>
                    <span className="text-xl font-bold text-accent-primary drop-shadow-gold">{myBlocksCount}</span>
                </div>
            </div>

            <div className="bg-bg-glass backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col gap-4">
                <h2 className="text-xl font-bold text-text-primary tracking-wide border-b border-white/5 pb-2 flex items-center gap-2 bg-clip-text text-transparent bg-accent-gradient drop-shadow-gold">
                    Global Stats
                </h2>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-text-secondary text-sm font-medium">Total Blocks</span>
                    <span className="text-lg font-bold text-white">{stats.totalBlocksClaimed} <span className="text-text-muted text-sm font-normal">/ 800</span></span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-text-secondary text-sm font-medium">Players Online</span>
                    <span className="text-lg font-bold text-accent-primary drop-shadow-gold">{connectedUsers}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary text-sm font-medium">Total Players</span>
                    <span className="text-lg font-bold text-white">{stats.totalUsers}</span>
                </div>
            </div>

            <div className="bg-bg-glass backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col gap-4 flex-1 min-h-[300px]">
                <h2 className="text-xl font-bold text-text-primary tracking-wide border-b border-white/5 pb-2 flex items-center gap-2 bg-clip-text text-transparent bg-accent-gradient drop-shadow-gold">
                    🏆 Leaderboard
                </h2>
                <div className="flex flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin max-h-[400px]">
                    {stats.leaderboard.length > 0 ? (
                        stats.leaderboard.map((player, index) => (
                            <div key={player.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-transparent hover:bg-white/10 hover:border-white/10 transition-all hover:translate-x-1">
                                <span className={`font-extrabold text-lg w-6 text-center ${index === 0 ? 'text-[#ffd700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]' :
                                    index === 1 ? 'text-[#c0c0c0] drop-shadow-[0_0_10px_rgba(192,192,192,0.5)]' :
                                        index === 2 ? 'text-[#cd7f32] drop-shadow-[0_0_10px_rgba(205,127,50,0.5)]' :
                                            'text-text-muted'
                                    }`}>
                                    #{index + 1}
                                </span>
                                <div
                                    className="w-7 h-7 rounded-md shadow-sm shrink-0 border border-white/10"
                                    style={{ backgroundColor: player.color }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-text-primary truncate">
                                        {player.name || 'Anonymous'}
                                    </div>
                                </div>
                                <span className="font-bold text-accent-primary">
                                    {player.blocks_claimed}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-text-muted p-4 italic">
                            No players yet. Be the first!
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
