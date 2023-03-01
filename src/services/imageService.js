const uploadImage = async (base64EncodedImage) => {
    try {
        let res = await fetch(`/api/v1/project/upload-image`, {
            method: 'POST',
            body: JSON.stringify({ data: base64EncodedImage }),
            headers: { 'Content-Type': 'application/json' },
        });
        const resImage = await res.json()
        return resImage
    } catch (err) {
        console.error('Có lỗi khi up hình imageService : ', err);
    }
}

export default uploadImage