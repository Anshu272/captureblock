import React from 'react';

function Block({ x, y, block, isMine, onClick }) {
    let classes = "aspect-square cursor-pointer relative transition-all duration-200 ease-out border border-white/5 hover:z-10 hover:scale-125 hover:shadow-gold hover:border-accent-primary/50 group";

    const style = {};

    if (block) {
        classes += " shadow-inner animate-claim border-none";
        style.backgroundColor = block.owner_color;
        if (isMine) {
            classes += " shadow-[0_0_8px_rgba(255,255,255,0.4)]";
        }
    } else {
        classes += " bg-white/[0.02] hover:bg-accent-primary/10";
    }

    const title = block
        ? `Owned by ${block.owner_name || 'Anonymous'}`
        : 'Click to claim';

    return (
        <div
            className={classes}
            style={style}
            onClick={onClick}
            title={title}
        >
            {!block && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-accent-primary/5 transition-opacity pointer-events-none" />
            )}
        </div>
    );
}

export default Block;
