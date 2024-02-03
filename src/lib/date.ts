// 2023-11-16 12:10:59 from that string to "16, Nov, 2023 12:10:59"
export function getDate(date: Date | string) {
  return new Date(date).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// get the time from a date string
export function getTime(date: Date | string) {
  return new Date(date).toLocaleString("id-ID", {
    hour: "numeric",
    minute: "numeric",
  })
}

// get full date from 13 mar 2023 to 13, March, 2023
export function getFullDate(date: Date | string) {
  return new Date(date).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

// get full date with day name
export function getFullDateWithDayName(date: Date | string) {
  return new Date(date).toLocaleString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}