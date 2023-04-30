import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { IoImage, IoArrowForward } from "react-icons/io5";
import useMeasure from "react-use-measure";

function ImageSelectStep({ onSend }) {
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const acceptedFile = acceptedFiles[0];
    const objectURL = URL.createObjectURL(acceptedFile);
    var image = new Image();
    image.src = objectURL;

    image.onload = function () {
      setFile({
        file: acceptedFile,
        url: objectURL,
        width: this.width,
        height: this.height,
      });
    };
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/gif": [],
      "image/jpeg": [],
      "image/webp": [],
    },
  });

  const canContinue = Boolean(file);

  return (
    <div className="flex-1 flex flex-col items-center">
      <h1 className=" font-semibold text-3xl text-center">Resmini seç!</h1>
      <p className="text-sm text-gray-400 font-semibold mt-2 text-center">
        Seçtiğiniz dosya bir resim olmalıdır
      </p>
      <div
        {...getRootProps()}
        className={`dashedBorder rounded-2xl flex items-center justify-center flex-col min-h-[20rem] w-full h-fit px-16 py-8 mt-8 transition cursor-pointer ${
          isDragActive ? "bg-[#458cff18]" : "bg-[#FBFBFF]"
        }`}
      >
        <input
          {...getInputProps()}
          accept="image/png, image/gif, image/jpeg, image/webp"
        />
        {file && <img src={file.url} className="h-full max-w-full" />}
        {!file && (
          <IoImage
            className={`transition ${file ? "w-16 h-16" : "w-24 h-24"} ${
              isDragActive || file ? "text-[#458cff]" : "text-[#458cff98]"
            }`}
          />
        )}
        {!file && (
          <p className=" text-gray-400 mt-2">Resmini buraya bırak veya tıkla</p>
        )}
      </div>
      <div className="mt-auto w-full">
        <button
          disabled={!canContinue}
          onClick={() => onSend(file)}
          className={`px-4 py-2 bg-[#458BFF] rounded-md ml-auto flex gap-2 mt-4 items-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition`}
        >
          <span>Devam et</span>
          <IoArrowForward />
        </button>
      </div>
    </div>
  );
}

function ImageResizeStep({ onSend, data }) {
  const [width, setWidth] = useState(data.width);
  const [height, setHeight] = useState(data.height);
  const [keepRatio, setKeepRatio] = useState(true);

  const onChangeWidth = (e) => {
    setWidth(e.target.value);

    if (keepRatio) {
      setHeight(Math.floor(e.target.value / (data.width / data.height)));
    }
  };

  const onChangeHeight = (e) => {
    setHeight(e.target.value);

    if (keepRatio) {
      setWidth(Math.floor(e.target.value * (data.width / data.height)));
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <h1 className=" font-semibold text-3xl text-center">
        Resmini boyutlandır
      </h1>
      <p className="text-sm text-gray-400 font-semibold mt-2 text-center">
        Seçtiğiniz dosya bir resim olmalıdır
      </p>
      <div
        className={` rounded-2xl flex justify-center flex-col gap-4 w-full h-fit p-8 mt-8 transition ${"bg-[#FBFBFF]"}`}
      >
        <div className="flex flex-col">
          <div className="flex justify-between">
            <span>Genişlik</span>
            <span>{width}</span>
          </div>
          <input
            onChange={onChangeWidth}
            value={width}
            type="range"
            min="1"
            max="10000"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <span>Yükseklik</span>
            <span>{height}</span>
          </div>

          <input
            onChange={onChangeHeight}
            value={height}
            min="1"
            max="10000"
            type="range"
          />
        </div>
        <label className="flex gap-4">
          <span>En / Boy oranını koru</span>
          <input
            type="checkbox"
            checked={keepRatio}
            onChange={(e) => setKeepRatio(e.target.checked)}
          />
        </label>
      </div>
      <div className="mt-auto w-full">
        <button
          onClick={() =>
            onSend({
              selectedWidth: width,
              selectedHeight: height,
            })
          }
          className={`px-4 py-2 bg-[#458BFF] rounded-md ml-auto flex gap-2 mt-4 items-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition`}
        >
          <span>Devam et</span>
          <IoArrowForward />
        </button>
      </div>
    </div>
  );
}

function ImageRotateStep({ onSend, data }) {
  const [degrees, setDegreess] = useState(0);
  return (
    <div className="flex-1 flex flex-col items-center">
      <h1 className=" font-semibold text-3xl text-center">Resmini çevir</h1>
      <p className="text-sm text-gray-400 font-semibold mt-2 text-center">
        Seçtiğiniz dosya bir resim olmalıdır
      </p>
      <div
        className={` rounded-2xl flex justify-center flex-col gap-4 w-full h-fit p-8 mt-8 transition ${"bg-[#FBFBFF]"}`}
      >
        <div className="px-8 mx-auto overflow-hidden">
          <img
            src={data.url}
            style={{
              transform: `rotateZ(${degrees}deg)`,
            }}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <span>Derece</span>
            <span>{degrees}</span>
          </div>

          <input
            onChange={(e) => setDegreess(e.target.value)}
            value={degrees}
            min="-180"
            max="180"
            type="range"
          />
        </div>
      </div>
      <div className="mt-auto w-full">
        <button
          onClick={() =>
            onSend({
              degrees,
            })
          }
          className={`px-4 py-2 bg-[#458BFF] rounded-md ml-auto flex gap-2 mt-4 items-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition`}
        >
          <span>Devam et</span>
          <IoArrowForward />
        </button>
      </div>
    </div>
  );
}

function ImageFlipStep({ onSend, data }) {
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  return (
    <div className="flex-1 flex flex-col items-center">
      <h1 className=" font-semibold text-3xl text-center">Resmini aynala</h1>
      <p className="text-sm text-gray-400 font-semibold mt-2 text-center">
        Seçtiğiniz dosya bir resim olmalıdır
      </p>
      <div
        className={` rounded-2xl flex justify-center flex-col gap-4 w-full h-fit p-8 mt-8 transition ${"bg-[#FBFBFF]"}`}
      >
        <div className="px-8 mx-auto overflow-hidden">
          <img
            src={data.url}
            style={{
              transform: `scale(${flipX ? -1 : 1},${flipY ? -1 : 1}) rotateZ(${
                data.degrees
              }deg)`,
            }}
          />
        </div>

        <label className="flex gap-4">
          <span>Yatay aynala</span>
          <input
            type="checkbox"
            checked={flipX}
            onChange={(e) => setFlipX(e.target.checked)}
          />
        </label>

        <label className="flex gap-4">
          <span>Dikey aynala</span>
          <input
            type="checkbox"
            checked={flipY}
            onChange={(e) => setFlipY(e.target.checked)}
          />
        </label>
      </div>
      <div className="mt-auto w-full">
        <button
          onClick={() =>
            onSend({
              flipX,
              flipY,
            })
          }
          className={`px-4 py-2 bg-[#458BFF] rounded-md ml-auto flex gap-2 mt-4 items-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition`}
        >
          <span>Devam et</span>
          <IoArrowForward />
        </button>
      </div>
    </div>
  );
}

function ImageCropStep({ onSend, data }) {
  const startPointX = useMotionValue(0);
  const startPointY = useMotionValue(0);
  const endPointX = useMotionValue(0);
  const endPointY = useMotionValue(0);
  const widthDim = useMotionValue(0);
  const heightDim = useMotionValue(0);
  const [
    imageRef,
    { height: imageHeight, width: imageWidth, x: imageX, y: imageY },
  ] = useMeasure();

  const isDraggingStart = useRef({
    state: false,
    x: 0,
    y: 0,
  });
  const isDraggingEnd = useRef({
    state: false,
    x: 0,
    y: 0,
  });

  const updateDimensions = () => {
    widthDim.set(endPointX.get() - startPointX.get());
    heightDim.set(endPointY.get() - startPointY.get());
  };

  const onPointerDownStart = (e) => {
    isDraggingStart.current.state = true;
    isDraggingStart.current.x = e.clientX - imageX - startPointX.get();
    isDraggingStart.current.y = e.clientY - imageY - startPointY.get();
  };

  const onPointerDownEnd = (e) => {
    isDraggingEnd.current.state = true;
    isDraggingEnd.current.x = e.clientX - imageX - endPointX.get();
    isDraggingEnd.current.y = e.clientY - imageY - endPointY.get();
  };

  useEffect(() => {
    const moveListener = (e) => {
      if (isDraggingStart.current.state) {
        const newX = Math.min(
          imageWidth,
          Math.max(0, e.clientX - imageX - isDraggingStart.current.x)
        );
        startPointX.set(newX);

        const newY = Math.min(
          imageHeight,
          Math.max(0, e.clientY - imageY - isDraggingStart.current.y)
        );
        startPointY.set(newY);

        updateDimensions();
      }

      if (isDraggingEnd.current.state) {
        const newX = Math.min(
          imageWidth,
          Math.max(0, e.clientX - imageX - isDraggingEnd.current.x)
        );
        endPointX.set(newX);

        const newY = Math.min(
          imageHeight,
          Math.max(0, e.clientY - imageY - isDraggingEnd.current.y)
        );
        endPointY.set(newY);
        updateDimensions();
      }
    };

    const upListener = () => {
      isDraggingStart.current.state = false;
      isDraggingEnd.current.state = false;
    };

    window.addEventListener("mousemove", moveListener);
    window.addEventListener("pointerup", upListener);

    () => (
      window.removeEventListener("mousemove", moveListener),
      window.removeEventListener("pointerup", upListener)
    );
  }, [imageX, imageY, imageWidth, imageHeight]);
  useEffect(() => {
    endPointX.set(imageWidth);
    endPointY.set(imageHeight);

    updateDimensions();
  }, [imageWidth, imageHeight]);

  const onSubmit = () => {
    onSend({
      startPointX: Math.floor(
        (startPointX.get() / imageWidth) * data.selectedWidth
      ),
      startPointY: Math.floor(
        (startPointY.get() / imageHeight) * data.selectedHeight
      ),
      endPointX: Math.floor(
        (endPointX.get() / imageWidth) * data.selectedWidth
      ),
      endPointY: Math.floor(
        (endPointY.get() / imageHeight) * data.selectedHeight
      ),
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <h1 className=" font-semibold text-3xl text-center">Resmini kırp</h1>
      <p className="text-sm text-gray-400 font-semibold mt-2 text-center">
        Seçtiğiniz dosya bir resim olmalıdır
      </p>
      <div
        className={` rounded-2xl flex justify-center flex-col gap-4 w-full h-fit p-8 mt-8 transition ${"bg-[#FBFBFF]"}`}
      >
        <div className="mx-auto overflow-hidden relative">
          <img
            draggable={false}
            ref={imageRef}
            src={data.url}
            className="select-none"
          />
          <motion.div
            className="absolute select-none"
            style={{
              top: startPointY,
              left: startPointX,
              width: widthDim,
              height: heightDim,
              boxShadow: "0 0 999999px 999999px rgb(0 0 0 / 50%)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#458BFF] cursor-se-resize"
              onPointerDown={onPointerDownStart}
            ></div>

            <div
              className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#458BFF] cursor-se-resize"
              onPointerDown={onPointerDownEnd}
            ></div>
          </motion.div>
        </div>
      </div>
      <div className="mt-auto w-full">
        <button
          onClick={onSubmit}
          className={`px-4 py-2 bg-[#458BFF] rounded-md ml-auto flex gap-2 mt-4 items-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition`}
        >
          <span>Devam et</span>
          <IoArrowForward />
        </button>
      </div>
    </div>
  );
}

function ImageSubmitStep({ data }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageURL] = useState(null);

  useEffect(() => {
    //
    const formData = new FormData();
    Object.entries(data)
      .filter((entry) => !["file", "url", "width", "height"].includes(entry[0]))
      .forEach((entry) => formData.append(entry[0], entry[1]));
    formData.append("image", data.file);

    fetch("http://localhost:3000/process", {
      method: "POST",
      body: formData,
    })
      .then((x) => x.json())
      .then((res) => {
        setIsLoading(false);
        setImageURL("http://localhost:3000/static/result/" + res.data.filename);
        setError(!res.status);
      });
  }, []);
  return (
    <div className="flex-1 flex flex-col items-center">
      <h1 className=" font-semibold text-3xl text-center">
        {isLoading
          ? "Resminiz işleniyor"
          : error
          ? "Resminiz işlenirken bir hata oluştu"
          : "Resminiz başarıyla işlendi"}
      </h1>
      <p className="text-sm text-gray-400 font-semibold mt-2 text-center">
        {isLoading
          ? "bu biraz zaman alabilir"
          : error
          ? "lütfen tekrar deneyin"
          : "sayfayı yenileyerek daha fazla resim işleyebilirsiniz"}
      </p>
      <div
        className={` rounded-2xl flex justify-center flex-col gap-4 w-full h-fit p-8 mt-8 transition ${"bg-[#FBFBFF]"}`}
      >
        <div className="px-8 mx-auto overflow-hidden">
          {isLoading || error ? <></> : <img src={imageUrl} />}
        </div>
      </div>
    </div>
  );
}

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 600 : -600,
    };
  },
  animate: {
    x: 0,
  },
  exit: (direction) => {
    return {
      x: direction < 0 ? 600 : -600,
    };
  },
};

// const steps = [ImageSelectStep, ImageSelectStep];
const steps = [
  ImageSelectStep,
  ImageResizeStep,
  ImageCropStep,
  ImageRotateStep,
  ImageFlipStep,
  ImageSubmitStep,
];

function App() {
  const [[step, direction], setStep] = useState([0, 0]);
  const [data, setData] = useState({});
  const [ref, { height }] = useMeasure();
  const k = useSpring(0);

  const onCompleteStep = async (step, data) => {
    setData((prev) => ({ ...prev, ...data }));
    setStep((prev) => [prev[0] + 1, 1]);
  };

  useEffect(() => k.set(height), [height]);

  const CurrentStep = steps[step];

  return (
    <div className="min-h-screen font-main flex items-center justify-center">
      <motion.div
        style={{
          height: k,
        }}
        className="bg-white rounded-md w-full max-w-[36rem] flex min-h-[24rem] overflow-hidden relative"
      >
        <div ref={ref} className="flex flex-1 h-fit  p-8">
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              variants={variants}
              custom={direction}
              initial="enter"
              animate="animate"
              exit="exit"
              transition={{
                duration: 0.75,
                delayChildren: 0.4,
              }}
              className="flex flex-col flex-1"
              key={step}
            >
              <CurrentStep
                data={data}
                onSend={(data) => onCompleteStep(step, data)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
