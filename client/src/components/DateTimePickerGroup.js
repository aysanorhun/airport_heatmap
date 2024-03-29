import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function DateTimePickerGroup({ minMaxWindows, windowTime, onChange_Start, onChange_End, startInspectTime }) {
  return (
    <Stack direction={"row"} spacing={2}>
      <DateTimePicker
        label="Start Time"
        reduceAnimations={true}
        skipDisabled={true}
        closeOnSelect={false}
        ampm={false}
        disabled={minMaxWindows ? false : true}
        onChange={onChange_Start}
        timeSteps={{ hours: 1, minutes: 1, seconds: windowTime }}
        views={["day", "hours", "minutes", "month", "seconds", "year"]}
        format={"DD/MM/YYYY HH:mm:ss"}
        minDateTime={minMaxWindows ? dayjs.unix(minMaxWindows[0].WINDOW_START) : dayjs.unix(0)}
        maxDateTime={minMaxWindows ? dayjs.unix(minMaxWindows[1].WINDOW_START) : dayjs.unix(0)}
      />

      <DateTimePicker
        label="End Time"
        reduceAnimations={true}
        skipDisabled={true}
        closeOnSelect={false}
        ampm={false}
        disabled={startInspectTime === null}
        onChange={onChange_End}
        timeSteps={{ hours: 1, minutes: 1, seconds: windowTime }}
        views={["day", "month", "year", "hours", "minutes", "seconds"]}
        format={"DD/MM/YYYY HH:mm:ss"}
        minDateTime={startInspectTime}
        maxDateTime={minMaxWindows ? dayjs.unix(minMaxWindows[1].WINDOW_START) : dayjs.unix(0)}
      />
    </Stack>
  );
}

export default DateTimePickerGroup;
