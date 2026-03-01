export function filterByRange(matrix, range) {
    //Filter formatted matrix (containing timestamped elements) according to cutoff date
    let cutoffLow = new Date(range[0], 0, 1).getTime();
    let cutoffHigh = new Date(range[1], 11, 31).getTime();
    matrix = matrix.filter(item => item.timestamp >= cutoffLow);
    matrix = matrix.filter(item => item.timestamp <= cutoffHigh);
    return matrix;
}