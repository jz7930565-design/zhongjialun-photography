"use client";

import { useEffect, useRef, useState } from "react";

const photographs = [
  { src: "./work/portrait-01.webp", alt: "夕阳下行走的汉服少女" },
  { src: "./work/portrait-02.webp", alt: "古建筑前的双人汉服肖像" },
  { src: "./work/portrait-03.webp", alt: "宫门前的蓝色汉服少女" },
  { src: "./work/portrait-04.webp", alt: "建筑中轴线上的持伞少女" },
  { src: "./work/portrait-05.webp", alt: "红灯笼前的粉色汉服少女" },
  { src: "./work/portrait-06.webp", alt: "山石旁读书的红衣少年" },
  { src: "./work/portrait-07.webp", alt: "古建筑栏杆旁的粉衣少女" },
  { src: "./work/portrait-08.webp", alt: "草地边共读画卷的少年少女" },
  { src: "./work/portrait-09.webp", alt: "书案前小憩的蓝衣少女" },
  { src: "./work/portrait-10.webp", alt: "竹林中撑伞的蓝衣少女" },
  { src: "./work/portrait-11.webp", alt: "红色书法布景中的汉服人像" },
  { src: "./work/portrait-12.webp", alt: "书案前阅读的蓝衣少年" },
  { src: "./work/portrait-13.webp", alt: "宫殿前的侠客人物肖像" },
  { src: "./work/portrait-14.webp", alt: "古建筑前撑伞的粉衣少女" },
  { src: "./work/collection-15.webp", alt: "夕阳中相对而立的双人汉服剪影" },
  { src: "./work/collection-16.webp", alt: "蓝天下抬手遮光的白衣人像" },
  { src: "./work/collection-17.webp", alt: "草丛中仰望飞机的白衣背影" },
  { src: "./work/collection-18.webp", alt: "蓝天堤岸上回头的白衣人像" },
  { src: "./work/collection-19.webp", alt: "草丛与蓝天之间的白衣侧脸" },
  { src: "./work/collection-20.webp", alt: "墙边抬袖的红衣汉服侧脸" },
  { src: "./work/collection-21.webp", alt: "粉紫晚霞下坐在江边的两个人" },
  { src: "./work/collection-22.webp", alt: "水边看手机的人物街拍" },
  { src: "./work/collection-23.webp", alt: "金色落日下坐在江边的人物剪影" },
  { src: "./work/collection-24.webp", alt: "花树下坐着的两个人与吉他" },
  { src: "./work/collection-25.webp", alt: "堤岸上骑车与步行的人物瞬间" },
];

const directions = [
  { index: 19, title: "入画", english: "INTO THE SCENE", category: "汉服写真 · 东方意境", description: "从衣袖到视线，把喜欢的东方意境，变成适合你的画面。", style: "汉服写真", bookable: true },
  { index: 18, title: "自在", english: "A MOMENT OF YOUR OWN", category: "自然写真 · 日常穿搭", description: "不一定要盛装。蓝天、草木和简单的衣服，也可以留下你的样子。", style: "自然写真", bookable: true },
  { index: 20, title: "日常", english: "LIFE AS IT HAPPENS", category: "街头观察 · 非预约客片", description: "江边的晚霞、树下的停留、擦肩的瞬间。记录生活里没有排练的画面。", style: "", bookable: false },
];
const selected = directions.map((direction) => direction.index);
const streetIndexes = [20, 23, 22, 24, 21];
const collections = [
  { id: "hanfu", title: "汉服写真", note: "古建、竹林与人物光影", indexes: [19, 14, 13, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { id: "natural", title: "自然写真", note: "蓝天、草木与日常穿搭", indexes: [18, 17, 15, 16] },
  { id: "street", title: "街头观察", note: "个人观察记录，非预约客片", indexes: streetIndexes },
];
const inquiryStyles = ["汉服写真", "古建东方意境", "竹林自然光影", "浓烈色彩汉服", "自然写真", "还没想好，想聊聊"];
const preparations = [
  { title: "先了解你，而不是先套风格。", text: "聊聊你喜欢的照片、想留下的感觉，以及不喜欢的角度和动作，再确定准备的方向。" },
  { title: "研究地点，也想好怎么构图。", text: "提前看场景和可用角度，考虑人物放在哪里、画面怎么取舍，让地点为你服务。" },
  { title: "准备姿势，更准备怎么引导。", text: "整理适合的动作参考，想好怎样拆成转身、视线、手的位置等小步骤，不用你自己猜怎么摆。" },
  { title: "到了现场，按你的状态调整。", text: "参考只是起点。根据现场光线和你的感受调整动作与角度，不舒服、不喜欢，都可以直接说。" },
];
const process = [
  { title: "聊一聊你想拍的自己", phase: "初次沟通", text: "先聊你喜欢什么、不喜欢什么，以及为什么想拍这组照片。参考图可以帮助沟通，不需要提前确定一套风格，也不用把自己套进别人的样子。", you: "拍摄人数、意向日期和预算；喜欢的参考图、想避开的风格或拍摄顾虑，也可以一起说。", confirm: "拍摄类型、城市与可选场景。" },
  { title: "把拍摄内容说清楚", phase: "方案与预约", text: "先明确一场拍摄包含什么，再安排档期。拍摄、妆造、服装和场地需要分别确认，避免到了现场才发现理解不同。", you: "选择拍摄方向，说明服装、妆造与出行需求。", confirm: "总费用、时长、服装套数、精修张数，以及预约和改期规则。" },
  { title: "把想法变成拍摄准备", phase: "拍摄前", text: "根据沟通的方向，我会研究地点、构图和姿势，整理动作参考，提前想好如何引导你完成。再一起确认服装搭配、集合信息与外景备选安排。", you: "反馈参考图中喜欢和不喜欢的部分；核对服装与随身物品，不用背姿势。", confirm: "画面方向、地点与时间、妆造服装安排，以及天气备选方案。" },
  { title: "从简单的动作开始", phase: "拍摄当天", text: "不用一开始就进入状态。我会从走动、转身、调整视线等简单动作开始引导，再根据你的感受和现场条件调整。参考姿势不必一模一样，舒服、适合你更重要。", you: "按约定到场，有不舒服或不喜欢的角度及时说出来。", confirm: "当天拍摄顺序、人物状态与画面方向。" },
  { title: "选出你真正喜欢的照片", phase: "选片与精修", text: "选片时兼顾表情、姿态与整组照片的变化。精修前说明肤色、皮肤质感和身形调整偏好，让处理方向更明确。", you: "反馈喜欢的照片与修图偏好，集中整理修改意见。", confirm: "选片方式、精修范围、加修费用与可修改次数。" },
  { title: "收好这一次的记忆", phase: "成片交付", text: "交付前核对文件、数量与版本。需要打印或用于社交平台，可以在沟通时说明，提前确认对应的尺寸与格式。", you: "收到后检查文件是否完整，并及时下载和备份。", confirm: "交付日期、文件规格、底片范围和文件保留时间。" },
];
const questions = [
  ["没有拍摄经验，会不会很僵硬？", "不用提前学会摆姿势。我会准备动作参考，想好怎样拆成视线、转身和手的位置等小步骤，再在现场引导。你不需要照着参考硬摆；感到僵硬或不舒服，可以随时告诉我，一起调整。"],
  ["妆造、服装和场地都包含吗？", "需要按具体方案分别确认。预约前请确认妆造由谁安排、服装是否自备或租赁、门票和场地费用由谁承担，不把这些项目默认计入拍摄报价。"],
  ["能拿到多少照片，多久交付？", "精修张数、底片是否交付、选片时间和最终交付日期，需要在预约时确认。加修、加急或打印需求也请提前提出，确认能否安排及相应费用。"],
  ["下雨、迟到或临时有事怎么办？", "外景拍摄应提前沟通天气备选方案。遇到情况请尽早联系，是否改期、档期如何调整，以及已产生费用的处理方式，以预约时确认的安排为准。"],
  ["精修到什么程度？不满意可以改吗？", "可以先说明你对皮肤纹理、肤色与身形调整的偏好，再确认精修范围。修改次数、反馈时间与额外修改费用需要提前约定，避免双方对“精修”的理解不同。"],
  ["我的照片会被公开展示吗？", "请在预约时说明你对公开展示的接受范围，例如是否允许露脸、是否允许用于作品集。展示用途与授权范围需要单独确认；有不公开的要求，也请明确提出。"],
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chosenStyle, setChosenStyle] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const inquiryMessage = `你好，我在你的网站看了作品，想咨询${chosenStyle && chosenStyle !== "还没想好，想聊聊" ? "「" + chosenStyle + "」风格的" : "一组"}拍摄。\n意向日期：\n拍摄城市 / 人数：\n预算范围：\n妆造服装需求：\n喜欢或想避开的风格（选填）：\n拍摄顾虑（选填）：\n想一起找适合我的拍摄方向，了解方案和报价。`;
  const openPhoto = (index: number) => {
    returnFocus.current = document.activeElement as HTMLElement;
    setActiveIndex(index);
  };
  const closePhoto = () => {
    dialogRef.current?.close();
    setActiveIndex(null);
    returnFocus.current?.focus();
  };
  const movePhoto = (direction: number) => setActiveIndex((index) => index === null ? null : (index + direction + photographs.length) % photographs.length);
  const chooseStyle = (style: string) => { setChosenStyle(style); setCopyStatus(""); };
  useEffect(() => {
    if (activeIndex === null) return;
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activeIndex]);
  const copyInquiry = async () => {
    try {
      await navigator.clipboard.writeText(inquiryMessage);
      setCopyStatus("已复制。粘贴到聊天中，补充信息后发送给我即可。");
    } catch {
      setCopyStatus("自动复制不可用，请长按或选中下方文字复制。");
    }
  };

  return (
    <main>
      <a className="skip-link" href="#works">跳到摄影作品</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="钟家伦摄影，回到顶部"><strong>钟家伦<span className="brand-dot">.</span></strong><span>JIALUN / PHOTOGRAPHY</span></a>
        <nav aria-label="主导航"><a href="#works">摄影作品</a><a href="#experience">拍摄体验</a><a href="#process">拍摄流程</a><a className="nav-contact" href="#contact">聊聊拍摄 <span aria-hidden="true">↗</span></a></nav>
      </header>

      <section className="cover" id="top">
        <img className="cover-photo" src={photographs[0].src} alt={photographs[0].alt} fetchPriority="high" />
        <div className="cover-top"><span>汉服写真 · 自然写真</span><button type="button" onClick={() => openPhoto(0)}>查看原幅 ↗</button></div>
        <div className="cover-bottom"><div><p className="cover-kicker">A PORTRAIT. A STORY.</p><h1>让此刻，<br /><span>成为故事。</span></h1><p className="cover-description">不用提前学会摆姿势，从简单的动作开始。</p></div><a className="cover-inquiry" href="#contact"><span>聊聊我的拍摄</span><span aria-hidden="true">↗</span></a></div>
        <div className="cover-foot"><span>钟家伦 / PHOTOGRAPHY</span><a href="#works">向下，寻找你的风格 ↓</a></div>
      </section>

      <section className="works section" id="works">
        <div className="section-label"><span>01 / SELECTED STORIES</span><span>摄影作品选集</span></div>
        <div className="works-heading"><h2>哪一种画面，<br /><span>让你想成为主角？</span></h2><p>从一张喜欢的照片开始。<br />选一个方向，我们再聊怎么拍得适合你。</p></div>
        <div className="editorial-grid">
          {directions.map((direction, order) => <article className={`story story-${order + 1}`} key={direction.index}>
            <button type="button" className="story-photo" onClick={() => openPhoto(direction.index)} aria-label={`放大查看：${photographs[direction.index].alt}`}>
              <img src={photographs[direction.index].src} alt={photographs[direction.index].alt} loading="lazy" />
              <span className="photo-open" aria-hidden="true">查看原幅 ↗</span>
            </button>
            <div className="story-info"><div className="story-title"><span className="story-number">0{order + 1}</span><h3>{direction.title}</h3><span className="story-english">{direction.english}</span></div><div className="story-description"><p className="story-category">{direction.category}</p><p>{direction.description}</p>{direction.bookable ? <a className="underlined-link" href="#contact" onClick={() => chooseStyle(direction.style)}>我想拍这种风格 <span aria-hidden="true">↗</span></a> : <a className="underlined-link" href="#archive-street" onClick={() => { const gallery = document.getElementById("archive-street") as HTMLDetailsElement | null; if (gallery) gallery.open = true; }}>看更多街头观察 <span aria-hidden="true">↗</span></a>}</div></div>
          </article>)}
        </div>
        <div className="collection-heading"><h3>按作品类型，继续看。</h3><p>共 {photographs.length} 张作品 · 下方收录精选之外的照片</p></div>
        {collections.map((collection) => {
          const remaining = collection.indexes.filter((index) => !selected.includes(index));
          return <details className="archive collection-archive" id={`archive-${collection.id}`} key={collection.id}>
            <summary><span>{collection.title}<small> / 展开其余 {remaining.length} 张 · {collection.note}</small></span><span className="plus" aria-hidden="true">＋</span></summary>
            <div className="archive-grid">{remaining.map((index) => <button className="archive-photo" key={photographs[index].src} onClick={() => openPhoto(index)} type="button" aria-label={`放大查看：${photographs[index].alt}`}><img src={photographs[index].src} alt={photographs[index].alt} loading="lazy" /><span>{String(index + 1).padStart(2, "0")} / {photographs[index].alt}</span></button>)}</div>
          </details>;
        })}
      </section>

      <section className="experience" id="experience">
        <div className="experience-photo"><img src={photographs[8].src} alt={photographs[8].alt} loading="lazy" /><span>小憩 / 人物摄影作品</span></div>
        <div className="experience-copy"><p className="section-label">02 / BEFORE THE CAMERA</p><h2>在你来到<br />镜头前，<br /><em>准备先开始。</em></h2><p className="experience-lead">我是钟家伦。先了解你的喜好，再研究地点、构图和动作，想好怎么引导你。你不需要独自琢磨“到了现场该怎么拍”。</p>
          <div className="care-list">{preparations.map((item, index) => <div key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div>
          <a className="underlined-link" href="#contact">一起找适合我的拍摄方向 <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="journey section" id="process">
        <div className="journey-intro"><p className="section-label">03 / HOW IT WORKS</p><h2>你负责期待，<br />细节一起安排。</h2><p>从第一次联系，到收到成片。<br />每一步都有要聊清楚的事。</p><a className="underlined-link" href="#contact">先问问适合我的方案 ↗</a></div>
        <ol className="journey-list">{process.map((step, index) => <li key={step.phase}><details open={index === 0 ? true : undefined}><summary><span className="step-number">0{index + 1}</span><span><small>{step.phase}</small><strong>{step.title}</strong></span><span className="plus" aria-hidden="true">＋</span></summary><div className="step-detail"><p>{step.text}</p><dl><div><dt>你可以准备</dt><dd>{step.you}</dd></div><div><dt>一起确认</dt><dd>{step.confirm}</dd></div></dl></div></details></li>)}</ol>
      </section>

      <section className="practical section" id="guide">
        <div className="section-label"><span>04 / BEFORE WE SHOOT</span><span>把顾虑，留在拍摄之前。</span></div>
        <details className="agreement"><summary><span>预约前，需要确认些什么？</span><span className="plus" aria-hidden="true">＋</span></summary><div className="agreement-grid"><article><h3>拍摄内容</h3><p>人数与风格、日期与时长、地点与服装套数，以及妆造、服装和道具的提供方式。</p></article><article><h3>费用与档期</h3><p>总费用、预约款与尾款，场地、门票和交通等额外支出，迟到、取消和改期安排。</p></article><article><h3>成片与后续</h3><p>精修张数、底片范围、交片日期、修改范围与次数，以及公开展示授权和文件保留时间。</p></article></div><p className="preparation">出发前：试穿服装，核对鞋子与配件，带好饮水和个人用品；外景可准备方便步行的鞋子。儿童同行时，提前沟通休息、用餐与陪同安排。</p></details>
        <div className="faq-list">{questions.map(([title, answer]) => <details key={title}><summary>{title}<span className="plus" aria-hidden="true">＋</span></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-heading"><p className="section-label">YOUR STORY STARTS HERE</p><h2>下一位主角，<br /><em>是你。</em><span className="contact-arrow" aria-hidden="true">↗</span></h2><p>还没想好怎么拍也没关系。<br />说说你喜欢什么、担心什么，再一起找方向。</p><div className="contact-methods"><a href="tel:15220017059"><span>直接打个电话</span><strong>152 2001 7059 ↗</strong></a><a href={`mailto:3315466882@qq.com?subject=${encodeURIComponent("摄影咨询" + (chosenStyle ? " · " + chosenStyle : ""))}&body=${encodeURIComponent(inquiryMessage)}`}><span>带着想法发邮件</span><strong>3315466882@qq.com ↗</strong></a></div><p className="contact-note">具体费用、档期和交付安排，在预约前确认。</p></div>
        <aside className="inquiry"><span className="inquiry-label">LET’S MAKE IT YOURS / 拍摄咨询</span><h3>你喜欢哪一种感觉？</h3><div className="style-options" aria-label="选择咨询的拍摄风格">{inquiryStyles.map((style) => <button key={style} type="button" aria-pressed={chosenStyle === style} onClick={() => chooseStyle(style)}>{style}<span aria-hidden="true">{chosenStyle === style ? " ✓" : " ＋"}</span></button>)}</div><label htmlFor="inquiry-message">帮你准备好第一句话</label><textarea id="inquiry-message" value={inquiryMessage} readOnly rows={8} aria-describedby="inquiry-help" /><button className="button inquiry-copy" type="button" onClick={copyInquiry}>复制这段话，开始咨询 <span aria-hidden="true">↗</span></button><p id="inquiry-help" className="copy-status" role="status">{copyStatus || "复制后可在聊天中补充信息；此处不会提交预约。"}</p></aside>
      </section>

      <footer><div className="footer-top"><a className="brand" href="#top"><strong>钟家伦<span className="brand-dot">.</span></strong><span>人物摄影</span></a><span>© 2026 钟家伦摄影</span><a href="#top">回到顶部 ↑</a></div><p className="footer-wordmark" aria-hidden="true">JIALUN<span>↗</span></p></footer>
      <div className="mobile-contact"><a href="#works">找我的风格</a><a href="#contact">聊聊我的拍摄 ↗</a></div>

      <dialog ref={dialogRef} className="lightbox" aria-label="作品大图预览" onCancel={closePhoto} onClose={() => setActiveIndex(null)} onClick={(event) => { if (event.target === event.currentTarget) closePhoto(); }} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); movePhoto(1); } if (event.key === "ArrowLeft") { event.preventDefault(); movePhoto(-1); } }}>
        {activeIndex !== null && <><button className="lightbox-close" type="button" onClick={closePhoto} autoFocus>关闭 ×</button><figure><img src={photographs[activeIndex].src} alt={photographs[activeIndex].alt} /><figcaption><span>{String(activeIndex + 1).padStart(2, "0")} / {photographs.length}</span><span>{photographs[activeIndex].alt}{streetIndexes.includes(activeIndex) ? " · 街头观察 / 非预约客片" : ""}</span></figcaption></figure><div className="lightbox-controls"><button type="button" onClick={() => movePhoto(-1)} aria-label="上一张">← 上一张</button>{!streetIndexes.includes(activeIndex) && <a href="#contact" onClick={() => { chooseStyle(directions.find((d) => d.index === activeIndex)?.style || `作品 ${String(activeIndex + 1).padStart(2, "0")} 的感觉`); closePhoto(); }}>我想拍这种感觉 ↗</a>}<button type="button" onClick={() => movePhoto(1)} aria-label="下一张">下一张 →</button></div></>}
      </dialog>
    </main>
  );
}
