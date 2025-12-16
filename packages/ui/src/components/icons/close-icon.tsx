import { cn } from "../../lib/utils";

function CloseIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clipPath="url(#clip0_8673_11974)">
        <path
          d="M18 6L6 18M6 6L18 18"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_8673_11974">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   className={cn(className)}
    //   width="24"
    //   height="24"
    //   viewBox="0 0 24 24"
    //   fill="none"
    // >
    //   <g clipPath="url(#clip0_8653_5903)">
    //     <path
    //       d="M18 6L6 18M6 6L18 18"
    //       stroke="white"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     />
    //   </g>
    //   <defs>
    //     <clipPath id="clip0_8653_5903">
    //       <rect width="24" height="24" fill="white" />
    //     </clipPath>
    //   </defs>
    // </svg>
  );
}
export { CloseIcon };
