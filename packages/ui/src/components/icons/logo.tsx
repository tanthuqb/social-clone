/* eslint-disable no-redeclare */
import * as React from "react";

import { cn } from "../../lib/utils";

const Logo = React.forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGSVGElement>
>(({ className, ...props }, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="40"
    viewBox="0 0 44 40"
    fill="none"
    className={cn("text-slate-900 transition-all", className)}
    {...props}
  >
    <g clipPath="url(#clip0_5589_6316)">
      <path
        d="M40.5718 16.151C37.8727 12.9119 34.7087 13.7991 34.7087 13.7991C35.1045 13.6938 35.5966 13.8392 36.2436 14.2986C38.415 15.8433 41.1078 24.081 33.6848 27.8848C30.4727 29.5306 26.7308 29.067 23.9019 26.0872L8.95117 29.8341C12.8522 36.8032 23.0413 42.5036 33.109 38.8726C38.7061 36.8538 41.8784 32.3566 43.2248 27.5413C43.2876 27.1156 44.2048 20.5111 40.5718 16.151Z"
        fill="url(#paint0_linear_5589_6316)"
      />
      <path
        opacity="0.6"
        d="M30.7216 34.4346C42.8183 33.0079 43.3732 20.8694 40.0564 16.68C38.9705 15.2869 37.4985 14.2492 35.8266 13.698C35.4508 13.686 35.075 13.7228 34.7085 13.8076C35.1042 13.7022 35.5963 13.8477 36.2433 14.3071C38.4147 15.8518 41.1076 24.0895 33.6845 27.8933C30.4724 29.5391 26.7305 29.0755 23.9016 26.0957L17.668 27.6488C18.8657 30.2304 22.3437 35.4229 30.7216 34.4346Z"
        fill="url(#paint1_linear_5589_6316)"
      />
      <path
        d="M17.5353 12.6632C14.0677 15.2194 11.7686 18.823 13.1904 21.826C14.4216 24.416 16.9113 23.8554 16.9113 23.8554C4.97583 32.7464 1.98149 28.3547 0.415224 23.4339C-1.15104 18.5132 1.33656 7.04913 12.8805 1.54046C18.0064 -0.901979 24.8369 -0.661739 25.5907 3.87965C26.355 8.49057 19.8428 10.9583 17.5353 12.6632Z"
        fill="url(#paint2_linear_5589_6316)"
      />
      <path
        opacity="0.6"
        d="M20.7996 5.11902C18.4754 3.04958 6.82675 7.91971 6.0499 17.8939C5.60389 23.6238 8.22969 26.4035 10.6566 27.7437C12.4134 26.9282 14.4759 25.6743 16.9154 23.8556C16.9154 23.8556 14.4257 24.4162 13.1944 21.8262C11.7664 18.8232 14.0655 15.2196 17.5331 12.6634C18.1299 12.2251 18.9988 11.7341 19.9662 11.1672C19.9704 11.1693 23.6411 7.64997 20.7996 5.11902Z"
        fill="url(#paint3_linear_5589_6316)"
      />
      <path
        d="M31.4816 6.28398C26.8226 7.54841 27.4717 17.7902 17.4941 23.5328C9.89515 27.9077 1.98843 28.3545 0.417969 23.4338C5.82871 40.4782 21.3825 33.6503 26.1337 29.6442C33.3976 23.5181 32.3799 14.2288 34.7754 13.782C35.2549 13.6745 38.1047 13.1941 40.5672 16.1507C44.2002 20.5108 43.2893 27.109 43.2202 27.541C44.217 23.9711 44.2107 20.2264 43.4296 17.1833C41.6686 10.2711 36.1406 5.01535 31.4816 6.28398Z"
        fill="url(#paint4_linear_5589_6316)"
      />
      <path
        opacity="0.33"
        d="M37.6336 10.3681C41.4236 11.622 42.8894 15.4258 43.1218 16.0917C41.0823 9.72958 35.8935 5.08283 31.4816 6.28403C26.8226 7.54845 27.4717 17.7903 17.4941 23.5329C9.89515 27.9078 1.98842 28.3545 0.417969 23.4338C0.945064 25.1538 1.68292 26.8011 2.61451 28.3377C5.64445 30.405 10.4165 31.9518 17.2491 29.6189C32.7987 24.3105 26.944 6.82773 37.6336 10.3681Z"
        fill="url(#paint5_linear_5589_6316)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_5589_6316"
        x1="44.9251"
        y1="18.6476"
        x2="20.6936"
        y2="34.6547"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.01" stopColor="#E05220" />
        <stop offset="0.2" stopColor="#E46321" />
        <stop offset="0.56" stopColor="#F08E24" />
        <stop offset="0.97" stopColor="#FFC627" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_5589_6316"
        x1="36.0277"
        y1="10.1998"
        x2="25.4541"
        y2="36.9638"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="0.12" stopColor="white" stopOpacity="0.86" />
        <stop offset="0.52" stopColor="white" stopOpacity="0.4" />
        <stop offset="0.8" stopColor="white" stopOpacity="0.11" />
        <stop offset="0.93" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_5589_6316"
        x1="2.78797"
        y1="29.6324"
        x2="22.2755"
        y2="-4.07589"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.06" stopColor="#6702B7" />
        <stop offset="0.17" stopColor="#5119C8" />
        <stop offset="0.29" stopColor="#5A2ED7" />
        <stop offset="0.42" stopColor="#3F4FE3" />
        <stop offset="0.55" stopColor="#4C79ED" />
        <stop offset="0.68" stopColor="#569FF4" />
        <stop offset="0.83" stopColor="#5BC9F8" />
        <stop offset="1" stopColor="#5DE6F9" />
        <stop offset="1" stopColor="#5DE6F9" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_5589_6316"
        x1="17.9602"
        y1="-0.575098"
        x2="9.94393"
        y2="25.0088"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="0.12" stopColor="white" stopOpacity="0.86" />
        <stop offset="0.56" stopColor="white" stopOpacity="0.4" />
        <stop offset="0.86" stopColor="white" stopOpacity="0.11" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_5589_6316"
        x1="48.0531"
        y1="16.4731"
        x2="-0.113315"
        y2="23.8177"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9D0B0B" />
        <stop offset="0.19" stopColor="#BD1432" />
        <stop offset="0.43" stopColor="#D71818" />
        <stop offset="0.65" stopColor="#CC2F84" />
        <stop offset="0.85" stopColor="#DC36B0" />
        <stop offset="1" stopColor="#E239B2" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_5589_6316"
        x1="38.0775"
        y1="2.40647"
        x2="14.1971"
        y2="27.5046"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="0.45" stopColor="white" stopOpacity="0.53" />
        <stop offset="0.83" stopColor="white" stopOpacity="0.15" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <clipPath id="clip0_5589_6316">
        <rect width="44" height="40" fill="white" />
      </clipPath>
    </defs>
  </svg>
));
Logo.displayName = "Logo";

export { Logo };
