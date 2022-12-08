function parse(input) {
    const splitted = input.split('\n');

    return {
        grid: ''.concat(... splitted),
        width: splitted[0].length,
        height: splitted.length
    }
}

// return -1 if out of bounds
function get_neighbor_index(grid, current_index, cardinal_point) {
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
    const grid_wrapper = parse(input)

    function check_direction(grid_wrapper, index, direction) {
        const size = grid_wrapper.grid[index];
        
        function recursive(grid_wrapper, neighbor_index, tree_to_check_size, dir) {
            const no_neighbor = neighbor_index == -1;
            
            return no_neighbor
                || tree_to_check_size > grid_wrapper.grid[neighbor_index] 
                    && recursive(
                        grid_wrapper, 
                        get_neighbor_index(grid_wrapper, neighbor_index, dir), 
                        tree_to_check_size, 
                        dir
                    );
        }

        return recursive(grid_wrapper, get_neighbor_index(grid_wrapper, index, direction), size, direction);
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
    const grid_wrapper = parse(input)

    function count_visible_trees(grid_wrapper, index, direction) {
        function recursive(grid_wrapper, neighbor_index, tree_to_check_size, direction) {
            const grid = grid_wrapper.grid;
            const no_neighbor = neighbor_index == -1;
    
            if (no_neighbor) return 0;
            if (tree_to_check_size <= grid[neighbor_index]) return 1;
    
            return 1 + recursive(grid_wrapper, get_neighbor_index(grid_wrapper, neighbor_index, direction), tree_to_check_size, direction);
        }

        const size = grid_wrapper.grid[index];

        return recursive(grid_wrapper, get_neighbor_index(grid_wrapper, index, direction), size, direction);
    }

    function scenic_score(grid_wrapper, index) {
        return count_visible_trees(grid_wrapper, index, 'N') * count_visible_trees(grid_wrapper, index, 'S')
            * count_visible_trees(grid_wrapper, index, 'E') * count_visible_trees(grid_wrapper, index, 'W');
    }

    return Math.max(...grid_wrapper.grid.split('').map((size, i) => scenic_score(grid_wrapper, i)));
}

// https://adventofcode.com/2022/day/8/input
// 
// console.log(advent_8_1(`...`));
// console.log(advent_8_2(`...`));