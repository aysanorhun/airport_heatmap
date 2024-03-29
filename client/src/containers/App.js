import { socket } from "../socket";
import { useState, useEffect, useRef, useCallback } from "react";
import Map from "../components/Map";
import InspectMenu from "../components/InspectMenu";
import FloorButtonGroup from "../components/FloorButtonGroup";
import dayjs from "dayjs";
import "leaflet/dist/leaflet.css";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  /* APP */
  const [clients, setClients] = useState(null);
  const [floorName, setFloorName] = useState("All");
  const [isLoading, setIsLoading] = useState([false, null]);
  const [windowTime, setWindowTime] = useState(17280); // change
  /* INSPECT MENU */
  const [isInspect, setIsInspect] = useState(false);
  /* REFS */
  const abortControllerRef = useRef(null);
  const intervalRef = useRef(null);
  const windowStartRef = useRef(null); // null change

  /* CLIENT FETCH */
  const fetchClients = useCallback(async () => {
    try {
      setIsLoading([true, windowStartRef.current]);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      const signal = controller.signal;
      abortControllerRef.current = controller;

      const res = await fetch(`http://localhost:3001/clients/${windowStartRef.current}`, {
        signal: signal,
        method: "GET",
      });

      const body = await res.json();
      setIsLoading([false, null]);
      if (body.error) {
        setClients(null);
        console.log(body.error.message);
        return;
      }

      setClients(body.clients);
    } catch (err) {
      console.log(err);
    }
  }, []);

  /* SOCKET IO */
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onWindowStart = (data) => {
      windowStartRef.current = data;
      fetchClients();
    };

    socket.on("WINDOW_START", onWindowStart);

    return () => {
      socket.off("WINDOW_START", onWindowStart);
    };
  }, [fetchClients]);

  /* INSPECT BUTTON */
  const toggleInspect = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    isInspect ? socket.connect() : socket.disconnect();
    windowStartRef.current = null;
    setClients(null);
    setIsInspect(!isInspect);
  };

  /* INSPECT MENU */
  const onDateSet = (startInspectTime, endInspectTime) => {
    if (dayjs(startInspectTime).unix() <= dayjs(endInspectTime).unix()) {
      windowStartRef.current = dayjs(startInspectTime).unix();
      fetchClients();
    } else {
      if (intervalRef.current) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        setIsLoading([false, null]);
        clearInterval(intervalRef.current);
      }
    }
  };

  const onSliderSet = (event, value) => {};

  const onPlaySet = (isPlaying, startInspectTime, endInspectTime) => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (windowStartRef.current + windowTime <= dayjs(endInspectTime).unix()) {
          windowStartRef.current = windowStartRef.current + windowTime;
          fetchClients();
        }
      }, 5000);
    } else {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsLoading([false, null]);
      clearInterval(intervalRef.current);
    }
  };

  const onLeftSet = (startInspectTime) => {
    if (windowStartRef.current - windowTime >= dayjs(startInspectTime).unix()) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      windowStartRef.current = windowStartRef.current - windowTime;
      fetchClients();
    }
  };

  const onRightSet = (endInspectTime) => {
    if (windowStartRef.current + windowTime <= dayjs(endInspectTime).unix()) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      windowStartRef.current = windowStartRef.current + windowTime;
      fetchClients();
    }
  };

  /* CLIENT FILTER BY FLOOR */
  const filteredClients = floorName === "All" ? clients : clients?.filter((client) => client.FLOOR === floorName);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map clients={filteredClients} />

      <Stack
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "400",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isLoading[0] && <CircularProgress />}
        {isLoading[0]
          ? isLoading[1]
            ? `Loading: ${dayjs.unix(isLoading[1]).format("DD/MM/YYYY HH:mm:ss")}`
            : null
          : null}
      </Stack>

      <Stack
        sx={{
          position: "absolute",
          top: "0px",
          right: "0px",
          zIndex: "400",
          display: "flex",
          alignItems: "end",
        }}
      >
        <FloorButtonGroup
          floors={["D", "E", "F", "H", "All"]}
          onButtonChange={(e) => setFloorName(e.currentTarget.name)}
        />

        <Button variant="contained" type="checkbox" name={"inspectButton"} onClick={toggleInspect}>
          {isInspect ? "Close" : "Inspect"}
        </Button>

        {isInspect ? (
          <InspectMenu
            currentWindow={windowStartRef.current}
            onSliderSet={onSliderSet}
            onDateSet={onDateSet}
            onPlaySet={onPlaySet}
            onLeftSet={onLeftSet}
            onRightSet={onRightSet}
            windowTime={windowTime}
          />
        ) : (
          <Chip
            label={`Shown Time: ${
              windowStartRef.current ? dayjs.unix(windowStartRef.current).format("DD/MM/YYYY HH:mm:ss") : null
            }`}
            variant="outlined"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              "& .MuiChip-label": {
                color: "black",
                fontWeight: "bold",
                fontSize: 16,
              },
            }}
          ></Chip>
        )}
      </Stack>
    </div>
  );
}

export default App;
