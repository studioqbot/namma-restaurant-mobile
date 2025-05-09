"use client"

import { createContext, useMemo, useState } from "react"
import { CatalogItemsType, CategoryDataType, LineItems, OrderDetailsType, OrderDetailsValue } from "./types";
import { ImageType, NammaSpecialItems } from "@/app/home/type";


interface GlobalContextType {

    cartItemCount: number;
    setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
    setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetailsType>>;
    orderDetails: OrderDetailsType;
    isOrderUpdate: string;
    setIsOrderUpdate: React.Dispatch<React.SetStateAction<string>>;
    lineItems: LineItems[];
    setLineItems: React.Dispatch<React.SetStateAction<LineItems[]>>;
    catalogCategoryAndItem: CatalogItemsType[];
    setCatalogCategoryAndItem: React.Dispatch<React.SetStateAction<CatalogItemsType[]>>;
    catalogCategory: CategoryDataType[],
    setCatalogCategory: React.Dispatch<React.SetStateAction<CategoryDataType[]>>;
    imageData: ImageType[],
    setImageData: React.Dispatch<React.SetStateAction<ImageType[]>>;
    nammaSpecialItemsData: NammaSpecialItems[];
    setNammaSpecialItemsData: React.Dispatch<React.SetStateAction<NammaSpecialItems[]>>;
    catalogCategoryTab: CategoryDataType[],
    setCatalogCategoryTab: React.Dispatch<React.SetStateAction<CategoryDataType[]>>;
    activeMenu: string;
    setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
    updateLineItem: LineItems[];
    setUpdateLineItem: React.Dispatch<React.SetStateAction<LineItems[]>>;
    isCountDecreased: boolean;
    setIsCountDecreased: React.Dispatch<React.SetStateAction<boolean>>;

    fieldToClear: string[],
    setFieldToClear: React.Dispatch<React.SetStateAction<string[]>>;
    isOrdered: boolean;
    setIsOrdered:React.Dispatch<React.SetStateAction<boolean>>;
    isCartOpen: boolean;
    setIsCartOpen:React.Dispatch<React.SetStateAction<boolean>>;
    globalLoading: boolean;
    setGlobalLoading:React.Dispatch<React.SetStateAction<boolean>>;


}
const GlobalContext = createContext<GlobalContextType>({

    setCartItemCount: () => { },
    cartItemCount: 0,
    setOrderDetails: () => { },
    orderDetails: OrderDetailsValue,
    isOrderUpdate: '',
    setIsOrderUpdate: () => { },
    lineItems: [],
    setLineItems: () => { },
    catalogCategoryAndItem: [],
    setCatalogCategoryAndItem: () => { },
    catalogCategory: [],
    setCatalogCategory: () => { },
    imageData: [],
    setImageData: () => { },
    nammaSpecialItemsData: [],
    setNammaSpecialItemsData: () => { },
    catalogCategoryTab: [],
    setCatalogCategoryTab: () => { },
    activeMenu: '',
    setActiveMenu: () => { },
    updateLineItem: [],
    setUpdateLineItem: () => { },
    isCountDecreased: false,
    setIsCountDecreased: () => { },

    fieldToClear: [],
    setFieldToClear: () => { },
    isOrdered: false, 
    setIsOrdered: () => { },
    isCartOpen: false, 
    setIsCartOpen: () => { },
    globalLoading: false, 
    setGlobalLoading: () => { },

});


const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [cartItemCount, setCartItemCount] = useState<number>(0);
    const [orderDetails, setOrderDetails] = useState(OrderDetailsValue);
    const [isOrderUpdate, setIsOrderUpdate] = useState<string>('');
    const [lineItems, setLineItems] = useState<LineItems[]>([]);
    const [catalogCategoryAndItem, setCatalogCategoryAndItem] = useState<CatalogItemsType[]>([]);
    const [catalogCategory, setCatalogCategory] = useState<CategoryDataType[]>([]);
    const [imageData, setImageData] = useState<ImageType[]>([]);
    const [nammaSpecialItemsData, setNammaSpecialItemsData] = useState<NammaSpecialItems[]>([]);
    const [catalogCategoryTab, setCatalogCategoryTab] = useState<CategoryDataType[]>([]);
    const [activeMenu, setActiveMenu] = useState("All");
    const [updateLineItem, setUpdateLineItem] = useState<LineItems[]>([]);
    const [isCountDecreased, setIsCountDecreased] = useState<boolean>(false);
    const [isOrdered, setIsOrdered] = useState<boolean>(false);
    const [fieldToClear, setFieldToClear] = useState<string[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [globalLoading, setGlobalLoading] = useState(false);

    const contextValue = useMemo(() => {
        return {
            cartItemCount, setCartItemCount,
            orderDetails, setOrderDetails, isOrderUpdate,
            setIsOrderUpdate, lineItems, setLineItems,
            catalogCategoryAndItem, setCatalogCategoryAndItem,
            catalogCategory, setCatalogCategory, imageData, setImageData,
            nammaSpecialItemsData, setNammaSpecialItemsData,
            catalogCategoryTab, setCatalogCategoryTab, activeMenu, setActiveMenu,
            updateLineItem, setUpdateLineItem, isCountDecreased, setIsCountDecreased,
             fieldToClear, setFieldToClear, isOrdered, setIsOrdered,isCartOpen, setIsCartOpen,
             globalLoading, setGlobalLoading
        }
    }, [cartItemCount, isOrderUpdate, orderDetails, lineItems, catalogCategoryAndItem,
        catalogCategory, activeMenu, nammaSpecialItemsData, imageData, catalogCategoryTab,
        updateLineItem, isCountDecreased, fieldToClear,isOrdered, isCartOpen,globalLoading])

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}



export default GlobalContext
export { GlobalProvider };