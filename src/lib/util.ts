
function delay(seconds: number) {
    let ms = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}