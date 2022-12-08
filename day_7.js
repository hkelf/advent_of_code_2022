function get_dir_sizes(input) {
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
    return get_dir_sizes(input)
        .filter(size => size <= 100000)
        .reduce((acc, cur) => acc + cur, 0);
}

function advent_7_2(input) {
    let sizes = get_dir_sizes(input);
    let max = Math.max(... sizes);
    sizes.sort((a, b) => a - b);

    for (let i=0; i<sizes.length; ++i) {
        if (max - sizes[i] < 40000000) {
            return sizes[i];
        }
    }

    return -1;
}

// https://adventofcode.com/2022/day/7/input
// 
// console.log(advent_7_1(`...`));
// console.log(advent_7_2(`...`));