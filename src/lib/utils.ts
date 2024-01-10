
export async function delay(seconds: number) {
    const ms = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}