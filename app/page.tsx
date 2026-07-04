"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Hero from "./component/Hero";
import { CustomFilter, SearchBar, ShowMore, CarCard } from "./component";
import { fetchCars } from "./component/utils";
import { fuels, yearsOfProduction } from "./constants";

export default function Home() {
  const [allCars, setAllCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("2022");
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setLoading(true);
    try {
      const result = await fetchCars({
        manufacturer: manufacturer || "",
        year: Number(year) || 2022,
        fuel: fuel || "",
        limit: limit || 10,
        model: model || "",
      });
      setAllCars(Array.isArray(result) ? result : []);
    } catch (error) {
      console.log(error);
      setAllCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, [fuel, year, limit, manufacturer, model]);

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>
        <div className="home_filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel} />
            <CustomFilter title="year" options={yearsOfProduction} setFilter={setYear} />
          </div>
        </div>

        {allCars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars.map((car, index) => (
                <CarCard key={`${car.make || 'car'}-${car.model || index}`} car={car} />
              ))}
            </div>
            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image src="/loader.svg" alt="loader" width={50} height={50} className="object-contain" />
              </div>
            )}
            <ShowMore pageNumber={limit || 10} isNext={limit > allCars.length} setLimit={setLimit} />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">OOPS! NO RESULT</h2>
            <p>{loading ? 'Loading...' : 'No cars found'}</p>
          </div>
        )}
      </div>
    </main>
  );
}