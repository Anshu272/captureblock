import React from 'react';
import Block from './Block';

const ROWS = 20;
const COLS = 40;

function Grid({ blocks, userId, onBlockClick }) {
    const gridBlocks = [];

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const key = `${x},${y}`;
            const block = blocks[key];

            gridBlocks.push(
                <Block
                    key={key}
                    x={x}
                    y={y}
                    block={block}
                    isMine={block?.owner_id === userId}
                    onClick={() => onBlockClick(x, y)}
                />
            );
        }
    }

    return (
        <div className="grid grid-cols-[repeat(40,minmax(20px,1fr))] gap-[1px] bg-white/5 p-[1px] rounded-xl w-full max-w-full overflow-x-auto shadow-2xl mx-auto border border-white/10 scrollbar-thin">
            {gridBlocks}
        </div>
    );
}

export default Grid;
