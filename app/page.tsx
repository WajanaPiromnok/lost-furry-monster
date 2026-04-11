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
      }, 5000);

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
                src="/pieces/button-start.png"
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
            <LayeredImage src="/pieces/alley-bg.png" alt="" priority className={`${styles.fullAsset} ${styles.searchBg}`} />

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
                    maskImage: `url(${hotspot.shadowSrc})`,
                    WebkitMaskImage: `url(${hotspot.shadowSrc})`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                  onClick={() => handleHotspotSelect(hotspot)}
                >
                  <span>?</span>
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
            <LayeredImage
              src="/pieces/result-full.png"
              alt="ฉากสรุปผลหลังค้นหามอนสเตอร์สำเร็จ"
              priority
              className={styles.fullAsset}
            />

            <AssetBox
              src="/pieces/sign-gap.png"
              alt="Mind the Gap - Lost Furry Monster in Thailand"
              wrapperClassName={styles.resultSign}
            />

            <button
              type="button"
              className={`${styles.imageButton} ${styles.replayButton}`}
              onClick={handleReplay}
              aria-label="เล่นอีกครั้ง"
            >
              <Image
                src="/pieces/button-replay.png"
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
      src={src}
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
        src={src}
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
