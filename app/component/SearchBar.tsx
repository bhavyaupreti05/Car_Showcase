"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import SearchManufacturer from "./SearchManufacturer";
import Image from "next/image";

interface SearchBarProps {
  setManufacturer: (value: string) => void;
  setModel: (value: string) => void;
}

const SearchButton = ({ otherClasses }: { otherClasses: string }) => (
  <button type="submit" className={`-ml-3 z-10 ${otherClasses}`}>
    <Image
      src="/magnifying-glass.svg"
      alt="magnifying glass"
      width={40}
      height={40}
      className="object-contain"
    ></Image>
  </button>
);
const SearchBar = ({ setManufacturer, setModel }: SearchBarProps) => {
  const [searchManufacturer, setsearchManufacturer] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchManufacturer === "" && searchModel === "") {
      return alert("please fill in the search bar ");
    }

    setModel(searchModel);
    setManufacturer(searchManufacturer);
  };

  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <div className="searchbar__item">
        <SearchManufacturer
          manufacturer={searchManufacturer}
          setManufacturer={setsearchManufacturer}
        />
        <SearchButton otherClasses="sm:hidden " />
      </div>
      <div className="searchbar_item">
        <Image
          src=" /model-icon.png"
          width={25}
          height={25}
          className="absolute w-[20px] h-[20px] ml-4"
          alt="car model"
        ></Image>
        <input
          type="text"
          name="model"
          value={searchModel}
          onChange={(e) => setSearchModel(e.target.value)}
          placeholder="tiguan"
          className="searchbar_input"
        />
        <SearchButton otherClasses="sm:hidden " />
      </div>
      <SearchButton otherClasses="max-sm:hidden " />
    </form>
  );
};

export default SearchBar;
