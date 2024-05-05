import { projectStorage } from '../firebase/config';

export const editImagesOnStorage = async (imgArray, bucket, deletedImages) => {
    let updatedImages = [];

    try {
        await Promise.all(
            deletedImages.map(async (img) => {
                if (img.name != null) {
                    await deleteImg(img.name, bucket);
                }
            })
        );

        const uploadResults = await Promise.all(
            imgArray.map(async (img) => {
                if (img.name == null) {
                    return await uploadImg(img, bucket);
                } else {
                    return img;
                }
            })
        );

        updatedImages.push(...uploadResults);

        return updatedImages;
    } catch (err) {
        console.error(err);
        return [];
    }
};
const uploadImg = async (img, bucket) => {
    const imageRef = projectStorage.ref(`${bucket}${img.file.name}`);
    try {
        await imageRef.put(img.file);
        const url = await imageRef.getDownloadURL();
        const newImage = {
            url: url,
            name: img.file.name,
        };
        return newImage;
    } catch (error) {
        console.error(error);
    }
};

// export const checkAndUpload = async (imagePreviews, bucket, imageUploads) => {
//     try {
//         let finalImages = await Promise.all(
//             imagePreviews.map(async (image, index) => {
//                 const isValid = await checkImagePath(image);

//                 if (isValid) {
//                     console.log('this is valid : ' + index);
//                     return image; // 유효하면 기존 경로를 반환
//                 } else {
//                     console.log('this is not valid : ' + index);

//                     // const uploadedUrl = await updateImage(
//                     //     index,
//                     //     bucket,
//                     //     imageUploads
//                     // );
//                     // return uploadedUrl; // 업데이트된 URL을 반환
//                 }
//             })
//         );

//         return finalImages;
//     } catch (error) {
//         console.error(error);
//         return []; // 오류 발생 시 빈 배열 반환
//     }

//     // for (let index = 0; index < imagePreviews.length; index++) {
//     //     const image = imagePreviews[index];
//     //     const isValid = await checkImagePath(image);
//     //     console.log(' image : ' + JSON.stringify(image));
//     //     console.log(' index : ' + index);
//     //     console.log(' is valid : ' + isValid);
//     // }
// };

// const checkImagePath = async (image) => {
//     try {
//         const response = await fetch(image.url, { mode: 'no-cors' });
//         if (response.status == 200) {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         console.error(error);
//     }
// };

// const updateImage = async (index, bucket, imageUploads) => {
//     console.log(index);
//     console.log(bucket);
//     console.log(imageUploads[index]);

//     // try {
//     //     const imageRef = projectStorage.ref(
//     //         `${bucket}${imageUploads[index].name}`
//     //     );
//     //     await imageRef.put(imageUploads[index]);
//     //     const url = await imageRef.getDownloadURL();
//     //     const name = imageUploads[index].name;
//     //     const newImage = {
//     //         url,
//     //         name,
//     //     };

//     //     return newImage;
//     // } catch (error) {
//     //     console.error(error);
//     // }
// };

// export const checkAndDelete = async (deletedImage, bucket) => {
//     try {
//         await Promise.all(
//             deletedImage.map(async (image) => {
//                 const isValid = await checkImagePath(image);
//                 if (isValid) {
//                     await deleteImg(image, bucket);
//                 }
//             })
//         );
//     } catch (error) {
//         console.error('비동기 삭제 작업 중 에러 발생:', error);
//     }
// };

const deleteImg = async (name, bucket) => {
    const imageRef = projectStorage.ref(`${bucket}${name}`); // 추출된 경로로 참조 생성
    try {
        await imageRef.delete(); // 파일 삭제
    } catch (error) {
        console.error('파일 삭제 중 오류 발생:', error);
    }
};
