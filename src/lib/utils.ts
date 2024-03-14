import fs from 'fs'
import chalk from 'chalk';
import { Report } from '../core/types/report.types';

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

export const generateJsonReport = async (path: string, reportObj: Report[]) => {
    fs.writeFileSync(path, JSON.stringify(reportObj));
}

export const readSnapshot = async (path: string) => {
    return fs.readFileSync(path, { encoding: 'base64' })
}

export const resolveValue = async (value: string) => {
    const pattern: RegExp = /\${([^}]+)}|\$([^$\s]+)/g;
    const matches: string[] = [];
    let match;
    while ((match = pattern.exec(value)) !== null) {
        matches.push(match[1] || match[2]);
    }
    return matches[0];
}