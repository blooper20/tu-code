"use client";

import { motion } from "framer-motion";
import { Github, Rocket, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 -z-10 h-full w-full">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent-500/10 blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-surface-3 bg-surface-1/50 px-4 py-1.5 text-sm text-text-secondary backdrop-blur-md">
            <Rocket className="h-4 w-4 text-primary-400" />
            <span>Archive Your Code Performance</span>
          </div>

          <h1 className="mb-8 font-display text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Anti-Gravity
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary sm:text-xl">
            개발자 팀원들의 성과물을 가장 감각적으로 보여주는 <br className="hidden sm:block" />
            GitHub 연동 포트폴리오 아카이빙 플랫폼입니다.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="btn-primary flex items-center gap-2 px-8 py-4 text-lg">
              시작하기
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-surface-3 bg-white/5 py-4 px-8 font-semibold transition-all hover:bg-white/10">
              <Github className="h-5 w-5" />
              GitHub으로 로그인
            </button>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          <div className="card text-left">
            <div className="mb-4 h-10 w-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary-400" />
            </div>
            <h3 className="mb-2 font-bold text-xl">자동 연동</h3>
            <p className="text-text-secondary">
              GitHub URL만 있으면 자동으로 README와 정보를 가져옵니다.
            </p>
          </div>
          <div className="card text-left animate-float">
            <div className="mb-4 h-10 w-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
              <Rocket className="h-6 w-6 text-accent-400" />
            </div>
            <h3 className="mb-2 font-bold text-xl">다이나믹 포트폴리오</h3>
            <p className="text-text-secondary">
              화려한 애니메이션과 함께 당신의 프로젝트를 돋보이게 합니다.
            </p>
          </div>
          <div className="card text-left">
            <div className="mb-4 h-10 w-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Github className="h-6 w-6 text-primary-400" />
            </div>
            <h3 className="mb-2 font-bold text-xl">통합 관리</h3>
            <p className="text-text-secondary">
              어드민 패널에서 모든 프로젝트 성과물을 효율적으로 관리하세요.
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="mt-32 pb-10 text-text-muted">
        &copy; 2024 Anti-Gravity Team. All rights reserved.
      </footer>
    </div>
  );
}
