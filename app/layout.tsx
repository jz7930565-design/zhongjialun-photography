import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "钟家伦摄影｜人物写真与汉服摄影",
  description: "钟家伦摄影作品集。专注人物写真、汉服摄影与有情绪的自然肖像。",
  openGraph: {
    title: "钟家伦摄影｜让光，留住时间",
    description: "人物写真 · 汉服摄影 · 情绪肖像",
    type: "website",
    url: "https://jz7930565-design.github.io/zhongjialun-photography/",
    images: ["https://jz7930565-design.github.io/zhongjialun-photography/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "钟家伦摄影｜让光，留住时间",
    description: "人物写真 · 汉服摄影 · 情绪肖像",
    images: ["https://jz7930565-design.github.io/zhongjialun-photography/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
