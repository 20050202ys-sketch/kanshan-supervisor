import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 部署：如果仓库名不是用户主页仓库，需要把 base 设为 "/<仓库名>/"
// 例如仓库叫 kanshan-supervisor，则 base = "/kanshan-supervisor/"
// 用 Vercel 或自定义域名部署时把 base 改回 "/"
// DEPLOY_BASE 由 GitHub Actions 作为 shell 环境变量注入（见 deploy.yml）
export default defineConfig({
  plugins: [react()],
  base: process.env.DEPLOY_BASE || "/",
});
