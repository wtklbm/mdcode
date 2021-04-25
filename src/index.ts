#!/usr/bin/env node

import { join, isAbsolute, parse } from 'path';

import { isDir, mkdir } from '@curong/fs';
import { printInfo } from '@curong/term';

import merge from './merge';
import append from './append';
import extract from './extract';

const helps = [
    '帮助:',
    '',
    '  提取已有文档中的代码到新的项目：',
    '    mdcode extract <mdPath> <projectPath>',
    '  合并新项目中的代码到已有文档：',
    '    mdcode merge <mdPath> <projectPath>',
    '  将新项目中的代码追加到文档：',
    '    mdcode append <mdPath> <projectPath>'
];

async function main() {
    const cwd = process.cwd();
    let [, , cmd, mdPath, projectPath = '.'] = process.argv;

    if (!cmd) {
        return printInfo(helps.join('\n'));
    }

    if (!isAbsolute(projectPath)) {
        projectPath = join(cwd, projectPath);
    }

    const { base: projectName } = parse(projectPath);

    if (!mdPath) {
        mdPath = join(cwd, `${projectName}.md`);
    } else if (!isAbsolute(mdPath)) {
        mdPath = join(cwd, mdPath);
    }

    if (!(await isDir(projectPath))) {
        await mkdir(projectPath);
    }

    switch (cmd.toLowerCase()) {
        case 'e':
        case 'extract':
            await extract(mdPath, projectName);
            break;

        case 'm':
        case 'merge':
            await merge(mdPath, projectName);
            break;

        case 'a':
        case 'append':
            await append(mdPath, projectPath);
            break;

        default:
            return console.log(helps.join('\n '));
    }
}

main().then(console.log, console.error);
