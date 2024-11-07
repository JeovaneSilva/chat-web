import { format, toZonedTime } from "date-fns-tz";

export const formatarData = (dataISO: string) => {
  const timezone = "America/Fortaleza";
  const data = toZonedTime(dataISO, timezone);

  return format(data, "HH:mm", { timeZone: timezone });
};
