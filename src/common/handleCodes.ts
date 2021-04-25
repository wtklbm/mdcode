import { isZero } from '@curong/types';
import { join } from 'path';

import {
    codeTemplateStartReg,
    CODE_TAG,
    commentTitleReg,
    pathReg
} from '../constants';

export type CodeItem = {
    path: string;
    head: string;
    content: string;
};

export type Codes = CodeItem[];

export type CodeMap = Record<string, Codes>;
export type ExtractCallback = (extract: {
    path: string;
    head: string;
    codes: string[];
    codeMap: CodeMap;
}) => Promise<void>;

export type ExtractResult = { codes: CodeMap; lines: string[] };

export type MergeCallback = (merge: {
    path: string;
    codes: string[];
    newLines: string[];
}) => Promise<void>;

export default async function handleCodes(
    lines: string[],
    callback: ExtractCallback
): Promise<ExtractResult>;
export default async function handleCodes(
    lines: string[],
    callback: MergeCallback,
    projectPath: string
): Promise<string[]>;
export default async function handleCodes(
    lines: string[],
    callback: any,
    projectPath?: string
): Promise<any> {
    const codes: string[] = [];
    const newLines: string[] = [];
    const codeMap: CodeMap = {};

    let isCodeTemplate = false;

    for (let i = 0, len = lines.length, m; i < len; i++) {
        let line = lines[i];

        if (codeTemplateStartReg.test(line)) {
            isCodeTemplate = true;
            newLines.push(line);
            continue;
        } else if (line === CODE_TAG) {
            isCodeTemplate = false;

            if (isZero(codes.length)) {
                newLines.push(line);
                continue;
            }

            if (codes.length) {
                const head = codes.shift() as string;

                newLines.push(head);

                let path = head.trim().replace(commentTitleReg, '');

                if ((m = pathReg.exec(path))) {
                    path = m[0];

                    if (projectPath) {
                        path = join(projectPath, path);
                    }

                    await callback({
                        path: join('.', path).replace(/\\/g, '/'),
                        codeMap,
                        codes,
                        head,
                        newLines
                    });

                    pathReg.lastIndex = 0;
                } else {
                    newLines.push(...codes);
                }
            }

            newLines.push(line);
            codes.length = 0;
            continue;
        }

        if (isCodeTemplate) {
            codes.push(line);
            continue;
        }

        if (!line) {
            newLines.push(line);
            continue;
        }

        newLines.push(line);
    }

    if (codes.length) {
        newLines.push(...codes);
    }

    if (!projectPath) {
        return {
            lines: newLines,
            codes: codeMap
        };
    }

    return newLines;
}
