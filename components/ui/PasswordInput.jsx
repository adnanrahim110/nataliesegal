"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "",
  name,
  id,
  required,
  className = "",
  inputClassName = "",
}) {
  const [show, setShow] = useState(false);

  const defaultInputClassName =
    "w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500";
  const finalInputClassName = inputClassName || defaultInputClassName;

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${finalInputClassName} pr-12`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200 p-1 hover:bg-white/50 rounded-lg"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  );
}
