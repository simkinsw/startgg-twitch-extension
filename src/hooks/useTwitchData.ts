import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { subscribe, unsubscribe } from "../redux/VideoComponent/app";

const useTwitchData = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(subscribe());
    return () => {
      dispatch(unsubscribe());
    };
  }, [dispatch]);
};

export default useTwitchData;
