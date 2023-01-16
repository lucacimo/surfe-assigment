import React, {
  useRef,
  useEffect,
  PropsWithChildren,
  MutableRefObject,
} from "react";

function useOutsideAlerter(
  ref: MutableRefObject<HTMLDivElement | null>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

type OutsideAlerterProps = {
  callback: () => void;
};

const OutsideAlerter = ({
  children,
  callback,
}: PropsWithChildren<OutsideAlerterProps>) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useOutsideAlerter(wrapperRef, callback);

  return <div ref={wrapperRef}>{children}</div>;
};

export default OutsideAlerter;
