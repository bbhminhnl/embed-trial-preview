import "./App.css";

import { Route, Routes, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import useChatbox from "./hooks/useChatbox";

export default function App() {
  /**
   *  Lay params từ url
   */
  const [search_params] = useSearchParams();
  /**
   *  Lay page_id tu url
   */
  const PAGE_ID = search_params.get("page_id");
  /**
   * Lay locale tu localStorage
   */
  const [locale, setLocale] = useState(
    () => localStorage.getItem("locale") || "vi"
  );

  /**
   * Loại page
   */

  const [page_type, setPageType] = useState("");

  /** Cập nhật lại locale khi localStorage thay đổi (nếu bạn đổi ở Setting) */
  useEffect(() => {
    /**
     * Cập nhật locale từ local storage nếu có thay đổi
     */
    const handleStorage = () => {
      const NEW_LOCALE = localStorage.getItem("locale") || "vi";
      setLocale(NEW_LOCALE);
      console.log(NEW_LOCALE, "new locale");
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  /**
   * Lấy thông tin public của page
   * @param page_id
   * @returns
   */
  const fetchPublicInfo = async (page_id: string) => {
    try {
      /**
       * Lay thong tin cua page
       */
      const RES = await fetch(
        `https://chatbox-public-v2.botbanhang.vn/embed/page/read_page?page_id=${page_id}`
      );
      /**
       * Parse data json
       */
      const DATA = await RES.json();
      /**
       * Lưu thong tin cua page
       */
      setPageType(DATA.data?.type);

      return DATA;
    } catch (error) {
      console.error("Failed to fetch public info:", error);
    }
  };
  /** useEffect */
  useEffect(() => {
    /** Nếu có page_id thì gọi hàm fetch public page */
    if (PAGE_ID) {
      fetchPublicInfo(PAGE_ID);
    }
  }, [PAGE_ID]);

  /**
   * GỌi hook chatbox
   */
  useChatbox({
    page_id: PAGE_ID,
    locale: locale,
    page_type: page_type,
    // userData: {
    //   name: "Nguyen Van BCED",
    //   email: "L4H0n@example.com",
    //   phone: "0123456789",
    //   clientId: "1a7b78c1d0094dd2945a5a3f4ae404a2",
    // },
  });

  return (
    <div className="min-h-screen min-w-screen flex flex-col relative bg-custom-gradient">
      <Navbar />
      <div className="flex flex-grow min-h-0 w-full pt-18">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
