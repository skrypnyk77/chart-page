import { observer } from "mobx-react";

export const ExportHistory = observer(({ system }) => {
  return (
    <iframe
      src={`http://monitoring.s4ga.tech/stats/export.php?system=${system}`}
      width="100%"
      height="500px"
      frameBorder="0"
    ></iframe>
  );
});