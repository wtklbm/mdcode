import { dirname, join, parse } from 'path';

import { printError } from '@curong/term';
import { isArrayHave } from '@curong/types';
import { mkdir, readlineStream, writeFile } from '@curong/fs';

import handleCodes from './common/handleCodes';

export default async function extract(pathString: string, projectName: string) {
    const mdLines = await readlineStream(pathString).catch(() => []);

    if (!isArrayHave(mdLines)) {
        return printError('[merge]: 在提取之前，文档必须要存在');
    }

    const { lines, codes } = await handleCodes(
        mdLines,
        async ({ path, head, codes, codeMap }) => {
            const content = codes.join('\n').trim();
            const v = { path, head, content };

            codeMap[path] = (codeMap[path] ?? []).concat(v);
        }
    );

    const write = async (pathName: string, content: string) => {
        const filePath = join(projectPath, pathName);

        await mkdir(dirname(filePath));
        await writeFile(filePath, content);
    };

    const { dir, name, ext } = parse(pathString);
    await writeFile(`${dir}/${name}_extract${ext}`, lines.join('\n'));
    const projectPath = join(dirname(pathString), projectName);

    for (const [_, v] of Object.entries(codes)) {
        if (v.length === 1) {
            const { path, content } = v[0];
            await write(path, content);

            continue;
        }

        for (let i = 0, len = v.length; i < len; i++) {
            const { path, content } = v[i];
            const { dir, name, ext } = parse(path);
            await write(join(dir, `${name}.[${i}]${ext}`), content);
        }
    }
}
