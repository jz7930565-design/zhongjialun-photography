const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const project = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(project, 'app/page.tsx'), 'utf8');
const data = new Function(source.slice(source.indexOf('const photographs'), source.indexOf('export default')) + '; return { photographs, caseIndexes, collections, selected };')();

function createPage() {
  const state = [];
  let cursor = 0;
  let copied = '';
  const hooks = {
    useState(initial) {
      const slot = cursor++;
      if (!(slot in state)) state[slot] = typeof initial === 'function' ? initial() : initial;
      return [state[slot], (value) => { state[slot] = typeof value === 'function' ? value(state[slot]) : value; }];
    },
    useRef(initial) {
      const slot = cursor++;
      if (!(slot in state)) state[slot] = { current: initial };
      return state[slot];
    },
    useEffect() {},
  };
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: module.exports,
    module,
    require: (name) => name === 'react' ? hooks : require(name),
    document: { activeElement: { focus() {} }, body: { style: {} } },
    navigator: { clipboard: { writeText: async (text) => { copied = text; } } },
  });
  return {
    render() { cursor = 0; return module.exports.default(); },
    copied: () => copied,
  };
}
function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== 'object') return [];
  return [node, ...elements(node.props?.children)];
}
function text(node) {
  if (Array.isArray(node)) return node.map(text).join('');
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node !== 'object') return String(node);
  return text(node.props?.children);
}
function find(tree, predicate) {
  const result = elements(tree).find(predicate);
  assert.ok(result, 'Expected element exists');
  return result;
}

test('all 25 works remain accessible; the confirmed case is exactly 01, 02, 13, 15', () => {
  assert.deepEqual(data.caseIndexes, [0, 1, 12, 14]);
  assert.equal(data.photographs.length, 25);
  const grouped = data.collections.flatMap((group) => group.indexes);
  assert.equal(grouped.length, 25);
  assert.equal(new Set(grouped).size, 25);
  const additional = grouped.filter((index) => !data.selected.includes(index));
  assert.equal(additional.length, 19);
  for (const photo of data.photographs) assert.ok(fs.existsSync(path.join(project, 'public', photo.src)));
});

test('case lightbox cycles within its four photographs and resets on another gallery', () => {
  const page = createPage();
  let tree = page.render();
  find(tree, (node) => node.props?.className === 'case-frame case-frame-14').props.onClick();
  tree = page.render();
  assert.match(text(find(tree, (node) => node.type === 'figcaption')), /04 \/ 4 · 作品 15/);
  find(tree, (node) => node.props?.['aria-label'] === '下一张').props.onClick();
  tree = page.render();
  assert.match(text(find(tree, (node) => node.type === 'figcaption')), /01 \/ 4 · 作品 01/);
  find(tree, (node) => node.props?.['aria-label'] === '上一张').props.onClick();
  tree = page.render();
  assert.match(text(find(tree, (node) => node.type === 'figcaption')), /04 \/ 4 · 作品 15/);
  find(tree, (node) => node.props?.className === 'lightbox-close').props.onClick();
  tree = page.render();
  find(tree, (node) => node.type === 'button' && node.props?.['aria-label'] === '放大查看：粉紫晚霞下坐在江边的两个人').props.onClick();
  tree = page.render();
  assert.match(text(find(tree, (node) => node.type === 'figcaption')), /01 \/ 5 · 作品 21/);
  const dialog = find(tree, (node) => node.type === 'dialog');
  assert.equal(elements(dialog).filter((node) => node.type === 'a' && node.props?.href === '#contact').length, 0);
});

test('case reference, filled fields, clipboard and email share the same inquiry', async () => {
  const page = createPage();
  let tree = page.render();
  find(tree, (node) => node.type === 'a' && text(node).includes('喜欢这一组？')).props.onClick();
  tree = page.render();
  const input = find(tree, (node) => node.type === 'input' && node.props?.placeholder === '你想在哪里拍');
  input.props.onChange({ target: { value: '杭州' } });
  tree = page.render();
  const message = find(tree, (node) => node.props?.['aria-label'] === '整理好的咨询文字').props.value;
  assert.match(message, /古建与落日 · 01 \/ 02 \/ 13 \/ 15/);
  assert.match(message, /杭州/);
  const mail = find(tree, (node) => node.props?.className === 'inquiry-email');
  assert.equal(new URL(mail.props.href).searchParams.get('body'), message);
  await find(tree, (node) => node.props?.className === 'button inquiry-copy').props.onClick();
  assert.equal(page.copied(), message);
  tree = page.render();
  assert.match(text(find(tree, (node) => node.props?.className === 'copy-status')), /已复制/);
  find(tree, (node) => node.type === 'button' && text(node).startsWith('自然写真')).props.onClick();
  tree = page.render();
  const changed = find(tree, (node) => node.props?.['aria-label'] === '整理好的咨询文字').props.value;
  assert.match(changed, /自然写真/);
  assert.doesNotMatch(changed, /古建与落日/);
  assert.match(changed, /杭州/);
  assert.equal(text(find(tree, (node) => node.props?.className === 'copy-status')).includes('已复制'), false);
});
