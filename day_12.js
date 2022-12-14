function get_point(matrix, width, height, x, y) {
    const is_oob = x < 0 || y < 0 || x >= width || y >= height;
    if (is_oob) return null;

    return matrix[y * width + x];
}

function print_path(matrix, history, width) {
    let result = '';

    matrix.forEach((element, i) => {
        if (i % width == 0) {
            result += '\n';
        }

        if (history.includes(i)) {
            if (history.indexOf(i) == history.length-1) {
                result += '\x1b[42m' + element.val + "\x1b[0m";
            } else {
                result += '\x1b[32m' + element.val + "\x1b[0m";
            }
        } else {
            if (element.dead_end) {
                result += '\x1b[41m' + element.val + "\x1b[0m";
            } else {
                result += element.val;
            }
        }
    });

    console.log(result);
    console.log("("+history.length+")");
}

/* function set_point(matrix, width, x, y, val) {
    matrix[y * width + x] = val;
}*/

function to_coords(index, width) {
    return {
        x: index % width,
        y: ~~(index / width)
    };
}

function dijkstra_i_guess(matrix, width, height, index, history) {    
    // DEBUG
    // console.clear();
    // print_path(matrix, history, width);
    // for(let t=10000000;t--;){}
    //
    
    const {x:x, y:y} = to_coords(index, width);
    
    const current_point = get_point(matrix, width, height, x, y);

    if (current_point.val == 'E') {
        // console.log('Path found', ... history);
        return history;
    }

    const shortests_list = [];

    if (current_point.n) {
        const target = get_point(matrix, width, height, x, y - 1);
        if (!target.dead_end && !history.includes(target.index)) {
            shortests_list.push(dijkstra_i_guess(matrix, width, height, target.index, history.concat(index)));
        } else {
            // console.log('loop', ... history.concat(index));
        }
    }

    if (current_point.s) {
        const target = get_point(matrix, width, height, x, y + 1);
        if (!target.dead_end && !history.includes(target.index)) {
            shortests_list.push(dijkstra_i_guess(matrix, width, height, target.index, history.concat(index)));
        } else {
            // console.log('loop', ... history.concat(index));
        }
    }

    if (current_point.w) {
        const target = get_point(matrix, width, height, x - 1, y);
        if (!target.dead_end && !history.includes(target.index)) {
            shortests_list.push(dijkstra_i_guess(matrix, width, height, target.index, history.concat(index)));
        } else {
            // console.log('loop', ... history.concat(index));
        }
    }

    if (current_point.e) {
        const target = get_point(matrix, width, height, x + 1, y);
        if (!target.dead_end && !history.includes(target.index)) {
            shortests_list.push(dijkstra_i_guess(matrix, width, height, target.index, history.concat(index)));
        } else {
            // console.log('loop', ... history.concat(index));
        }
    }

    const sorted = shortests_list.filter(h => h).sort((history1, history2) => history1.length - history2.length);

    if (sorted.length == 0) {
        current_point.dead_end = true;
        return null;
    }

    return sorted[0];
}

function advent_12_1(input) {
    const width = input.split('\n')[0].length;
    const height = input.split('\n').length;

    let index_S, index_E;

    const graph_matrix = input
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

            const point_val = point.charCodeAt(0);

            return {
                dead_end: false,
                x: x,
                y: y,
                index: index,
                val: point,
                n: n == null ? 0 : Number(point == 'S' && n.charCodeAt(0) - 'a'.charCodeAt(0) <= 1 || point =='z' && n == 'E' || point.toLowerCase() == point && n.toLowerCase() == n && n.charCodeAt(0) - point_val <= 1),
                s: s == null ? 0 : Number(point == 'S' && s.charCodeAt(0) - 'a'.charCodeAt(0) <= 1 || point =='z' && s == 'E' || point.toLowerCase() == point && s.toLowerCase() == s && s.charCodeAt(0) - point_val <= 1),
                w: w == null ? 0 : Number(point == 'S' && w.charCodeAt(0) - 'a'.charCodeAt(0) <= 1 || point =='z' && w == 'E' || point.toLowerCase() == point && w.toLowerCase() == w && w.charCodeAt(0) - point_val <= 1),
                e: e == null ? 0 : Number(point == 'S' && e.charCodeAt(0) - 'a'.charCodeAt(0) <= 1 || point =='z' && e == 'E' || point.toLowerCase() == point && e.toLowerCase() == e && e.charCodeAt(0) - point_val <= 1)
            };
        });

    const path = dijkstra_i_guess(graph_matrix, width, height, index_S, []);

    console.log(
        path
            .map(i => to_coords(i, width))
            .map(p => get_point(graph_matrix, width, height, p.x, p.y))
            .map(p => `${p.val}(${p.x},${p.y})`)
    );

    print_path(graph_matrix, path, width);

    return path.length;
}

const test_input = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const test_input_2 = `Saaaccaaccccc
baaccaaaaaacc
baccccaaaaacc
baacaaaaaaacc
baaaaaaaaaaac
bcaaaaaaaaaac
bcccccaaacacc
baccccaaccccc
baaaccccacccc
baaaccccaaaca
baacccccaaaaa
baaacccEaaaaa
bccccccaaaaaa`;

const input = `abaaaaacaaaacccccccccaaaaaaccccccccccccccccccccccccccccccccccaaaaaa
abaaaaacaaaaccccaaaaaaaaaacccccccccccccccccccccccccccccccccccaaaaaa
abaaacccaaaaccccaaaaaaaaaaacccaacccccccccccaacccccccccccccccccaaaaa
abaaaacccaacccccaaaaaaaaaaaaaaaaacccccccccccacccccccccccccccccccaaa
abacaacccccccccccaaaaaaaaaaaaaaaaccccccccccaacccccccccccccccccccaaa
abcccacccccccccccaaaaaaaccaaaaaaaccccccccccclllcccccacccccccccccaac
abccccccccccccccccaaaaaccccccccccccccccccclllllllcccccccccccccccccc
abaaacccccccccccccaaaaaccccccccccccccccaakklllllllcccccccccaacccccc
abaaacccccccccccacccaaaccccccccccccccccakkklpppllllccddaaacaacccccc
abaaacccaaacccccaacaaaccccccccccccccccckkkkpppppllllcddddaaaacccccc
abaacccaaaacccccaaaaaccccccccccccccccckkkkpppppppllmmddddddaaaacccc
abaaaccaaaaccccccaaaaaacaaacccccccccckkkkpppuuuppplmmmmdddddaaacccc
abaaacccaaaccccaaaaaaaacaaaaccccccckkkkkoppuuuuuppqmmmmmmdddddacccc
abcccccccccccccaaaaaaaacaaaacccccjkkkkkooppuuuuuuqqqmmmmmmmddddcccc
abccccccccccccccccaaccccaaaccccjjjjkoooooouuuxuuuqqqqqqmmmmmddecccc
abacaaccccccccccccaacccccccccccjjjjoooooouuuxxxuvvqqqqqqqmmmeeecccc
abaaaacccccccacccaccccccccccccjjjjoootuuuuuuxxxyvvvvvqqqqmmmeeecccc
abaaaaacccccaaacaaacccccccccccjjjoooottuuuuuxxyyvvvvvvvqqmnneeecccc
abaaaaaccaaaaaaaaaaccccccccaccjjjooottttxxxxxxyyyyyyvvvqqnnneeecccc
abaaaccccaaaaaaaaaacccccccaaccjjjoootttxxxxxxxyyyyyyvvqqqnnneeecccc
SbcaaccccaaaaaaaaaaccccaaaaacajjjnnntttxxxxEzzzyyyyvvvrrqnnneeccccc
abcccccccaaaaaaaaaaacccaaaaaaaajjjnnntttxxxxyyyyyvvvvrrrnnneeeccccc
abcccccccaaaaaaaaaaacccccaaaaccjjjnnnnttttxxyyyyywvvrrrnnneeecccccc
abcccccccccaaaaaaccaccccaaaaaccciiinnnnttxxyyyyyyywwrrnnnneeecccccc
abccccccccccccaaacccccccaacaaaccciiinnnttxxyywwyyywwrrnnnffeccccccc
abccccccccccccaaacccccccaccaaaccciiinnnttwwwwwwwwwwwrrrnnfffccccccc
abccccccccccccccccccccccccccccccciiinnnttwwwwsswwwwwrrrnnfffccccccc
abaaaccaaccccccccccccccccccccccccciinnnttswwwssswwwwrrroofffacccccc
abaaccaaaaaacccccccccccccccccaaacciinnntssssssssssrrrrooofffacccccc
abaccccaaaaacccccccaaacccccccaaaaciinnnssssssmmssssrrrooofffacccccc
abaacaaaaaaacccccccaaaaccccccaaaaciiinmmmssmmmmmoosroooooffaaaacccc
abaaaaaaaaaaaccccccaaaaccccccaaacciiimmmmmmmmmmmoooooooofffaaaacccc
abcaaaaaaaaaaccccccaaaaccccccccccccihhmmmmmmmhggoooooooffffaaaccccc
abcccccaaacaccccccccaaccccccccccccchhhhhhhhhhhggggggggggffaaacccccc
abaccccaacccccccccccaaaccccccccccccchhhhhhhhhhgggggggggggcaaacccccc
abaaaccccaccccccccccaaaacccaacccccccchhhhhhhaaaaaggggggcccccccccccc
abaaaccccaaacaaaccccaaaacaaaacccccccccccccccaaaacccccccccccccccaaac
abaacccccaaaaaaaccccaaaaaaaaacccccccccccccccaaacccccccccccccccccaaa
abaaaccccaaaaaaccccaaaaaaaaccccccccccccccccccaacccccccccccccccccaaa
abccccccaaaaaaaaaaaaaaaaaaacccccccccccccccccaaccccccccccccccccaaaaa
abcccccaaaaaaaaaaaaaaaaaaaaacccccccccccccccccccccccccccccccccaaaaaa`;

console.log(advent_12_1(test_input));
