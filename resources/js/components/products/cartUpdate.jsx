// product dummy data
// const myCartData = {
//     "product_id": 2,
//     "user_id": 4,
//     "variants": [],
//     "quantity": 2
// }
// const myCartData1 = {
//     "product_id": 6,
//     "user_id": 4,
//     "variants": [
//         {
//             "property_name": {
//                 "en": "color",
//                 "fr": "Couleur"
//             },
//             "property_value": {
//                 "en": "White",
//                 "fr": "blanc"
//             }
//         },
//         {
//             "property_name": {
//                 "en": "size"
//             },
//             "property_value": {
//                 "en": "35 cm"
//             }
//         }
//     ],
//     "quantity": 7
// }

// db
// const cartsFromDB = [
//     {
//         "id": 1,
//         "product_id": 2,
//         "user_id": 4,
//         "variants": [],
//         "quantity": 2
//     },

// ]


// call this function before API cart calling
const isDuplicateCartData = (carts, myCartData) => {
    for (let i = 0; i < carts?.length; i++) {
        const product = carts[i];
        if( product?.id === myCartData?.product_id ) {
            if(product.variants.length === 0) {
                return true
            } else if(product?.variants?.length > 0) {
                const variants = product?.variants;
                const isData = compareArrays(variants, myCartData?.variants);
                return isData;
            }
        }
    }
    return false;
}

function compareObjects(obj1, obj2) {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
        if (!compareObjects(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}

function compareArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (!compareObjects(arr1[i], arr2[i])) {
            return false;
        }
    }
    return true;
}

export default isDuplicateCartData;

// if it will return false
// if it will return true, not call API bz already exists
// isDuplicateCartData(carts, myCartData)
