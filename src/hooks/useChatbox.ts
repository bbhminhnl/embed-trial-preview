import { useDispatch, useSelector } from "react-redux";

import { selectViewGlobal } from "@/stores/appSlice";
import { showToast } from "@/stores/toastSlice";
import { t } from "i18next";
import { useEffect } from "react";

/**
 * Khai báo global object BBH
 */
declare global {
  /**
   * Khai báo global object BBH
   */
  interface Window {
    BBH?: {
      init: (config: { page_id: string; config?: Record<string, any> }) => void;
      destroy: () => void;
    };
  }
}
/**
 * Khai báo options cho useChatbox
 */
interface UseChatboxOptions {
  /** Id Trang */
  page_id: string | null;
  /** Thông tin user */
  userData?: {
    /** Tên */
    name?: string;
    /** Email */
    email?: string | undefined;
    /** SDT */
    phone?: string;
    /** ID */
    clientId?: string;
  };
  /** Ngôn ngữ */
  locale?: string;
  /** Loại page trang */
  page_type?: string;
  /** Fn sử dụng khi script loaded */
  onLoaded?: () => void;
  /** Fn sử dụng khi script load that bai */
  onError?: (error: Error) => void;
}

const useChatbox = ({
  page_id,
  userData,
  page_type,
  locale,
  onLoaded,
  onError,
}: UseChatboxOptions) => {
  const dispatch = useDispatch();
  /**
   * Lấy device
   */
  const DEVICE_GLOBAL = useSelector(selectViewGlobal);
  /** Hàm dịch chuyển embed vào thẻ preview container */
  function moveIframeIntoContainer() {
    /**
     * Tạo interval để kiểm tra xem iframe đã được tạo chưa
     * Nếu có thì di chuyển nó vào thẻ preview container
     */
    const INTERVAL = setInterval(() => {
      /**
       * Lấy iframe và container
       * @type {HTMLIFrameElement}
       */
      const IFRAME = document.getElementById("BBH-EMBED-IFRAME");
      /**
       * Lấy container
       * @type {HTMLDivElement}
       */

      const CONTAINER = document.getElementById("BBH-EMBED-CONTAINER");

      /**
       * Nếu IFRAME và CONTAINER tồn tại thì di chuyển IFRAME vào CONTAINER
       */
      if (IFRAME && CONTAINER) {
        CONTAINER.appendChild(IFRAME);
        IFRAME.style.width = "100%";
        IFRAME.style.height = "100%";
        IFRAME.style.border = "none";
        clearInterval(INTERVAL);
        console.log("➡ BBH iframe moved into container.");
      }
    }, 300);
  }

  useEffect(() => {
    /**
     * Nếu không có page_id hoặc page_type thi bao loi
     */
    if (!page_id || !page_type) {
      const ERROR = new Error("page_id is required");
      onError?.(ERROR);
      console.error(ERROR.message);
      return;
    }
    /**
     * Kiem tra xem page_type co phai la website khong
     */
    if (page_type !== "WEBSITE") {
      /** Show toast lỗi */
      dispatch(showToast({ message: t("page_is_not_website"), type: "error" }));
      return;
    }

    /**
     * Kiem tra xem script da duoc them vao chua
     */
    const EXISTING_SCRIPT = document.querySelector(
      'script[src*="botbanhang.vn"]'
    );
    if (EXISTING_SCRIPT) {
      initializeBBH();
      return;
    }
    /**
     * Tạo script
     */
    const SCRIPT = document.createElement("script");
    SCRIPT.src = "https://chatbox-embed-sdk.botbanhang.vn/dist/sdk.min.js";
    // SCRIPT.src = "https://sdk.retify.ai/dist/sdk.min.js";

    // SCRIPT.src = "https://bbh-embed-chat-sdk.vercel.app/dist/sdk.min.js"; //Development
    // SCRIPT.src = "http://192.168.1.106:9090/sdk.js";
    SCRIPT.async = true;
    /**
     * Xu ly khi load xong
     * @returns
     */
    SCRIPT.onload = () => initializeBBH();
    SCRIPT.onerror = () => {
      const error = new Error("Failed to load BBH script");
      onError?.(error);
      console.error(error.message);
    };
    /**
     * Thêm script vào body
     */
    document.body.appendChild(SCRIPT);
    /**
     * Xu ly khi unmount
     */
    return () => {
      document.body.removeChild(SCRIPT);
    };
    /**
     * Khoi tao BBH
     */
    function initializeBBH() {
      try {
        if (!window.BBH) {
          throw new Error("BBH global object not found");
        }

        window.BBH.init({
          page_id: page_id || "",
          config: { locale: locale },
        });

        console.log("BBH initialized with page_id:", page_id);
        onLoaded?.();

        /** 👉 Chờ iframe xuất hiện và di chuyển nó */
        // moveIframeIntoContainer();

        sendUserData();
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error("Failed to initialize BBH");
        onError?.(err);
        console.error(err.message);
      }
    }
    /**
     * Gui thong tin nguoi dung
     */
    function sendUserData() {
      setTimeout(() => {
        const iframe = document.querySelector(
          "#BBH-EMBED-IFRAME"
        ) as HTMLIFrameElement;
        if (iframe?.contentWindow && userData) {
          iframe.contentWindow.postMessage(
            {
              from: "parent-app",
              user_name: userData.name,
              user_email: userData.email,
              user_phone: userData.phone,
              client_id: userData.clientId,
            },
            "*"
          );
          console.log("User data sent to iframe");
        }
      }, 1000);
    }
  }, [page_id, page_type]);

  // useEffect(() => {
  //   /** Chờ iframe move xong */
  //   const TIME_OUT = setTimeout(() => {
  //     /**
  //      * Nếu không có page_id thì return
  //      */
  //     if (window.BBH && page_id && page_type === "WEBSITE") {
  //       window.BBH?.destroy();
  //       /** Gọi lại init sau khi iframe đã được chuyển vị trí */
  //       window.BBH.init({
  //         page_id: page_id,
  //         config: { locale },
  //       });
  //     }
  //     /** delay nhỏ để đảm bảo đã move xong */
  //   }, 500);

  //   return () => clearTimeout(TIME_OUT);
  // }, [DEVICE_GLOBAL]);
  useEffect(() => {
    console.log(DEVICE_GLOBAL, "DEVICE_GLOBAL");
    const TIME_OUT = setTimeout(() => {
      if (window.BBH && page_id && page_type === "WEBSITE") {
        window.BBH?.destroy();

        // Gọi lại init
        window.BBH.init({
          page_id,
          config: { locale },
        });

        // 👉 Phải move lại iframe sau khi init
        moveIframeIntoContainer();

        // 👉 Gửi lại thông tin user nếu cần
        // if (userData) {
        //   setTimeout(() => {
        //     const iframe = document.querySelector(
        //       "#BBH-EMBED-IFRAME"
        //     ) as HTMLIFrameElement;
        //     if (iframe?.contentWindow) {
        //       iframe.contentWindow.postMessage(
        //         {
        //           from: "parent-app",
        //           user_name: userData.name,
        //           user_email: userData.email,
        //           user_phone: userData.phone,
        //           client_id: userData.clientId,
        //         },
        //         "*"
        //       );
        //       console.log("User data resent to iframe");
        //     }
        //   }, 1000);
        // }

        console.log(
          "✅ BBH re-initialized and iframe moved (on device change)"
        );
      }
    }, 500); // delay nhỏ để init kịp render iframe

    return () => clearTimeout(TIME_OUT);
  }, [DEVICE_GLOBAL]);
};

export default useChatbox;
