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
