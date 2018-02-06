class ArrayUtility {

    constructor() {
        // this.name = name;
    }

    padArray(arr, len, fill) {
        return arr.concat(Array(len).fill(fill)).slice(0, len);
    }

    chunkArray(arr, chunkSize) {
        var i, j, tmp = [];
        for (i = 0, j = arr.length; i < j; i += chunkSize) {
          tmp.push(arr.slice(i, i + chunkSize));
        }
        return tmp;
    }

}

export const arrayUtility = new ArrayUtility();