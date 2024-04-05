import {SVGProps} from "react";

export default function Drink(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5.33333 31.7809V28.2497H14.2222V19.4217L0 3.53121V0H32V3.53121L17.7778 19.4217V28.2497H26.6667V31.7809H5.33333ZM7.91111 7.06243H24.0889L27.2889 3.53121H4.71111L7.91111 7.06243ZM16 16.067L20.9333 10.5936H11.0667L16 16.067Z"
      />
    </svg>
  );
}
