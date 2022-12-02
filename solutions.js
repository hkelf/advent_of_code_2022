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
