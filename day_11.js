function build_monkey(monkey_raw) {
    let monkey = { inspect_count: 0 };
    
    monkey_raw
        .split('\n')
        .forEach(line => {
            if (line.includes('Monkey')) {
                monkey.number = line.match(/\d+/).map(Number)[0];
            }

            if (line.includes('Starting')) {
                monkey.items = line.match(/\d+/g).map(Number).reverse();
            }

            if (line.includes('divisible')) {
                monkey.test_divisible = line.match(/\d+/g).map(Number)[0];
            }

            if (line.includes('true')) {
                monkey.test_divisible_true = line.match(/\d+/g).map(Number)[0];
            }

            if (line.includes('false')) {
                monkey.test_divisible_false = line.match(/\d+/g).map(Number)[0];
            }

            let match_operation = line.match(/(?<loperand>old|\d+) (?<operator>\*|\+|-|\/) (?<roperand>old|\d+)/)
            if (match_operation) {
                monkey.operation = {
                    left_operand: match_operation.groups.loperand,
                    right_operand: match_operation.groups.roperand,
                    operator: match_operation.groups.operator
                }
            }
        });

    return monkey;
}

function eval(operation, old) {
    const lope = operation.left_operand == 'old' ? old : parseInt(operation.left_operand);
    const rope = operation.right_operand == 'old' ? old : parseInt(operation.right_operand);

    switch (operation.operator) {
        case '+': return lope + rope;
        case '-': return lope - rope;
        case '*': return lope * rope;
    }
}

function advent_11_1(input) {
    const monkeys = input.split('\n\n').map(build_monkey);
    let counter = 20;
    for (;counter--;) {
        monkeys.forEach(monkey => {
            let item = monkey.items.pop();

            while (item) {
                monkey.inspect_count++;
                const worry = ~~(eval(monkey.operation, item) / 3);
                monkeys
                    .find(m => m.number == monkey[worry % monkey.test_divisible == 0 ? "test_divisible_true" : "test_divisible_false"])
                    .items.push(worry);
                // if (worry % monkey.test_divisible == 0) {
                //     monkeys.find(m => m.number == monkey.test_divisible_true).items.push(worry);
                // } else {
                //     monkeys.find(m => m.number == monkey.test_divisible_false).items.push(worry % monkey.test_divisible);
                // }

                item = monkey.items.pop();
            }
        })
    }

    const top_2 = monkeys.sort((monkey_a, monkey_b) => monkey_a.inspect_count - monkey_b.inspect_count).slice(-2);

    return top_2[0].inspect_count * top_2[1].inspect_count;
}

function advent_11_2(input) {
    const monkeys = input.split('\n\n').map(build_monkey);
    
    // I have no idea what i'm doing. Found it on reddit and the guy told he had no idea neither.
    // A guy tried to explain:
    // https://www.reddit.com/r/adventofcode/comments/zih7gf/comment/izra8bn/?utm_source=share&utm_medium=web2x&context=3
    const supermodulo = monkeys
        .map(m => m.test_divisible)
        .sort((a, b) => a - b)
        .reduce((acc, cur) => acc * cur, 1);

    const ROUNDS = 10000;
    let counter = ROUNDS;
    for (;counter--;) {
        monkeys.forEach(monkey => {
            let item = monkey.items.pop();

            while (item) {
                monkey.inspect_count++;

                const worry = eval(monkey.operation, item);
                monkeys
                    .find(m => m.number == monkey[worry % monkey.test_divisible == 0 ? "test_divisible_true" : "test_divisible_false"])
                    .items.push(worry % supermodulo);

                item = monkey.items.pop();
            }
        })
    }

    const top_2 = monkeys.sort((monkey_a, monkey_b) => monkey_a.inspect_count - monkey_b.inspect_count).slice(-2);

    return top_2[0].inspect_count * top_2[1].inspect_count;
}

// https://adventofcode.com/2022/day/11/input
// console.log(advent_11_1(input));
// console.log(advent_11_2(input));
