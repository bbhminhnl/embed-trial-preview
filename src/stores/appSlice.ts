import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { AppState } from "./type";
import { RootState } from "@/stores";

const INITIAL_STATE: AppState = {
  /**
   * status reset
   */
  reset: false,
  /**
   * locale Selected
   */
  locale: "auto",
  /**
   * view device
   */
  device: "pc",
  /**
   * page url
   */
  page_url: "",
  /**
   * sub page url
   */
  sub_page_url: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState: INITIAL_STATE,
  reducers: {
    /** Cập nhật trạng thái reset */
    setResetGlobal: (state, action: PayloadAction<boolean>) => {
      state.reset = action.payload;
    },

    /** Cập nhật locale */
    setLocaleGlobal: (state, action: PayloadAction<string | number>) => {
      state.locale = action.payload;
    },

    /** Cập nhật view PC */
    setViewGlobal: (state, action: PayloadAction<string | number>) => {
      state.device = action.payload;
    },
    /** Cập nhật page url */
    setPageUrlGlobal: (state, action: PayloadAction<string | number>) => {
      state.page_url = action.payload;
    },
    /** Cập nhật page url */
    setSubPageUrlGlobal: (state, action: PayloadAction<string | number>) => {
      state.sub_page_url = action.payload;
    },
  },
});

/** Action creators are generated for each case reducer function */
export const {
  setResetGlobal,
  setLocaleGlobal,
  setViewGlobal,
  setPageUrlGlobal,
  setSubPageUrlGlobal,
} = appSlice.actions;

/**
 * Trạng   thái reset
 */
export const selectResetGlobal = (state: RootState) => state.app.reset;
/**
 * Trạng thái locale
 */
export const selectLocaleGlobal = (state: RootState) => state.app.locale;
/**
 * Trạng thái thiết bị hiện tại
 */
export const selectViewGlobal = (state: RootState) => state.app.device;
/**
 * Trạng thái page url
 */
export const selectPageUrlGlobal = (state: RootState) => state.app.page_url;
/**
 * Trạng thái sub page url
 */
export const selectSubPageUrlGlobal = (state: RootState) =>
  state.app.sub_page_url;

export default appSlice.reducer;
