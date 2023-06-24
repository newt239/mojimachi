import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import ReactGA from "react-ga4";

const usePageTracking = () => {
  const location = useLocation();

  const GA_ID = "G-G8QF4D0N3Y";

  useEffect(() => {
    ReactGA.initialize(GA_ID);
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);
};

export default usePageTracking;
