"use client";

import Image from "next/image";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { ComponentProps } from "react";
import { Carprops } from "../types";
import { generateCarImageUrl } from "./utils";

interface CarDetailsProps {
  isOpen: boolean;
  closeModal: () => void;
  car: Carprops;
}

const CarDetails = ({ isOpen, closeModal, car }: CarDetailsProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as={Fragment as unknown as ComponentProps<typeof Dialog>["as"]} className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col gap-5">
                <button
                  type="button"
                  className="absolute top-2 right-2 z-10 w-fit p-2 rounded-full bg-blue-100"
                  onClick={closeModal}
                >
                  <Image src="/close.svg" alt="close" width={20} height={20} className="object-contain" />
                </button>

                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                  <Image src={generateCarImageUrl(car)} alt="car model" fill priority className="object-contain" />
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold text-xl capitalize">
                    {car.make} {car.model}
                  </h2>
                  <p className="text-sm text-gray-600">{car.class}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-4">
                  {Object.entries(car).map(([key, value]) => (
                    <div className="flex justify-between gap-5 w-full text-right" key={key}>
                      <h4 className="text-gray-500 capitalize">{key}</h4>
                      <p className="font-medium text-gray-800">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CarDetails;
