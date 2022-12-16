function get_point(matrix, width, height, x, y) {
    const is_oob = x < 0 || y < 0 || x >= width || y >= height;
    if (is_oob) return null;

    return matrix[coords_to_index(width, x, y)];
}

function to_coords(index, width) {
    return {
        x: index % width,
        y: ~~(index / width)
    };
}

function coords_to_index(width, x, y) {
    return y * width + x;
}

function dijkstra(ro_graph, source, target) {
    const graph = ro_graph.slice();
    const distances = graph.map(_ => Infinity);
    const previous = graph.map(_ => null);

    distances[source] = 0;

    while (graph.filter(e => e != null).length) {
        const index = graph
            .reduce((acc, _, idx) => {
                if (graph[idx] == null) return acc;
                if (acc == null) return idx;

                return distances[acc] < distances[idx] ? acc : idx;
            }, null);

        if (index == target) break;

        const node_to_check = graph[index];
        graph[index] = null;

        node_to_check.neighbors.filter(n => graph[n] != null).forEach(n => {
            const tentative = distances[index] + 1;
            if (tentative < distances[n]) {
                distances[n] = tentative;
                previous[n] = index;
            }
        });
    }

    return (function rec_path(index, accumulator=[]) {
        if (previous[index] == null) return accumulator;
        return rec_path(previous[index], accumulator.concat(index))
    }) (target);
}

function get_elevation(value) {
    if (value == 'S') return 'a'.charCodeAt(0);
    if (value == 'E') return 'z'.charCodeAt(0);

    return value.charCodeAt(0);
}

function get_graph(input) {
    const width = input.split('\n')[0].length;
    const height = input.split('\n').length;

    let index_S, index_E;

    const graph = input
        .replace(/\n/g, '')
        .split('')
        .map((point, index, self) => {
            const { x: x, y: y } = to_coords(index, width);
            const n = get_point(self, width, height, x, y - 1);
            const s = get_point(self, width, height, x, y + 1);
            const w = get_point(self, width, height, x - 1, y);
            const e = get_point(self, width, height, x + 1, y);
            
            if (point == 'S') index_S = index;
            if (point == 'E') index_E = index;
            let neighbors = [];

            const point_value = get_elevation(point);

            if (n != null && get_elevation(n) - point_value <= 1) neighbors.push(coords_to_index(width, x, y - 1));
            if (s != null && get_elevation(s) - point_value <= 1) neighbors.push(coords_to_index(width, x, y + 1));
            if (w != null && get_elevation(w) - point_value <= 1) neighbors.push(coords_to_index(width, x - 1, y));
            if (e != null && get_elevation(e) - point_value <= 1) neighbors.push(coords_to_index(width, x + 1, y));

            return {
                x: x,
                y: y,
                index: index,
                val: point,
                neighbors: neighbors
            };
        });

    return {
        index_S: index_S,
        index_E: index_E,
        width: width,
        height: height,
        graph: graph
    };
}

function advent_12_1(input) {
    const {
        index_S: index_S,
        index_E: index_E,
        width: width,
        graph: graph
    } = get_graph(input);

    const dijkstra_result = dijkstra(graph, index_S, index_E);

    return dijkstra_result.length;
}

function advent_12_2(input) {
    const {
        index_E: index_E,
        width: width,
        height: height,
        graph: graph
    } = get_graph(input);

    const starting_indexes = new Set();
    for(let i=0; i<width; ++i) {
        const top_point = get_point(graph, width, height, i, 0);
        const bottom_point = get_point(graph, width, height, i, height - 1);

        if (['S', 'a'].includes(top_point.val)) starting_indexes.add(top_point.index);
        if (['S', 'a'].includes(bottom_point.val)) starting_indexes.add(bottom_point.index);
    }

    for(let i=0; i<height; ++i) {
        const left_point = get_point(graph, width, height, 0, i);
        const right_point = get_point(graph, width, height, width - 1, i);

        if (['S', 'a'].includes(left_point.val)) starting_indexes.add(left_point.index);
        if (['S', 'a'].includes(right_point.val)) starting_indexes.add(right_point.index);
    }
    
    return Math.min(... Array.from(starting_indexes)
    .map(i => [i, dijkstra(graph, i, index_E)]).map(tuple => tuple[1]).map(path => path.length).filter(l => l));
}

// https://adventofcode.com/2022/day/12/input
// console.log(advent_12_1(input));
// console.log(advent_12_2(input));
