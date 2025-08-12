import Logo from './Logo.png'
import Pet from './Pet.png'
import Care from './Care.png'
import Food from './Food.png'
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import care11 from './care11.png'
import care21 from './care21.png'
import care31 from './care31.png'
import food31 from './food31.png'
import food21 from './food21.png'
import food11 from './food11.png'
import pet1 from './pet1.jpg'
import pet2 from './pet2.jpeg'
import refresh_icon from './refresh_icon.svg'
import remove_icon from './remove_icon.svg'
import arrow_right_icon_colored from './arrow_right_icon_colored.svg'


export const assets = {
    Logo,
    star_icon,
    star_dull_icon,
    refresh_icon,
    remove_icon,
    arrow_right_icon_colored


}

export const pets = [
  {
    _id: "101",
    text: "Labrador",
    path: "Pets",
    image: pet1,

  },
    {
    _id: "102",
    text: "Rotweiler",
    path: "Pets",
    image: pet2,

  },

]

export const categories = [
    {
    text: "Pets",
    path: "Pets",
    image: Pet,
    bgColor: "#000000ff",
  },
      {
    text: "Care",
    path: "Care",
    image: Care,
    bgColor: "#000000ff",
  },
     {
    text: "Food",
    path: "Food",
    image: Food,
    bgColor: "#000000ff",
  },
]

export const dummyProducts = [
    {
    _id: "1",
    name: "Dog Playing Ball",
    category: "Care",
    price: 500,
    offerPrice: 400,
    image: [care11],
    description: [
      
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
    {
    _id: "2",
    name: "Dog Body Belt",
    category: "Care",
    price: 250,
    offerPrice: 210,
    image: [care21],
    description: [
      
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
     {
    _id: "3",
    name: "Dog Cover Belt",
    category: "Care",
    price: 260,
    offerPrice: 255,
    image: [care31],
    description: [
      
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
     {
    _id: "4",
    name: "Dog Food1",
    category: "Food",
    price: 260,
    offerPrice: 255,
    image: [food11],
    description: [
      
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
     {
    _id: "5",
    name: "Cat Food",
    category: "Food",
    price: 260,
    offerPrice: 255,
    image: [food21],
    description: [
      
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
     {
    _id: "6",
    name: "Fish Food",
    category: "Food",
    price: 260,
    offerPrice: 255,
    image: [food31],
    description: [
      
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
    
]

export const food = [

 
  
]