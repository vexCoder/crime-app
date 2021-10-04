import React from "react";

const useToggle = (bool?: boolean): [boolean, (bool?: boolean) => void] => {
  const [ check, setCheck ] = React.useState(!!bool);

  const toggle = (bool?: boolean) => {
    setCheck(typeof bool === "boolean" ? bool : prev => !prev);
  };

  return [ check, toggle ];
};

export default useToggle;