import React from "react";
import Image from "next/image";
const Footer = () => {
  return (
    <div className=" bg-[#333333] pt-[70px] pb-[30px] mt-[80px]  ">
      <div className="xl:w-[1278px] lg:px-[70px]  px-[20px] w-full   mx-auto  ">
        <div className="flex lg:flex-row flex-col lg:gap-[0px] gap-[40px] justify-between border-b-[1px] border-[#DEDEDE] pb-[20px]">
          <div className="flex flex-col w-[215px] gap-[10px]">
            <h2 className="text-white text-[14px] w-[76px] border-b-[1px] border-[#DEDEDE] font-bold">
              Merge PDF
            </h2>
            <p className="text-white text-[16px] font-medium leading-[26px]">
              Combine PDF files to create a single document online for free.
              It’s easy to merge PDFs with our PDF combiner. No watermarks and
              no file size limits.
            </p>
          </div>
          <div className="flex flex-col w-[151px] gap-[10px]">
            <h2 className="text-white text-[14px] w-[39px] border-b-[1px] border-[#DEDEDE] font-bold">
              About
            </h2>

            <p className="text-white text-[16px] font-light leading-[26px] cursor-pointer">
              About Us
            </p>
            <p className="text-white text-[16px] font-light leading-[26px] cursor-pointer">
              Contact Us
            </p>
            <p className="text-white text-[16px] font-lightleading-[26px] cursor-pointer">
              Privacy Policy
            </p>
            <p className="text-white text-[16px] font-light leading-[26px] cursor-pointer">
              Terms and Conditions
            </p>
            <p className="text-white text-[16px] font-lightleading-[26px] cursor-pointer">
              Our Editorial Process
            </p>
            <p className="text-white text-[16px] font-light leading-[26px] cursor-pointer">
              Authors
            </p>
          </div>
          <div className="flex flex-col w-[57px] gap-[10px]">
            <h2 className="text-white text-[14px] w-[67px] border-b-[1px] border-[#DEDEDE] font-bold">
              Resources
            </h2>
            <p className="text-white text-[16px] font-medium leading-[26px] cursor-pointer">
              Insights
            </p>
          </div>
          <div className="flex flex-col w-[268.94px] gap-[10px]">
            <h2 className="text-white text-[14px]  font-bold">
              Connect With Us
            </h2>
            <div className="flex flex-row gap-[8px]">
              <Image
                src="/fb.svg"
                alt="fb"
                height={44}
                width={44}
                className="cursor-pointer"
              />
              <Image
                src="/twitter.svg"
                alt="twitter"
                height={44}
                width={44}
                className="cursor-pointer"
              />
              <Image
                src="/insta.svg"
                alt="insta"
                height={44}
                width={44}
                className="cursor-pointer"
              />
              <Image
                src="/pinterest.svg"
                alt="pinterest"
                height={44}
                width={44}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-white text-[14px]  font-bold">
              Connect With Us
            </h2>
            <div className="flex flex-row gap-[10px]">
              <div className=" w-[129px] cursor-pointer h-[50px] border-[1px] border-white flex flex-row gap-[5px] justify-center items-center rounded-[10px] px-[10px] py-[5px] ">
                <Image
                  src="/apple.svg"
                  alt="apple"
                  height={17}
                  width={21}
                  className="cursor-pointer"
                />
                <div className="flex flex-col ">
                  <h2 className="text-white text-[9px]  font-medium">
                    Download on the
                  </h2>
                  <h2 className="text-white text-[14px] -mt-[5px] font-semibold">
                    App Store
                  </h2>
                </div>
              </div>
              <div className=" w-[129px] cursor-pointer h-[50px] border-[1px] border-white flex flex-row gap-[5px] justify-center items-center rounded-[10px] px-[10px] py-[5px] ">
                <Image
                  src="/play.svg"
                  alt="google play"
                  height={17}
                  width={21}
                  className="cursor-pointer"
                />
                <div className="flex flex-col ">
                  <h2 className="text-white text-[9px]  font-medium">
                    Get it on
                  </h2>
                  <h2 className="text-white text-[14px] -mt-[5px] font-semibold">
                    Google Play
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[16px] font-medium text-white text-center pt-[30px] ">
          Copyright © 2024
        </p>
      </div>
    </div>
  );
};

export default Footer;
