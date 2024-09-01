export function uniqueRandom(min: number, max: number, arrayOfNumbers: number[]): number {
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    for(let i = 0; i < arrayOfNumbers.length; i++){
        if(arrayOfNumbers[i] == random) {
            return uniqueRandom(min, max, arrayOfNumbers);
        }
    }
    return random;
}

export function removeFromArray(arr: any, value: number) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

export function getLastElement(string: string, character: string, defaultValue: string = ""): string {
    var ret = string.split(character)[string.split(character).length - 1];
    if(string.split(character).length == 3) {
        if(defaultValue != "") return defaultValue.split(character)[defaultValue.split(character).length - 1];
        return "";
    }
    return ret;
}