import Image from "next/image";
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
      <span className={styles.iconWrap}>
        {discord.iconUrl ? (
          <Image className={styles.icon} src={discord.iconUrl} alt="" width={48} height={48} />
        ) : (
          <span className={styles.icon} />
        )}
        <svg className={styles.badge} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#5865f2" />
          <path
            fill="#fff"
            d="M16.98 8.322a13.876 13.876 0 00-3.415-1.056.052.052 0 00-.055.026c-.147.262-.31.605-.425.874a12.816 12.816 0 00-3.836 0 8.965 8.965 0 00-.432-.874.054.054 0 00-.055-.026 13.838 13.838 0 00-3.414 1.056.049.049 0 00-.023.02C.293 11.86-.176 15.283.055 18.663a.058.058 0 00.022.04 13.951 13.951 0 004.199 2.122.055.055 0 00.059-.02c.323-.441.611-.907.858-1.397a.053.053 0 00-.029-.074 9.184 9.184 0 01-1.312-.625.054.054 0 01-.005-.09c.088-.066.176-.135.26-.204a.052.052 0 01.055-.007c2.752 1.257 5.73 1.257 8.449 0a.052.052 0 01.056.006c.084.07.172.139.26.205a.054.054 0 01-.004.09 8.62 8.62 0 01-1.313.624.053.053 0 00-.028.075c.25.49.538.955.858 1.396a.055.055 0 00.059.021 13.902 13.902 0 004.205-2.122.054.054 0 00.022-.04c.276-3.907-.463-7.297-1.956-10.32a.043.043 0 00-.022-.021zM6.678 16.607c-.826 0-1.51-.761-1.51-1.694 0-.933.669-1.694 1.51-1.694.848 0 1.525.768 1.51 1.694 0 .933-.669 1.694-1.51 1.694zm5.585 0c-.826 0-1.51-.761-1.51-1.694 0-.933.669-1.694 1.51-1.694.849 0 1.526.768 1.51 1.694 0 .933-.661 1.694-1.51 1.694z"
          />
        </svg>
      </span>
      <span className={styles.text}>
        <p className={styles.platform}>Discord</p>
        <p className={styles.name}>{discord.name}</p>
        {discord.memberCount != null && (
          <p className={styles.members}>{discord.memberCount} members</p>
        )}
      </span>
    </a>
  );
}
