/// <reference types="vite/client" />

declare module '*.svg' {
  import * as React from 'react';
  import { SVGProps } from 'react';
  export const ReactComponent: React.FC<SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
