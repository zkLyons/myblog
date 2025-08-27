import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/myblog/",
  lang: "zh-CN",
  title: "zkLyons",
  description: "我的个人博客空间",
  theme,
  
  

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
