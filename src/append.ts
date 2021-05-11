import { extname, basename, relative } from 'path';

import { isNotZero } from '@curong/types';
import { fileList, readFile, writeFile } from '@curong/fs';

import { CODE_TAG, ignoreFiles, ignoreReg } from './constants';

const getExtFullName = (ext: string) => {
    switch (ext) {
        case 'js':
            return 'javascript';

        case 'ts':
            return 'typescript';

        case 'rs':
            return 'rust';

        case 'py':
            return 'python';

        case 'sh':
            return 'bash';

        default:
            return ext;
    }
};

const getWrapperBox = (ext: string, path: string) => {
    switch (ext) {
        case 'css':
            return `/* ${path} */`;

        case 'html':
            return `<!-- ${path} -->`;

        case 'py':
        case 'sh':
            return `# ${path}`;

        default:
            return `// ${path}`;
    }
};

const appendCodeTemplate = (value: string, relativePath: string) => {
    relativePath = relativePath.replace(/\\/g, '/');

    const ext = extname(relativePath).slice(1).toLowerCase();
    const e = getExtFullName(ext);
    const p = getWrapperBox(ext, relativePath);

    return `\n\n${CODE_TAG}${e}\n${p}\n\n${value}\n${CODE_TAG}\n\n`;
};

export default async function append(mdPath: string, projectPath: string) {
    const codes: string[] = [];
    const files = await fileList(projectPath);

    for (let i = 0, len = files.length; i < len; i++) {
        const filePath = files[i];
        const content = (await readFile(filePath)).trim();
        const relativePath = relative(projectPath, filePath);

        if (
            ignoreReg.test(relativePath) ||
            ignoreFiles.has(basename(relativePath.toLowerCase()))
        ) {
            continue;
        }

        if (isNotZero(content.length)) {
            codes.push(appendCodeTemplate(content, relativePath));
        }
    }

    const body = (await readFile(mdPath).catch(() => '')).trimEnd();
    const content = body + codes.join('\n');

    await writeFile(mdPath, content);
}
