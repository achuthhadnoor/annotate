import React, { useEffect, useRef, useState } from "react";

export default function Onboard() {
  // const [email, setEmail] = useState("");
  // const [code, setCode] = useState("");
  // const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  // const limit = 10;
  // const emailRef = useRef(null);
  const codeRef = useRef(null);
  const verify = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const code = codeRef?.current?.value;
    // const email = emailRef?.current?.value;
    setLoading(true);
    global.ipcRenderer.send("validate", { email: "", code });
    // gumroad(code, email);
  };
  // const nestedValue = (mainObject, key) => {
  //   try {
  //     return key
  //       .split(".")
  //       .reduce((obj, property) => obj[property], mainObject);
  //   } catch (err) {
  //     return null;
  //   }
  // };

  // const gumroad = async (code, email) => {
  //   // https://api.gumroad.com/v2/licenses/verify
  //   axios
  //     .post("https://api.gumroad.com/v2/licenses/verify", {
  //       product_permalink: "lapse_app",
  //       license_key: code,
  //       increment_uses_count: true,
  //       email: email,
  //     })
  //     .then((response) => {
  //       // if (!data?.success) {
  //       //   alert('Sorry. Something went wrong.')
  //       //   return
  //       // }

  //       const uses = nestedValue(response, "data.uses");

  //       // if (uses > limit) {
  //       //   alert("Sorry, This licence expired!");
  //       //   global.ipcRenderer.send("quit-app");
  //       //   return;
  //       // }

  //       const refunded = nestedValue(response, "data.purchase.refunded");

  //       if (refunded) {
  //         alert("Sorry. This purchase has been refunded.");
  //         global.ipcRenderer.send("quit-app");
  //         return;
  //       }

  //       const chargebacked = nestedValue(
  //         response,
  //         "data.purchase.chargebacked"
  //       );

  //       if (chargebacked) {
  //         alert("Sorry. This purchase has been chargebacked.");
  //         global.ipcRenderer.send("quit-app");
  //         return;
  //       }
  //       global.ipcRenderer.send("validate", {
  //         id: response.data.purchase.id,
  //         name: response.data.purchase.name,
  //       });
  //       // Store.set('verification', response.data)
  //       // Store.set('showMenubar', true)
  //       // MenuBar.create()
  //       // this.emitSuccess()
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       if (!error.response) {
  //         alert("Please check your internet connection.");
  //         setLoading(false);
  //       } else if (error.response.status && error.response.status >= 500) {
  //         alert("Oh no. Gumroad can't be reached. Please try again later.");
  //         setLoading(false);
  //       } else {
  //         // alert('Sorry. This license does not exist.')
  //         axios
  //           .post("https://lapse.achuth.dev/api/verify", {
  //             email: email,
  //             phrase: code,
  //           })
  //           .then((res) => {
  //             debugger;
  //             let result = res.data;
  //             if (result.status === 200) {
  //               setValid(true);
  //               if (result.message) alert(result.message);
  //               global.ipcRenderer.send("verified", result);
  //             }
  //             setLoading(false);
  //           })
  //           .catch((e) => {
  //             debugger;
  //             alert("Check your Email / Licence");
  //             setLoading(false);
  //           });
  //       }
  //     });
  // };

  useEffect(() => {
    const handleMessage = (_event, { valid }) => {
      valid && setLoading(false);
      global.ipcRenderer.send("activate");
    };
    // add a listener to 'message' channel
    global.ipcRenderer.addListener("validation-status", handleMessage);

    return () => {
      global.ipcRenderer.removeListener("validation-status", handleMessage);
    };
  }, []);

  return (
    <div className="dark:text-neutral-50 text-neutral-800 relative align-middle items-center justify-center text-center p-5">
      <span className="p-2 absolute top-0 w-full drag left-0" />
      <svg
        width="132"
        height="132"
        viewBox="0 0 132 132"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="left-16 relative"
      >
        <g filter="url(#filter0_d_5959_265)">
          <rect
            width="72"
            height="72"
            rx="15"
            transform="matrix(-1 0 0 1 102 13)"
            fill="url(#paint0_linear_5959_265)"
          />
          <g filter="url(#filter1_di_5959_265)">
            <path
              d="M84.7031 64.75L66.7256 36.9406C60.707 27.9442 39.8406 34.3798 50.3482 60.6283L53.0586 61.5048L66.0703 55.8257"
              stroke="url(#paint1_linear_5959_265)"
              stroke-width="7"
              stroke-linecap="round"
              stroke-linejoin="round"
              shape-rendering="crispEdges"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_5959_265"
            x="0"
            y="0"
            width="132"
            height="132"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="10"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_5959_265"
            />
            <feOffset dy="17" />
            <feGaussianBlur stdDeviation="10" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5959_265"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5959_265"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_di_5959_265"
            x="37.9443"
            y="24.6152"
            width="56.2588"
            height="50.6348"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="3" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5959_265"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5959_265"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect2_innerShadow_5959_265"
            />
          </filter>
          <linearGradient
            id="paint0_linear_5959_265"
            x1="36"
            y1="0"
            x2="36"
            y2="72"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#5DB5FF" />
            <stop offset="1" stop-color="#2B59FF" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_5959_265"
            x1="66.1744"
            y1="31.0811"
            x2="66.1744"
            y2="67.4881"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0.78" />
          </linearGradient>
        </defs>
      </svg>
      <h1 className=" relative left-10 scale-75 mb-4">
        <svg
          width="158"
          height="30"
          viewBox="0 0 158 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.348 3.944L5.464 28.136V28.1C5.32 28.46 5.116 28.76 4.852 29C4.612 29.216 4.312 29.324 3.952 29.324C3.76 29.324 3.568 29.3 3.376 29.252C3.208 29.228 3.028 29.192 2.836 29.144H2.872C1.504 28.712 1 27.944 1.36 26.84L9.568 1.892C9.688 1.508 9.892 1.184 10.18 0.919999C10.492 0.655999 10.852 0.499999 11.26 0.451998C11.668 0.379998 12.064 0.331998 12.448 0.307998C12.832 0.259999 13.132 0.235999 13.348 0.235999C13.564 0.235999 13.864 0.259999 14.248 0.307998C14.632 0.331998 15.028 0.367998 15.436 0.415999C15.772 0.463998 16.096 0.643998 16.408 0.955998C16.744 1.268 16.996 1.58 17.164 1.892C18.508 6.02 19.864 10.184 21.232 14.384C22.624 18.56 23.992 22.712 25.336 26.84C25.672 27.944 25.168 28.712 23.824 29.144C23.632 29.192 23.452 29.228 23.284 29.252C23.14 29.3 22.972 29.324 22.78 29.324C22.444 29.324 22.132 29.216 21.844 29C21.58 28.76 21.388 28.46 21.268 28.1V28.136L13.348 3.944ZM16.048 20.36C16.048 21.128 15.772 21.788 15.22 22.34C14.692 22.868 14.044 23.132 13.276 23.132C12.508 23.132 11.86 22.868 11.332 22.34C10.804 21.788 10.54 21.128 10.54 20.36C10.54 19.592 10.804 18.944 11.332 18.416C11.86 17.864 12.508 17.588 13.276 17.588C14.044 17.588 14.692 17.864 15.22 18.416C15.772 18.944 16.048 19.592 16.048 20.36ZM32.1957 27.488C32.1957 28.64 31.5357 29.216 30.2157 29.216C28.8957 29.216 28.2357 28.64 28.2357 27.488V13.016C28.2357 12.032 28.3917 11.18 28.7037 10.46C29.0157 9.74 29.5077 9.152 30.1797 8.696C31.4517 7.784 32.7237 7.328 33.9957 7.328H39.7917C41.0157 7.328 42.2877 7.784 43.6077 8.696C44.9037 9.608 45.5517 11.048 45.5517 13.016V27.488C45.5517 28.64 44.8917 29.216 43.5717 29.216C42.2517 29.216 41.5917 28.64 41.5917 27.488V13.34C41.5917 12.716 41.3997 12.116 41.0157 11.54L41.0517 11.576C40.7397 11 40.1037 10.712 39.1437 10.712H34.6437C33.6597 10.712 33.0117 11 32.6997 11.576C32.3637 12.08 32.1957 12.668 32.1957 13.34V27.488ZM54.1683 27.488C54.1683 28.64 53.5083 29.216 52.1883 29.216C50.8683 29.216 50.2083 28.64 50.2083 27.488V13.016C50.2083 12.032 50.3643 11.18 50.6763 10.46C50.9883 9.74 51.4803 9.152 52.1523 8.696C53.4243 7.784 54.6963 7.328 55.9683 7.328H61.7643C62.9883 7.328 64.2603 7.784 65.5803 8.696C66.8763 9.608 67.5243 11.048 67.5243 13.016V27.488C67.5243 28.64 66.8643 29.216 65.5443 29.216C64.2243 29.216 63.5643 28.64 63.5643 27.488V13.34C63.5643 12.716 63.3723 12.116 62.9883 11.54L63.0243 11.576C62.7123 11 62.0763 10.712 61.1163 10.712H56.6163C55.6323 10.712 54.9843 11 54.6723 11.576C54.3363 12.08 54.1683 12.668 54.1683 13.34V27.488ZM83.701 7.328C84.325 7.328 84.961 7.46 85.609 7.724C86.281 7.988 86.929 8.324 87.553 8.732H87.517C88.141 9.188 88.621 9.788 88.957 10.532C89.293 11.252 89.461 12.092 89.461 13.052V23.276C89.461 25.244 88.813 26.696 87.517 27.632C86.245 28.544 84.973 29 83.701 29H77.941C77.317 29 76.681 28.892 76.033 28.676C75.385 28.46 74.749 28.112 74.125 27.632C72.829 26.72 72.181 25.268 72.181 23.276V13.052C72.181 12.092 72.349 11.252 72.685 10.532C73.021 9.788 73.501 9.188 74.125 8.732H74.089C74.689 8.324 75.325 7.988 75.997 7.724C76.669 7.46 77.317 7.328 77.941 7.328H83.701ZM83.053 25.616C83.941 25.616 84.565 25.364 84.925 24.86C85.309 24.356 85.501 23.816 85.501 23.24V13.088C85.501 12.488 85.309 11.948 84.925 11.468C84.565 10.964 83.941 10.712 83.053 10.712H78.589C77.701 10.712 77.065 10.964 76.681 11.468C76.321 11.948 76.141 12.488 76.141 13.088V23.24C76.141 23.816 76.321 24.356 76.681 24.86C77.065 25.364 77.701 25.616 78.589 25.616H83.053ZM98.729 10.712V23.816C98.729 24.44 98.861 24.92 99.125 25.256C99.389 25.592 99.953 25.76 100.817 25.76H101.753C102.689 25.76 103.133 26.312 103.085 27.416C103.085 28.544 102.641 29.108 101.753 29.108H100.565C99.797 29.108 99.077 29.012 98.405 28.82C97.733 28.604 97.085 28.304 96.461 27.92V27.956C95.285 27.188 94.697 25.82 94.697 23.852V10.712H93.293C92.429 10.712 91.973 10.148 91.925 9.02C91.925 7.892 92.381 7.328 93.293 7.328H94.697V3.476C94.697 2.324 95.381 1.748 96.749 1.748C98.069 1.748 98.729 2.324 98.729 3.476V7.328H101.717C102.653 7.328 103.097 7.892 103.049 9.02C103.049 10.148 102.605 10.712 101.717 10.712H98.729ZM111.648 29C110.904 29 110.196 28.904 109.524 28.712C108.852 28.496 108.204 28.196 107.58 27.812V27.848C106.404 27.104 105.816 25.736 105.816 23.744V21.98C105.816 20.996 105.984 20.144 106.32 19.424C106.68 18.68 107.172 18.092 107.796 17.66H107.76C108.36 17.252 108.996 16.952 109.668 16.76C110.34 16.544 110.988 16.436 111.612 16.436H119.568V13.088C119.568 12.488 119.376 11.948 118.992 11.468C118.632 10.964 118.008 10.712 117.12 10.712H112.908C111.996 10.712 111.36 10.94 111 11.396C110.664 11.828 110.496 12.344 110.496 12.944V13.232C110.496 14.48 109.824 15.104 108.48 15.104C107.136 15.104 106.464 14.48 106.464 13.232V12.908C106.464 11.924 106.632 11.096 106.968 10.424C107.328 9.752 107.808 9.188 108.408 8.732H108.372C108.996 8.324 109.644 7.988 110.316 7.724C111.012 7.46 111.672 7.328 112.296 7.328H117.768C118.368 7.328 119.004 7.46 119.676 7.724C120.372 7.988 121.02 8.324 121.62 8.732H121.584C122.208 9.188 122.688 9.788 123.024 10.532C123.36 11.252 123.528 12.092 123.528 13.052V27.488C123.528 28.64 122.868 29.216 121.548 29.216C121.284 29.216 121.032 29.204 120.792 29.18C120.576 29.156 120.372 29.096 120.18 29C120.012 28.88 119.868 28.724 119.748 28.532C119.652 28.316 119.604 28.04 119.604 27.704L119.568 19.82H112.296C111.768 19.82 111.36 19.88 111.072 20C110.784 20.12 110.556 20.312 110.388 20.576C110.196 20.984 110.052 21.308 109.956 21.548C109.884 21.764 109.848 22.016 109.848 22.304V23.708C109.848 24.332 110.028 24.812 110.388 25.148C110.772 25.46 111.42 25.616 112.332 25.616H116.364C117.252 25.616 117.696 26.18 117.696 27.308C117.696 27.788 117.588 28.196 117.372 28.532C117.156 28.844 116.82 29 116.364 29H111.648ZM132.901 10.712V23.816C132.901 24.44 133.033 24.92 133.297 25.256C133.561 25.592 134.125 25.76 134.989 25.76H135.925C136.861 25.76 137.305 26.312 137.257 27.416C137.257 28.544 136.813 29.108 135.925 29.108H134.737C133.969 29.108 133.249 29.012 132.577 28.82C131.905 28.604 131.257 28.304 130.633 27.92V27.956C129.457 27.188 128.869 25.82 128.869 23.852V10.712H127.465C126.601 10.712 126.145 10.148 126.097 9.02C126.097 7.892 126.553 7.328 127.465 7.328H128.869V3.476C128.869 2.324 129.553 1.748 130.921 1.748C132.241 1.748 132.901 2.324 132.901 3.476V7.328H135.889C136.825 7.328 137.269 7.892 137.221 9.02C137.221 10.148 136.777 10.712 135.889 10.712H132.901ZM144.344 23.24C144.344 23.816 144.524 24.356 144.884 24.86C145.268 25.364 145.904 25.616 146.792 25.616H151.292C152.18 25.616 152.804 25.4 153.164 24.968C153.548 24.512 153.74 23.996 153.74 23.42V23.024C153.74 21.896 154.4 21.332 155.72 21.332C157.04 21.332 157.7 21.896 157.7 23.024V23.456C157.7 24.464 157.532 25.292 157.196 25.94C156.884 26.588 156.404 27.152 155.756 27.632C154.484 28.544 153.212 29 151.94 29H145.892C144.62 29 143.384 28.544 142.184 27.632C141.608 27.152 141.164 26.552 140.852 25.832C140.54 25.088 140.384 24.236 140.384 23.276V13.016C140.384 11.072 140.984 9.632 142.184 8.696C142.784 8.264 143.396 7.928 144.02 7.688C144.668 7.424 145.292 7.292 145.892 7.292H151.94C152.516 7.292 153.152 7.412 153.848 7.652C154.544 7.868 155.192 8.168 155.792 8.552C156.368 8.96 156.824 9.524 157.16 10.244C157.52 10.964 157.7 11.816 157.7 12.8V17.66C157.7 18.212 157.532 18.704 157.196 19.136C156.884 19.568 156.296 19.784 155.432 19.784H147.656C146.792 19.784 146.336 19.22 146.288 18.092C146.288 16.964 146.744 16.4 147.656 16.4H153.776L153.74 13.052C153.74 12.452 153.548 11.912 153.164 11.432C152.804 10.928 152.18 10.676 151.292 10.676H146.792C145.904 10.676 145.268 10.928 144.884 11.432C144.524 11.912 144.344 12.452 144.344 13.052V23.24Z"
            fill="currentColor"
          ></path>
        </svg>
      </h1>
      {loading ? (
        <div className="flex justify-center scale-150 mt-10">
          <svg
            className="animate-spin  -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <form className="flex flex-col space-y-4" onSubmit={verify}>
          {/* <input
          name="email"
          className="bg-transparent ring-2 dark:ring-neutral-600 dark:text-neutral-300 text-neutral-900 ring-neutral-400 rounded p-2"
          type="email"
          placeholder="email@address.com"
          ref={emailRef}
        /> */}
          <input
            name="code"
            type="text"
            className="text-center bg-transparent ring-2 dark:ring-neutral-600 dark:text-neutral-300 text-neutral-600 ring-neutral-400 rounded p-2"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            ref={codeRef}
          />
          <button className="bg-blue-600 rounded p-2 text-neutral-100">
            Activate License
          </button>
        </form>
      )}
    </div>
  );
}
