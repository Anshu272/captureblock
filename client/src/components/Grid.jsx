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
        <div className="grid grid-cols-[repeat(40,minmax(0,1fr))] gap-[1px] bg-white/5 p-[1px] rounded-xl w-full max-w-[95vw] aspect-[2/1] shadow-2xl overflow-hidden mx-auto border border-white/10">
            {gridBlocks}
        </div>
    );
}

export default Grid;
