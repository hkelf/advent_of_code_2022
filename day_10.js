const NOOP = 'noop';
const ADDX = 'addx';

function read(line) {
    if (line == NOOP) {
        return { instr: NOOP, cost: 1 };
    }

    let m;

    m = line.match(/addx (-?\d+)/);
    if (m) {
        return { instr: ADDX, cost: 2, params: [ parseInt(m[1]) ] };
    }

    return null;
}

function eval(state, tokens) {    
    switch (tokens.instr) {
        case ADDX:
            state.X += tokens.params[0];
            break;
    }
}

function advent_10_1(input) {
    let state = {
        X: 1,
        tick_count: 1,
        iss_sum: 0
    };
    
    input.split('\n')
        .map(read)
        .forEach(tokens => {
            // Increment tick
            const lim = state.tick_count + tokens.cost;    
            for (; state.tick_count < lim; state.tick_count++) {
                if (state.tick_count == 20 || !((state.tick_count + 20) % 40)) {
                    state.iss_sum += state.tick_count * state.X;
                }
            }

            eval(state, tokens);
        });

    return state.iss_sum;
}

function advent_10_2(input) {
    let state = {
        X: 1,
        tick_count: 1
    };

    let display = new Array(240);
    
    input.split('\n')
        .map(read)
        .forEach(tokens => {
            const lim = state.tick_count + tokens.cost;    
            for (; state.tick_count < lim; state.tick_count++) {
                // print
                display[state.tick_count-1] = 
                    (state.tick_count-1) % 40 >= state.X-1 && (state.tick_count-1) % 40 < state.X-1 + 3;
            }

            eval(state, tokens);
        });
    
    return new Array(6).fill(null).map((_, i) => 
        ''.concat(... display.slice(i * 40, i * 40 + 40).map(p => p ? '#' : '.'))
    );
}

// https://adventofcode.com/2022/day/10/input
// console.log(advent_10_1(input));
// advent_10_2(input).forEach(line => console.log(line));
