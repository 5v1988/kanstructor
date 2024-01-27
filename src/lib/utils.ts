import fs from 'fs'
import chalk from 'chalk';

export async function delay(seconds: number) {
    const ms = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const write = async (path: string, elements: string[]) => {
    const file = fs.createWriteStream(path);
    file.on('error', async (err) => {
        console.error(chalk.red('Error on writing the content to file: ', chalk.bold.bgWhite('%s'),
            'Error: %s'), path, err.message);
    });
    elements.forEach(function (element) { file.write(element + '\n'); });
    file.end();
    console.log(chalk.green('Saved the page contents to the file: ',
        chalk.white.bgBlue.bold('%s')), path);
}

export const writeToJson = async (jsonObject: any) => {
    fs.writeFileSync('results.json', JSON.stringify(jsonObject));
}

export const readSnapshot = async (path: string) => {
    return fs.readFileSync(path, { encoding: 'base64' })
}