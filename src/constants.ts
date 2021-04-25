/** 验证示例代码开头的正则表达式 */
export const codeTemplateStartReg = /^`{3} ?({[^}]+}|[-a-z]+)$/i;

/** 示例代码标签 */
export const CODE_TAG = '```';

/** 验证文档注释头的正则表达式 */
export const commentTitleReg = /^(\/{2}[/!]? ?|# )/;

export const pathReg = /^(?:([\\/]|\$[-a-z0-9_]+:)?[-a-z0-9]+|[.]{1,2}|[a-z]+:[\\/]?)(?:[/\\][-a-z0-9+&@#%?=~_|!:,;.]+)+([a-z0-9]|[\\/])/gi;

export const ignoreFiles = new Set(
    ['.gitignore', 'LICENSE', 'package-lock.json'].map(v => v.toLowerCase())
);

export const ignoreReg = /^(dist|.git|.idea|.DS_Store|node_modules)[\\/]/;
