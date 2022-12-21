function parse(input) {
    const circles = input.split('\n')
        .map(line => line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/))
        .map(match => { 
            const circle = { 
                sensor: { x: Number(match[1]), y: Number(match[2]) }, 
                beacon: { x: Number(match[3]), y: Number(match[4]) }
            };

            circle.radius = Math.abs(circle.beacon.x - circle.sensor.x) + Math.abs(circle.beacon.y - circle.sensor.y);
            circle.x_borders = { min: circle.sensor.x - circle.radius, max: circle.radius + circle.sensor.x };
            circle.y_borders = { min: circle.sensor.y - circle.radius, max: circle.radius + circle.sensor.y };

            circle.contains_ignore_beacon = function(x, y) {
                if (x == this.beacon.x && y == this.beacon.y) {
                    return false;
                }
                
                return Math.abs(this.sensor.x - x) + Math.abs(this.sensor.y - y) <= this.radius;
            }

            circle.contains = function(x, y) {
                return Math.abs(this.sensor.x - x) + Math.abs(this.sensor.y - y) <= this.radius;
            }

            return circle;
        });

    const limits = { left: Math.min(... circles.map(c => c.x_borders.min )), right: Math.max(... circles.map(c => c.x_borders.max )) };

    return [circles, limits];
}

function advent_15_1(input) {
    const [circles, limits] = parse(input);

    let count = 0;
    for (let x = limits.left; x <= limits.right; ++x) {
        if (circles.some(c => c.contains_ignore_beacon(x, 2000000))) count ++;
    }

    return count;
}

function get_outer_circle(circle) {
    let clone = JSON.parse(JSON.stringify(circle));

    clone.radius++;
    clone.x_borders = { min: clone.sensor.x - clone.radius, max: clone.radius + clone.sensor.x };
    clone.y_borders = { min: clone.sensor.y - clone.radius, max: clone.radius + clone.sensor.y };

    return clone;
}

function get_perimeter_points(circle) {
    let result = [];

    let x = circle.sensor.x;
    let y = circle.sensor.y;

    for (let i = circle.radius; i >= -circle.radius; --i) {
        result.push([ x + i, y - (circle.radius - i)]);
        result.push([ x + i, y + (circle.radius - i)]);
    }

    return result;
}

function find_beacon(circles, limit) {
    // Inspired from https://www.reddit.com/r/adventofcode/comments/zmtpwz/comment/j0d4ub2/?utm_source=share&utm_medium=web2x&context=3
    // We have to reduce the amount of points to check. 
    // There is only one point to find. This point must be in the group "circles rounding the scopes of the sensors"
    let outer_circles = circles.map(get_outer_circle);

    for (const circle of outer_circles) {
        const points = get_perimeter_points(circle)
            .filter(point => point[0] >= 0 && point[0] <= limit && point[1] >= 0 && point[1] <= limit);
        for (const point of points) {
            if (circles.some(c => c.contains(point[0], point[1], false))) {
                continue;
            }
    
            return point;
        }
    }

    return null;
}

function advent_15_2(input) {
    const [circles, limits] = parse(input);
    const limit = 4000000;

    const result = find_beacon(circles, limit);

    return result[0] * 4000000 + result[1];
}

// https://adventofcode.com/2022/day/15/input
// console.log(advent_15_1(input));
// console.log(advent_15_2(input));
