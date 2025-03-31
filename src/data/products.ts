import { getProducts, getCategories, getConeCandy, clearCategoriesCache } from "@/services/productApi";
import { Product, ProductSize } from "@/types/product";

// Sample data to use if API fails
export const sampleApiResponse = {
  "code": "200",
  "msg": "get Products Successfully",
  "Data": [
    {
      "pid": "16",
      "title": "American Dry Fruit",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/1506202407d7a56a-5e0b-4305-932c-6cda06457275.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/310520242d49f726-a537-49c1-b468-e8c37ee57dfb.jpeg",
      "product_data": [
        {
          "id": "70",
          "size": "5 Litre",
          "mrp": "700",
          "price": "550",
          "status": "In Stock"
        },
        {
          "id": "71",
          "size": "750 ML",
          "mrp": "135",
          "price": "135",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "5",
      "title": "Anjir",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/310520244a3e024a-a586-4703-9c42-9007c65d44bc.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/310520244a3e024a-a586-4703-9c42-9007c65d44bc.jpeg",
      "product_data": [
        {
          "id": "14",
          "size": "5 Litre",
          "mrp": "550",
          "price": "440",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "9",
      "title": "Badam Pista",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/31052024f9a5f47e-305c-45bc-a3a6-b738161cfd02.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/31052024f9a5f47e-305c-45bc-a3a6-b738161cfd02.jpeg",
      "product_data": [
        {
          "id": "20",
          "size": "5 Litre",
          "mrp": "630",
          "price": "490",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "11",
      "title": "Black Current",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/310520248da18f0a-be9d-4dff-bcd4-0f51642481da.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/310520248da18f0a-be9d-4dff-bcd4-0f51642481da.jpeg",
      "product_data": [
        {
          "id": "22",
          "size": "5 Litre",
          "mrp": "675",
          "price": "520",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "20",
      "title": "Bombay Special",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "product_data": [
        {
          "id": "57",
          "size": "5 Litre",
          "mrp": "760",
          "price": "600",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "17",
      "title": "Butter Scotch",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/31052024d2cc0cd0-842f-4d30-b2ba-fec8b5b76f77.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/31052024f4093707-1b7d-4827-90f0-b4f7e5d43dfd.jpeg",
      "product_data": [
        {
          "id": "32",
          "size": "5 Litre",
          "mrp": "575",
          "price": "460",
          "status": "In Stock"
        },
        {
          "id": "33",
          "size": "750 ML",
          "mrp": "130",
          "price": "130",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "8",
      "title": "Chocolate Chips",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/31052024c566fb9b-aad6-4179-9126-bbd95938ba71.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/31052024c9811814-51c3-4dbc-999d-053eb5df0193.jpeg",
      "product_data": [
        {
          "id": "18",
          "size": "5 Litre",
          "mrp": "690",
          "price": "550",
          "status": "In Stock"
        },
        {
          "id": "19",
          "size": "750 ML",
          "mrp": "150",
          "price": "150",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "13",
      "title": "Cookies Cream",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/15062024cookie_creame.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/15062024cookie_creame.jpeg",
      "product_data": [
        {
          "id": "72",
          "size": "5 Litre",
          "mrp": "750",
          "price": "600",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "3",
      "title": "Gulab",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "product_data": [
        {
          "id": "42",
          "size": "5 Litre",
          "mrp": "550",
          "price": "450",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "7",
      "title": "Kaju Draksh",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/310520248b0dc46b-9b67-4a76-abb3-f27fe5fd7b88.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/31052024e53c0df8-aba1-4a51-a1df-e12831ef8f20.jpeg",
      "product_data": [
        {
          "id": "16",
          "size": "5 Litre",
          "mrp": "575",
          "price": "450",
          "status": "In Stock"
        },
        {
          "id": "17",
          "size": "750 ML",
          "mrp": "120",
          "price": "120",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "18",
      "title": "Kesar Pista",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "product_data": [
        {
          "id": "55",
          "size": "5 Litre",
          "mrp": "730",
          "price": "575",
          "status": "In Stock"
        },
        {
          "id": "56",
          "size": "750 ML",
          "mrp": "150",
          "price": "150",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "2",
      "title": "Mango",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/28052024e9fdf9da-9aaa-4ac4-bea4-cc72be44927d.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/280520246db70db4-65fa-4bbb-ad7b-b8f92de8e9d2.jpeg",
      "product_data": [
        {
          "id": "9",
          "size": "5 Litre",
          "mrp": "500",
          "price": "400",
          "status": "In Stock"
        },
        {
          "id": "10",
          "size": "750 ML",
          "mrp": "105",
          "price": "105",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "4",
      "title": "Mava Malai",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/310520241622662e-8445-405f-afb6-8d7f528137c5.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/31052024cfe2add9-7b6f-4dbb-81b3-8b22b9ee8d85.jpeg",
      "product_data": [
        {
          "id": "12",
          "size": "5 Litre",
          "mrp": "575",
          "price": "450",
          "status": "In Stock"
        },
        {
          "id": "13",
          "size": "750 ML",
          "mrp": "125",
          "price": "125",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "24",
      "title": "Mewad King",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "product_data": [
        {
          "id": "51",
          "size": "5 Litre",
          "mrp": "800",
          "price": "675",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "6",
      "title": "Pan Masala",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/31052024ee281a9f-20e3-4e19-ac27-bc3833309a5d.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/31052024ee281a9f-20e3-4e19-ac27-bc3833309a5d.jpeg",
      "product_data": [
        {
          "id": "15",
          "size": "5 Litre",
          "mrp": "690",
          "price": "530",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "23",
      "title": "Panch Ratna",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "product_data": [
        {
          "id": "50",
          "size": "5 Litre",
          "mrp": "800",
          "price": "650",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "15",
      "title": "Rajbhog",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/31052024b0ef8295-6f59-4847-b3da-1453b42f962b.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/31052024d70d84c8-a8ab-433b-9793-40e391deefe5.jpeg",
      "product_data": [
        {
          "id": "28",
          "size": "5 Litre",
          "mrp": "760",
          "price": "600",
          "status": "In Stock"
        },
        {
          "id": "29",
          "size": "750 ML",
          "mrp": "155",
          "price": "155",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "22",
      "title": "Rajwadi Dry Fruit",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "product_data": [
        {
          "id": "49",
          "size": "5 Litre",
          "mrp": "800",
          "price": "650",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "19",
      "title": "Sitafal",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "product_data": [
        {
          "id": "47",
          "size": "5 Litre",
          "mrp": "750",
          "price": "560",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "14",
      "title": "Strawberry",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/31052024e4192673-d3be-49a7-9093-92267e80e149.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/31052024abd14d64-c276-4656-943a-76a0ad555d36.jpeg",
      "product_data": [
        {
          "id": "26",
          "size": "5 Litre",
          "mrp": "500",
          "price": "400",
          "status": "In Stock"
        },
        {
          "id": "27",
          "size": "750 ML",
          "mrp": "105",
          "price": "105",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "21",
      "title": "Sunday Special",
      "status": "Out of Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/310520246e869a44-d7d1-46d8-846a-e92f7e5c04f2.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/310520246e869a44-d7d1-46d8-846a-e92f7e5c04f2.jpeg",
      "product_data": [
        {
          "id": "38",
          "size": "5 Litre",
          "mrp": "575",
          "price": "460",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "10",
      "title": "Sweet Heart",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "product_data": [
        {
          "id": "43",
          "size": "5 Litre",
          "mrp": "650",
          "price": "450",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "12",
      "title": "Traffic Jam",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/15062024extra.jpeg",
      "product_data": [
        {
          "id": "44",
          "size": "5 Litre",
          "mrp": "800",
          "price": "620",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "1",
      "title": "Venila",
      "status": "In Stock",
      "type": "IceCreame",
      "image": "https://shribombaychowpati.com/AdminPanel/products/280520243bc4ea2b-2134-41cd-9eee-93adc09227d9.jpeg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/28052024f5c0546f-8cda-4cb5-810c-ef905667b4c3.jpeg",
      "product_data": [
        {
          "id": "7",
          "size": "5 Litre",
          "mrp": "500",
          "price": "400",
          "status": "In Stock"
        },
        {
          "id": "8",
          "size": "750 ML",
          "mrp": "95",
          "price": "95",
          "status": "In Stock"
        }
      ]
    }
  ]
};

// Cone Candy API Response
export const coneCandyApiResponse = {
  "code": "200",
  "msg": "get Products Successfully",
  "Data": [
    {
      "pid": "38",
      "title": "BADA CONE 100 ML (बड़ा कोन)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/11102024bada_cone.jpg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/11102024bada_cone.jpg",
      "product_data": [
        {
          "id": "87",
          "size": "14",
          "mrp": "210",
          "price": "210",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "30",
      "title": "BIG BUTTER CONE (बड़ा बटर कोन)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/11102024badacodebuttescotch.jpg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/11102024badacodebuttescotch.jpg",
      "product_data": [
        {
          "id": "79",
          "size": "8",
          "mrp": "160",
          "price": "160",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "31",
      "title": "BIG CHOCOLATE CONE (बड़ा चॉकलेट कोन)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/11102024chocolate_cone.jpg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/11102024chocolate_cone.jpg",
      "product_data": [
        {
          "id": "80",
          "size": "8",
          "mrp": "240",
          "price": "240",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "35",
      "title": "BIG MAVA KULFI (बड़ी मावा कुल्फी)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Big_Mawa.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Big_Mawa.png",
      "product_data": [
        {
          "id": "84",
          "size": "25",
          "mrp": "375",
          "price": "375",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "42",
      "title": "CHOCO CRUNCH (चोको क्रंच)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Choko_Krunch.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Choko_Krunch.png",
      "product_data": [
        {
          "id": "91",
          "size": "12",
          "mrp": "240",
          "price": "240",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "43",
      "title": "CHOCOBAR (चॉकोबार)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Best_Chocobar.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Best_Chocobar.png",
      "product_data": [
        {
          "id": "92",
          "size": "30",
          "mrp": "300",
          "price": "300",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "41",
      "title": "CHOWPATI KULFI (चौपाटी कुल्फी)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Chowpati_Special.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Chowpati_Special.png",
      "product_data": [
        {
          "id": "90",
          "size": "12",
          "mrp": "240",
          "price": "240",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "44",
      "title": "CHOWPATI MATKA (चौपाटी मटका)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/matka.jpg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/matka.jpg",
      "product_data": [
        {
          "id": "93",
          "size": "8",
          "mrp": "240",
          "price": "240",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "37",
      "title": "FROSTICK 60 ML (फ्रॉस्टिक)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Frostick.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Frostick.png",
      "product_data": [
        {
          "id": "86",
          "size": "12",
          "mrp": "360",
          "price": "360",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "46",
      "title": "KESAR PISTA CONE (केसर पिस्ता कोन)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/11102024kesar_pista.jpg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/11102024kesar_pista.jpg",
      "product_data": [
        {
          "id": "95",
          "size": "8",
          "mrp": "240",
          "price": "240",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "34",
      "title": "MANGO DOLLY KULFI (मैंगो डॉली कुल्फी)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Mango_Dolly.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Mango_Dolly.png",
      "product_data": [
        {
          "id": "83",
          "size": "25",
          "mrp": "375",
          "price": "375",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "25",
      "title": "MAVA KULFI (मावा कुल्फी)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Mawa_Kulfi.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Mawa_Kulfi.png",
      "product_data": [
        {
          "id": "74",
          "size": "30",
          "mrp": "300",
          "price": "300",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "39",
      "title": "MAVA MASTI KULFI (मावा मस्ती कुल्फी)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Mava_Masti.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Mava_Masti.png",
      "product_data": [
        {
          "id": "88",
          "size": "30",
          "mrp": "150",
          "price": "150",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "29",
      "title": "MINI BUTTER CONE (मिनी बटर कोन)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/11102024butter_scotch.jpg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/11102024butterscotch.jpg",
      "product_data": [
        {
          "id": "78",
          "size": "20",
          "mrp": "200",
          "price": "200",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "40",
      "title": "MINI CHOCOBAR KULFI (मिनी चोकोबार कुल्फी)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Mini_Chocobar.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Mini_Chocobar.png",
      "product_data": [
        {
          "id": "89",
          "size": "30",
          "mrp": "210",
          "price": "210",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "28",
      "title": "MINI CHOCOLATE CONE (मिनी चॉकलेट कोन)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/11102024chocolate_cone.jpg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/11102024chocolate_cone.jpg",
      "product_data": [
        {
          "id": "77",
          "size": "20",
          "mrp": "300",
          "price": "300",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "27",
      "title": "MINI STRAWBERRY CONE (मिनी स्ट्रॉबेरी कोन)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/11102024strawbeery.jpg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/11102024strawbeery.jpg",
      "product_data": [
        {
          "id": "76",
          "size": "20",
          "mrp": "300",
          "price": "300",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "32",
      "title": "ORANGE BAR KULFI (ऑरेंज बार कुल्फी)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/18092024file (1).png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/18092024file (1).png",
      "product_data": [
        {
          "id": "81",
          "size": "30",
          "mrp": "150",
          "price": "150",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "47",
      "title": "PLAIN PISTA CONE (सादा पिस्ता कोन)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/11102024plainpista.jpg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/11102024plainpista.jpg",
      "product_data": [
        {
          "id": "96",
          "size": "8",
          "mrp": "240",
          "price": "240",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "33",
      "title": "PREMIUM CHOCOBAR KULFI (प्रीमियम चोकोबार कुल्फी)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Choko_Krunch.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Choko_Krunch.png",
      "product_data": [
        {
          "id": "82",
          "size": "25",
          "mrp": "375",
          "price": "375",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "26",
      "title": "RABADI KULFI (रबड़ी कुल्फी)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/18092024file (1).png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/18092024file (1).png",
      "product_data": [
        {
          "id": "75",
          "size": "30",
          "mrp": "600",
          "price": "600",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "36",
      "title": "RAJBHOG KULFI (राजभोग कुल्फी)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/Rajbhog.png",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/Rajbhog.png",
      "product_data": [
        {
          "id": "85",
          "size": "12",
          "mrp": "300",
          "price": "300",
          "status": "In Stock"
        }
      ]
    },
    {
      "pid": "45",
      "title": "RAJWADI MATKA (रजवाडी मटका)",
      "status": "In Stock",
      "type": "ConeCandy",
      "image": "https://shribombaychowpati.com/AdminPanel/products/matka.jpg",
      "cover": "https://shribombaychowpati.com/AdminPanel/products/matka.jpg",
      "product_data": [
        {
          "id": "94",
          "size": "8",
          "mrp": "320",
          "price": "320",
          "status": "In Stock"
        }
      ]
    }
  ]
};

// Import the ApiProductData interface from productApi.ts
import { ApiProductData, ApiResponse, transformProductData } from "@/services/productApi";

// Transform the sample API data to match our app's product interface
export const fallbackProducts: Product[] = [
  ...sampleApiResponse.Data.map(transformProductData),
  ...coneCandyApiResponse.Data.map(transformProductData)
];

// Generate fallback categories from the sample data
export const fallbackCategories = Array.from(
  new Set(fallbackProducts.map(product => product.category))
);

// Export the API functions to be used directly
export { getProducts, getCategories, getConeCandy, clearCategoriesCache };
