import {
  selectLocaleGlobal,
  selectPageUrlGlobal,
  selectResetGlobal,
  selectViewGlobal,
  setPageUrlGlobal,
  setResetGlobal,
  setSubPageUrlGlobal,
} from "@/stores/appSlice";
import { use, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { NetworkContext } from "../NWProvider";
import { t } from "i18next";
import { useSearchParams } from "react-router-dom";

const Setting = () => {
  /**
   * trạng thái online
   */
  const { is_online: IS_ONLINE, show_reconnect: SHOW_RECONNECT } =
    useContext(NetworkContext);

  /**
   * Lấy thông tin từ URL
   */
  const [search_params] = useSearchParams();

  /**
   * IFrame
   */
  const IFRAME_REF = useRef<HTMLIFrameElement | null>(null);

  /** Reset conversation */
  const RESET_GLOBAL = useSelector(selectResetGlobal);

  /** Locale global */
  const LOCALE_GLOBAL = useSelector(selectLocaleGlobal);
  /** Thiết bị hiện tại */
  const DEVICE_GLOBAL = useSelector(selectViewGlobal);
  /**
   * Lấy page_id từ url
   */
  const PAGE_URL_GLOBAL = useSelector(selectPageUrlGlobal);

  /** page_url*/
  const [page_url, setPageUrl] = useState<string | number>("");

  /**
   * Khai báo dispatch
   */
  const dispatch = useDispatch();

  useEffect(() => {
    /**
     * Gọi hàm Interval
     */
    const INTERVAL = setInterval(() => {
      /**
       * Lấy iframe
       */
      const IFRAME = document.querySelector(
        "#BBH-EMBED-IFRAME"
      ) as HTMLIFrameElement | null;
      /**
       *  Nếu có Iframe thì gán vào ref
       */
      if (IFRAME) {
        IFRAME_REF.current = IFRAME;
        clearInterval(INTERVAL); // Ngừng khi đã tìm thấy iframe
      }
    }, 300); // Kiểm tra mỗi 300ms

    return () => clearInterval(INTERVAL);
  }, []);

  /**
   * Access token từ URL hoặc localStorage
   */
  const PAGE_ID = search_params.get("page_id");

  /** Hàm confirm */
  const handleReset = () => {
    /** Gửi message xuống SDK */
    if (IFRAME_REF?.current?.contentWindow) {
      IFRAME_REF.current?.contentWindow.postMessage(
        {
          from: "parent-app-preview",
          reset_conversation: true,
          reset_page_id: PAGE_ID,
        },
        "*"
      );
    }
  };

  useEffect(() => {
    if (RESET_GLOBAL) {
      /** Nếu có page_id thì gọi hàm fetch public page */
      handleReset();
      /** Reset lại trạng thái */
      dispatch(setResetGlobal(false));
    }
  }, [RESET_GLOBAL]);

  useEffect(() => {
    if (LOCALE_GLOBAL) {
      /** Nếu có page_id thì gọi hàm fetch public page */
      handleChangeLanguage(LOCALE_GLOBAL);
    }
  }, [LOCALE_GLOBAL]);

  useEffect(() => {
    /** Thêm event listener cho thông điệp */
    window.addEventListener("message", handleMessage);

    /** Hàm cleanup */
    return () => {
      /** Xóa event listener */
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  /**
   * Lưu trạng thái mở embed
   */
  const [is_open_embed, setIsOpenEmbed] = useState(false);
  /** Hàm xử lý event post message từ cha */
  const handleMessage = (event: MessageEvent) => {
    let PAYLOAD: any;

    try {
      /** Nếu event.data là string, cố gắng parse nó */
      PAYLOAD =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    } catch (error) {
      console.error("Lỗi khi parse event.data:", error);
      return;
    }

    /** Lưu trạng thái mở embed */
    setIsOpenEmbed(PAYLOAD?.is_show);
  };

  /** Hàm confirm */
  const handleChangeLanguage = (locale: any) => {
    // setLocale(locale);
    /** Gửi message xuống SDK */
    if (IFRAME_REF?.current?.contentWindow) {
      IFRAME_REF.current?.contentWindow.postMessage(
        {
          from: "parent-app-preview",
          locale: locale,
          reset_page_id: PAGE_ID,
        },
        "*"
      );
    }
  };
  return (
    <div
      className={`flex h-full w-full relative ${
        DEVICE_GLOBAL === "mobile"
          ? "max-w-[390px]"
          : DEVICE_GLOBAL === "tablet"
          ? "max-w-[768px]"
          : ""
      }`}
    >
      {!IS_ONLINE && (
        <div className="flex justify-center items-center fixed inset-0 bg-red-500 p-2 h-8 text-white text-sm z-50">
          {t("disconnected")}
        </div>
      )}
      {SHOW_RECONNECT && (
        <div className="flex justify-center items-center fixed inset-0 bg-green-500 p-2 h-8 text-white text-sm z-50">
          {t("reconnected")}
        </div>
      )}
      <div
        id="BBH-EMBED-CONTAINER"
        className="relative flex flex-col gap-y-2 flex-grow min-h-0 h-full bg-white md:rounded-lg w-full "
      >
        <style>{`
      #BBH-EMBED-IFRAME {
        // all: unset !important;
        position: absolute !important;
        bottom: 0 !important;
        right: 0 !important;
        
        width: ${
          DEVICE_GLOBAL === "mobile" && is_open_embed ? "100% !important" : ""
        };
        height: ${
          DEVICE_GLOBAL === "mobile" && is_open_embed ? "100% !important" : ""
        };
        }
    `}</style>

        {PAGE_URL_GLOBAL ? (
          <div className={`flex justify-center items-center w-full h-full `}>
            <div
              className={`bg-black rounded-md overflow-hidden h-full ${
                DEVICE_GLOBAL === "mobile"
                  ? "w-[390px] border border-gray-300 shadow-2xl"
                  : DEVICE_GLOBAL === "tablet"
                  ? "w-[768px] border border-gray-300 shadow-2xl"
                  : "w-full"
              }`}
            >
              <iframe
                src={PAGE_URL_GLOBAL.toString()}
                className="w-full h-full"
                title="Iframe Preview"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-2 gap-x-4 items-center p-10">
            <span className="text-sm flex-shrink-0 ">
              {t("enter_your_website")}
            </span>
            <div className="w-full md:max-w-60">
              <input
                type="text"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                placeholder={"https://retion.ai"}
                value={page_url}
                onChange={(e) => {
                  setPageUrl(e.target.value);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                dispatch(setSubPageUrlGlobal(page_url));
              }}
              className="flex  bg-blue-700 hover:bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-md items-center gap-2 cursor-pointer"
            >
              <ArrowPathIcon className="size-4" />
              {t("preview")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
