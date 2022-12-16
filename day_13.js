// 1 asc -1 desc 0 eq
function get_order(left, right, tab = '') {
    let ptr = 0;

    while (ptr < left.length || ptr < right.length) {
        const left_head = left[ptr];
        const right_head = right[ptr];

        if (left_head === undefined) return 1;

        else if (right_head === undefined) return -1;
        
        else if (!Array.isArray(left_head) && !Array.isArray(right_head)) {
            if (left_head < right_head) return 1;
            if (left_head > right_head) return -1;
        
        } else if (Array.isArray(left_head) && Array.isArray(right_head)) {
            const array_comp = get_order(left_head, right_head, tab + ' ');
            
            if (array_comp == 1) return 1;
            if (array_comp == -1) return -1;

        } else if (!Array.isArray(left_head)) {
            left[ptr] = [left_head];
            continue;

        } else if (!Array.isArray(right_head)) {
            right[ptr] = [right_head];
            continue;
        }

        ptr++;
    }

    return 0;
}

function is_signal(entry) {
    if (Array.isArray(entry) && entry.length == 1) {
        if (entry[0] == 2 || entry[0] == 6) {
            return true;
        } else {
            return is_signal(entry[0]);
        }
    }

    return false;
}

function advent_13_1(input) {
    return input
        .split('\n\n')
        .map(pair => pair.split('\n').map(eval))
        .map((pair, i) => get_order(... pair) == 1 ? i + 1 : 0 )
        .reduce((acc, curr) =>  acc + curr, 0);
}


function advent_13_2(input) {
    input += `
[[2]]
[[6]]`;

    return [].concat(... input.split('\n\n').map(pair => pair.split('\n').map(eval)))
        .sort((a, b) => get_order(b, a))    
        .reduce((acc, cur, i) => is_signal(cur) ? acc * (i+1) : acc, 1);
}

// https://adventofcode.com/2022/day/13/input
// console.log(advent_13_1(input));
// console.log(advent_13_2(input));
