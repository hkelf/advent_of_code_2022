function advent_4_1(input) {
    return input
        .split('\n')
        .map(duo => duo.split(',').map(range => range.split('-').map(edge => parseInt(edge))))
        .filter(duo => 
            duo[0][0] <= duo[1][0] && duo[0][1] >= duo[1][1] 
            || duo[0][0] >= duo[1][0] && duo[0][1] <= duo[1][1] 
        )
        .length;
}

function advent_4_2(input) {
    return input
        .split('\n')
        .map(duo => duo.split(',').map(range => range.split('-').map(edge => parseInt(edge))))
        .filter(duo => duo[0][0] <= duo[1][1] && duo[0][1] >= duo[1][0])
        .length;
}

// https://adventofcode.com/2022/day/4/input
// 
// console.log(advent_4_1(`...`));
// console.log(advent_4_2(`...`));