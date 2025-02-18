export const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const isBase64 = (str: string) => {
  if (str === "" || str?.trim() === "") {
    return false;
  }
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};

 
export const base64toFile = (dataurl = "", filename: string) => {
  if (!dataurl) {
    throw new Error("No content was provided");
  }
  const [metadata, base64] = dataurl.split(",");
  const mime = metadata.match(/:(.*?);/);

  if (!isBase64(base64)) {
    // throw new Error("Content provided is not of base64");
    return null;
  }
  const bstr = atob(base64);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

   
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime[1] });
};
