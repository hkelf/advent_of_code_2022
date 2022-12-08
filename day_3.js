function advent_3_1(list) {
    return list
        .split("\n")
        .map(entry => [
            entry.slice(0, entry.length/2).split(''), 
            entry.slice(entry.length/2, entry.length)
        ])
        .map(compartiments => compartiments[0].filter(item => compartiments[1].includes(item))[0])
        .map(item => item.charCodeAt(0) - (item == item.toLowerCase() ? 96 : 38))
        .reduce((a, c) => a + c, 0);
}

function advent_3_2(list) {
    return list
        .split("\n")
        .reduce((acc, _, i, self) => {
            if (i % 3 == 0) {
                acc.push([self[i], self[i+1], self[i+2]])
            }

            return acc;
        }, [])
        .map(compartiments => 
            compartiments[0]
                .split('')
                .filter(item => 
                    compartiments[1].includes(item) && compartiments[2].includes(item)
                )[0]
        )
        .map(item => item.charCodeAt(0) - (item == item.toLowerCase() ? 96 : 38))
        .reduce((a, c) => a + c, 0);
}

// https://adventofcode.com/2022/day/3/input
// 
// console.log(advent_3_1(`...`));
// console.log(advent_3_2(`...`));