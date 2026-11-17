"use client";

import { useEffect, useState } from "react";
import { API_URL, WS_URL } from "@/lib/api";

type Info = {
  name_th: string;
  emoji: string;
  tagline: string;
  description: string;
};

type Result = {
  id: number;
  created_at: string;
  animal: string;
  confidence: number;
  scores: Record<string, number>;
  info: Info;
};

type Stats = {
  total: number;
  by_animal: Record<string, number>;
};

const TRAITS: [string, string][] = [
  ["social", "สังคม"],
  ["independence", "ความเป็นอิสระ"],
  ["planning", "การวางแผน"],
  ["analysis", "การวิเคราะห์"],
  ["calmness", "ความสงบนิ่ง"],
];

const ANIMAL_LABEL: Record<string, string> = {
  cat: "🐱 แมว",
  dog: "🐶 สุนัข",
  fox: "🦊 จิ้งจอก",
  owl: "🦉 นกฮูก",
  panda: "🐼 แพนด้า",
};

export default function DashboardPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let closed = false;

    async function loadStats() {
      try {
        const res = await fetch(`${API_URL}/stats`);

        if (!res.ok) return;

        setStats(await res.json());
      } catch {
      }
    }

    function connect() {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setOnline(true);
        loadStats();
      };

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);

          if (msg.type === "result") {
            setResult(msg.data);
          }

          loadStats();
        } catch {
        }
      };

      ws.onclose = () => {
        setOnline(false);

        if (!closed) {
          timer = setTimeout(connect, 2000);
        }
      };

      ws.onerror = () => {
        ws?.close();
      };
    }

    connect();

    return () => {
      closed = true;

      if (timer) {
        clearTimeout(timer);
      }

      ws?.close();
    };
  }, []);

  const animalStats = stats
    ? Object.entries(stats.by_animal).sort(([, a], [, b]) => b - a)
    : [];

  return (
    <main className="relative h-dvh overflow-hidden bg-[#020817] text-white">
      <Background />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col px-4 py-3 sm:px-6 sm:py-4">


        <header className="shrink-0 border-b border-white/[0.08] pb-3">

          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">


            <div className="flex shrink-0 items-center justify-center">

              <img
                src="/MSU-logo.webp"
                alt="มหาวิทยาลัยมหาสารคาม"
                className="h-20 w-20 object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.12)] sm:h-24 sm:w-24"
              />

            </div>


            <div className="min-w-0 text-center">


              <p className="text-sm font-bold tracking-wide text-yellow-300 sm:text-base">
                มหาวิทยาลัยมหาสารคาม
              </p>


              <p className="mt-0.5 text-[8px] font-medium tracking-[0.16em] text-slate-500 sm:text-[9px]">
                MAHASARAKHAM UNIVERSITY
              </p>

              <p className="mt-2 text-[10px] font-semibold text-blue-400 sm:text-xs">
                คณะวิทยาการสารสนเทศ
              </p>

              <h1 className="mt-0.5 truncate text-sm font-bold text-white sm:text-base">
                วิทยาการข้อมูลและวิศวกรรมข้อมูล
              </h1>

              <p className="mt-0.5 text-[7px] tracking-[0.15em] text-slate-500 sm:text-[8px]">
                DATA SCIENCE & DATA ENGINEERING
              </p>

            </div>



            <div className="flex shrink-0 flex-col items-center gap-2">

              <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">

                <img
                  src="/Informatics-logo-footer.webp"
                  alt="คณะวิทยาการสารสนเทศ"
                  className="h-full w-full object-contain drop-shadow-[0_0_18px_rgba(59,130,246,0.15)]"
                />

              </div>


            </div>

          </div>

        </header>



        <div className="flex min-h-0 flex-1 flex-col justify-center">

          {!result ? (

            <div className="mx-auto w-full max-w-md text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-blue-500/15 bg-blue-500/[0.05] shadow-[0_0_50px_rgba(37,99,235,0.08)]">

                <span className="text-4xl">
                  🐾
                </span>

              </div>

              <h2 className="mt-5 text-2xl font-bold">
                รอผลลัพธ์...
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                ผลจากแบบทดสอบจะแสดงที่นี่
              </p>

              <p className="mt-4 text-[9px] tracking-[0.15em] text-slate-700">
                DATA SCIENCE & DATA ENGINEERING
              </p>

            </div>

          ) : (


            <div className="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-[0.9fr_1.1fr]">


              <section className="flex flex-col justify-center rounded-2xl border border-blue-500/15 bg-[#071426]/95 p-5 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">

                <p className="text-[8px] tracking-[0.2em] text-blue-400">
                  YOUR RESULT
                </p>

                <div className="mx-auto mt-3 flex h-28 w-28 items-center justify-center rounded-full border border-blue-400/15 bg-blue-500/[0.06] shadow-[0_0_50px_rgba(37,99,235,0.12)] sm:h-32 sm:w-32">

                  <span className="text-7xl sm:text-8xl">
                    {result.info.emoji}
                  </span>

                </div>

                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                  {result.info.name_th}
                </h2>

                <p className="mt-1 text-sm text-blue-300">
                  {result.info.tagline}
                </p>

                <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-slate-400">
                  {result.info.description}
                </p>

                <div className="mt-3">

                  <span className="text-[10px] text-slate-500">
                    ความมั่นใจ{" "}
                  </span>

                  <span className="text-lg font-bold text-blue-300">
                    {result.confidence}%
                  </span>

                </div>

              </section>


              <section className="rounded-2xl border border-blue-500/15 bg-[#071426]/95 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[8px] tracking-[0.2em] text-blue-400">
                      PERSONALITY
                    </p>

                    <h2 className="mt-1 text-lg font-bold">
                      บุคลิกภาพของคุณ
                    </h2>

                  </div>

                  <span className="text-lg">
                    📊
                  </span>

                </div>


                <div className="mt-4 space-y-3.5">

                  {TRAITS.map(([key, label]) => {

                    const value = result.scores[key] ?? 0;

                    const percent = (value / 5) * 100;

                    return (
                      <div key={key}>

                        <div className="mb-1 flex items-center justify-between">

                          <span className="text-xs text-slate-300">
                            {label}
                          </span>

                          <span className="text-[10px] text-slate-500">
                            {value.toFixed(1)} / 5
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 transition-all duration-1000"
                            style={{
                              width: `${percent}%`,
                            }}
                          />

                        </div>

                      </div>
                    );

                  })}

                </div>

              </section>

            </div>
          )}

        </div>



        {stats && stats.total > 0 && (

          <section className="shrink-0 border-t border-white/[0.06] pt-3">

            <div className="mx-auto w-full max-w-5xl rounded-xl border border-blue-500/10 bg-[#071426]/80 px-4 py-3 backdrop-blur-md">


              <div className="mb-3 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="text-sm">
                    📊
                  </span>

                  <div>

                    <h3 className="text-xs font-bold text-slate-200">
                      สถิติผู้เข้าร่วม
                    </h3>

                    <p className="text-[9px] text-slate-500">
                      จำนวนผู้เข้าร่วมที่ได้สัตว์แต่ละประเภท
                    </p>

                  </div>

                </div>


                <div className="text-right">

                  <span className="text-lg font-bold text-blue-300">
                    {stats.total}
                  </span>

                  <span className="ml-1 text-[9px] text-slate-500">
                    คน
                  </span>

                </div>

              </div>


              <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">

                {animalStats.map(([animal, count]) => {

                  const percent =
                    stats.total > 0
                      ? (count / stats.total) * 100
                      : 0;

                  return (
                    <div key={animal}>

                      <div className="mb-1 flex items-center justify-between">

                        <span className="text-[10px] font-medium text-slate-300">
                          {ANIMAL_LABEL[animal] ?? animal}
                        </span>

                        <span className="text-[9px] text-slate-500">
                          {count} คน · {percent.toFixed(0)}%
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.18)] transition-all duration-700"
                          style={{
                            width: `${percent}%`,
                          }}
                        />

                      </div>

                    </div>
                  );

                })}

              </div>

            </div>

          </section>
        )}



        <footer className="shrink-0 pt-2 text-center">

          <p className="text-[8px] text-slate-700">
            มหาวิทยาลัยมหาสารคาม · คณะวิทยาการสารสนเทศ ·
            Data Science & Data Engineering
          </p>

        </footer>

      </div>
    </main>
  );
}


function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">


      <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-blue-700/10 blur-[120px] animate-[glow1_12s_ease-in-out_infinite]" />

      <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[120px] animate-[glow2_15s_ease-in-out_infinite]" />


      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "45px 45px",
        }}
      />


      <svg
        className="absolute inset-0 h-full w-full opacity-[0.055]"
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
      >

        <polyline
          points="0,570 100,530 190,550 290,450 390,480 500,370 610,410 720,290 840,330 960,220 1080,250 1200,180"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        <polyline
          points="0,620 130,590 250,610 370,520 490,550 610,460 730,480 850,390 980,410 1100,330 1200,350"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.5"
        />

      </svg>



      <span className="absolute left-[12%] top-[20%] h-1 w-1 animate-[p1_7s_ease-in-out_infinite] rounded-full bg-blue-400 shadow-[0_0_12px_#60a5fa]" />

      <span className="absolute left-[82%] top-[25%] h-1 w-1 animate-[p2_9s_ease-in-out_infinite] rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />

      <span className="absolute left-[18%] top-[78%] h-1 w-1 animate-[p3_8s_ease-in-out_infinite] rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />

      <span className="absolute left-[88%] top-[72%] h-1 w-1 animate-[p4_10s_ease-in-out_infinite] rounded-full bg-blue-300 shadow-[0_0_12px_#93c5fd]" />

      <style jsx>{`

        @keyframes glow1 {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(60px, 40px);
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

        @keyframes p1 {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }

          50% {
            transform: translate(90px, 50px);
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
            transform: translate(-80px, 60px);
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
            transform: translate(80px, -50px);
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
            transform: translate(-70px, -60px);
            opacity: 1;
          }
        }

      `}</style>

    </div>
  );
}