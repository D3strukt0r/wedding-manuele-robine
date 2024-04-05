import {SVGProps} from "react";

export default function Heart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 35 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M17.5 31.8926L14.9625 29.6332C12.0167 26.9972 9.58125 24.7233 7.65625 22.8115C5.73125 20.8997 4.2 19.1834 3.0625 17.6626C1.925 16.1418 1.13021 14.7442 0.678125 13.4696C0.226042 12.1951 0 10.8916 0 9.5591C0 6.83621 0.91875 4.5623 2.75625 2.73738C4.59375 0.91246 6.88333 0 9.625 0C11.1417 0 12.5854 0.318637 13.9563 0.95591C15.3271 1.59318 16.5083 2.49116 17.5 3.64984C18.4917 2.49116 19.6729 1.59318 21.0437 0.95591C22.4146 0.318637 23.8583 0 25.375 0C28.1167 0 30.4062 0.91246 32.2437 2.73738C34.0812 4.5623 35 6.83621 35 9.5591C35 10.8916 34.774 12.1951 34.3219 13.4696C33.8698 14.7442 33.075 16.1418 31.9375 17.6626C30.8 19.1834 29.2687 20.8997 27.3438 22.8115C25.4187 24.7233 22.9833 26.9972 20.0375 29.6332L17.5 31.8926ZM17.5 27.2C20.3 24.7088 22.6042 22.5725 24.4125 20.791C26.2208 19.0096 27.65 17.4598 28.7 16.1418C29.75 14.8239 30.4792 13.6507 30.8875 12.6224C31.2958 11.594 31.5 10.5729 31.5 9.5591C31.5 7.82108 30.9167 6.37274 29.75 5.21406C28.5833 4.05538 27.125 3.47604 25.375 3.47604C24.0042 3.47604 22.7354 3.85985 21.5688 4.62748C20.4021 5.3951 19.6 6.37274 19.1625 7.56038H15.8375C15.4 6.37274 14.5979 5.3951 13.4312 4.62748C12.2646 3.85985 10.9958 3.47604 9.625 3.47604C7.875 3.47604 6.41667 4.05538 5.25 5.21406C4.08333 6.37274 3.5 7.82108 3.5 9.5591C3.5 10.5729 3.70417 11.594 4.1125 12.6224C4.52083 13.6507 5.25 14.8239 6.3 16.1418C7.35 17.4598 8.77917 19.0096 10.5875 20.791C12.3958 22.5725 14.7 24.7088 17.5 27.2Z"
      />
    </svg>
  );
}
