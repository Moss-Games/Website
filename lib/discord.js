// Discord's own iframe widget (discord.com/widget) only ever shows who's
// currently online, not the server's total member count, and that's not
// configurable — so instead of embedding it, this fetches the invite's
// public info server-side (no auth needed) and renders our own small card.
const INVITE_CODE = "sEzbqYjmZ4";

export async function getDiscordInvite() {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();

    return {
      name: data.guild?.name || "MossGames",
      iconUrl: data.guild?.icon
        ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`
        : null,
      memberCount: data.approximate_member_count ?? null,
      onlineCount: data.approximate_presence_count ?? null,
      inviteUrl: `https://discord.gg/${INVITE_CODE}`,
    };
  } catch {
    return null;
  }
}
