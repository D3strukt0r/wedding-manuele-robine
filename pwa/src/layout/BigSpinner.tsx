import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

function BigSpinner() {
  return (
    <div className="h-full flex items-center justify-center flex-col text-center">
      <FontAwesomeIcon icon={faCircleNotch} spin />
    </div>
  );
}

export default BigSpinner;
