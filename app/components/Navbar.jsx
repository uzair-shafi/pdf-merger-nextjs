import Image from "next/image";

export const Navbar = () => {
  return (
    <header className="mt-[10px] z-20 md:h-[102px]  lg:px-[70px]  px-[20px] ">
      <div className="py-5">
        <div className="">
          <div className="flex md:flex-row flex-col md:gap-[0px] gap-[20px] items-center justify-between">
            <Image
              src="/logo.svg"
              alt="Logo"
              height={40}
              width={40}
              className="cursor-pointer"
            />

            <nav className="flex gap-[19px] text-black/60 items-center">
              <a
                href="#"
                className="text-[#333333] w-[83px] text-[14px] md:block hidden font-semibold hover:text-red"
              >
                Insights
              </a>
              <a
                href="#"
                className="text-[#333333] w-[83px] text-[14px] font-semibold hover:text-red md:block hidden "
              >
                About Us
              </a>

              <button className="bg-[#FE3323] text-white px-[26px] py-[10px] rounded-[6px] font-semibold text-[16px] w-[93px] h-[42px] inline-flex align-items justify-center hover:shadow-[0px_0px_14px_rgba(254,51,35,0.8)]">
                Login
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
