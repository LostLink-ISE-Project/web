import { Button } from "@/components/ui/button";
import LostLinkLogo from "@/assets/LostLink.svg";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
// import ItemCard from "@/components/common/items/item-card";
import ItemToolbar from "@/components/common/items/item-toolbar";
import type { DateRange } from "react-day-picker";

export default function HomePage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("newest");
  const [officeFilter, setOfficeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-32 py-6 gap-4 overflow-y-scroll">
      <div className="flex justify-between items-center">
        <div>
          <a href="/">
            <img
              src={LostLinkLogo}
              alt="Logo"
              className={"transition-all w-24 sm:w-32"}
            />
          </a>
        </div>

        <Link to={"/login"}>
          <Button className="flex text-white items-center py-5 rounded-lg gap-2">
            <span className="hidden sm:inline">Log In</span>
            <LogIn size={18}/>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col p-0 md:p-9 gap-0 md:gap-6">
        <ItemToolbar
          view={view}
          setView={setView}
          keyword={keyword}
          setKeyword={setKeyword}
          sort={sort}
          setSort={setSort}
          isForPublic={true}
          dateRange={dateRange}
          setDateRange={setDateRange}
          officeFilter={officeFilter}
          setOfficeFilter={setOfficeFilter}
        />

        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              : "flex flex-col gap-4"
          }
        >
          {/* {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              variant={view}
              isForPublic={true}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
}
