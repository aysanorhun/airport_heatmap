import { useEffect, useState, useRef } from "react";
import ControlButtonGroup from "./ControlButtonGroup";
import DateTimePickerGroup from "./DateTimePickerGroup";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
// import Box from "@mui/material/Box"
// import Slider from "@mui/material/Slider"
// import { ThemeProvider, createTheme } from "@mui/material/styles"

// const finalTheme = createTheme({
//     components: {
//         MuiSlider: {
//             styleOverrides: {
//                 valueLabel: {
//                     backgroundColor: "black",
//                     color: "white",
//                 },
//             },
//         },
//     },
// });

function InspectMenu({ currentWindow, onSliderSet, onDateSet, onPlaySet, onLeftSet, onRightSet, windowTime }) {
  /* FETCH LAST MIN MAX WINDOW */
  const [minMaxWindows, setMinMaxWindows] = useState(null);
  /* DATE TIME PICKER GROUP */
  const [startInspectTime, setStartInspectTime] = useState(null);
  const [endInspectTime, setEndInspectTime] = useState(null);
  /* CONTROL BUTTON GROUP */
  const [isPlaying, setIsPlaying] = useState(false);
  const [isControlButtonGroupDisabled, setIsControlButtonGroupDisabled] = useState(true);
  /* SLIDER */
  // const [sliderMin, setSliderMin] = useState(0);
  // const [sliderMax, setSliderMax] = useState(0);
  /* REFS */
  const abortControllerRef = useRef(null);

  /* FETCH LAST MIN MAX WINDOW */
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    abortControllerRef.current = controller;
    const fetchMinMaxWindows = async () => {
      try {
        const res = await fetch(`http://localhost:3001/windows/firstLast`, {
          signal: signal,
          method: "GET",
        });

        const body = await res.json();
        if (body.error) {
          console.log(body.error.message);
          return;
        }
        setMinMaxWindows(body.windows);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMinMaxWindows();
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  /* DATE TIME PICKER GROUP */
  const onChange_Start = (time, context) => {
    if (!context.validationError) {
      if (endInspectTime) {
        if (dayjs(time).unix() <= dayjs(endInspectTime).unix()) {
          setIsControlButtonGroupDisabled(false);
        } else {
          setIsControlButtonGroupDisabled(true);
          setIsPlaying(false);
        }
        onDateSet(time, endInspectTime);
      }
      setStartInspectTime(dayjs(time));
    }
  };

  const onChange_End = (time, context) => {
    if (!context.validationError) {
      if (startInspectTime) {
        if (dayjs(startInspectTime).unix() <= dayjs(time).unix()) {
          setIsControlButtonGroupDisabled(false);
        } else {
          setIsControlButtonGroupDisabled(true);
          setIsPlaying(false);
        }
        onDateSet(startInspectTime, time);
      }
      setEndInspectTime(dayjs(time));
    }
  };

  /* CONTROL BUTTON GROUP */
  const onPlayChange = (isPlaying) => {
    setIsPlaying(isPlaying);
    onPlaySet(isPlaying, startInspectTime, endInspectTime);
  };

  const onLeftChange = () => {
    onLeftSet(startInspectTime);
  };

  const onRightChange = () => {
    onRightSet(endInspectTime);
  };

  /* SLIDER */
  // const onSliderChange = (event, value) => {
  //     onSliderSet(event, value);
  // }

  return (
    <Paper elevation={15} sx={{ width: "85%", height: "100%" }}>
      <Stack
        spacing={2}
        sx={{ padding: 1, width: "100%", height: "100%", display: "flex", justifyContent: "space-around" }}
      >
        <Paper sx={{ display: "flex", justifyContent: "center" }}>
          Shown Time: {currentWindow ? dayjs.unix(currentWindow).format("DD/MM/YYYY HH:mm:ss") : null}
        </Paper>

        <DateTimePickerGroup
          minMaxWindows={minMaxWindows}
          windowTime={windowTime}
          onChange_Start={onChange_Start}
          onChange_End={onChange_End}
          startInspectTime={startInspectTime}
        />

        {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <ThemeProvider theme={finalTheme}>
                        <Slider
                            key={`slider-${sliderMin}-${sliderMax}`}
                            sx={{ width: "80%", display: "flex", justifyContent: "center" }}
                            marks
                            valueLabelDisplay="auto"
                            step={windowTime}
                            min={sliderMin}
                            max={sliderMax}
                            value={currentWindow}
                            onChange={onSliderChange}
                        />
                    </ThemeProvider>
                </Box> */}

        <ControlButtonGroup
          onPlayChange={onPlayChange}
          onLeftChange={onLeftChange}
          onRigtChange={onRightChange}
          isDisabled={isControlButtonGroupDisabled}
          isPlaying={isPlaying}
        />
      </Stack>
    </Paper>
  );
}

export default InspectMenu;
