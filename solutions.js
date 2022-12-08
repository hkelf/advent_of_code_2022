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

let advent_6_1_recursive = (m,i=0) => /(.).*\1/.test(m.slice(0, 4)) ? advent_6_1_recursive(m.slice(1), i+1) : i+4;

let advent_6_2_recursive = (m,i=0) => /(.).*\1/.test(m.slice(0, 14)) ? advent_6_2_recursive(m.slice(1), i+1) : i+14;

/***/

function advent_7_list_directories_sizes(input) {
    const output = input.split('\n');
    let tree = { type: 'dir', name: '/', children: [], parent: null};
    let wd = null;
    
    function push(name, size) {
        const existing_child = wd.children.filter(named => named.name == name)[0];
        if (existing_child) {
            if (!isNaN(size)) {
                existing_child.size = size;
            }
        } else {
            wd.children.push(
                isNaN(size)
                    ? { type: 'dir', parent: wd, name: name, children: [] }
                    : { type: 'file', parent: wd, name: name, size: parseInt(size) }
            );
        }
    }
    
    function cd(param) {
        switch (param) {
            case '/': 
                wd = tree;
                break;
            case '..':
                wd = wd.parent;
                break;
            case '.':
                break;
            default:
                wd = wd.children.filter(child => child.name == param)[0];
                break;
        }
    }

    function dir_sizes(dir, list_ptr) {
        let size = dir.children.reduce(
            (acc, child) => acc + (child.type == 'file' ? child.size : dir_sizes(child, list_ptr))
            , 0
        );

        list_ptr.push(size);

        return size;
    }
    
    for (let i=0; i<output.length; ++i) {
        const line = output[i];
        
        if (line == '$ ls') {
            continue;
        }
        
        let dir_output = line.match(/dir ([\w|\.]+)/);
        if (dir_output) {
            push(dir_output[1]);
            continue;
        }
        
        let file_output = line.match(/(\d+) ([\w|\.]+)/);
        if (file_output) {
            push(file_output[2], file_output[1]);
            continue;
        }
        
        let cd_output = line.match(/\$ cd ([\w|\.|\/]+)/);
        if (cd_output) {
            cd(cd_output[1]);
            continue;
        }
    }
    
    let result = [];
    dir_sizes(tree, result);

    return result;
}

function advent_7_1(input) {
    return advent_7_list_directories_sizes(input)
        .filter(size => size <= 100000)
        .reduce((acc, cur) => acc + cur, 0);
}

function advent_7_2(input) {
    let sizes = advent_7_list_directories_sizes(input);
    let max = Math.max(... sizes);
    sizes.sort((a, b) => a - b);

    for (let i=0; i<sizes.length; ++i) {
        if (max - sizes[i] < 40000000) {
            return sizes[i];
        }
    }

    return -1;
}

/***/

function advent_8_parse(input) {
    const splitted = input.split('\n');

    return {
        grid: ''.concat(... splitted),
        width: splitted[0].length,
        height: splitted.length
    }
}

// return -1 if out of bounds
function advent_8_get_neighbor_index(grid, current_index, cardinal_point) {
    switch (cardinal_point) {
        case 'N':
            return current_index - grid.width < 0 ? -1 : current_index - grid.width;
        case 'E':
            return current_index % grid.width + 1 >= grid.width ? -1 : current_index + 1;
        case 'S':
            return current_index + grid.width >= grid.width * grid.height ? -1 : current_index + grid.width ;
        case 'W':
            return current_index % grid.width - 1 < 0 ? -1 : current_index - 1;
    }
}

function advent_8_1(input) {
    const grid_wrapper = advent_8_parse(input)

    function check_direction(grid_wrapper, index, direction) {
        const size = grid_wrapper.grid[index];
        
        function recursive(grid_wrapper, neighbor_index, tree_to_check_size, dir) {
            const no_neighbor = neighbor_index == -1;
            
            return no_neighbor
                || tree_to_check_size > grid_wrapper.grid[neighbor_index] 
                    && recursive(
                        grid_wrapper, 
                        advent_8_get_neighbor_index(grid_wrapper, neighbor_index, dir), 
                        tree_to_check_size, 
                        dir
                    );
        }

        return recursive(grid_wrapper, advent_8_get_neighbor_index(grid_wrapper, index, direction), size, direction);
    }

    function am_i_visible(grid_wrapper, index) {
        return check_direction(grid_wrapper, index, 'N') || check_direction(grid_wrapper,  index, 'S')
            || check_direction(grid_wrapper, index, 'E') || check_direction(grid_wrapper, index, 'W');
    }

    return grid_wrapper.grid
        .split('')
        .filter((_, i) => am_i_visible(grid_wrapper, i))
        .length;
}

function advent_8_2(input) {
    const grid_wrapper = advent_8_parse(input)

    function count_visible_trees(grid_wrapper, index, direction) {
        function recursive(grid_wrapper, neighbor_index, tree_to_check_size, direction) {
            const grid = grid_wrapper.grid;
            const no_neighbor = neighbor_index == -1;
    
            if (no_neighbor) return 0;
            if (tree_to_check_size <= grid[neighbor_index]) return 1;
    
            return 1 + recursive(grid_wrapper, advent_8_get_neighbor_index(grid_wrapper, neighbor_index, direction), tree_to_check_size, direction);
        }

        const size = grid_wrapper.grid[index];

        return recursive(grid_wrapper, advent_8_get_neighbor_index(grid_wrapper, index, direction), size, direction);
    }

    function scenic_score(grid_wrapper, index) {
        return count_visible_trees(grid_wrapper, index, 'N') * count_visible_trees(grid_wrapper, index, 'S')
            * count_visible_trees(grid_wrapper, index, 'E') * count_visible_trees(grid_wrapper, index, 'W');
    }

    return Math.max(...grid_wrapper.grid.split('').map((size, i) => scenic_score(grid_wrapper, i)));
}
