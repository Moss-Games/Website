import styles from "./DiscordCard.module.css";

export default function DiscordCard({ discord }) {
  if (!discord) return null;

  return (
    <a
      className={styles.card}
      href={discord.inviteUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {discord.iconUrl ? (
        <img className={styles.icon} src={discord.iconUrl} alt="" />
      ) : (
        <span className={styles.icon} />
      )}
      <span className={styles.text}>
        <p className={styles.name}>{discord.name}</p>
        {discord.memberCount != null && (
          <p className={styles.members}>{discord.memberCount} members</p>
        )}
      </span>
    </a>
  );
}
