"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Document, Page } from "react-pdf";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { PDFDocument, degrees } from "pdf-lib";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const Hero = () => {
  const fileInputRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [pdfPreviews, setPdfPreviews] = useState([]);

  const SelectRef = useRef([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedPopupIndex, setSelectedPopupIndex] = useState(null);

  const openPopup = (index) => {
    setSelectedPopupIndex(index);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedPopupIndex(null);
  };

  const rotateSinglePdf = (index) => {
    setPdfPreviews((prevPreviews) => {
      return prevPreviews.map((preview, i) => {
        if (i === index) {
          const newRotation = (preview.rotation + 90) % 360;
          return { ...preview, rotation: newRotation };
        }
        return preview;
      });
    });
  };
  const rotateSinglePdfAnti = (index) => {
    setPdfPreviews((prevPreviews) => {
      return prevPreviews.map((preview, i) => {
        if (i === index) {
          const newRotation = (preview.rotation - 90) % 360;
          return { ...preview, rotation: newRotation };
        }
        return preview;
      });
    });
  };

  const rotateAllPdfs = () => {
    setPdfPreviews((prevPreviews) =>
      prevPreviews.map((preview) => {
        const newRotation = (preview.rotation + 90) % 360;
        return { ...preview, rotation: newRotation };
      })
    );
  };

  const rotateAllPdfsAnti = () => {
    setPdfPreviews((prevPreviews) =>
      prevPreviews.map((preview) => {
        const newRotation = (preview.rotation - 90) % 360;
        return { ...preview, rotation: newRotation };
      })
    );
  };

  const handleClick = (index) => {
    setSelectedIndex(index);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        selectedIndex !== null &&
        SelectRef.current[selectedIndex] &&
        !SelectRef.current[selectedIndex].contains(event.target)
      ) {
        setSelectedIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedIndex]);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const deleteFiles = () => {
    setPdfPreviews([]);
  };
  const deleteSingle = (index) => {
    setPdfPreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
    closePopup();
  };

  const handleInputChange = (event) => {
    const inputFiles = Array.from(event.target.files);
    if (inputFiles) {
      handleFiles(inputFiles);
    }
  };
  const handleFiles = (newFiles) => {
    const pdfFiles = newFiles.filter((file) => file.type === "application/pdf");
    if (pdfFiles.length > 0) {
      generatePdfPreviews(pdfFiles);
    }
  };

  const generatePdfPreviews = async (files) => {
    const allPreviews = [];
    for (const file of files) {
      const previewsForFile = await renderAllPages(file);
      allPreviews.push(...previewsForFile);
    }
    setPdfPreviews((prevPreviews) => [...prevPreviews, ...allPreviews]);
  };

  const renderAllPages = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

        const pages = [];
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const scale = 3.0;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;

          const imageUrl = canvas.toDataURL();
          pages.push({
            imageUrl,
            name: `${file.name} - Page ${i}`,
            file,
            rotation: 0,
          });
        }

        resolve(pages);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const mergePdfs = async () => {
    const pdfDoc = await PDFDocument.create();
    const fileMap = new Map();

    for (const preview of pdfPreviews) {
      if (!fileMap.has(preview.file.name)) {
        const pdfBytes = await preview.file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        fileMap.set(preview.file.name, pdf);
      }
    }

    for (const preview of pdfPreviews) {
      const pdf = fileMap.get(preview.file.name);
      const pageIndex = parseInt(preview.name.split(" - Page ")[1]) - 1;
      const [copiedPage] = await pdfDoc.copyPages(pdf, [pageIndex]);

      const rotationDegrees = preview.rotation || 0;
      copiedPage.setRotation(
        degrees((copiedPage.getRotation().angle + rotationDegrees) % 360)
      );

      pdfDoc.addPage(copiedPage);
    }

    const mergedPdfBytes = await pdfDoc.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "merged.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col justify-center mx-auto items-center lg:px-[90px] lg:h-[460px] md:px-[80px] px-[20px] md::mt-[0px] mt-[30px] ">
      {pdfPreviews.length === 0 ? (
        <div className="flex flex-col gap-[8px] lg:w-[770px]">
          <h1 className="text-[34px] font-extrabold text-center">
            <span className="text-red">Merge</span> PDF
          </h1>
          <p className="text-[#333333] leading-[24px] lg:w-[770px] text-center text-[16px] font-[400px]">
            Combine PDF files to create a single document online for free. It’s
            easy to merge PDFs with our PDF combiner. No watermarks and no file
            size limits.
          </p>

          <div className="bg-white rounded-[20px] mx-auto p-[12px] mt-[40px] lg:w-[770px] w-full lg:h-[323px] shadow-custom-black z-100">
            <div
              className={`lg:w-[746px] relative lg:p-[0px] p-[10px] lg:h-[299px] border-[2px] rounded-[10px] border-[#DEDEDE] border-dashed flex flex-col gap-[12px] justify-center items-center
              ${dragging ? "bg-[#fff8f8]" : "bg-white"}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Image
                src="/doc2.svg"
                alt="Logo"
                height={84}
                width={96.98}
                className="cursor-pointer lg:w-[84px] w-[60px]"
              />
              <button
                className="bg-red text-white lg:text-[22px] text-[15px] flex flex-row gap-[10px] justify-center items-center font-bold lg:w-[312px] lg:h-[62px] h-[50px] lg:px-[56px] px-[30px] lg:py-[16px] py-[10px] rounded-[10px] transition-all duration-400 ease-in hover:shadow-[0px_0px_14px_rgba(254,51,35,0.8)] hover:lg:w-[340px] hover:lg:h-[70px] hover:lg:px-[70px] hover:lg:py-[20px]"
                onClick={handleButtonClick}
              >
                <Image
                  src="/Vector.svg"
                  alt="Logo"
                  height={26}
                  width={23}
                  className="cursor-pointer lg:w-[23px] w-[18px]"
                />
                Upload PDF File
              </button>
              <p className="text-[16px] text-[#9A9A9A] font-semibold">
                or drop PDFs here
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept=".pdf"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center  lg:mt-[60px] mt-[110px] lg:mb-[0px] mb-[110px] lg:w-[770px] h-[402px] w-full">
          <div className="flex flex-col gap-[8px] lg:w-[770px]">
            <h1 className="text-[34px] font-extrabold text-center">
              <span className="text-red">Merge</span> PDF
            </h1>
            <p className="text-[#333333] leading-[24px] lg:w-[770px] text-center text-[16px] font-[400px]">
              Combine PDF files to create a single document online for free.
              It’s easy to merge PDFs with our PDF combiner. No watermarks and
              no file size limits.
            </p>
          </div>

          <div className="bg-white rounded-[20px] p-[12px] mt-[40px] lg:w-[770px] w-full lg:h-[323px] shadow-custom-black z-100">
            <div className="flex flex-row md:gap-[0px] gap-[5px] justify-between pb-[10px]">
              <div className="flex lg:flex-row flex-col items-center md:gap-[20px] gap-[10px]">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf"
                  onChange={handleInputChange}
                />
                <button
                  onClick={handleButtonClick}
                  className="bg-[#F6F6F6] text-red hover:bg-red hover:text-white p-[12px] flex flex-row gap-[10px] h-[33px] w-[118px] text-[14px] justify-center items-center font-semibold border-[1px] border-red rounded-[6px] group"
                >
                  <Image
                    src="/add.svg"
                    alt="Logo"
                    height={17}
                    width={16}
                    className="cursor-pointer group-hover:hidden"
                  />
                  <Image
                    src="/docw.svg"
                    alt="Logo"
                    height={17}
                    width={16}
                    className="cursor-pointer hidden group-hover:block"
                  />
                  Add More
                </button>
                <p className="text-[12px] font-semibold text-[#9A9A9A]">
                  {pdfPreviews.length} selected
                </p>
              </div>
              <div className="flex lg:flex-row flex-col items-center gap-[10px]">
                <button
                  onClick={rotateAllPdfs}
                  className="bg-white text-red hover:bg-red group hover:text-white p-[12px] flex flex-row gap-[10px] h-[33px] w-[117px] text-[14px] justify-center items-center font-semibold border-[1px] border-red rounded-[6px] "
                >
                  <Image
                    src="/rotate.svg"
                    alt="Logo"
                    height={16}
                    width={16}
                    className="cursor-pointer group-hover:hidden"
                  />
                  <Image
                    src="/rotatew.svg"
                    alt="Logo"
                    height={17}
                    width={16}
                    className="cursor-pointer hidden group-hover:block"
                  />
                  Rotate All
                </button>
                <button
                  onClick={rotateAllPdfsAnti}
                  className="bg-white text-red hover:bg-red group hover:text-white p-[12px] flex flex-row gap-[10px] h-[33px] w-[117px] text-[14px] justify-center items-center font-semibold border-[1px] border-red rounded-[6px] "
                >
                  <Image
                    src="/rotatesec.svg"
                    alt="Logo"
                    height={16}
                    width={16}
                    className="cursor-pointer group-hover:hidden"
                  />
                  <Image
                    src="/rotatesecw.svg"
                    alt="Logo"
                    height={17}
                    width={16}
                    className="cursor-pointer hidden group-hover:block"
                  />
                  Rotate All
                </button>
                <button
                  onClick={deleteFiles}
                  className="bg-white text-red hover:bg-red group hover:text-white p-[12px] flex flex-row gap-[10px] h-[33px] w-[117px] text-[14px] justify-center items-center font-semibold border-[1px] border-red rounded-[6px] "
                >
                  <Image
                    src="/del.svg"
                    alt="Logo"
                    height={16}
                    width={16}
                    className="cursor-pointer group-hover:hidden"
                  />
                  <Image
                    src="/delw.svg"
                    alt="Logo"
                    height={17}
                    width={16}
                    className="cursor-pointer hidden group-hover:block"
                  />
                  Delete All
                </button>
              </div>
            </div>
            <div className="lg:w-[746px] h-[254px] p-[10px] border-[2px] rounded-[10px] border-[#DEDEDE] border-dashed flex  gap-[12px] justify-start items-start overflow-x-auto shrink-0 ">
              {pdfPreviews.map((file, index) => (
                <div
                  onClick={() => handleClick(index)}
                  ref={(el) => (SelectRef.current[index] = el)}
                  style={{
                    backgroundColor:
                      selectedIndex === index ? "#FFEAE9" : "#F6F6F6",
                    borderColor:
                      selectedIndex === index ? "#FE3323" : "#DEDEDE",
                  }}
                  key={index}
                  className="group border relative rounded-[10px] p-2 w-[160px] h-[210px] flex flex-col items-center justify-center shrink-0 transition-all duration-300 ease-in"
                >
                  <div className=" flex flex-row justify-center absolute top-[10px] gap-[4px] w-[114px] mb-[8px]  -mt-[0px]">
                    <Image
                      src="/prev.svg"
                      alt="Logo"
                      height={24}
                      width={24}
                      onClick={() => openPopup(index)}
                      className="cursor-pointer hidden group-hover:flex"
                    />
                    <Image
                      src="/redrotatesec.svg"
                      alt="Logo"
                      height={24}
                      width={24}
                      onClick={() => rotateSinglePdf(index)}
                      className="cursor-pointer hidden group-hover:flex"
                    />
                    <Image
                      src="/redrotate.svg"
                      alt="Logo"
                      height={24}
                      width={24}
                      onClick={() => rotateSinglePdfAnti(index)}
                      className="cursor-pointer hidden group-hover:flex"
                    />
                    <Image
                      src="/reddelete.svg"
                      alt="Logo"
                      height={24}
                      width={24}
                      onClick={() => deleteSingle(index)}
                      className="cursor-pointer hidden group-hover:flex"
                    />
                  </div>
                  <img
                    src={file.imageUrl}
                    alt="PDF Preview"
                    style={{
                      transform: `rotate(${file.rotation}deg)`,
                      transition: "transform 0.3s ease",
                    }}
                    className="w-[108px] h-[140px] mt-[32px]"
                  />

                  <div className="w-[27px] h-[15px] rounded-[34px] bg-red mt-[4px] flex justify-center items-center">
                    <p className="font-bold text-[13px] text-white">
                      {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={mergePdfs}
            className="bg-red align-center mt-[10px] mb-[10px]  text-white lg:text-[18px]  text-[15px] flex flex-row  justify-center items-center font-bold lg:w-[237px] lg:h-[49px] h-[40px] lg:px-[50px] px-[30px] lg:py-[12px] py-[10px] rounded-[10px] hover:shadow-[0px_0px_14px_rgba(254,51,35,0.8)]  "
          >
            Merge and Save
          </button>
        </div>
      )}
      {isPopupVisible && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="relative w-full h-full">
            <div className="bg-[#424242] w-full h-[60px] flex justify-between items-center px-[50px]">
              <div className="flex gap-[10px]">
                <button
                  onClick={() => rotateSinglePdf(selectedPopupIndex)}
                  className="text-white p-2  hover:text-white rounded-[6px]"
                >
                  <Image
                    src="/rotatew.svg"
                    alt="Rotate"
                    width={15}
                    height={15}
                  />
                </button>
                <button
                  onClick={() => rotateSinglePdfAnti(selectedPopupIndex)}
                  className="text-white p-2  hover:text-white rounded-[6px]"
                >
                  <Image
                    src="/rotatesecw.svg"
                    alt="Rotate Counterclockwise"
                    width={15}
                    height={15}
                  />
                </button>
                <button
                  onClick={() => deleteSingle(selectedPopupIndex)}
                  className="text-white p-2   rounded-[6px]"
                >
                  <Image src="/delw.svg" alt="Delete" width={15} height={15} />
                </button>
              </div>
              <button
                onClick={closePopup}
                className="text-white p-2  hover:text-white rounded-[6px]"
              >
                Close
              </button>
            </div>

            <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-[#000000] bg-opacity-80">
              <img
                src={pdfPreviews[selectedPopupIndex].imageUrl}
                alt="Full PDF Preview"
                style={{
                  transform: `rotate(${pdfPreviews[selectedPopupIndex].rotation}deg)`,
                  transition: "transform 0.3s ease",
                }}
                className="w-[400px] h-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
