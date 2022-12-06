function advent_1_1(input) {
    return Math.max(...
        input
            .split('\n\n')
            .map(elf => 
                elf
                    .split('\n')
                    .map(s => parseInt(s))
                    .reduce((a, c) => a + c, 0)
            )
    )
}

function advent_1_2(input) {
    return input
        .split('\n\n')
        .map(elf => 
            elf
                .split('\n')
                .map(s => parseInt(s))
                .reduce((a, c) => a + c, 0)
        )
        .sort((a, b) => a - b)
        .slice(-3)
        .reduce((a, c) => a + c, 0);
}

/***/

function advent_2_1(guide) {
    return guide
        .split("\n")
        .map(e => {
            switch (e) {
                case "A X": return 4;
                case "A Y": return 8;
                case "A Z": return 3;
                case "B X": return 1;
                case "B Y": return 5;
                case "B Z": return 9;
                case "C X": return 7;
                case "C Y": return 2;
                case "C Z": return 6;
            }
        })
        .reduce((a, c) => a + c, 0);
}

function advent_2_2(guide) {
    return guide
        .split("\n")
        .map(e => {
            switch (e) {
                case "A X": return 3;
                case "A Y": return 4;
                case "A Z": return 8;
                case "B X": return 1;
                case "B Y": return 5;
                case "B Z": return 9;
                case "C X": return 2;
                case "C Y": return 6;
                case "C Z": return 7;
            }
        })
        .reduce((a, c) => a + c, 0);
}

/***/

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

/***/

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

/***/

function advent_5_parse_stock(input) {
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

function advent_5_parse_commands(input) {
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
    let stock = advent_5_parse_stock(input)

    advent_5_parse_commands(input)
        .forEach(instruction => {
            for (let i = 0; i < instruction.qty; ++i) {
                stock[instruction.to].push(stock[instruction.from].pop())
            }
        });
    
    return stock.reduce((acc, cur) => acc + cur.pop(), '')
}

function advent_5_2(input) {
    let stock = advent_5_parse_stock(input);

    advent_5_parse_commands(input)
        .forEach(instruction => {
            stock[instruction.to] = stock[instruction.to].concat(stock[instruction.from].slice(-instruction.qty));
            stock[instruction.from] = stock[instruction.from].slice(0, -instruction.qty);
        });
    
    return stock.reduce((acc, cur) => acc + cur.pop(), '')
}

/***/

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
