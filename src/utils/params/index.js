import React from "react";
import { useParams } from "react-router-dom";

function Params(WrappedComponent) {
  return function WithRouteParamsComponent(props) {
    const { id } = useParams();
    return <WrappedComponent {...props} id={id} />;
  };
}

export default Params;
