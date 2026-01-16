import React, { useEffect } from 'react';

function usePortal(id: string) {
  const rootElemRef = React.useRef(document.createElement('div'));

  useEffect(
    function setupElement() {
      const parentElem = document.querySelector(`#${id}`);
      (parentElem as HTMLElement).appendChild(rootElemRef.current);
      return function removeElement() {
        rootElemRef.current.remove();
      };
    },
    [id]
  );

  return rootElemRef.current;
}

export default usePortal;
