class ArrayUtility {

    constructor() {
        // this.name = name;
    }

    padArray(arr, len, fill) {
        return arr.concat(Array(len).fill(fill)).slice(0, len);
    }

}

export const arrayUtility = new ArrayUtility();