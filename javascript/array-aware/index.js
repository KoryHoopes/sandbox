import { writeFile } from 'fs';
import { performance } from 'perf_hooks';

let sectors;

/**
 * Function that returns a 2 dimensional array where each cell is aware of its surrounding neighbors and its own position in the array.
 * @function    createMap
 * @param       {number}    dimension   This number will be the height and width of the 2 dimensional array
 * @param       {boolean}   flat        Set true if you want the array flattened into a 1 dimensional array
 * @param       {boolean}   saveFile    Set true if you want to save the array to a json file
 */
const createMap = function(dimension, flat, saveFile) {
    let count = 0,
        data = [],
        map;

    function findNeighbors(i) {
        const
            bottom = count + dimension < (dimension * dimension),
            left = count - 1 >= i * dimension,
            right = count + 1 < (i + 1) * dimension,
            top = count - dimension >= 0;

        return {
            bottom: bottom ? count + dimension : null,
            left: left ? count - 1 : null,
            right: right ? count + 1 : null,
            top: top ? count - dimension : null
        }
    }

    function saveMap(data) {
        writeFile(`map-${dimension * dimension}.json`, JSON.stringify(data), (err) => {
            if (err) throw err;
            console.log('JSON has been saved.');
        });
    }

    for (let i = 0; i < dimension; i += 1) {
        let row = [];

        for (let j = 0; j < dimension; j += 1) {
            row.push(
                {
                    id: count,
                    neighbors: findNeighbors(i),
                    position: {
                        x: j,
                        y: i,
                    }
                }
            );

            count += 1;
        }
        data.push(row);
    }

    if (flat) {
        map = [].concat(...data);
    } else {
        map = data;
    }

    if (saveFile) {
        saveMap(map);
    }

    sectors = dimension * dimension;

    return map;
};

const t0 = performance.now();
const map = createMap(4, true, true);
const t1 = performance.now();

console.log(`Map with ${sectors} sectors created in ${t1 - t0} milliseconds.`);
console.log(map[15]);