import {
  selectLocaleGlobal,
  selectPageUrlGlobal,
  selectResetGlobal,
  selectViewGlobal,
  setResetGlobal,
} from "@/stores/appSlice";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  /** Thêm locale từ localStorage */
  const LOCALE = localStorage.getItem("locale") || "auto";

  /**
   * Ngôn ngữ
   */
  const [locale, setLocale] = useState<string | number>(LOCALE);
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

  /** Hàm confirm */
  const handleChangeLanguage = (locale: any) => {
    /** Lưu locale vào localStorage */
    localStorage.setItem("locale", locale.toString());
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
    <div className="flex h-full w-full">
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
      <div className="flex flex-col gap-y-2 flex-grow min-h-0 h-full bg-white py-2 md:rounded-lg w-full ">
        {PAGE_URL_GLOBAL && (
          <div
            className={`flex justify-center items-center w-full h-full ${
              DEVICE_GLOBAL === "mobile" ? "max-w-[420px]" : ""
            }`}
          >
            <div
              className={`bg-black ${
                DEVICE_GLOBAL === "mobile"
                  ? "w-[390px] h-full rounded-[40px] overflow-hidden border border-gray-300 shadow-2xl"
                  : "w-full h-full rounded-lg overflow-hidden"
              }`}
            >
              <iframe
                src={PAGE_URL_GLOBAL.toString()}
                className="w-full h-full"
                title="Iframe Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
