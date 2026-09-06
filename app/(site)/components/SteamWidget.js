import styles from "./SteamWidget.module.css";

// Live price/discount + review summary for a Steam game, fetched in
// app/(site)/games/[slug]/page.js via lib/steam.js's fetchSteamLiveStats.
// Renders nothing (not even a wrapper) when both pieces are unavailable —
// e.g. an unlisted/delisted app, or Steam being unreachable — so the game
// page never shows an empty box.
function reviewTone(percentPositive) {
  if (percentPositive >= 80) return styles.reviewsPositive;
  if (percentPositive >= 50) return styles.reviewsMixed;
  return styles.reviewsNegative;
}

export default function SteamWidget({ stats }) {
  const { price, reviews } = stats || {};
  if (!price && !reviews) return null;

  return (
    <div className={styles.widget}>
      {reviews && (
        <div className={`${styles.reviews} ${reviewTone(reviews.percentPositive)}`}>
          <span className={styles.reviewsDesc}>{reviews.description}</span>
          <span className={styles.reviewsCount}>
            {reviews.percentPositive}% of {reviews.totalReviews.toLocaleString()} reviews
          </span>
        </div>
      )}
      {price && (
        <div className={styles.price}>
          {price.isFree ? (
            <span className={styles.priceFinal}>Free to Play</span>
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
