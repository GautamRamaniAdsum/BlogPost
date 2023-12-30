const validateFile = async (
    responseObj,
    file,
    fieldName,
    allowedExtension,
    maxSizeInMb,
    next
) => {
    let isValidFile = true;
    responseObj.statusCode = 400;

    console.log("responseObj::", responseObj, "file::", file, "fieldName::", fieldName,"fieldName::", allowedExtension,"allowedExtension::", "maxSizeInMb::",maxSizeInMb);

    if (!file) {
        console.log("!file::::");
        isValidFile = false;
        next(new Error(`The ${fieldName} field is required.`))
    } else if (file.fieldname !== fieldName) {
        isValidFile = false;
        console.log("file.fieldname !== fieldName::::");
        next(new Error(`The ${fieldName} field is required.`))
    } else {
        // Validate extension
        if (allowedExtension.length > 0) {
            const extension = path.extname(file.originalname).toLowerCase();
            const isValidExt = await isValidExtenstion(extension, allowedExtension);

            if (!isValidExt) {
                console.log("!isValidExt::::");
                isValidFile = false;
                next(new Error(`The type of ${fieldName} must be ${allowedExtension.join('/')}.`))
            }
        }

        // Validate file size
        if (maxSizeInMb) {
            const isValidSize = await isValidFileSize(
                file.size,
                maxSizeInMb * 1024 * 1024
            );

            if (!isValidSize) {
                console.log("!isValidSize::::");
                isValidFile = false;
                next(new Error(`The ${fieldName} may not be greater than ${maxSizeInMb.toString()} MB.`))
            }
        }
    }

    if (!isValidFile) {
        console.log("!isValidFile::::");
        next(new Error("not a valid file"))
    }
};

const isValidExtenstion = async (mimetype, allowedExtension) => {
    if (allowedExtension.includes(mimetype)) {
        return true;
    } else {
        return false;
    }
};

const isValidFileSize = async (fileSize, maxSize) => {
    if (fileSize <= maxSize) {
        return true;
    } else {
        return false;
    }
};

module.exports = { validateFile }