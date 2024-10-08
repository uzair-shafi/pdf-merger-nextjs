import React from "react";
import Image from "next/image";

const HowWorks = () => {
  return (
    <div className="flex md:flex-row flex-col xl:mt-[0px] mt-[70px] justify-center  w-full lg:gap-[100px] gap-[20px] lg:h-[276px]  px-[20px]  ">
      <div className="sm:w-[365px] xs:w-[315px] h-[276px] flex flex-col md:pr-[0px] sm:pr-[10px] gap-[10px]">
        <h2 className="text-[#333333] font-extrabold lg:text-[34px] text-[25px]">
          How it Works
        </h2>
        <div className="flex flex-col gap-[20px] md:pr-[0px] sm:pr-[10px]">
          <div className=" flex flex-row items-start gap-[10px] ">
            <Image
              src="/star.svg"
              alt="Logo"
              height={13}
              width={12.46}
              className="cursor-pointer mt-[10px]"
            />
            <p className="lg:text-[22px] text-[18px] text-start font-semibold ">
              Upload pdfs to merge pdf files together.
            </p>
          </div>
          <div className=" flex flex-row items-start gap-[10px]">
            <Image
              src="/star.svg"
              alt="Logo"
              height={13}
              width={12.46}
              className="cursor-pointer mt-[10px]"
            />
            <p className="lg:text-[22px] text-[18px] text-start font-semibold  ">
              Start the process to combine two pdfs or more.
            </p>
          </div>
          <div className=" flex flex-row items-start gap-[10px]">
            <Image
              src="/star.svg"
              alt="Logo"
              height={13}
              width={12.46}
              className="cursor-pointer mt-[10px]"
            />
            <p className="lg:text-[22px] text-[18px] text-start font-semibold">
              Download the file in your storage.
            </p>
          </div>
        </div>
      </div>
      <div className="lg:w-[420px] md:w-[370px] w-full h-[268px] bg-[#F6F6F6] rounded-[20px]  "></div>
    </div>
  );
};

export default HowWorks;
