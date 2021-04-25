module.exports = {
    // 单行语句最大宽度
    printWidth: 80,
    // 代码缩进的宽度
    tabWidth: 4,
    // `tab` 还是空格
    useTabs: false,
    // 添加语句末尾的分号
    semi: true,
    // 单引号还是双引号
    singleQuote: true,
    // 在 `JSX` 中使用单引号
    jsxSingleQuote: false,
    // 尾随逗号
    trailingComma: "none",
    // 对象的大括号左右添加空格
    bracketSpacing: true,
    // 将 `JSX` 元素的闭合标签放在最后一行的末尾
    jsxBracketSameLine: false,
    // 只有一个参数的箭头函数是否包裹小括号
    arrowParens: "avoid",
    // 缩进 `Vue` 的 `script` 和 `style` 标签
    vueIndentScriptAndStyle: false,
    // `as-needed`  - 仅在需要时在对象属性周围添加引号。
    // `consistent` - 如果对象中至少有一个属性需要用引号引起来，请用所有引号引起来。
    // `preserve`   - 尊重对象属性中引号的输入使用。
    quoteProps: "as-needed",
    // `HTML` 文件的全局空格敏感度
    // `css`    - 遵守 CSS `display` 属性的默认值
    // `strict` - 空白被认为是敏感的
    // `ignore` - 空白被认为是不敏感的
    htmlWhitespaceSensitivity: "css",
    // 行结束符
    //
    // `auto` - 维持现有的行尾 (通过查看第一行后的内容对一个文件中的混合值进行归一化)
    // `lf`   - 仅 `\n` 换行，在 `Linux` 和 `macOS` 以及 `git repos` 内部通用
    // `crlf` - 回车符+换行符 (`\r\n`)，在Windows上很常见
    // `cr`   - 仅回车符 (\r)，很少使用
    endOfLine: 'lf',
};
