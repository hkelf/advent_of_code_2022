const AIR = '.';
const ROCK = '#';
const STATIC_SAND = 'o';
const DYNAMIC_SAND = '+';
const X_SPAWN = 500;

function build_map(path_list, max_y_inc = 0) {
    const map = {
        min_x: Math.min(... path_list.flatMap(path => path.map(point => point[0]))),
        max_x: Math.max(... path_list.flatMap(path => path.map(point => point[0]))),
        // min_y: Math.min(... path_list.flatMap(path => path.map(point => point[1]))),
        min_y: 0,
        max_y: Math.max(... path_list.flatMap(path => path.map(point => point[1]))) + max_y_inc,
        index_2_coords: function(index) {
            const x = index % this.width;
            const y = ~~ (index / this.width);
            
            return {
                projected: { x: x + this.min_x, y: y + this.min_y },
                not_projected: { x: x, y: y }
            }
        },
        get_by_coords: function(x, y) {
            if (x > this.max_x) return null;
            if (x < this.min_x) return null;
            if (y > this.max_y) return null;
            if (y < this.min_y) return null;

            return this.grid[(x - this.min_x) + ((y - this.min_y) * this.width)];
        },
        set_by_coords: function(x, y, val) { 
            if (x > this.max_x) return;
            if (x < this.min_x) return;
            if (y > this.max_y) return;
            if (y < this.min_y) return;

            this.grid[(x - this.min_x) + ((y - this.min_y) * this.width)] = val;
        },
        print: function() {
            let result = '';
            for (let i=0; i<this.grid.length;++i) {
                if (i % this.width == 0) result += '\n';
                const coords = this.index_2_coords(i);
                const val = this.grid[i];
                let color = '';
                if (coords.projected.x == X_SPAWN && coords.projected.y == 0) {
                    color = '\x1b[41m';
                } else {    
                    switch (val) {
                        case AIR: 
                            color = '\x1b[36m';
                            break;
                        case ROCK:
                            color = '\x1b[42m';
                            break;
                        case STATIC_SAND:
                            color = '\x1b[43m';
                            break;
                        case DYNAMIC_SAND:
                            color = '\x1b[33m';
                            break;
                    }
                }
                result += color + val + '\x1b[0m';
            }

            return result;
        },
        draw_path: function(from, to, val) {
            const is_vertical = from[0] === to[0];
            if (is_vertical) {
                for (let i=Math.min(from[1], to[1]); i <= Math.max(from[1], to[1]); ++i) {
                    this.set_by_coords(from[0], i, val);
                }
            } else {
                for (let i=Math.min(from[0], to[0]); i <= Math.max(from[0], to[0]); ++i) {
                    this.set_by_coords(i, from[1], val);
                }
            }
        },
        get_next_drop_position: function () {
            let grain_pos = { x: X_SPAWN, y: 0 };

            while (true) {
                let next = this.get_by_coords(grain_pos.x, grain_pos.y + 1);
                if (next == null) return { type: 'oob' };
                if (next == AIR) { 
                    grain_pos.y ++;
                    continue;
                }

                next = this.get_by_coords(grain_pos.x - 1, grain_pos.y + 1);
                if (next == null) return { type: 'oob' };
                if (next == AIR) { 
                    grain_pos.y ++;
                    grain_pos.x --;
                    continue;
                }

                next = this.get_by_coords(grain_pos.x + 1, grain_pos.y + 1);
                if (next == null) return { type: 'oob' };
                if (next == AIR) { 
                    grain_pos.y ++;
                    grain_pos.x ++;
                    continue;
                }

                return { type: 'stuck', coord: grain_pos }
            }
        }
    };

    map.width = map.max_x - map.min_x + 1;
    map.height = map.max_y - map.min_y + 1;
    map.grid = new Array((map.width) * (map.height)).fill(AIR);
    
    let segments = [];
    path_list.forEach(path => {
        for (let i=1; i<path.length; ++i) {
            segments.push([path[i-1], path[i]]);
        }
    })
    
    segments.forEach(segment => map.draw_path(segment[0], segment[1], ROCK));

    return map;
}

function advent_14_1(input) {
    const path_list = input.split('\n').map(line => line.split(' -> ').map(point => point.split(',').map(Number)));

    const map = build_map(path_list);

    count = 0;
    while (true) {
        const pos = map.get_next_drop_position();

        if (pos.type == 'stuck') {
            map.set_by_coords(pos.coord.x, pos.coord.y, STATIC_SAND);
            count ++;
        } else {
            break;
        }
    }

    return count;
}


function advent_14_2(input) {
    const path_list = input.split('\n').map(line => line.split(' -> ').map(point => point.split(',').map(Number)));

    const map = build_map(path_list, 1);

    map.get_next_drop_position = function() {
        let grain_pos = { x: X_SPAWN, y: 0 };

        if (this.get_by_coords(grain_pos.x, grain_pos.y) != AIR) {
            return { type: 'spawn_stuck', coord: grain_pos };
        }
        while (true) {
            if (map.max_y == grain_pos.y) 
                return { type: 'stuck', coord: grain_pos };

            let next = this.get_by_coords(grain_pos.x, grain_pos.y + 1);
            if (next == null) {
                map.resize(grain_pos.x);
                continue;
            }
            if (next == AIR) { 
                grain_pos.y ++;
                continue;
            }

            next = this.get_by_coords(grain_pos.x - 1, grain_pos.y + 1);
            if (next == null) {
                map.resize(grain_pos.x - 1);
                continue;
            }
            if (next == AIR) { 
                grain_pos.y ++;
                grain_pos.x --;
                continue;
            }

            next = this.get_by_coords(grain_pos.x + 1, grain_pos.y + 1);
            if (next == null) {
                map.resize(grain_pos.x + 1);
                continue;
            }
            if (next == AIR) { 
                grain_pos.y ++;
                grain_pos.x ++;
                continue;
            }

            return { type: 'stuck', coord: grain_pos }
        }
    }
    
    const RESIZE = 10;

    map.resize = function(x_target) {
        if (x_target >= this.min_x && x_target <= this.max_x) throw ("If it occurs, infinite loop. \\o/");

        const chunks = []; 
        for (let i = 0; i < this.grid.length; i += this.width) chunks.push(this.grid.slice(i, i + this.width));
        
        if (x_target < this.min_x) {
            this.grid = [].concat(... chunks.map(chunk => new Array(RESIZE).fill(AIR).concat(chunk)));
            this.min_x -= RESIZE;
        }

        if (x_target > this.max_x) {
            this.grid = [].concat(... chunks.map(chunk => chunk.concat(new Array(RESIZE).fill(AIR))));
            this.max_x += RESIZE;
        }

        this.width += RESIZE;
    }

    let count = 0;
    while (true) {
        const pos = map.get_next_drop_position();

        if (pos.type == 'stuck') {
            map.set_by_coords(pos.coord.x, pos.coord.y, STATIC_SAND);
            count ++;
        } else {
            break;
        }
    }

    return count;
}

// https://adventofcode.com/2022/day/14/input
// console.log(advent_14_1(input));
// console.log(advent_14_2(input));
