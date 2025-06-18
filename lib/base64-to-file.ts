// Utility to convert base64 string to a File
export function base64ToFile(base64String: string, fileName: string): File {
    const byteString = atob(base64String)
    const byteArray = new Uint8Array(byteString.length)

    for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i)
    }

    const blob = new Blob([byteArray], { type: "image/png" }) // or image/jpeg
    return new File([blob], fileName, { type: "image/png" })
}
