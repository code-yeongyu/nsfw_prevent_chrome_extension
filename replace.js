console.log("the script loaded")

const NSFW_URL = "http://localhost:5000/upload/files"
const REPLACED_IDENTIFIER = "localhost"

function getDataUrl(img) {
    // Create empty canvas to get blob
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL("image/jpeg")
}

function b64toBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1])
    var ab = new ArrayBuffer(byteString.length)
    var ia = new Uint8Array(ab)

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: "image/jpeg" })
}

function replaceAllImages() {
    const images = document.querySelectorAll("img")
    console.log("selected images")

    const formdata = new FormData()
    const data = []

    for (image of images) {
        if (image.src.includes(REPLACED_IDENTIFIER)) {
            // if REPLACED_IDENTIFIER in image.src
            continue
        }
        image.crossOrigin = "anonymous"
        const dataUrl = getDataUrl(image)
        const blob = b64toBlob(dataUrl)
        formdata.append("file[]", blob, Date.now() + ".jpg")
        data.push({ element: image, blob: blob })
    }
    console.log("converted images into blob")

    const requestOptions = {
        method: "POST",
        body: formdata,
    }

    fetch(NSFW_URL, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("got response")
            for (let i = 0; i < result.length; i++) {
                if (result[i].unsafe) {
                    data[i].element.src = result[i].url
                }
            }
            console.log("replaced!")
            replaceAllImages()
        })
}

replaceAllImages()
