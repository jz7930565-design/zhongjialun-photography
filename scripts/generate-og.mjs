import sharp from "sharp";

const photo = await sharp("public/work/pink-veil-portrait.webp")
  .resize({ width: 530 })
  .extract({ left: 0, top: 64, width: 530, height: 630 })
  .png()
  .toBuffer();

const lettering = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="670" height="630" fill="#f7f3ed"/>
  <path d="M70 70H600" stroke="#8e3c4a" stroke-width="2"/>
  <text x="72" y="290" fill="#2b2b2a" font-family="Georgia,serif" font-style="italic" font-size="194" font-weight="bold" letter-spacing="-23">JL</text>
  <circle cx="282" cy="270" r="11" fill="#8e3c4a"/>
  <text x="75" y="354" fill="#8e3c4a" font-family="Segoe UI,sans-serif" font-size="19" letter-spacing="7">PORTRAIT / JOURNAL</text>
  <path d="M75 414H600" stroke="#2b2b2a" stroke-opacity=".28"/>
  <text x="75" y="467" fill="#2b2b2a" font-family="Microsoft YaHei,sans-serif" font-size="26" letter-spacing="8">人物写真 · 汉服摄影</text>
  <text x="75" y="570" fill="#66615e" font-family="Segoe UI,sans-serif" font-size="17" letter-spacing="3">A MOMENT, KEPT YOUR WAY.</text>
</svg>`);

await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#f7f3ed" } })
  .composite([{ input: photo, left: 670, top: 0 }, { input: lettering, left: 0, top: 0 }])
  .png({ compressionLevel: 9 })
  .toFile("public/og-jl.png");
