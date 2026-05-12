export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}

export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const hourInMs = 1000 * 60 * 60;
  const minuteInMs = 1000 * 60;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = now - time;
  const formatter = new Intl.RelativeTimeFormat("ko");
  if (diff >= dayInMs) {
    const days = Math.floor((now - time) / dayInMs);
    return formatter.format(-days, "days");
  }
  if (diff >= hourInMs) {
    const hours = Math.floor((now - time) / hourInMs);
    return formatter.format(-hours, "hours");
  }
  if (diff >= minuteInMs) {
    const mins = Math.floor((now - time) / minuteInMs);
    return formatter.format(-mins, "minutes");
  }
  return "방금 전";
}
