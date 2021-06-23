const DOMAIN = "http://localhost"
const NSFW_URL = `${DOMAIN}/upload/files`

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

function requestToServer(formdata) {
    const requestOptions = {
        method: "POST",
        body: formdata,
        mode: "cors",
    }
    fetch(NSFW_URL, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("got response")
            let count = 0
            for (let i = 0; i < result.length; i++) {
                if (result[i].unsafe) {
                    data[i].element.src = result[i].url
                    count += 1
                }
            }
            console.log(`${count} images replaced!`)
        })
}

function getImages() {
    return document.querySelectorAll("img")
}

function getImagesLength() {
    return getImages().length
}

function replaceAllImages() {
    const images = getImages()
    console.log("selected images")

    const formdata = new FormData()
    const data = []

    for (image of images) {
        if (image.src.includes(DOMAIN)) {
            // if REPLACED_IDENTIFIER in image.src
            continue
        }
        image.crossOrigin = "anonymous"
        const dataUrl = getDataUrl(image)
        const blob = b64toBlob(dataUrl)
        formdata.append("file[]", blob, Date.now() + ".jpg")
        data.push({ element: image, blob: blob })
    }
    console.log(`converted ${data.length} images into blob`)
    requestToServer(formdata)
}

let images_length = 0

function replaceIfNewImageLoaded() {
    const images = getImagesLength()
    if (images > images_length) {
        images = getImagesLength()
        replaceAllImages()
    }
}

setTimeout(replaceIfNewImageLoaded, 500)
