import { observer } from "mobx-react";

export const ModesHistory = observer(({ system }) => {
  return (
    <iframe
      src={`http://monitoring.s4ga.tech/stats/modes.php?system=${system}`}
      width="100%"
      height="400px"
      frameBorder="0"
    ></iframe>
  );
});
