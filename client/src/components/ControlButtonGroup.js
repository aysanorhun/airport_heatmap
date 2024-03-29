import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import StopIcon from "@mui/icons-material/Stop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function ControlButtonGroup({ onPlayChange, onLeftChange, onRigtChange, isDisabled, isPlaying }) {
  const onStartStopChange = () => {
    onPlayChange(!isPlaying);
  };

  return (
    <Stack direction={"row"} spacing={1} sx={{ display: "flex", justifyContent: "center" }}>
      <IconButton onClick={onLeftChange} disabled={isDisabled}>
        <ArrowBackIcon />
      </IconButton>

      {isPlaying ? (
        <IconButton onClick={onStartStopChange} disabled={isDisabled}>
          <StopIcon />
        </IconButton>
      ) : (
        <IconButton onClick={onStartStopChange} disabled={isDisabled}>
          <PlayArrowIcon />
        </IconButton>
      )}

      <IconButton onClick={onRigtChange} disabled={isDisabled}>
        <ArrowForwardIcon />
      </IconButton>
    </Stack>
  );
}

export default ControlButtonGroup;
