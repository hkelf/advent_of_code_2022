// Returns true if the tail was moved, else false.
function move_tail(head_pos, tail_pos) {
    const diff_x = tail_pos.x - head_pos.x;
    const diff_y = tail_pos.y - head_pos.y;
    
    const dont_move = diff_x <= 1 && diff_x >= -1 && diff_y <= 1 && diff_y >= -1;
    if (dont_move) {
        return false;
    }

    tail_pos.x += diff_x > 0 ? -1 : diff_x < 0 ? 1 : 0;
    tail_pos.y += diff_y > 0 ? -1 : diff_y < 0 ? 1 : 0;

    return true;
}

function resolve_cmd_p1(state, command) {
    let head_pos = state.head_pos;
    let tail_pos = state.tail_pos;

    for (let i=0; i<command.count; ++i) {
        switch (command.direction) {
            case 'U':
                head_pos.y--;
                break;
            case 'D':
                head_pos.y++;
                break;
            case 'L':
                head_pos.x--;
                break;
            case 'R':
                head_pos.x++;
                break;
        }

        if (move_tail(head_pos, tail_pos)) state.tail_log.add(`${tail_pos.x},${tail_pos.y}`);
    }
}

function resolve_cmd_p2(state, command) {
    for (let i=0; i<command.count; ++i) {
        switch (command.direction) {
            case 'U':
                state.rope.pos.y--;
                break;
            case 'D':
                state.rope.pos.y++;
                break;
            case 'L':
                state.rope.pos.x--;
                break;
            case 'R':
                state.rope.pos.x++;
                break;
        }

        const has_tail_moved = (function recursive_move_next_node(node) {
            return node.next == null || move_tail(node.pos, node.next.pos) && recursive_move_next_node(node.next);
        }) (state.rope);

        if (has_tail_moved) {
            let tail = (function get_tail_recursively(node) { 
                return node.next == null ? node : get_tail_recursively(node.next) }
            ) (state.rope);
            
            state.tail_log.add(`${tail.pos.x},${tail.pos.y}`);
        }
    }
}

function advent_9_1(input) {
    let state = {
        head_pos: {x: 0, y: 0},
        tail_pos: {x: 0, y: 0},
        tail_log: new Set([`0,0`])
    };

    input
        .split('\n')
        .map(line => {
            const m = line.match(/([A-Z]) (\d+)/);
            return { direction: m[1], count: parseInt(m[2]) };
        })
        .forEach(command => resolve_cmd_p1(state, command));

    return state.tail_log.size;
}

function advent_9_2(input, rope_size = 9) {
    let state = {
        rope: { pos: {x: 0, y: 0}, next: null },
        tail_log: new Set([`0,0`])
    };

    (function recursive_add_node(node, count) {
        if (count) {
            node.next = { pos: {x: 0, y: 0}, next: null };
            recursive_add_node(node.next, count - 1)
        }
    }) (state.rope, rope_size);

    input
        .split('\n')
        .map(line => {
            const m = line.match(/([A-Z]) (\d+)/);
            return { direction: m[1], count: parseInt(m[2]) };
        })
        .forEach(command => resolve_cmd_p2(state, command));

    return state.tail_log.size;
}

// https://adventofcode.com/2022/day/9/input
// console.log(advent_9_1(`...`))
// console.log(advent_9_2(`...`))
// Alternative part 1, the part 1 was basically part 2 with a single node: 
// console.log(advent_9_2(`...`, 1))
