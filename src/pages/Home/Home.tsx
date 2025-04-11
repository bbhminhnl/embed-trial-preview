import Setting from "../../components/setting/Setting";
import { t } from "i18next";

export default function Home() {
  return (
    <div className="flex flex-grow min-h-0 w-full">
      <div className="flex flex-col gap-y-2 h-full w-full  md:p-3">
        <Setting />
      </div>
    </div>
  );
}
