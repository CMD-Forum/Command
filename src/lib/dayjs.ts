import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(advancedFormat);

dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      m: "1 min.",
      mm: "%d min.",
      h: "1 hr.",
      hh: "%d hr.",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "1 yr.",
      yy: "%d yrs."
    }
  })

export default dayjs