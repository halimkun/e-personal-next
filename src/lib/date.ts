// 2023-11-16 12:10:59 from that string to "16, Nov, 2023 12:10:59"
export function getDate(date: Date | string) {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

// get the time from a date string
export function getTime(date: Date | string) {
  return new Date(date).toLocaleString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })
}