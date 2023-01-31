import cl from "classnames";
import { useEffect, useState } from "react";
import { useAppState, useUpdateAppState } from "../context/appContext";

const IndexPage = () => {
  const [passThrough, setPassThrough] = useState(true);
  const appState = useAppState();
  const updateAppState = useUpdateAppState();
  const tools = [
    // {
    //   id: "text",
    //   title: "Text",
    //   icon: () => (
    //     <svg
    //       width="20"
    //       height="20"
    //       viewBox="0 0 20 20"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         d="M3.51278 14.5H1.53551L4.5483 5.77273H6.92614L9.93466 14.5H7.95739L5.77131 7.76705H5.70312L3.51278 14.5ZM3.3892 11.0696H8.05966V12.5099H3.3892V11.0696ZM12.8175 14.6236C12.3999 14.6236 12.0277 14.5511 11.701 14.4062C11.3743 14.2585 11.1158 14.0412 10.9254 13.7543C10.7379 13.4645 10.6442 13.1037 10.6442 12.6719C10.6442 12.3082 10.7109 12.0028 10.8445 11.7557C10.978 11.5085 11.1598 11.3097 11.3899 11.1591C11.62 11.0085 11.8814 10.8949 12.174 10.8182C12.4695 10.7415 12.7791 10.6875 13.103 10.6562C13.4837 10.6165 13.7905 10.5795 14.0234 10.5455C14.2564 10.5085 14.4254 10.4545 14.5305 10.3835C14.6357 10.3125 14.6882 10.2074 14.6882 10.0682V10.0426C14.6882 9.77273 14.603 9.56392 14.4325 9.41619C14.2649 9.26847 14.0263 9.1946 13.7166 9.1946C13.3899 9.1946 13.13 9.26705 12.9368 9.41193C12.7436 9.55398 12.6158 9.73295 12.5533 9.94886L10.8743 9.8125C10.9595 9.41477 11.1271 9.07102 11.3771 8.78125C11.6271 8.48864 11.9496 8.2642 12.3445 8.10795C12.7422 7.94886 13.2024 7.86932 13.7251 7.86932C14.0888 7.86932 14.4368 7.91193 14.7692 7.99716C15.1044 8.08239 15.4013 8.21449 15.6598 8.39347C15.9212 8.57244 16.1271 8.80256 16.2777 9.08381C16.4283 9.36222 16.5036 9.69602 16.5036 10.0852V14.5H14.782V13.5923H14.7308C14.6257 13.7969 14.4851 13.9773 14.3089 14.1335C14.1328 14.2869 13.9212 14.4077 13.674 14.4957C13.4268 14.581 13.1413 14.6236 12.8175 14.6236ZM13.3374 13.3707C13.6044 13.3707 13.8402 13.3182 14.0447 13.2131C14.2493 13.1051 14.4098 12.9602 14.5263 12.7784C14.6428 12.5966 14.701 12.3906 14.701 12.1605V11.4659C14.6442 11.5028 14.5661 11.5369 14.4666 11.5682C14.37 11.5966 14.2607 11.6236 14.1385 11.6491C14.0163 11.6719 13.8942 11.6932 13.772 11.7131C13.6499 11.7301 13.5391 11.7457 13.4396 11.7599C13.2266 11.7912 13.0405 11.8409 12.8814 11.9091C12.7223 11.9773 12.5987 12.0696 12.5107 12.1861C12.4226 12.2997 12.3786 12.4418 12.3786 12.6122C12.3786 12.8594 12.468 13.0483 12.647 13.179C12.8288 13.3068 13.0589 13.3707 13.3374 13.3707Z"
    //         fill="currentColor"
    //       />
    //     </svg>
    //   ),
    // },
    {
      id: "brush",
      title: "Brush",
      icon: () => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.1126 11.1638L17.2195 4.53586C17.2575 4.49639 17.287 4.44966 17.3064 4.39848C17.3258 4.3473 17.3346 4.29273 17.3323 4.23806C17.3301 4.18339 17.3167 4.12975 17.2932 4.08036C17.2696 4.03096 17.2363 3.98684 17.1952 3.95065L16.0233 2.77922C15.9477 2.707 15.8472 2.66669 15.7426 2.66669C15.638 2.66669 15.5374 2.707 15.4618 2.77922L8.82481 8.87879C8.78534 8.91664 8.75394 8.96208 8.73249 9.01236C8.71104 9.06264 8.69998 9.11673 8.69998 9.17139C8.69998 9.22605 8.71104 9.28014 8.73249 9.33042C8.75394 9.3807 8.78534 9.42614 8.82481 9.46399L10.5267 11.1638C10.5646 11.2033 10.6101 11.2346 10.6604 11.2561C10.7108 11.2775 10.7649 11.2885 10.8197 11.2885C10.8744 11.2885 10.9285 11.2775 10.9789 11.2561C11.0292 11.2346 11.0747 11.2033 11.1126 11.1638ZM7.61947 10.2612L9.74481 12.3911C9.87845 12.5131 9.96745 12.6762 9.99765 12.8546V13.2531C9.99902 13.6818 9.91557 14.1065 9.75211 14.5028C9.58865 14.8991 9.3484 15.2592 9.04516 15.5625C8.4103 16.1747 7.65412 16.6473 6.8253 16.9498C5.99648 17.2524 5.1134 17.3782 4.23294 17.3192C3.70913 17.3216 3.19939 17.1499 2.7839 16.8313C2.71774 16.7648 2.67673 16.6773 2.66784 16.584C2.65895 16.4906 2.68274 16.397 2.73515 16.3192C3.2273 15.5254 3.47909 14.6065 3.46019 13.673C3.43053 13.1773 3.50171 12.6807 3.66943 12.2132C3.83714 11.7457 4.09792 11.317 4.43603 10.9529C5.04736 10.3432 5.87615 10.0009 6.74009 10.0015C6.87298 9.9932 7.00627 9.9932 7.13916 10.0015C7.32261 10.0355 7.49067 10.1264 7.61947 10.2612V10.2612Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "Line",
      id: "line",
      icon: () => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="3.75"
            y1="16.4393"
            x2="15.9476"
            y2="4.24175"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Rectangle",
      id: "rectangle",
      icon: () => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3.41602"
            y="3.41669"
            width="13.5"
            height="13.5"
            rx="1.25"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      title: "Circle",
      id: "circle",
      icon: () => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="10"
            r="6.75"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      title: "Selection",
      id: "selection",
      icon: () => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_5778_274)">
            <path
              d="M10.834 11.8333L14.1673 15.1666"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 6L9.16618 16L10.6453 11.6453L15 10.1662L5 6Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="0.75"
              y="0.75"
              width="18.5"
              height="18.5"
              rx="1.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeDasharray="2 2"
            />
          </g>
          <defs>
            <clipPath id="clip0_5778_274">
              <rect width="20" height="20" fill="currentColor" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    // {
    //   title: "Eraser",
    //   id: "eraser",
    //   icon: () => (
    //     <svg
    //       width="20"
    //       height="20"
    //       viewBox="0 0 20 20"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         d="M5.59886 10.4185L3.90318 13.3555C3.62703 13.8338 3.79091 14.4454 4.2692 14.7216L9.29811 17.625C9.7764 17.9011 10.388 17.7373 10.6641 17.259L12.3598 14.322M5.59886 10.4185L9.49023 3.67846C9.76638 3.20017 10.378 3.0363 10.8563 3.31244L15.8852 6.21588C16.3635 6.49202 16.5273 7.10361 16.2512 7.58191L12.3598 14.322M5.59886 10.4185L12.3598 14.322"
    //         stroke="currentColor"
    //         strokeWidth="1.5"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   title: "Cursor Highlight",
    //   id: "cursor-highlight",
    //   icon: () => (
    //     <svg
    //       width="20"
    //       height="20"
    //       viewBox="0 0 20 20"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         d="M14.166 14.1667L17.4993 17.5"
    //         stroke="currentColor"
    //         strokeWidth="1.5"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //       />
    //       <path
    //         d="M8.33203 8.33337L12.4982 18.3334L13.9773 13.9786L18.332 12.4995L8.33203 8.33337Z"
    //         stroke="currentColor"
    //         strokeWidth="1.5"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //       />
    //       <path
    //         d="M9.18424 8.27298L7.95529 7.96154L8.2741 9.1886L9.55595 14.1222C8.48819 14.3478 7.3739 14.2746 6.33794 13.9036C5.08239 13.454 4.01557 12.5934 3.3105 11.4614C2.60544 10.3294 2.3035 8.99236 2.45364 7.66722C2.60379 6.34207 3.19723 5.10651 4.1377 4.16095C5.07817 3.21539 6.31051 2.6153 7.63482 2.458C8.95914 2.3007 10.2978 2.59542 11.4336 3.29437C12.5694 3.99331 13.4357 5.05548 13.8921 6.30858C14.2687 7.34266 14.3479 8.4567 14.1279 9.5258L9.18424 8.27298Z"
    //         stroke="currentColor"
    //         strokeWidth="1.5"
    //       />
    //     </svg>
    //   ),
    // },
    {
      title: "Cursor Focus",
      id: "cursor-focus",
      icon: () => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_5778_278)">
            <circle
              cx="10"
              cy="10"
              r="9.25"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M11 11L14 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L9.33294 14L10.5162 10.5162L14 9.33294L6 6Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_5778_278">
              <rect width="20" height="20" fill="currentColor" />
            </clipPath>
          </defs>
        </svg>
      ),
      onclick: () => {
        updateAppState({
          ...appState,
          cursorFocus: !appState.cursorFocus,
        });
      },
    },
    // {
    //   title: "Arrow",
    //   id: "arrow",
    //   icon: () => (
    //     <svg
    //       width="20"
    //       height="20"
    //       viewBox="0 0 20 20"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         d="M2.5 10H17.5M17.5 10L12.3077 5M17.5 10L12.3077 15"
    //         stroke="currentColor"
    //         strokeWidth="1.5"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //       />
    //     </svg>
    //   ),
    // },
  ];

  useEffect(() => {
    const handleMessage = (_event, args) => {};
    // add a listener to 'message' channel
    global.ipcRenderer.addListener("message", handleMessage);

    return () => {
      global.ipcRenderer.removeListener("message", handleMessage);
    };
  }, []);
  const togglePassthrough = () => {
    global.ipcRenderer.send("toggle-passthrough");
  };

  const updateGlobalState = (action: string, options?: any) => {
    // cursor: url("data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.75 1.25L7.25 2.25L15.25 10.25L16.8358 11.8358C17.6168 12.6168 17.6168 13.8832 16.8358 14.6642L15.6642 15.8358C14.8832 16.6168 13.6168 16.6168 12.8358 15.8358L11.25 14.25L3.25 6.25L1.75 1.25Z' fill='white'/%3E%3Cpath d='M15.25 10.25L7.25 2.25L1.75 1.25L3.25 6.25L11.25 14.25M15.25 10.25L16.8358 11.8358C17.6168 12.6168 17.6168 13.8832 16.8358 14.6642L15.6642 15.8358C14.8832 16.6168 13.6168 16.6168 12.8358 15.8358L11.25 14.25M15.25 10.25L11.25 14.25' stroke='black'/%3E%3C/svg%3E%0A"),
    // auto;
    switch (action) {
      case "passthrough":
        setPassThrough((prvState) => {
          // call electron api
          togglePassthrough();
          return !prvState;
        });
        break;

      default:
        break;
    }
  };
  return (
    <div id="toolbar" className="px-2">
      <div
        className={cl(
          "relative transition-all delay-75 h-7 w-12 border-2  p-1 rounded-full flex align-middle",
          passThrough
            ? "justify-end bg-blue-200 border-blue-400  border-2"
            : "justify-start border-neutral-900 dark:border-neutral-100"
        )}
        onClick={() => {
          updateGlobalState("passthrough");
        }}
      >
        <span
          className={cl(
            "inline-block rounded-full h-4 w-4  ",
            passThrough ? " bg-blue-900" : "bg-neutral-900 dark:bg-neutral-200"
          )}
        />
      </div>
      <div className="colors">
        <div
          className={cl(
            appState.primaryColor === appState.activeColor
              ? "color border-[1px] border-black dark:border-white shadow-sm"
              : "color"
          )}
          id="primary-color"
          onClick={() => {
            updateAppState({ ...appState, activeColor: appState.primaryColor });
          }}
        ></div>
        <div
          className={cl(
            appState.secondaryColor === appState.activeColor
              ? "color border-[1px] border-black dark:border-white shadow-sm"
              : "color"
          )}
          id="secondary-color"
          onClick={() => {
            updateAppState({
              ...appState,
              activeColor: appState.secondaryColor,
            });
          }}
        ></div>
        <div
          className={cl(
            appState.ternaryColor === appState.activeColor
              ? "color border-[1px] border-black dark:border-white shadow-sm"
              : "color"
          )}
          id="ternary-color"
          onClick={() => {
            updateAppState({ ...appState, activeColor: appState.ternaryColor });
          }}
        ></div>
      </div>
      <div className="separator"></div>
      {tools.map((tool) => (
        <button
          key={`tool-${tool.id}`}
          className={`p-2 select-none cursor-default text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-50 ${
            appState.selectedTool === tool.id ||
            (appState.cursorFocus && tool.id === "cursor-focus")
              ? "dark:text-neutral-50 text-neutral-900"
              : ""
          }`}
          id={tool.id}
          title={tool.title}
          onClick={
            tool.onclick
              ? tool.onclick
              : () => {
                  updateAppState({
                    ...appState,
                    selectedTool: tool.id,
                  });
                }
          }
        >
          {tool.icon()}
        </button>
      ))}
      <div className="separator"></div>
      <span className="text-neutral-800  dark:text-neutral-100">
        {appState.stroke}
      </span>
      <input
        type={"range"}
        max="50"
        className="slider h-5"
        value={appState.stroke}
        min="3"
        onChange={(e) => {
          updateAppState({
            ...appState,
            stroke: e.target.value,
          });
        }}
      />
      <span
        className={cl(
          "p-2 rounded  border-2 border-neutral-800 dark:border-neutral-100",
          appState.fill && "bg-indigo-500"
        )}
        onClick={() => {
          updateAppState({ ...appState, fill: !appState.fill });
        }}
      />

      <div className="separator"></div>

      <button
        className={`p-2 select-none cursor-default text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-50 ${
          appState.undoEnabled && "dark:text-neutral-50 text-neutral-900"
        }`}
        title={"Undo"}
        onClick={() => {
          updateAppState({ ...appState, selectedTool: "undo" });
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 12L4 8L8 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 16V10.9091C16 10.1376 15.6839 9.39761 15.1213 8.85205C14.5587 8.30649 13.7956 8 13 8H4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        className={`p-2 select-none cursor-default text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-50 ${
          appState.undoEnabled && "dark:text-neutral-50 text-neutral-900"
        }`}
        title={"Redo"}
        onClick={() => {
          updateAppState({ ...appState, selectedTool: "redo" });
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 12L16 8L12 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 16V10.9091C4 10.1376 4.31607 9.39761 4.87868 8.85205C5.44129 8.30649 6.20435 8 7 8H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`select-none cursor-default text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-50`}
        onClick={() => {
          updateAppState({ ...appState, selectedTool: "clear" });
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H5.33333H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 6.20532V15.6C15 15.9713 14.8495 16.3274 14.5816 16.5899C14.3137 16.8525 13.9503 17 13.5714 17H6.42857C6.04969 17 5.68633 16.8525 5.41842 16.5899C5.15051 16.3274 5 15.9713 5 15.6V6.05164M7.14286 5.8V4.4C7.14286 4.0287 7.29337 3.6726 7.56128 3.41005C7.82919 3.1475 8.19255 3 8.57143 3H11.4286C11.8075 3 12.1708 3.1475 12.4387 3.41005C12.7066 3.6726 12.8571 4.0287 12.8571 4.4V5.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default IndexPage;
