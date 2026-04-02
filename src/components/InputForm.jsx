import { CloudUploadIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
const parentVariant = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.5, duration: 0.9 },
  },
};
const childVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
};
const InputForm = () => {
  // states
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    console.log("File Selected", selectedFile.name);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    console.log(droppedFile.name);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      setTimeout(() => setError(null), 3000);
      return;
    }
    const data = new FormData();
    data.append("file", file);
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      const resdata = await response.json();
      if (response.ok) {
        setSuccess(resdata.message);

        setTimeout(() => {
          setSuccess(null);
          setFile(null);
        }, 3000);
      } else {
        setError(resdata.error);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <motion.div
        onDragOver={(e) => e.preventDefault()}
        variants={parentVariant}
        initial="hidden"
        animate="visible"
        onDrop={handleDrop}
        className="max-w-xl mx-auto mt-10"
      >
        {success && (
          <motion.p
            className="bg-green-400 px-20 py-3 mb-2 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {success}
          </motion.p>
        )}
        {error && (
          <motion.p
            className="bg-red-400 px-20 py-3 mb-2 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.8 }}
          >
            {error}
          </motion.p>
        )}
        <motion.label
          variants={childVariants}
          initial="hidden"
          animate="visible"
          htmlFor="file-upload"
          className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-slate-300 active:border-blue-500 active:bg-blue-50"
        >
          <motion.div
            variants={childVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center pt-5 pb-6"
          >
            <CloudUploadIcon className="w-10 h-10 mb-4 text-gray-500" />
            {file ? (
              <>
                <motion.p
                  variants={childVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-2 text-sm text-gray-700"
                >
                  <motion.span
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    className="font-bold"
                  >
                    {file.name}
                  </motion.span>
                </motion.p>
              </>
            ) : (
              <>
                <motion.p
                  variants={childVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-2 text-sm text-gray-700"
                >
                  <motion.span
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    className="font-bold"
                  >
                    Click to upload
                  </motion.span>{" "}
                  or drag and drop
                </motion.p>
              </>
            )}
          </motion.div>

          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <motion.input
              variants={childVariants}
              initial="hidden"
              animate="visible"
              id="file-upload"
              type="file"
              name="file"
              className="hidden"
              accept="image/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx,
          application/pdf,
          application/msword,
          application/vnd.openxmlformats-officedocument.wordprocessingml.document,
          application/vnd.ms-excel,
          application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
          application/vnd.ms-powerpoint,
          application/vnd.openxmlformats-officedocument.presentationml.presentation"
              onChange={handleFileChange}
            />
            <AnimatePresence mode="wait">
              {loading ? (
                <>
                  <motion.button
                    disabled={loading}
                    variants={childVariants}
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        duration: 0.1,
                        type: "spring",
                        stiffness: 500,
                      },
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                        stiffness: 500,
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    type="submit"
                    className="cursor-pointer disabled:opacity-50 w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-md hover:bg-black active:bg-slate-800 flex items-center gap-2"
                  >
                    <Loader2 className="animate-spin" size={20} />
                    Uploading...
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    disabled={loading}
                    variants={childVariants}
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        duration: 0.1,
                        type: "spring",
                        stiffness: 500,
                      },
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                        stiffness: 500,
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    type="submit"
                    className="cursor-pointer disabled:opacity-50 w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-md hover:bg-black active:bg-slate-800"
                  >
                    Upload
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </form>
        </motion.label>
      </motion.div>
    </div>
  );
};

export default InputForm;
