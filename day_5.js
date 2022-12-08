function parse_stock(input) {
    const stock = [];
    const regex = /\[([a-zA-Z])\]\s|(\s{3})\s/g;

    input
        .split('\n')
        .map(line => line + ' ')
        .filter(line => line.includes('['))
        .reverse()
        .forEach(line => {
            let n;

            while ((n = regex.exec(line)) !== null) {
                if (n.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                const stack_index = ~~(n.index / 4) + 1;

                if (n[0].trim().length === 0) continue;

                if (!stock[stack_index]) stock[stack_index] = [];

                stock[stack_index].push(n[1]);
            }
        });

    return stock;
}

function parse_commands(input) {
    return input
        .split('\n')
        .filter(line => line.includes('move'))
        .map(line => { 
            const captures = line.match(/move (\d+) from (\d+) to (\d+)/);
            return {
                qty: captures[1],
                from: captures[2],
                to: captures[3]
            }
        });
}

function advent_5_1(input) {
    let stock = parse_stock(input)

    parse_commands(input)
        .forEach(instruction => {
            for (let i = 0; i < instruction.qty; ++i) {
                stock[instruction.to].push(stock[instruction.from].pop())
            }
        });
    
    return stock.reduce((acc, cur) => acc + cur.pop(), '')
}

function advent_5_2(input) {
    let stock = parse_stock(input);

    parse_commands(input)
        .forEach(instruction => {
            stock[instruction.to] = stock[instruction.to].concat(stock[instruction.from].slice(-instruction.qty));
            stock[instruction.from] = stock[instruction.from].slice(0, -instruction.qty);
        });
    
    return stock.reduce((acc, cur) => acc + cur.pop(), '')
}

// https://adventofcode.com/2022/day/5/input
// 
// console.log(advent_5_1(`...`));
// console.log(advent_5_2(`...`));