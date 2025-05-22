import {
  selectSubPageUrlGlobal,
  setLocaleGlobal,
  setPageUrlGlobal,
  setResetGlobal,
  setViewGlobal,
} from "@/stores/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import CustomSelectSearch from "./select/CustomSelectSearch";
import debounce from "lodash/debounce";
import { t } from "i18next";

export default function Navbar() {
  /** Mock Ngôn ngữ */
  const LANGUAGES = [
    { key: t("page_setting"), value: "auto" },
    { key: t("vietnamese"), value: "vi" },
    { key: t("english"), value: "en" },
    { key: t("korean"), value: "kr" },
    { key: t("japanese"), value: "jp" },
    { key: t("chinese"), value: "cn" },
  ];

  const DEVICES = [
    { key: t("pc"), value: "pc" },
    { key: t("tablet"), value: "tablet" },
    { key: t("mobile"), value: "mobile" },
  ];
  /**
   * Khai báo dispatch
   */
  const dispatch = useDispatch();

  /** Thêm locale từ localStorage */
  const LOCALE = localStorage.getItem("locale") || "auto";

  /** Device */
  const [device, setDevice] = useState<string | number>("pc");

  /** Ngôn ngữ*/
  const [locale, setLocale] = useState<string | number>(LOCALE);
  /** page_url*/
  const [page_url, setPageUrl] = useState<string | number>("");

  /** Sub url */
  const SUB_URL = useSelector(selectSubPageUrlGlobal);

  /**
   * Hàm debounce cập nhật link hiển thị trong iframe vào store
   */
  const debouncedDispatch = useMemo(
    () =>
      debounce((value: string | number) => {
        dispatch(setPageUrlGlobal(value));
      }, 500),
    [dispatch]
  );
  /**
   * Hàm cập nhật lại locale khi có thay đổi
   */
  useEffect(() => {
    return () => {
      debouncedDispatch.cancel();
    };
  }, [debouncedDispatch]);

  useEffect(() => {
    setPageUrl(SUB_URL);
    /**
     * Lưu page_url vào Redux
     */
    dispatch(setPageUrlGlobal(SUB_URL));
  }, [SUB_URL]);

  return (
    <div
      className={`fixed flex w-full top-0 md:px-3 px-2 pt-2 z-[999999999999999]`}
    >
      <div className="flex justify-between items-center flex-grow mx-auto h-16 px-6 py-3 bg-white bg-opacity-85 backdrop-blur-md  text-black shadow-sm border rounded-md border-slate-200">
        <div className="flex items-center flex-shrink-0 gap-x-2">
          <img src="./botbanhang.png" alt="Logo" className="h-11" />
        </div>
        <div className="flex items-center gap-x-4">
          <div className="flex gap-y-2 gap-x-4 items-center">
            <span className="text-sm font-medium flex-shrink-0 ">
              {t("website")}
            </span>
            <div className="w-full md:max-w-60">
              <input
                type="text"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                placeholder={"https://retion.ai"}
                value={page_url}
                onChange={(e) => {
                  setPageUrl(e.target.value);
                  // dispatch(setPageUrlGlobal(e.target.value));
                  debouncedDispatch(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="flex gap-y-2 gap-x-4 items-center">
            <span className="text-sm font-medium flex-shrink-0 ">
              {t("language")}
            </span>
            <div className="w-full md:max-w-60">
              <CustomSelectSearch
                label={t("language")}
                data={LANGUAGES}
                selected={LANGUAGES.find((e) => e.value === locale)}
                value={locale}
                setSelected={(e) => {
                  // handleChangeLanguage(e.value);
                  setLocale(e.value);
                  /** Lưu locale vào Redux */
                  dispatch(setLocaleGlobal(e.value));

                  /** Lưu locale vào localStorage */
                  localStorage.setItem("locale", e.value.toString());
                }}
              />
            </div>
          </div>
          <div className=" md:flex gap-y-2 gap-x-4 items-center ">
            <span className="text-sm font-medium flex-shrink-0 ">
              {t("device")}
            </span>
            <div className="w-full md:max-w-60">
              <CustomSelectSearch
                label={t("device")}
                data={DEVICES}
                selected={DEVICES.find((e) => e.value === device)}
                value={device}
                setSelected={(e) => {
                  // handleChangeLanguage(e.value);
                  setDevice(e.value);
                  dispatch(setViewGlobal(e.value));
                }}
              />
            </div>
          </div>
          <button
            onClick={() => dispatch(setResetGlobal(true))}
            className="flex  bg-blue-700 hover:bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded items-center gap-2 cursor-pointer"
          >
            <ArrowPathIcon className="size-4" />
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
