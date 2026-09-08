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
];

const selected = [0, 13, 9, 10];
const process = [
  { title: "聊一聊你想拍的自己", phase: "初次沟通", text: "可以发来喜欢的照片，也可以只说想要自然、安静或有故事感。一起梳理人物、风格与拍摄用途。", you: "拍摄人数、意向日期、预算范围，或几张喜欢的参考图。", confirm: "拍摄类型、城市与可选场景。" },
  { title: "把拍摄内容说清楚", phase: "方案与预约", text: "先明确一场拍摄包含什么，再安排档期。拍摄、妆造、服装和场地需要分别确认，避免到了现场才发现理解不同。", you: "选择拍摄方向，说明服装、妆造与出行需求。", confirm: "总费用、时长、服装套数、精修张数，以及预约和改期规则。" },
  { title: "准备好，再轻松出发", phase: "拍摄前", text: "根据场景协调服饰与配件，确认集合地点和时间。外景还需要考虑天气、光线与步行距离。", you: "核对服装和随身物品；提前说明体力、行动或其他特别需求。", confirm: "妆造安排、集合信息、场地费用和天气备选安排。" },
  { title: "从简单的动作开始", phase: "拍摄当天", text: "不用一开始就进入状态。可以从走动、转身、看向窗外等简单动作开始，再逐步调整表情、手势与站姿。", you: "按约定到场，有不舒服或不喜欢的角度及时说出来。", confirm: "当天拍摄顺序、人物状态与画面方向。" },
  { title: "选出你真正喜欢的照片", phase: "选片与精修", text: "选片时兼顾表情、姿态与整组照片的变化。精修前说明肤色、皮肤质感和身形调整偏好，让处理方向更明确。", you: "反馈喜欢的照片与修图偏好，集中整理修改意见。", confirm: "选片方式、精修范围、加修费用与可修改次数。" },
  { title: "收好这一次的记忆", phase: "成片交付", text: "交付前核对文件、数量与版本。需要打印或用于社交平台，可以在沟通时说明，提前确认对应的尺寸与格式。", you: "收到后检查文件是否完整，并及时下载和备份。", confirm: "交付日期、文件规格、底片范围和文件保留时间。" },
];
const questions = [
  ["没有拍摄经验，会不会很僵硬？", "可以从站立、走动和转身等简单动作开始，不必提前背一整套姿势。沟通时告诉我你喜欢和不喜欢的表情、角度，拍摄中也可以直接反馈感受。"],
  ["妆造、服装和场地都包含吗？", "需要按具体方案分别确认。预约前请确认妆造由谁安排、服装是否自备或租赁、门票和场地费用由谁承担，不把这些项目默认计入拍摄报价。"],
  ["能拿到多少照片，多久交付？", "精修张数、底片是否交付、选片时间和最终交付日期，需要在预约时确认。加修、加急或打印需求也请提前提出，确认能否安排及相应费用。"],
  ["下雨、迟到或临时有事怎么办？", "外景拍摄应提前沟通天气备选方案。遇到情况请尽早联系，是否改期、档期如何调整，以及已产生费用的处理方式，以预约时确认的安排为准。"],
  ["精修到什么程度？不满意可以改吗？", "可以先说明你对皮肤纹理、肤色与身形调整的偏好，再确认精修范围。修改次数、反馈时间与额外修改费用需要提前约定，避免双方对“精修”的理解不同。"],
  ["我的照片会被公开展示吗？", "请在预约时说明你对公开展示的接受范围，例如是否允许露脸、是否允许用于作品集。展示用途与授权范围需要单独确认；有不公开的要求，也请明确提出。"],
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    if (activeIndex === null) return;
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activeIndex]);

  const copyInquiry = async () => {
    const message = "你好，我想咨询拍摄。\n拍摄类型：\n拍摄人数：\n意向日期：\n拍摄城市：\n预算范围：\n喜欢的风格：\n是否需要妆造 / 服装：\n其他想法：";
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus("咨询清单已复制，可以粘贴到聊天中填写。");
    } catch {
      setCopyStatus("未能自动复制，请按上方清单把拍摄信息发给我。");
    }
  };

  return (
    <main>
      <a className="skip-link" href="#works">跳到摄影作品</a>
      <header className="site-header">
        <a className="brand" href="#top"><strong>钟家伦</strong><span>PHOTOGRAPHY</span></a>
        <nav aria-label="主导航">
          <a href="#works">作品</a><a href="#process">拍摄流程</a><a href="#guide">预约须知</a>
          <a className="nav-contact" href="#contact">咨询拍摄 ↗</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">钟家伦 · 人物摄影</p>
          <h1>你自在的样子，<br /><em>值得被记录。</em></h1>
          <p className="hero-description">人物写真、汉服与纪念拍摄。<br />从想法、准备到成片，一起把细节聊清楚。</p>
          <div className="hero-actions"><a className="button solid" href="#works">看摄影作品 <span>↗</span></a><a className="text-link" href="#process">了解拍摄流程 ↓</a></div>
          <div className="hero-note"><span>选风格</span><span>聊方案</span><span>安排拍摄</span></div>
        </div>
        <button className="hero-image" type="button" onClick={() => openPhoto(0)} aria-label="放大查看夕阳下的汉服写真">
          <img src={photographs[0].src} alt={photographs[0].alt} fetchPriority="high" />
          <span className="hero-caption">汉服写真 <span>查看完整画面 ↗</span></span>
        </button>
      </section>

      <section className="works section" id="works">
        <div className="section-heading"><div><p className="eyebrow">01 / 摄影作品</p><h2>先看照片，再聊你的想法。</h2></div><p>光线、表情和人与场景的关系。<br />找到你喜欢的感觉，作为沟通的起点。</p></div>
        <div className="selected-grid">
          {selected.map((index) => <button className="photo-card" key={index} onClick={() => openPhoto(index)} type="button" aria-label={`放大查看：${photographs[index].alt}`}>
            <span className="photo-frame"><img src={photographs[index].src} alt={photographs[index].alt} loading="lazy" /></span>
            <span className="photo-meta"><b>{String(index + 1).padStart(2, "0")}</b><span>{photographs[index].alt}</span><i>↗</i></span>
          </button>)}
        </div>
        <details className="more-works">
          <summary>展开其余 10 张作品 <span aria-hidden="true">＋</span></summary>
          <div className="archive-grid">
            {photographs.map((photo, index) => selected.includes(index) ? null : <button className="photo-card" key={photo.src} onClick={() => openPhoto(index)} type="button" aria-label={`放大查看：${photo.alt}`}>
              <img src={photo.src} alt={photo.alt} loading="lazy" /><span className="photo-meta"><b>{String(index + 1).padStart(2, "0")}</b><span>{photo.alt}</span></span>
            </button>)}
          </div>
        </details>
      </section>

      <section className="process section" id="process">
        <div className="process-intro"><p className="eyebrow">02 / 拍摄流程</p><h2>从第一次联系，<br />到收到照片。</h2><p>不知道怎么准备也没关系。<br />沿着这六步，逐项确认拍摄安排。</p><a className="text-link" href="#contact">带着你的想法来聊聊 ↗</a><span className="process-number" aria-hidden="true">01—06</span></div>
        <ol className="process-list">
          {process.map((step, index) => <li key={step.phase}><span className="step-number">{String(index + 1).padStart(2, "0")}</span><div><p className="step-phase">{step.phase}</p><h3>{step.title}</h3><p>{step.text}</p><dl><div><dt>你可以准备</dt><dd>{step.you}</dd></div><div><dt>一起确认</dt><dd>{step.confirm}</dd></div></dl></div></li>)}
        </ol>
      </section>

      <section className="booking-guide section" id="guide">
        <div className="section-heading"><div><p className="eyebrow">03 / 预约须知</p><h2>先说清楚，才能放心拍。</h2></div><p>具体金额与交付安排因方案而异。<br />预约前，把以下内容逐项确认。</p></div>
        <div className="agreement-grid">
          <article><span>01 / 拍什么</span><h3>拍摄内容</h3><ul><li>拍摄人数、类型与风格参考</li><li>日期、时长、地点与服装套数</li><li>妆造、服装、道具的提供方式</li></ul></article>
          <article><span>02 / 付什么</span><h3>费用与档期</h3><ul><li>总费用、预约款与尾款安排</li><li>场地、门票、交通等额外支出</li><li>迟到、取消、天气与改期安排</li></ul></article>
          <article><span>03 / 收到什么</span><h3>成片与后续</h3><ul><li>精修张数、底片范围与文件规格</li><li>交片时间、修改范围与次数</li><li>照片公开展示与文件保留时间</li></ul></article>
        </div>
        <div className="preparation"><h3>拍摄前的一点准备</h3><p>提前试穿服装，检查鞋子与配件；带好补妆用品、饮水及必要的个人物品。外景可准备方便步行的鞋子。儿童拍摄时，提前沟通休息、用餐与陪同安排。</p></div>
      </section>

      <section className="faq section" id="questions">
        <div><p className="eyebrow">04 / 常见问题</p><h2>你可能还想问。</h2><p>有其他顾虑，也欢迎在预约前直接告诉我。</p></div>
        <div className="faq-list">{questions.map(([title, answer]) => <details key={title}><summary>{title}<span aria-hidden="true">＋</span></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="about section" id="about">
        <img src={photographs[8].src} alt={photographs[8].alt} loading="lazy" />
        <div><p className="eyebrow">关于摄影师 / 钟家伦</p><h2>好照片之外，<br />也在意你的拍摄感受。</h2><p>我关注人物的表情、光线与自然状态。喜欢的照片可以成为参考，但更重要的是找到适合你的表达。</p><p>沟通时可以直说你喜欢什么、担心什么。清楚的准备、现场的交流，以及一致的修图方向，都是一场拍摄的一部分。</p></div>
      </section>

      <section className="contact section" id="contact">
        <div><p className="eyebrow">开始一次拍摄</p><h2>把你的想法，<br /><em>慢慢说给我听。</em></h2><p>有参考图可以一起发来；还没想好风格，<br />就先说说为什么想拍这组照片。</p><div className="contact-links"><a href="tel:15220017059"><small>电话咨询</small><span>152 2001 7059 ↗</span></a><a href="mailto:3315466882@qq.com"><small>邮箱联系</small><span>3315466882@qq.com ↗</span></a></div></div>
        <aside className="inquiry-card"><p className="eyebrow">初次咨询，可以这样开始</p><h3>“你好，我想约一组照片。”</h3><ul><li><span>拍什么</span>写真 / 汉服 / 纪念拍摄</li><li><span>几个人</span>人数与是否有儿童同行</li><li><span>何时何地</span>意向日期与拍摄城市</li><li><span>怎么准备</span>预算、风格、妆造与服装需求</li></ul><button className="button solid" type="button" onClick={copyInquiry}>复制咨询清单 <span>↗</span></button><p className="copy-status" role="status">{copyStatus || "复制后填写即可；这不会提交预约或产生费用。"}</p></aside>
      </section>
      <footer><a className="brand" href="#top"><strong>钟家伦</strong><span>PHOTOGRAPHY</span></a><span>© 2026 钟家伦摄影</span><a href="#top">回到顶部 ↑</a></footer>
      <div className="mobile-contact"><a href="#process">看拍摄流程</a><a href="#contact">咨询拍摄 ↗</a></div>

      <dialog ref={dialogRef} className="lightbox" aria-label="作品大图预览" onCancel={closePhoto} onClose={() => setActiveIndex(null)} onClick={(event) => { if (event.target === event.currentTarget) closePhoto(); }} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); movePhoto(1); } if (event.key === "ArrowLeft") { event.preventDefault(); movePhoto(-1); } }}>
        {activeIndex !== null && <><button className="lightbox-close" type="button" onClick={closePhoto} autoFocus>关闭 ×</button><figure><img src={photographs[activeIndex].src} alt={photographs[activeIndex].alt} /><figcaption><span>{String(activeIndex + 1).padStart(2, "0")} / 14</span><span>{photographs[activeIndex].alt}</span></figcaption></figure><div className="lightbox-controls"><button type="button" onClick={() => movePhoto(-1)} aria-label="上一张">← 上一张</button><button type="button" onClick={() => movePhoto(1)} aria-label="下一张">下一张 →</button></div></>}
      </dialog>
    </main>
  );
}
