import { useField } from "@unform/core";
import React, { useEffect, useRef } from "react";

export default function Input({ name, label, ...rest }) {
  const inputRef = useRef(null);

  const { fieldName, registerField, defaultValue, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  return (
    <>
      <label htmlFor={fieldName}>{label}</label>
      <input id={fieldName} type="text" ref={inputRef} defaultValue={defaultValue} {...rest} />
      {error && <span style={{ color: "#f00", zIndex: 30, fontSize: "1.2rem" }}>{error}</span>}
    </>
  );
}
