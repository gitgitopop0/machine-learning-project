"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";
import { CHOICES, QUESTIONS } from "@/lib/questions";

type Phase = "answering" | "sending" | "done";

export default function QuizPage() {
    const total = QUESTIONS.length;

    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(
        Array(total).fill(null)
    );
    const [phase, setPhase] = useState<Phase>("answering");
    const [error, setError] = useState("");

    const answered = answers.filter((a) => a !== null).length;
    const allAnswered = answers.every((a) => a !== null);
    const isLast = index === total - 1;

    function reset() {
        setIndex(0);
        setAnswers(Array(total).fill(null));
        setError("");
        setPhase("answering");
    }

    function choose(value: number) {
        const next = [...answers];
        next[index] = value;
        setAnswers(next);

        if (!isLast) {
            setTimeout(() => {
                setIndex((prev) => prev + 1);
            }, 180);
        }
    }

    async function submit() {
        setPhase("sending");
        setError("");

        try {
            const res = await fetch(`${API_URL}/predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ answers }),
            });

            if (!res.ok) {
                throw new Error("bad status");
            }

            setPhase("done");

            setTimeout(reset, 4000);
        } catch {
            setError(
                "ส่งคำตอบไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง"
            );

            setPhase("answering");
        }
    }


    if (phase === "done") {
        return (
            <main className="relative h-dvh overflow-hidden bg-[#020817] text-white">
                <AnimatedBackground />

                <div className="relative z-10 flex h-full items-center justify-center px-5">
                    <div className="w-full max-w-md text-center">

                        <img
                            src="/Informatics-logo-footer.webp"
                            alt="Faculty of Informatics"
                            className="mx-auto mb-5 h-20 w-auto object-contain"
                        />

                        <div className="rounded-3xl border border-blue-400/20 bg-[#071426]/95 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-400/30">
                                <span className="text-3xl">🎉</span>
                            </div>

                            <p className="mt-5 text-xs font-medium tracking-[0.2em] text-blue-400">
                                DSDE OPEN HOUSE
                            </p>

                            <h1 className="mt-2 text-3xl font-bold">
                                ขอบคุณที่ร่วมสนุก!
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                เราได้รับคำตอบของคุณแล้ว
                                <br />
                                ไปดูสิว่า...คุณเหมือนสัตว์อะไร 🐾
                            </p>

                            <p className="mt-2 text-xs text-slate-500">
                                ดูผลลัพธ์ได้ที่จอ Dashboard
                            </p>

                            <button
                                onClick={reset}
                                className="mt-7 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)]"
                            >
                                🔄 ให้คนถัดไปเล่น
                            </button>
                        </div>

                        <p className="mt-5 text-[10px] text-slate-600">
                            คณะวิทยาการสารสนเทศ
                            {" • "}
                            วิทยาการข้อมูลและวิศวกรรมข้อมูล
                        </p>
                    </div>
                </div>
            </main>
        );
    }


    return (
        <main className="relative h-dvh overflow-hidden bg-[#020817] text-white">
            <AnimatedBackground />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-3 sm:px-6 sm:py-4">


                <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] pb-3">

                    <div className="flex min-w-0 items-center gap-3">

                        <img
                            src="/Informatics-logo-footer.webp"
                            alt="Faculty of Informatics"
                            className="h-11 w-auto shrink-0 object-contain sm:h-14"
                        />

                        <div className="min-w-0 border-l border-white/10 pl-3">
                            <p className="text-[9px] text-blue-400 sm:text-[10px]">
                                คณะวิทยาการสารสนเทศ
                            </p>

                            <h1 className="truncate text-sm font-bold sm:text-base">
                                วิทยาการข้อมูลและวิศวกรรมข้อมูล
                            </h1>

                            <p className="mt-0.5 truncate text-[7px] tracking-[0.12em] text-slate-500 sm:text-[8px]">
                                DATA SCIENCE & DATA ENGINEERING
                            </p>
                        </div>

                    </div>

                    <div className="hidden shrink-0 items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 sm:flex">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
                        <span className="text-[9px] text-slate-400">
                            OPEN HOUSE
                        </span>
                    </div>

                </header>


                <div className="flex min-h-0 flex-1 flex-col justify-center">


                    <div className="mb-3 shrink-0 text-center sm:mb-4">

                        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                            คุณเหมือนสัตว์อะไร? 🐾
                        </h2>

                        <p className="mt-1 text-[11px] text-slate-500">
                            ตอบคำถาม แล้วมาดูกันว่าบุคลิกของคุณเหมือนสัตว์ตัวไหน
                        </p>

                    </div>


                    <div className="mx-auto mb-3 w-full max-w-3xl shrink-0">

                        <div className="mb-1.5 flex justify-between text-[9px] text-slate-500">
                            <span>
                                คำถาม {index + 1} / {total}
                            </span>

                            <span>
                                {answered} / {total}
                            </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 transition-all duration-500"
                                style={{
                                    width: `${((index + 1) / total) * 100}%`,
                                }}
                            />
                        </div>

                    </div>


                    <div className="mx-auto w-full max-w-3xl">

                        <div className="rounded-2xl border border-blue-500/15 bg-[#071426]/95 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-6">

                            <div className="flex items-center gap-2">
                                <span className="text-base">🧠</span>

                                <span className="text-[9px] font-medium tracking-[0.18em] text-blue-400">
                                    QUESTION {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>

                            <h3 className="mt-2 text-lg font-semibold leading-relaxed sm:text-xl">
                                {QUESTIONS[index]}
                            </h3>


                            <div className="mt-4 grid gap-2 sm:grid-cols-2">

                                {CHOICES.map((c, i) => {
                                    const selected = answers[index] === c.value;


                                    const emojis = ["🎯", "✨", "🔥", "💡", "🚀", "🌟"];
                                    const emoji = emojis[i % emojis.length];

                                    return (
                                        <button
                                            key={c.value}
                                            onClick={() => choose(c.value)}
                                            disabled={phase === "sending"}

                                            className={`group flex min-h-[58px] items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-300 sm:px-4 ${selected
                                                ? "scale-[1.02] border-blue-400 bg-blue-500/15 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                                                : "border-white/[0.07] bg-[#0a182b] hover:scale-[1.02] active:scale-[0.98] hover:border-blue-500/40 hover:bg-blue-500/[0.05]"
                                                }`}
                                        >

                                            <span

                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${selected
                                                    ? "rotate-12 bg-blue-500 text-white shadow-[0_0_14px_rgba(59,130,246,0.4)]"
                                                    : "bg-slate-800 text-slate-400 group-hover:rotate-6 group-hover:bg-blue-500/15 group-hover:text-blue-300"
                                                    }`}
                                            >
                                                {c.value}
                                            </span>

                                            <div className="flex flex-1 items-center gap-2">
                                                <span
                                                    className={`text-sm transition-colors duration-300 ${selected
                                                        ? "font-medium text-blue-100"
                                                        : "text-slate-300 group-hover:text-white"
                                                        }`}
                                                >
                                                    {c.label}
                                                </span>


                                                <span className={`text-base transition-all duration-300 ${selected ? "scale-125" : "scale-100 group-hover:scale-110"
                                                    }`}>
                                                    {emoji}
                                                </span>
                                            </div>

                                            <div className={`ml-auto flex items-center justify-center text-blue-400 transition-all duration-300 ${selected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                                                }`}>
                                                ✓
                                            </div>

                                        </button>
                                    );
                                })}

                            </div>


                            {error && (
                                <div className="mt-3 rounded-lg border border-red-500/20 bg-red-950/30 p-2.5 text-xs text-red-300">
                                    ⚠️ {error}
                                </div>
                            )}



                            <div className="mt-4 flex items-center justify-between">

                                <button
                                    onClick={() => setIndex(index - 1)}
                                    disabled={index === 0 || phase === "sending"}
                                    className="rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-20"
                                >
                                    ← ย้อนกลับ
                                </button>

                                {isLast ? (
                                    <button
                                        onClick={submit}
                                        disabled={!allAnswered || phase === "sending"}
                                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        {phase === "sending"
                                            ? "⏳ กำลังคิด..."
                                            : "🚀 ดูว่าสัตว์อะไร"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIndex(index + 1)}
                                        disabled={answers[index] === null}
                                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        ถัดไป →
                                    </button>
                                )}

                            </div>

                        </div>
                    </div>
                </div>

                <footer className="shrink-0 border-t border-white/[0.05] pt-2 text-center">
                    <p className="text-[9px] text-slate-600">
                        💻 Data Science & Data Engineering · DSDE
                    </p>
                </footer>

            </div>
        </main>
    );
}



function AnimatedBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">



            <div className="absolute -left-40 -top-40 h-[420px] w-[420px] animate-[glow1_12s_ease-in-out_infinite] rounded-full bg-blue-700/10 blur-[120px]" />

            <div className="absolute -bottom-40 -right-40 h-[450px] w-[450px] animate-[glow2_15s_ease-in-out_infinite] rounded-full bg-cyan-600/10 blur-[130px]" />


            <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)
          `,
                    backgroundSize: "45px 45px",
                }}
            />


            <span className="absolute left-[10%] top-[18%] h-1 w-1 animate-[p1_7s_ease-in-out_infinite] rounded-full bg-blue-400 shadow-[0_0_12px_#60a5fa]" />

            <span className="absolute left-[80%] top-[20%] h-1 w-1 animate-[p2_9s_ease-in-out_infinite] rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />

            <span className="absolute left-[20%] top-[78%] h-1 w-1 animate-[p3_8s_ease-in-out_infinite] rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />

            <span className="absolute left-[88%] top-[70%] h-1 w-1 animate-[p4_10s_ease-in-out_infinite] rounded-full bg-blue-300 shadow-[0_0_12px_#93c5fd]" />


            <svg
                className="absolute inset-0 h-full w-full opacity-[0.07]"
                preserveAspectRatio="none"
            >
                <line
                    x1="5%"
                    y1="25%"
                    x2="25%"
                    y2="40%"
                    stroke="#3b82f6"
                />

                <line
                    x1="25%"
                    y1="40%"
                    x2="45%"
                    y2="20%"
                    stroke="#3b82f6"
                />

                <line
                    x1="75%"
                    y1="25%"
                    x2="90%"
                    y2="45%"
                    stroke="#22d3ee"
                />

                <line
                    x1="15%"
                    y1="80%"
                    x2="35%"
                    y2="65%"
                    stroke="#3b82f6"
                />

                <line
                    x1="70%"
                    y1="75%"
                    x2="90%"
                    y2="60%"
                    stroke="#22d3ee"
                />
            </svg>


            <div className="absolute left-[-20%] top-[45%] h-px w-[140%] animate-[scan_10s_linear_infinite] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />


            <style jsx>{`
        @keyframes glow1 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(70px, 40px);
          }
        }

        @keyframes glow2 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-60px, -40px);
          }
        }

        @keyframes scan {
          0% {
            transform: translateX(-15%);
            opacity: 0;
          }

          25% {
            opacity: 1;
          }

          75% {
            opacity: 1;
          }

          100% {
            transform: translateX(15%);
            opacity: 0;
          }
        }

        @keyframes p1 {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }

          50% {
            transform: translate(100px, 60px);
            opacity: 1;
          }
        }

        @keyframes p2 {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }

          50% {
            transform: translate(-90px, 70px);
            opacity: 1;
          }
        }

        @keyframes p3 {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }

          50% {
            transform: translate(90px, -60px);
            opacity: 1;
          }
        }

        @keyframes p4 {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }

          50% {
            transform: translate(-80px, -70px);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}
