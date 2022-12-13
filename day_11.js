/**

PART 2 ONGOING !


*/

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
        case '/': return lope / rope;
    }
}

function tree(operation, old) {
    const lope = operation.left_operand == 'old' ? old : parseInt(operation.left_operand);
    const rope = operation.right_operand == 'old' ? old : parseInt(operation.right_operand);

    return { l: lope, o: operation.operator, r: rope };
}

function is_divisible(tree, value) {
    if (typeof tree.l == 'number' && tree.r == 'number') {
        return 
    }
}

function advent_11_1(input) {
    const monkeys = input.split('\n\n').map(build_monkey);
    let counter = 20;
    for (;counter--;) {
        console.log(counter);
        monkeys.forEach(monkey => {
            let item = monkey.items.pop();

            while (item) {
                monkey.inspect_count++;
                const worry = ~~(eval(monkey.operation, item) / 3n);
                if (worry % monkey.test_divisible == 0n) {
                    monkeys.find(m => m.number == monkey.test_divisible_true).items.push(worry);
                } else {
                    monkeys.find(m => m.number == monkey.test_divisible_false).items.push(worry % monkey.test_divisible);
                }

                item = monkey.items.pop();
            }
        })
        if (counter % 1000 == 0) {
            console.log(`== After round ${counter} ==`);
            monkeys.forEach(m => console.log(`Monkey ${m.number} inspected items ${m.inspect_count} times.`))
        }
    }

    const top_2 = monkeys.sort((monkey_a, monkey_b) => monkey_a.inspect_count - monkey_b.inspect_count).slice(-2);

    return top_2[0].inspect_count * top_2[1].inspect_count;
}

function advent_11_2(input) {
    const monkeys = input.split('\n\n').map(build_monkey);
    let counter = 10000;
    for (;counter--;) {
        if (10000 - counter<25) console.log(counter)
        monkeys.forEach(monkey => {
            let item = monkey.items.pop();

            while (item) {
                monkey.inspect_count++;

                const worry = eval(monkey.operation, item);
                if (worry % monkey.test_divisible == 0) {
                    monkeys.find(m => m.number == monkey.test_divisible_true).items.push(monkey.test_divisible);
                } else {
                    monkeys.find(m => m.number == monkey.test_divisible_false).items.push(item);
                }

                item = monkey.items.pop();
            }
        })

        if (counter % 1000 == 0 || 10000 - counter == 1 || 10000 - counter <= 20 ) {
            console.log(`== After round ${10000 - counter} ==`);
            monkeys.forEach(m => console.log(`Monkey ${m.number} inspected items ${m.inspect_count} times.`, ... m.items))
        }
    }

    const top_2 = monkeys.sort((monkey_a, monkey_b) => monkey_a.inspect_count - monkey_b.inspect_count).slice(-2);

    return top_2[0].inspect_count * top_2[1].inspect_count;
}

const test_input = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

const input = `Monkey 0:
Starting items: 93, 98
Operation: new = old * 17
Test: divisible by 19
  If true: throw to monkey 5
  If false: throw to monkey 3

Monkey 1:
Starting items: 95, 72, 98, 82, 86
Operation: new = old + 5
Test: divisible by 13
  If true: throw to monkey 7
  If false: throw to monkey 6

Monkey 2:
Starting items: 85, 62, 82, 86, 70, 65, 83, 76
Operation: new = old + 8
Test: divisible by 5
  If true: throw to monkey 3
  If false: throw to monkey 0

Monkey 3:
Starting items: 86, 70, 71, 56
Operation: new = old + 1
Test: divisible by 7
  If true: throw to monkey 4
  If false: throw to monkey 5

Monkey 4:
Starting items: 77, 71, 86, 52, 81, 67
Operation: new = old + 4
Test: divisible by 17
  If true: throw to monkey 1
  If false: throw to monkey 6

Monkey 5:
Starting items: 89, 87, 60, 78, 54, 77, 98
Operation: new = old * 7
Test: divisible by 2
  If true: throw to monkey 1
  If false: throw to monkey 4

Monkey 6:
Starting items: 69, 65, 63
Operation: new = old + 6
Test: divisible by 3
  If true: throw to monkey 7
  If false: throw to monkey 2

Monkey 7:
Starting items: 89
Operation: new = old * old
Test: divisible by 11
  If true: throw to monkey 0
  If false: throw to monkey 2`;

console.log(advent_11_2(test_input));
