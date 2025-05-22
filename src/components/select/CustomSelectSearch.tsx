// export default CustomSelectShad
import { Check, ChevronDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "../ui/button";
import { t } from "i18next";

interface SelectOption {
  key: string;
  value: string | number;
  icon?: string;
}

interface CustomSelectProps {
  /** Tên Select */
  label: string;
  /** Data select */
  data: SelectOption[];
  /** Giá trị trong select */
  selected?: SelectOption | null;
  /** Giá trị trong select */
  value?: string | number;
  /** Disable */
  disabled?: boolean;
  /** onSelect */
  setSelected?: (option: SelectOption) => void;
}

const CustomSelectSearch: React.FC<CustomSelectProps> = ({
  label,
  data,
  selected,
  disabled,
  value,
  setSelected,
}) => {
  /** State lưu giá trị */
  const [search_value, setSearchValue] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [filtered_data, setFilteredData] = useState<SelectOption[]>(data);

  /** Lọc dữ liệu không phân biệt dấu */
  const FILTERED_DATA = useMemo(() => {
    return data;
  }, [data]);

  /**
   * useEffect lọc dữ liệu
   */
  useEffect(() => {
    setFilteredData(FILTERED_DATA);
  }, [FILTERED_DATA]);

  /**
   * Hàm xử lý chọn select
   */
  const handleSelect = useCallback(
    (option: SelectOption) => {
      // onSelect(option)
      setOpen(false);
      setSearchValue("");
      setSelected(option);
    },
    [selected, setSelected]
  );

  /** REF select */
  const SELECT_REF = useRef<HTMLDivElement>(null);

  /** useEffect
   * click chuột ra ngoài
   */
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  /** click chuột ra ngoài
   * @param event
   */
  const handleClickOutside = (event: MouseEvent) => {
    if (
      SELECT_REF.current &&
      !SELECT_REF.current.contains(event.target as Node)
    ) {
      // setIsOpen(false)
    }
  };

  return (
    <div
      className={`relative w-full md:w-48 truncate ${
        disabled ? "pointer-events-none" : ""
      }`}
      ref={SELECT_REF}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-slate-300"
            disabled={disabled}
          >
            <span className="truncate">{selected ? selected.key : label}</span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 shadow-sm border border-slate-200 rounded">
          <Command>
            <CommandList>
              <CommandGroup>
                {filtered_data.length > 0 ? (
                  filtered_data.map((item) => (
                    <CommandItem
                      key={item.key}
                      onSelect={() => handleSelect(item)}
                      className="cursor-pointer rounded-md text-sm hover:bg-slate-100 p-2"
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selected?.key === item.key
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {item.icon && (
                        <img
                          src={item.icon}
                          alt={item.key}
                          className="w-5 h-5"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite loop if fallback image also fails
                          }}
                          loading="lazy"
                        />
                      )}
                      {item.key}
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>{t("no_data_found")}</CommandEmpty>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomSelectSearch;
function removeVietnameseTones(arg0: string) {
  throw new Error("Function not implemented.");
}
