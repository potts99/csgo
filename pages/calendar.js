import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { useQuery } from "react-query";
import React from "react";
import ArrangeFriendly from "../components/ArrangeFriendly";

const locales = {
  "en-US": enUS,
};

async function fixtures() {
  const res = await fetch(`/api/team/managed_fixtures`);
  return res.json();
}

export default function CalendarView() {
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const [event, setEvent] = React.useState([]);

  const { data, status, refetch } = useQuery("fixtures", fixtures);

  React.useEffect(() => {
    if (data && data.fixtures) {
      const t = data.fixtures;

      let n = [];

      for (let k = 0; k < t.length; k++) {
        n.push({
          title: t[k].opponent,
          start: t[k].date,
          end: t[k].date,
        });
      }

      setEvent(n)
    }
  }, [data]);

  return (
    <div>
      {status === "loading" && <div>Loading</div>}

      {status === "success" && (
        <div>
          <div className="py-2">
            <ArrangeFriendly />
          </div>
          <Calendar
            defaultDate={new Date("01/01/2021")}
            localizer={localizer}
            events={event}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "60vh" }}
            views={["month"]}
          />
        </div>
      )}
    </div>
  );
}
