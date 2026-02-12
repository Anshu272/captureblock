import React from 'react';

function Header({ isConnected, userColor, userName, onNameChange, connectedUsers }) {
    return (
        <header className="sticky top-0 z-50 bg-bg-glass backdrop-blur-xl border-b border-white/10 shadow-sm px-4 lg:px-8 py-4 w-full">
            <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-accent-gradient drop-shadow-gold">
                        BlockCapture
                    </h1>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-text-secondary">
                        <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${isConnected ? 'bg-accent-primary text-accent-primary animate-pulse' : 'bg-status-danger text-status-danger'}`}></span>
                        <span>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    {userColor && (
                        <div className="flex items-center gap-2 p-1 pl-1.5 pr-3 bg-bg-input border border-white/10 rounded-full transition-all hover:bg-white/10">
                            <div
                                className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg transition-transform duration-300 hover:scale-110"
                                style={{ backgroundColor: userColor }}
                                title="Your color"
                            ></div>
                            <span className="text-text-primary px-2 py-1 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                {userName || 'Anonymous'}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-text-secondary whitespace-nowrap">
                        <span>👥 {connectedUsers}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
