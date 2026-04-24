"use client";

import React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Screen = "intro" | "search" | "result";
type Feedback = "idle" | "wrong" | "correct";
type MonsterId = "orange" | "purple" | "white" | "blue";

type Hotspot = {
  id: string;
  label: string;
  left: string;
  top: string;
  width: string;
  height: string;
  monster: MonsterId;
  shadowSrc: string;
};

type RoundConfig = {
  monster: MonsterId;
  posterSrc: string;
};

const assetBasePath =
  process.env.NODE_ENV === "production"
    ? "/mrkreme/thailandtour/lost-furry-monster"
    : "";

const ROUND_VARIANTS: RoundConfig[] = [
  { monster: "orange", posterSrc: "/pieces/poster-orange.png" },
  { monster: "purple", posterSrc: "/pieces/poster-purple.png" },
  { monster: "white", posterSrc: "/pieces/poster-white.png" },
];

const HOTSPOTS: Hotspot[] = [
  {
    id: "orange-monster",
    label: "มอนสเตอร์สีส้มด้านซ้าย",
    left: "10%",
    top: "22%",
    width: "45%",
    height: "45%",
    monster: "orange",
    shadowSrc: "/pieces/shadow-orange.png",
  },
  {
    id: "left-shadow",
    label: "เงาด้านล่างฝั่งซ้าย",
    left: "16%",
    top: "50%",
    width: "45%",
    height: "45%",
    monster: "white",
    shadowSrc: "/pieces/shadow-white.png",
  },
  {
    id: "top-right-shadow",
    label: "เงาด้านบนฝั่งขวา",
    left: "67%",
    top: "7%",
    width: "45%",
    height: "45%",
    monster: "purple",
    shadowSrc: "/pieces/shadow-purple.png",
  },
  {
    id: "mid-right-shadow",
    label: "เงาด้านขวา",
    left: "67%",
    top: "43%",
    width: "45%",
    height: "45%",
    monster: "blue",
    shadowSrc: "/pieces/shadow-blue.png",
  },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [round, setRound] = useState<RoundConfig>(ROUND_VARIANTS[0]);
  const [posterRotate, setPosterRotate] = useState<number>(0);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    setRound(pickRound());
    setPosterRotate(pickPosterRotate());
  }, []);

  useEffect(() => {
    if (screen === "intro") {
      const timer = window.setTimeout(() => {
        setIsIdle(true);
      }, 5000);
      return () => window.clearTimeout(timer);
    } else {
      setIsIdle(false);
    }
  }, [screen]);

  useEffect(() => {
    if (screen !== "search") {
      return;
    }

    if (feedback === "wrong") {
      const timer = window.setTimeout(() => {
        setFeedback("idle");
        setSelectedId(null);
      }, 820);

      return () => window.clearTimeout(timer);
    }

    if (feedback === "correct") {
      const revealTimer = window.setTimeout(() => {
        setRevealed(true);
      }, 120);

      const resultTimer = window.setTimeout(() => {
        setScreen("result");
      }, 2500);

      return () => {
        window.clearTimeout(revealTimer);
        window.clearTimeout(resultTimer);
      };
    }
  }, [feedback, screen]);

  function resetGame(nextScreen: Screen) {
    setFeedback("idle");
    setSelectedId(null);
    setRevealed(false);
    if (nextScreen === "intro") {
      setRound(pickRound());
      setPosterRotate(pickPosterRotate());
    }
    setScreen(nextScreen);
  }

  function handleStart() {
    resetGame("search");
  }

  function handleReplay() {
    resetGame("intro");
  }

  function handleHotspotSelect(hotspot: Hotspot) {
    if (feedback === "correct") {
      return;
    }

    setSelectedId(hotspot.id);
    setFeedback(hotspot.monster === round.monster ? "correct" : "wrong");
  }

  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        {screen === "intro" ? (
          <section className={`${styles.scene} ${styles.introScene}`}>
            <LayeredImage src="/pieces/wall-bg.png" alt="" priority className={styles.fullAsset} />

            <AssetBox
              src="/pieces/sign-find.png"
              alt="ป้ายตามหามอนสเตอร์ขนดกฟู"
              wrapperClassName={styles.introSign}
            />

            <div className={styles.posterCluster}>
              <AssetBox
                src="/pieces/sticker-behind.png"
                alt="สติ๊กเกอร์มอนสเตอร์ขนดกฟูหาย"
                wrapperClassName={styles.stickerBehind}
              />

              <div className={`${styles.shakeWrapper} ${isIdle ? styles.riseShake : ""}`}>
                <AssetBox
                  src={round.posterSrc}
                  alt="โปสเตอร์มอนสเตอร์หาย"
                  wrapperClassName={styles.posterMain}
                  style={{ transform: `rotate(${posterRotate}deg)` }}
                />
              </div>
            </div>

            <AssetBox src="/pieces/sticker-left.png" alt="" wrapperClassName={styles.stickerLeft} />
            <AssetBox
              src="/pieces/sticker-right.png"
              alt=""
              wrapperClassName={styles.stickerRight}
            />

            <button
              type="button"
              className={`${styles.imageButton} ${styles.startButton}`}
              onClick={handleStart}
              aria-label="เริ่มค้นหา"
            >
              <Image
                src={withBasePath("/pieces/button-start.png")}
                alt=""
                fill
                className={styles.asset}
                sizes="(max-width: 480px) 100vw, 430px"
              />
            </button>
          </section>
        ) : null}

        {screen === "search" ? (
          <section
            className={`${styles.scene} ${styles.searchScene} ${feedback === "wrong"
              ? styles.searchWrong
              : feedback === "correct"
                ? styles.searchCorrect
                : ""
              }`}
          >
            <LayeredImage src="/pieces/alley-bg-cnx.png" alt="" priority className={`${styles.fullAsset} ${styles.searchBg}`} />

            {/* Behind wall: orange & white — pillar overlaps these */}
            <AssetBox
              src="/pieces/shadow-orange.png"
              alt="มอนสเตอร์สีส้ม"
              wrapperClassName={`${styles.orangeVisible} ${revealed ? styles.shadowHidden : ""}`}
            />
            <AssetBox
              src="/pieces/shadow-white.png"
              alt=""
              wrapperClassName={`${styles.shadowWhite} ${revealed ? styles.shadowHidden : ""}`}
            />

            <LayeredImage src="/pieces/alley-wall.png" alt="" className={`${styles.fullAsset} ${styles.alleyWall}`} />
            <div className={styles.vignette} />

            {/* In front of wall: purple & blue */}
            <AssetBox
              src="/pieces/shadow-purple.png"
              alt=""
              wrapperClassName={`${styles.shadowPurple} ${revealed ? styles.shadowHidden : ""}`}
            />
            <AssetBox
              src="/pieces/shadow-blue.png"
              alt=""
              wrapperClassName={`${styles.shadowBlue} ${revealed ? styles.shadowHidden : ""}`}
            />

            {/* Colored reveals on correct answer */}
            <AssetBox
              src="/pieces/monster-orange.png"
              alt="มอนสเตอร์สีส้ม"
              wrapperClassName={`${styles.revealOrange} ${revealed ? styles.revealVisible : ""}`}
            />
            <AssetBox
              src="/pieces/monster-white.png"
              alt="มอนสเตอร์สีขาว"
              wrapperClassName={`${styles.revealWhite} ${revealed ? styles.revealVisible : ""}`}
            />
            <AssetBox
              src="/pieces/monster-purple.png"
              alt="มอนสเตอร์สีม่วง"
              wrapperClassName={`${styles.revealPurple} ${revealed ? styles.revealVisible : ""}`}
            />
            <AssetBox
              src="/pieces/monster-blue.png"
              alt="มอนสเตอร์สีฟ้า"
              wrapperClassName={`${styles.revealBlue} ${revealed ? styles.revealVisible : ""}`}
            />

            {feedback !== "correct" && HOTSPOTS.map((hotspot) => {
              const isSelected = hotspot.id === selectedId;
              const hotspotState =
                isSelected && feedback === "wrong"
                  ? styles.hotspotWrong
                  : "";

              return (
                <button
                  key={hotspot.id}
                  type="button"
                  aria-label={`ตรวจสอบ ${hotspot.label}`}
                  className={`${styles.hotspot} ${hotspotState}`}
                  style={{
                    left: hotspot.left,
                    top: hotspot.top,
                    width: hotspot.width,
                    height: hotspot.height,
                    maskImage: `url(${withBasePath(hotspot.shadowSrc)})`,
                    WebkitMaskImage: `url(${withBasePath(hotspot.shadowSrc)})`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                  onClick={() => handleHotspotSelect(hotspot)}
                >
                  <QuestionMarkIcon className={styles.hotspotIcon} />
                </button>
              );
            })}

            <AssetBox
              src="/pieces/sign-find.png"
              alt="ป้ายตามหามอนสเตอร์ขนดกฟู"
              wrapperClassName={styles.searchSign}
            />
          </section>
        ) : null}

        {screen === "result" ? (
          <section className={`${styles.scene} ${styles.resultScene}`}>
            <header className={styles.headerLogos}>
              <div className={styles.leftLogos}>
                <div className={`${styles.logoBox} ${styles.thailandLogo}`}>
                  <Image
                    src={withBasePath("/pieces/Thailand.png")}
                    alt="Amazing Thailand"
                    fill
                    className={styles.logoImage}
                  />
                </div>
                <div className={styles.logoDivider}></div>
                <div className={`${styles.logoBox} ${styles.kremeLogo}`}>
                  <Image
                    src={withBasePath("/pieces/Kreme.png")}
                    alt="Signature"
                    fill
                    className={styles.logoImage}
                  />
                </div>
              </div>
              <div className={`${styles.logoBox} ${styles.artXpLogo}`}>
                <Image
                  src={withBasePath("/pieces/ArtXP.png")}
                  alt="ART XP"
                  fill
                  className={styles.logoImage}
                />
              </div>
            </header>

            <LayeredImage
              src="/pieces/result-full-cnx.png"
              alt="ฉากสรุปผลหลังค้นหามอนสเตอร์สำเร็จ"
              priority
              className={styles.fullAsset}
            />

            <AssetBox
              src="/pieces/sign-gap.png"
              alt="Mind the Gap - Lost Furry Monster in Thailand"
              wrapperClassName={styles.resultSign}
            />

            <a
              href="https://maps.app.goo.gl/AJ9A3ySb9r1BCgMD7"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.imageButton} ${styles.mapButton}`}
              aria-label="ดูแผนที่"
            >
              <Image
                src={withBasePath("/pieces/button-map.png")}
                alt=""
                fill
                className={styles.asset}
                sizes="(max-width: 480px) 100vw, 150px"
              />
            </a>

            <button
              type="button"
              className={`${styles.imageButton} ${styles.replayButton}`}
              onClick={handleReplay}
              aria-label="เล่นอีกครั้ง"
            >
              <Image
                src={withBasePath("/pieces/button-replay.png")}
                alt=""
                fill
                className={styles.asset}
                sizes="(max-width: 480px) 100vw, 430px"
              />
            </button>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function LayeredImage({
  alt,
  className,
  priority,
  src,
}: {
  alt: string;
  className?: string;
  priority?: boolean;
  src: string;
}) {
  return (
      <Image
        src={withBasePath(src)}
        alt={alt}
        fill
        priority={priority}
      className={className}
      sizes="(max-width: 480px) 100vw, 430px"
    />
  );
}

function AssetBox({
  alt,
  src,
  style,
  wrapperClassName,
}: {
  alt: string;
  src: string;
  style?: React.CSSProperties;
  wrapperClassName?: string;
}) {
  return (
    <div className={wrapperClassName} style={style}>
      <Image
        src={withBasePath(src)}
        alt={alt}
        fill
        className={styles.asset}
        sizes="(max-width: 480px) 100vw, 430px"
      />
    </div>
  );
}

function pickPosterRotate() {
  return parseFloat((Math.random() * 8 - 4).toFixed(1));
}

function pickRound(): RoundConfig {
  return ROUND_VARIANTS[Math.floor(Math.random() * ROUND_VARIANTS.length)];
}

function withBasePath(src: string) {
  if (!src.startsWith("/")) {
    return src;
  }

  return `${assetBasePath}${src}`;
}

function QuestionMarkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 110"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="m52.785 37.504c-7.5781 2.8984-12.48 10.477-12.48 18.723v5.1328c0 1.8906 1.5312 3.4219 3.4219 3.4219h12.105c1.8906 0 3.4219-1.5312 3.4219-3.4219v-5.1328c0-0.66797 0.44531-1.1133 0.66797-1.3359 10.699-4.2344 17.605-14.934 17.16-26.523-0.67188-13.816-12.039-25.184-25.859-25.852-7.5781-0.22266-14.711 2.2305-20.059 7.5781-4.5 4.3125-7.4219 10.043-8.2344 16.129-0.25 1.8555 1.2695 3.4844 3.1406 3.4844h12.875c1.3945 0 2.6289-0.91406 3.0078-2.2578 0.40234-1.4141 1.1875-2.7344 2.3633-3.7578 1.5586-1.5586 3.7891-2.4531 6.2422-2.2305 4.2344 0.22266 7.8008 3.7891 8.0234 8.0234-0.44922 3.5625-2.4531 6.6836-5.7969 8.0195z" />
      <path d="m61.566 85.598c0 6.5742-5.3281 11.902-11.902 11.902-6.5742 0-11.902-5.3281-11.902-11.902 0-6.5742 5.3281-11.902 11.902-11.902 6.5742 0 11.902 5.3281 11.902 11.902" />
    </svg>
  );
}
