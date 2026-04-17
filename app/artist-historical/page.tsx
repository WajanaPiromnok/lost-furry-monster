"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { boonTookMon } from "../fonts";
import styles from "./artist.module.css";

const BASE_PATH = "/mrkreme/thailandtour/lost-furry-monster";
const isProd = process.env.NODE_ENV === "production";
const getAssetPath = (path: string) => (isProd ? `${BASE_PATH}${path}` : path);

export default function ArtistHistoricalPage() {
  return (
    <main className={`${styles.page} ${boonTookMon.variable}`}>
      <div className={styles.frame}>
        {/* Background Wall */}
        <Image
          src={getAssetPath("/artist/wall-bg.png")}
          alt=""
          fill
          priority
          className={styles.bgWall}
        />

        <div className={styles.scene}>
          {/* Top Logos */}
          <header className={styles.headerLogos}>
            <div className={styles.leftLogos}>
              <div className={`${styles.logoBox} ${styles.thailandLogo}`}>
                <Image
                  src={getAssetPath("/artist/Thailand.png")}
                  alt="Amazing Thailand"
                  fill
                  className={styles.logoImage}
                />
              </div>
              <div className={styles.logoDivider}></div>
              <div className={`${styles.logoBox} ${styles.kremeLogo}`}>
                <Image
                  src={getAssetPath("/artist/Kreme.png")}
                  alt="Signature"
                  fill
                  className={styles.logoImage}
                />
              </div>
            </div>
            <div className={`${styles.logoBox} ${styles.artXpLogo}`}>
              <Image
                src={getAssetPath("/artist/ArtXP.png")}
                alt="ART XP"
                fill
                className={styles.logoImage}
              />
            </div>
          </header>

          <div className={styles.contentWrapper}>
            {/* Torn Paper Section */}
            <section
              className={styles.tornPaper}
              style={{ backgroundImage: `url('${getAssetPath("/artist/BG.png")}')` }}
            >
              {/* Artist Badge */}
              {/* <div className={styles.artistBadge}>
                <div className={styles.portraitCircle}>
                  <Image
                    src="/artist/Andy.png"
                    alt="Andy Varagun Chongthanapipat"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.badgeInfo}>
                  <span className={styles.artistRealName}>
                    Andy Varagun Chongthanapipat
                  </span>
                  <span className={styles.knownAs}>หรือที่รู้จักในชื่อ</span>
                  <span className={styles.moniker}>MRKREME</span>
                </div>
              </div> */}

              {/* Bio Text */}
              <div className={styles.bioText}>
                <p>
                  Andy Varagun Chongthanapipat หรือที่รู้จักในชื่อ MRKREME
                  โลกในจินตนาการนั้นไม่เคยจางหาย หากกลับค่อยๆ พัฒนา ชัดเจน และมีชีวิตมากยิ่งขึ้น
                  ควบคู่ไปกับเส้นทางการสร้างสรรค์ของเขา
                </p>
                <p>
                  ความหลงใหลใน “มอนสเตอร์” ตั้งแต่วัยเยาว์ ได้กลายเป็นแก่นสำคัญของผลงาน
                  มอนสเตอร์ในมุมมองของเขา ไม่ได้ถูกจำกัดด้วยความน่ากลัว หากแต่เป็นรูปทรงของความเป็นไปได้—
                  พื้นที่ที่ความคิดสร้างสรรค์สามารถแปรเปลี่ยนได้อย่างไร้ขีดจำกัด
                  ทั้งน่ากลัวและน่ารักดำรงอยู่ร่วมกัน โดยเฉพาะอิทธิพลจากมอนสเตอร์ยุค 1980s
                  ซึ่งโดดเด่นด้วยสีสันจัดจ้านและรูปแบบที่เปี่ยมด้วยจินตนาการ
                </p>
              </div>
            </section>

            {/* Placeholder Red Box for future poster */}
            {/* <div className={styles.placeholderRedBox}>
              RED POSTER READY
            </div> */}

            {/* Action Buttons (Tapes) */}
            <div className={styles.buttonCluster}>
              <button className={styles.tapeButton}>
                <Image
                  src={getAssetPath("/artist/play-ar.png")}
                  alt=""
                  fill
                  style={{ objectFit: "contain" }}
                />
              </button>

              <Link href="https://www.instagram.com/mrkreme?igsh=MTEzZjU5MW1mdDA5cA==" target="_blank" rel="noopener noreferrer" className={styles.tapeButton}>
                <Image
                  src={getAssetPath("/artist/Contact.png")}
                  alt=""
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Background Posters/Stickers */}


        {/* Decorative Background Stickers */}
        {/* <div className={`${styles.backgroundSticker} ${styles.stickerTopRight}`}>
          <Image
            src="/pieces/sticker-left.png"
            alt=""
            width={160}
            height={220}
            style={{ objectFit: "contain" }}
          />
        </div> */}
        {/* <div className={`${styles.backgroundSticker} ${styles.stickerBottomLeft}`}>
          <Image
            src="/pieces/sticker-right.png"
            alt=""
            width={140}
            height={140}
            style={{ objectFit: "contain" }}
          />
        </div> */}
      </div>
    </main>
  );
}
