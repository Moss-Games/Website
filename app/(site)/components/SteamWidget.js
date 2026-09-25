import { translateSteamReviews } from "@/lib/i18n/content-utils";
import styles from "./SteamWidget.module.css";

// Live price/discount + review summary for a Steam game, fetched in
// app/(site)/projects/[slug]/page.js via lib/steam.js's fetchSteamLiveStats.
// Renders nothing (not even a wrapper) when both pieces are unavailable
// (e.g. an unlisted/delisted app, or Steam being unreachable), so the game
// page never shows an empty box.
function reviewTone(percentPositive) {
  if (percentPositive >= 80) return styles.reviewsPositive;
  if (percentPositive >= 50) return styles.reviewsMixed;
  return styles.reviewsNegative;
}

export default function SteamWidget({ stats, ofLabel = "of", reviewsLabel = "reviews", freeToPlayLabel = "Free to Play", locale = "en" }) {
  const { price, reviews } = stats || {};
  if (!price && !reviews) return null;

  return (
    <div className={styles.widget}>
      {reviews && (
        <div className={`${styles.reviews} ${reviewTone(reviews.percentPositive)}`}>
          {/* reviews.description ("Very Positive", ...) is Steam's own live
              text, mapped to Steam's French wording in French. */}
          <span className={styles.reviewsDesc}>{translateSteamReviews(reviews.description, locale)}</span>
          <span className={styles.reviewsCount}>
            {reviews.percentPositive}% {ofLabel} {reviews.totalReviews.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} {reviewsLabel}
          </span>
        </div>
      )}
      {price && (
        <div className={styles.price}>
          {price.isFree ? (
            <span className={styles.priceFinal}>{freeToPlayLabel}</span>
          ) : (
            <>
              {price.discountPercent > 0 && (
                <span className={styles.discount}>-{price.discountPercent}%</span>
              )}
              {price.discountPercent > 0 && price.initial && (
                <span className={styles.priceInitial}>{price.initial}</span>
              )}
              <span className={styles.priceFinal}>{price.final}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
