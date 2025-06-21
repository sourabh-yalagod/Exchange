"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
const images: any = {
  desktopDark: "/desktop-dark.png",
  desktopLight: "/desktop-light.png",
  proDark: "/pro-dark.svg",
  proLight: "/pro-light.svg",
  liteLight: "/lite-light.svg",
  liteDark: "/lite-dark.svg",
};
const Demo = () => {
  const [image, setImage] = useState(images.desktopDark);
  const { forcedTheme } = useTheme();
  return (
    <div className="md:flex grid space-y-12 place-items-center gap-2 w-full justify-around">
      <div className="grid max-w-full w-1/2 gap-6 place-items-center">
        <Image src={image} alt="Demo Image" height={500} width={300} />
        <div className="flex text-xl font-semibold space-x-6 cursor-pointer">
          {["Desktop", "Lite", "Pro"].map((item) => {
            console.log(
              // item.toLowerCase().startsWith(image.toLowerCase().split("/")[0])
              image.slice(1),
            );

            return (
              <div
                key={item}
                onClick={() =>
                  setImage(
                    images[
                      item
                        .toLowerCase()
                        .concat(forcedTheme == "dark" ? "Dark" : "Light")
                    ],
                  )
                }
                className="relative group transition-all hover:scale-105"
              >
                <span className="">{item}</span>
                {item
                  .toLowerCase()
                  .startsWith(image.toLowerCase().slice(1).split("-")[0]) && (
                  <span className="absolute delay-300 transition-all duration-500 left-0 -bottom-5 h-[5px] w-full bg-blue-500 scale-x-110 rounded-2xl"></span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid space-y-4 place-items-center">
        <h1 className="text-4xl text-center font-semibold">
          Trade on the go. Anywhere, anytime.
        </h1>
        <div className="">
          <Image
            src={"/qr-code.jpg"}
            alt="QR Code"
            width={200}
            height={200}
            className="rounded-xl border-2"
          />
          <div className="text-lg font-semibold capitalize pt-3">
            <h2>Scan to Download App</h2>
            <h2>iOS and Android</h2>
          </div>
        </div>
        <div className="flex items-center space-x-16">
          <Logo image={`/apple.webp`} title={"Apple"} />
          <Logo image={`/window.png`} title={"Window"} />
          <Logo image={`/linux.png`} title={"Linux"} />
        </div>
      </div>
    </div>
  );
};

export default Demo;

const Logo = ({ title, image }: any) => {
  return (
    <div className="text-center rounded-xl border-2 w-fit grid place-items-center text-xl cursor-pointer hover:dark:bg-[#1e2326] hover:scale-105 transition-all p-2 font-bold font-mono">
      <Image src={image} alt={title} width={50} height={50} />
      {title}
    </div>
  );
};
