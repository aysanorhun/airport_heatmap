import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

function FloorButtonGroup({ floors, onButtonChange }) {
  const [buttonValue, setButtonValue] = useState(5);

  const onChange = (event, buttonValue) => {
    if (buttonValue !== null) {
      setButtonValue(buttonValue);
      onButtonChange(event);
    }
  };

  return (
    <ToggleButtonGroup
      color={"primary"}
      value={buttonValue}
      exclusive
      onChange={onChange}
      sx={{ display: "flex", justifyContent: "end" }}
    >
      {floors?.map((button, i) => {
        return (
          <ToggleButton key={i} value={i + 1} name={floors[i]}>
            {floors[i]}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}

export default FloorButtonGroup;
