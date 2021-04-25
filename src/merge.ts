import { dirname, join, parse } from 'path';

import { printError } from '@curong/term';
import { isArrayHave } from '@curong/types';
import { isFile, readFile, readlineStream, writeFile } from '@curong/fs';

import handleCodes from './common/handleCodes';

export default async function merge(pathString: string, projectName: string) {
    const mdLines = await readlineStream(pathString).catch(() => []);

    if (!isArrayHave(mdLines)) {
        return printError('[merge]: 在合并之前，文档必须要存在');
    }

    const projectPath = join(dirname(pathString), projectName);
    let map: Record<string, number> = {};
    console.log(22, pathString);

    const lines = await handleCodes(
        mdLines,
        async ({ path, codes, newLines }) => {
            const { dir, name, ext } = parse(path);

            if (!map[path]) {
                map[path] = 0;
            }

            let nPath = join(dir, `${name}.[${map[path]++}]${ext}`);

            if (!(await isFile(nPath))) {
                nPath = path;
            }

            const content = await readFile(nPath).catch(() => null);

            if (content) {
                newLines.push('', content.trim());
            } else if (codes.length) {
                newLines.push(...codes);
            }
        },
        projectPath
    );

    const { dir, name, ext } = parse(pathString);

    await writeFile(join(dir, `${name}_merge${ext}`), lines.join('\n'));
}
