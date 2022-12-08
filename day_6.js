function advent_6_1(input) {
    let i = 0;

    while(/(.).*\1/.test(input.slice(i, (i++)+4)));

    return i + 3;
}

function advent_6_2(input) {
    let i = 0;

    while(/(.).*\1/.test(input.slice(i, (i++)+14)));

    return i + 13;
}

let advent_6_1_recursive = (m,i=0) => /(.).*\1/.test(m.slice(0, 4)) ? advent_6_1_recursive(m.slice(1), i+1) : i+4;

let advent_6_2_recursive = (m,i=0) => /(.).*\1/.test(m.slice(0, 14)) ? advent_6_2_recursive(m.slice(1), i+1) : i+14;

// https://adventofcode.com/2022/day/6/input
// 
// console.log(advent_6_1(`...`));
// console.log(advent_6_2(`...`));