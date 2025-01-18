import React, { useState } from "react";
import jsPDF from "jspdf";

const ImgToPdf = () => {
  const [photos, setPhoto] = useState([]);
  const [paperSize, setPaperSize] = useState("a4");
  const [marginSize, setMarginSize] = useState("normal");
  const [imagePosition, setImagePosition] = useState("cover");

  const onChangePhoto = (e) => {
    setPhoto([...photos, ...e.target.files]);
  };

  const removePhoto = (index) => {
    const updatePhotos = [...photos];
    updatePhotos.splice(index, 1);
    setPhoto(updatePhotos);
  };

  const getPageController = () => {
    const unit = {
        a4: { width: 595.28, height: 841.89 },
        letter: { width: 612, height: 792 },
        legal: { width: 612, height: 1008 },
        tabloid: { width: 792, height: 1224 },
        executive: { width: 522, height: 756 }
    };
      
    return unit[paperSize];
      
  };

  const getMarginSize = () => {
    const margins = {
        none: 0,        
        small: 10,
        normal: 15,
        large: 25
      };
      
    return margins[marginSize];
      
  };

  const pdfGenerate = () => {
    const { width, height } = getPageController();
    const margin = getMarginSize();
    var doc = new jsPDF("p", "pt", paperSize);

    photos.forEach((photo, index) => {
        const img = URL.createObjectURL(photo);
    
        if (index > 0) {
            doc.addPage();
        }
    
        // Calculate position based on the selected image position
        let x = margin;
        let y = margin;
        let imgWidth = width - 2 * margin;
        let imgHeight = height - 2 * margin;
    
        switch (imagePosition) {
            case "top":
                y = margin;
                imgHeight = (height - 2 * margin) / 2;
                break;
            case "center":
                y = (height - imgHeight) / 2;
                break;
            case "bottom":
                y = height - imgHeight - margin;
                break;
            case "cover":
                // Stretch to cover the entire page
                x = 0;
                y = 0;
                imgWidth = width;
                imgHeight = height;
                break;
            case "stretch":
                // Stretch image to fit within margins
                imgWidth = width - 2 * margin;
                imgHeight = height - 2 * margin;
                break;
            default:
                break;
        }
    
        doc.addImage(img, null, x, y, imgWidth, imgHeight);
    });
    doc.save("image-to-pdf.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl border-2 border-purple-400 rounded-lg bg-white shadow-lg p-6 flex flex-col">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Image to PDF</h1>
        </div>

        {/* Content */}
        <div className="flex-grow grid grid-cols-12 gap-4">
          {/* Left Side (12/4) */}
          <div className="col-span-12 sm:col-span-4 bg-gray-50 p-6 shadow-md rounded-lg">
            {photos.map((photo, index) => (
              <div key={index}>
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Image"
                  className="w-full h-64 object-cover mb-3"
                />
                <button
                  className="mt-2 mb-5 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                  onClick={() => removePhoto(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Right Side (12/8) */}
          <div className="col-span-12 sm:col-span-8 bg-gray-50 p-6 shadow-md rounded-lg">
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Add Images
                </label>
                <input
                  accept="image/png, image/jpeg, image/jpg"
                  type="file"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                  onChange={onChangePhoto}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Paper Size
                </label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                >
                  <option value="a4">A4 (210mm x 297mm)</option>
                  <option value="letter">Letter (8.5in x 11in)</option>
                  <option value="legal">Legal (8.5in x 14in)</option>
                  <option value="tabloid">Tabloid (11in x 17in)</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Margin Size
                </label>
                <select
                  value={marginSize}
                  onChange={(e) => setMarginSize(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="small">Small</option>
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image Position
                </label>
                <select
                  value={imagePosition}
                  onChange={(e) => setImagePosition(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                >
                  <option value="cover">Cover</option>
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                  <option value="stretch">Stretch</option>                 
                </select>
              </div>
            </form>
            <div>
            <button
              disabled={photos.length === 0}
              onClick={pdfGenerate}
              className="mt-5 w-full px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            >
              Download PDF
            </button>
            <div className="text-xs text-gray-500 mt-2">
              * Please note that this tool converts images to PDF format, but it does not preserve the original image quality.
            </div>
            <div className="text-xs text-gray-500 mt-2">
              * This tool is for educational purposes only and does not include any security measures or encryption.
            </div>
          </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-500 text-center">
          <a
            href="https://www.facebook.com/softdevjowel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            Developed by Muhammad Jowel
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImgToPdf;
