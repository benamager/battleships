// 2D grid of cells
// "e" = empty cell (default)
// "d" = dummy cell (invisible to player)
// "s" = ship cell (invisible to player), just for collision detection
const presetMap1 = [
    ["e", "e", "e", "e", "e", "e", "e", "e", "d", "d"],
    ["d", "d", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
];
const presetMap2 = [
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "d", "d"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "d", "d"],
];
const presetMap3 = [
    ["e", "e", "d", "d", "e", "e", "e", "d", "d", "e", "e"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["d", "e", "e", "e", "e", "e", "e", "e", "e", "e", "d"],
    ["d", "e", "e", "e", "e", "e", "e", "e", "e", "e", "d"],
    ["e", "e", "e", "e", "d", "d", "d", "e", "e", "e", "e"],
    ["e", "e", "e", "e", "d", "d", "d", "e", "e", "e", "e"],
    ["d", "e", "e", "e", "e", "e", "e", "e", "e", "e", "d"],
    ["d", "e", "e", "e", "e", "e", "e", "e", "e", "e", "d"],
    ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
    ["e", "e", "d", "d", "e", "e", "e", "d", "d", "e", "e"],
];

export const maps = [presetMap1, presetMap2, presetMap3];
