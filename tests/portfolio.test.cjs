const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const project = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(project, 'app/page.tsx'), 'utf8');
const data = new Function(source.slice(source.indexOf('const photographs'), source.indexOf('export default')) + '; return { photographs, caseIndexes, collections, selected, directions };')();

function createPage(options = {}) {
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
    navigator: { userAgent: options.userAgent || 'Windows', platform: options.platform || 'Win32', maxTouchPoints: options.maxTouchPoints || 0, clipboard: { writeText: async (text) => { if (options.clipboardFails) throw new Error('Clipboard denied'); copied = text; } } },
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

test('QQ click uses the confirmed number on desktop, phones and iPad without sending messages', () => {
  for (const options of [{}, { userAgent: 'Android' }, { userAgent: 'iPhone' }, { platform: 'MacIntel', maxTouchPoints: 5 }]) {
    const page = createPage(options);
    const link = find(page.render(), n => n.props?.className === 'button qq-open');
    const event = { currentTarget: { href: link.props.href } };
    link.props.onClick(event);
    const target = new URL(event.currentTarget.href);
    assert.equal(target.searchParams.get('uin'), '3315466882');
    assert.equal(target.protocol, Object.keys(options).length ? 'mqqwpa:' : 'tencent:');
    assert.equal(target.searchParams.has('text'), false);
    assert.match(text(find(page.render(), n => n.props?.className === 'qq-status')), /尝试打开/);
  }
});

test('QQ number copying reports success and failure honestly', async () => {
  for (const clipboardFails of [false, true]) {
    const page = createPage({ clipboardFails });
    await find(page.render(), n => n.type === 'button' && text(n) === '复制号码').props.onClick();
    const status = text(find(page.render(), n => n.props?.className === 'qq-status'));
    assert.match(status, clipboardFails ? /自动复制不可用/ : /QQ 号已复制/);
    assert.equal(page.copied(), clipboardFails ? '' : '3315466882');
  }
});

test('requested cover and experience replacements use the selected existing photographs', () => {
  const page = createPage();
  const tree = page.render();
  const cover = find(tree, n => n.props?.['aria-label'] === '浏览系列：朱衣入画');
  assert.equal(find(cover, n => n.type === 'img').props.src, './work/collection-27.webp');
  const experience = find(tree, n => n.props?.className === 'experience-photo');
  assert.equal(find(experience, n => n.type === 'img').props.src, './work/dream-umbrella.webp');
  assert.match(text(experience), /伞下清风/);
});

test('contact sheets open the exact frame without leaving its series', () => {
  for (const series of data.directions) {
    const page = createPage();
    for (let position = 0; position < series.indexes.length; position++) {
      find(page.render(), n => n.props?.['aria-label'] === `预览${series.title}第${position + 1}张`).props.onClick();
      const dialog = find(page.render(), n => n.type === 'dialog');
      assert.equal(find(dialog, n => n.type === 'img').props.src, data.photographs[series.indexes[position]].src);
      assert.match(text(dialog), new RegExp(series.title));
    }
  }
});

test('all six service steps remain available in native disclosures', () => {
  const journey = find(createPage().render(), n => n.props?.className === 'service-steps');
  const disclosures = elements(journey).filter(n => n.type === 'details');
  assert.equal(disclosures.length, 6);
  assert.equal(disclosures[0].props.open, true);
  for (const disclosure of disclosures) {
    assert.ok(find(disclosure, n => n.type === 'summary'));
    assert.match(text(disclosure), /你可以准备/);
    assert.match(text(disclosure), /一起确认/);
  }
});

test('all 40 works remain accessible; the confirmed case is exactly 01, 02, 13, 15', () => {
  assert.deepEqual(data.caseIndexes, [0, 1, 12, 14]);
  assert.equal(data.photographs.length, 40);
  const grouped = data.collections.flatMap((group) => group.indexes);
  assert.equal(grouped.length, 40);
  assert.equal(new Set(grouped).size, 40);
  const additional = grouped.filter((index) => !data.selected.includes(index));
  assert.equal(additional.length, 15);
  for (const photo of data.photographs) assert.ok(fs.existsSync(path.join(project, 'public', photo.src)));
});

test('four series have complete unique sequences and carry their title into inquiries', () => {
  assert.deepEqual(data.directions.map(s => s.indexes.length), [4, 5, 7, 5]);
  assert.equal(new Set(data.directions.flatMap(s => s.indexes)).size, 21);
  for (const series of data.directions) {
    const page = createPage();
    let tree = page.render();
    find(tree, n => n.props?.['aria-label'] === `浏览系列：${series.title}`).props.onClick();
    for (let i = 0; i < series.indexes.length + 1; i++) {
      tree = page.render();
      const dialog = find(tree, n => n.type === 'dialog');
      assert.equal(find(dialog, n => n.type === 'img').props.src, data.photographs[series.indexes[i % series.indexes.length]].src);
      find(dialog, n => n.props?.['aria-label'] === '下一张').props.onClick();
    }
    tree = page.render();
    const dialog = find(tree, n => n.type === 'dialog');
    find(dialog, n => n.type === 'a' && n.props?.href === '#contact').props.onClick();
    tree = page.render();
    const message = find(tree, n => n.props?.['aria-label'] === '整理好的咨询文字').props.value;
    assert.ok(message.includes(`参考作品：${series.title}`));
    assert.ok(message.includes(series.style));
  }
});

test('saved series can be toggled and appear once in the consultation draft', () => {
  const page = createPage();
  let tree = page.render();
  const buttons = elements(tree).filter(n => n.props?.className === 'save-series');
  assert.equal(buttons.length, 4);
  buttons[0].props.onClick();
  tree = page.render();
  assert.match(text(find(tree, n => n.props?.className === 'inspiration-tray')), /已收藏 1 组/);
  assert.match(find(tree, n => n.props?.['aria-label'] === '整理好的咨询文字').props.value, /参考作品：庭院寻春/);
  elements(tree).filter(n => n.props?.className === 'save-series')[1].props.onClick();
  tree = page.render();
  assert.match(find(tree, n => n.props?.['aria-label'] === '整理好的咨询文字').props.value, /庭院寻春、朱衣入画/);
  elements(tree).filter(n => n.props?.className === 'save-series')[0].props.onClick();
  tree = page.render();
  assert.match(find(tree, n => n.props?.['aria-label'] === '整理好的咨询文字').props.value, /参考作品：朱衣入画/);
  assert.doesNotMatch(find(tree, n => n.props?.['aria-label'] === '整理好的咨询文字').props.value, /庭院寻春/);
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
