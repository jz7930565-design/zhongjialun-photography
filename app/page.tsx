"use client";

import { useEffect, useState } from "react";

const photographs = [
  { src: "./work/portrait-01.webp", alt: "夕阳下行走的汉服少女", place: "西安", shape: "landscape" },
  { src: "./work/portrait-02.webp", alt: "古建筑前的双人汉服肖像", place: "西安", shape: "portrait" },
  { src: "./work/portrait-03.webp", alt: "宫门前的蓝色汉服少女", place: "西安", shape: "portrait" },
  { src: "./work/portrait-04.webp", alt: "建筑中轴线上的持伞少女", place: "西安", shape: "landscape" },
  { src: "./work/portrait-05.webp", alt: "红灯笼前的粉色汉服少女", place: "西安", shape: "portrait" },
  { src: "./work/portrait-06.webp", alt: "山石旁读书的红衣少年", place: "西安", shape: "portrait" },
  { src: "./work/portrait-07.webp", alt: "古建筑栏杆旁的粉衣少女", place: "西安", shape: "portrait" },
  { src: "./work/portrait-08.webp", alt: "草地边共读画卷的少年少女", place: "西安", shape: "landscape" },
  { src: "./work/portrait-09.webp", alt: "书案前小憩的蓝衣少女", place: "西安", shape: "portrait" },
  { src: "./work/portrait-10.webp", alt: "竹林中撑伞的蓝衣少女", place: "西安", shape: "portrait" },
  { src: "./work/portrait-11.webp", alt: "红色书法布景中的汉服人像", place: "西安", shape: "landscape" },
  { src: "./work/portrait-12.webp", alt: "书案前阅读的蓝衣少年", place: "西安", shape: "portrait" },
  { src: "./work/portrait-13.webp", alt: "宫殿前的侠客人物肖像", place: "西安", shape: "landscape" },
  { src: "./work/portrait-14.webp", alt: "古建筑前撑伞的粉衣少女", place: "西安", shape: "portrait" },
];

const services = [
  { no: "01", title: "人物写真", en: "PORTRAIT", text: "从气质与情绪出发，找到最接近你的表达。" },
  { no: "02", title: "汉服摄影", en: "HANFU", text: "结合服饰、建筑与自然光，呈现东方叙事感。" },
  { no: "03", title: "亲子纪念", en: "MEMORY", text: "记录关系里的温度，让重要时刻可以被反复看见。" },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((activeIndex + 1) % photographs.length);
      if (event.key === "ArrowLeft") setActiveIndex((activeIndex - 1 + photographs.length) % photographs.length);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = activeIndex === null ? "" : "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  const activePhoto = activeIndex === null ? null : photographs[activeIndex];

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="钟家伦摄影首页">
          <strong>钟家伦</strong><span>PHOTOGRAPHY</span>
        </a>
        <nav aria-label="主导航">
          <a href="#works">作品</a>
          <a href="#about">关于</a>
          <a href="#services">服务</a>
          <a className="nav-contact" href="#contact">预约拍摄</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">PORTRAIT · GUANGZHOU · 2026</p>
          <h1>让光，<br /><em>留住时间。</em></h1>
          <div className="hero-note">
            <span>人物写真 / 汉服摄影 / 情绪肖像</span>
            <p>我不只记录你看起来的样子，<br />也记录那一刻真实的情绪。</p>
          </div>
        </div>
        <figure className="hero-image">
          <img src={photographs[0].src} alt={photographs[0].alt} fetchPriority="high" />
          <figcaption><span>01</span> 华裳入梦 · 西安</figcaption>
        </figure>
        <a className="scroll-cue" href="#works"><span>SCROLL</span><i>↓</i></a>
      </section>

      <section className="opening-works" id="works">
        <div className="section-intro">
          <p>SELECTED WORKS / 01—14</p>
          <h2>每一次快门，<br />都是一段未说完的故事。</h2>
        </div>
        <div className="lead-grid">
          {[2, 10].map((index) => (
            <button className="lead-photo" type="button" key={photographs[index].src} onClick={() => setActiveIndex(index)} aria-label={`放大查看：${photographs[index].alt}`}>
              <img src={photographs[index].src} alt={photographs[index].alt} loading="lazy" />
              <span><b>{String(index + 1).padStart(2, "0")}</b> 华裳入梦</span>
            </button>
          ))}
        </div>
      </section>

      <section className="series-statement" aria-label="摄影理念">
        <p>THE STORY OF LIGHT</p>
        <h2>照片不需要喧哗。<br /><em>光落下来，故事自然发生。</em></h2>
        <span>ZHONG JIALUN / PHOTOGRAPHER</span>
      </section>

      <section className="gallery-section" aria-label="华裳入梦完整作品">
        <div className="gallery-heading">
          <div><span>01</span><p>华裳入梦<br /><small>A DREAM IN SILK</small></p></div>
          <p className="gallery-copy">一次关于传统服饰、建筑空间与人物情绪的练习。<br />拍摄于西安，2026。</p>
        </div>
        <div className="editorial-gallery">
          {photographs.slice(1).map((photo, offset) => {
            const index = offset + 1;
            return (
              <button className={`photo-card card-${index + 1}`} type="button" key={photo.src} onClick={() => setActiveIndex(index)} aria-label={`放大查看第 ${index + 1} 张作品：${photo.alt}`}>
                <span className="photo-frame"><img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" /></span>
                <span className="photo-meta"><b>{String(index + 1).padStart(2, "0")}</b><i>{photo.place} · 2026</i></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-mark">光</div>
        <div className="about-label"><span>ABOUT</span><p>关于摄影师</p></div>
        <div className="about-copy">
          <h2>我喜欢等待。<br />等待人物忘记镜头，<br /><em>成为自己。</em></h2>
          <div>
            <p>我是钟家伦，一名关注人物与情绪的摄影师。我偏爱自然光、真实质感，以及不过度表演的瞬间。</p>
            <p>拍摄不应该让人紧张。前期我们会一起确定服装、场景与情绪方向；现场我会提供清晰引导，让每个人都能自然地进入状态。</p>
          </div>
        </div>
        <div className="about-foot"><span>BASED IN GUANGZHOU</span><span>AVAILABLE FOR TRAVEL</span></div>
      </section>

      <section className="services" id="services">
        <div className="services-heading"><p>SERVICES / 2026</p><h2>为你记录，<br />值得留下的部分。</h2></div>
        <div className="service-list">
          {services.map((service) => (
            <article key={service.no}>
              <span>{service.no}</span><small>{service.en}</small><h3>{service.title}</h3><p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process" aria-label="拍摄流程">
        <div className="process-title"><p>HOW IT WORKS</p><h2>拍摄流程</h2></div>
        <ol>
          <li><span>01</span><div><b>沟通想法</b><p>确认拍摄类型、人物气质、时间与场景。</p></div></li>
          <li><span>02</span><div><b>共同准备</b><p>确定服装、妆造与视觉方向，减少现场的不确定。</p></div></li>
          <li><span>03</span><div><b>拍摄交付</b><p>现场引导状态，完成筛选、精修与成片交付。</p></div></li>
        </ol>
      </section>

      <section className="contact" id="contact">
        <p className="contact-kicker">BOOK A SESSION / GUANGZHOU</p>
        <h2>下一组照片，<br /><em>从一次聊天开始。</em></h2>
        <div className="contact-grid">
          <p>欢迎联系人物写真、汉服摄影与纪念拍摄。<br />告诉我你想留下怎样的画面。</p>
          <div>
            <a href="tel:15220017059"><span>PHONE</span>152 2001 7059 <i>↗</i></a>
            <a href="mailto:3315466882@qq.com"><span>EMAIL</span>3315466882@qq.com <i>↗</i></a>
          </div>
        </div>
      </section>

      <footer><span>© 2026 钟家伦摄影</span><span>GUANGZHOU · CHINA</span><a href="#top">回到顶部 ↑</a></footer>

      {activePhoto && activeIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="作品大图预览" onMouseDown={() => setActiveIndex(null)}>
          <button className="lightbox-close" type="button" onClick={() => setActiveIndex(null)} aria-label="关闭大图">关闭 ×</button>
          <button className="lightbox-nav prev" type="button" onClick={(event) => { event.stopPropagation(); setActiveIndex((activeIndex - 1 + photographs.length) % photographs.length); }} aria-label="上一张">←</button>
          <figure onMouseDown={(event) => event.stopPropagation()}>
            <img src={activePhoto.src} alt={activePhoto.alt} />
            <figcaption><span>{String(activeIndex + 1).padStart(2, "0")} / {photographs.length}</span><p>{activePhoto.alt}</p></figcaption>
          </figure>
          <button className="lightbox-nav next" type="button" onClick={(event) => { event.stopPropagation(); setActiveIndex((activeIndex + 1) % photographs.length); }} aria-label="下一张">→</button>
        </div>
      )}
    </main>
  );
}
