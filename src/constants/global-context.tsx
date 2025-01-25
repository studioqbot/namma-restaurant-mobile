"use client"

import { createContext, useMemo, useState } from "react"
import { CatalogItemsType, CategoryDataType, LineItemsType, OrderDetailsType, OrderDetailsValue } from "./types";



interface GlobalContextType {

    cartItemCount: number;
    setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
    setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetailsType>>;
    orderDetails: OrderDetailsType;
    isOrderUpdate: string;
    setIsOrderUpdate: React.Dispatch<React.SetStateAction<string>>;
    lineItems: LineItemsType[];
    setLineItems: React.Dispatch<React.SetStateAction<LineItemsType[]>>;
    catalogCategoryAndItem: CatalogItemsType[];
    setCatalogCategoryAndItem: React.Dispatch<React.SetStateAction<CatalogItemsType[]>>;
    catalogCategory: CategoryDataType[],
    setCatalogCategory: React.Dispatch<React.SetStateAction<CategoryDataType[]>>;
    updateLineItem: LineItemsType[];
    setUpdateLineItem: React.Dispatch<React.SetStateAction<LineItemsType[]>>;
    fieldToRemove: string[];
    setFieldToRemove: React.Dispatch<React.SetStateAction<string[]>>;
    amount: string | number;
    setAmount: React.Dispatch<React.SetStateAction<string | number>>;
    catalogCategoryTab: CategoryDataType[],
    setCatalogCategoryTab: React.Dispatch<React.SetStateAction<CategoryDataType[]>>;
    isOrdered: boolean;
    setIsOrdered:React.Dispatch<React.SetStateAction<boolean>>;



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
    updateLineItem: [],
    setUpdateLineItem: () => { },
    fieldToRemove: [],
    setFieldToRemove: () => { },
    amount: 0,
    setAmount: () => { },
    catalogCategoryTab: [],
    setCatalogCategoryTab: () => { },
    isOrdered: false, 
    setIsOrdered: () => { },


});


const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [cartItemCount, setCartItemCount] = useState<number>(0);
    const [orderDetails, setOrderDetails] = useState(OrderDetailsValue);
    const [isOrderUpdate, setIsOrderUpdate] = useState<string>('');
    const [lineItems, setLineItems] = useState<LineItemsType[]>([]);
    const [catalogCategoryAndItem, setCatalogCategoryAndItem] = useState<CatalogItemsType[]>([]);
    const [catalogCategory, setCatalogCategory] = useState<CategoryDataType[]>([]);
    const [updateLineItem, setUpdateLineItem] = useState<LineItemsType[]>([]);
    const [fieldToRemove, setFieldToRemove] = useState<string[]>([]);
    const [amount, setAmount] = useState<string | number>(0);
    const [isOrdered, setIsOrdered] = useState<boolean>(false);
    const [catalogCategoryTab, setCatalogCategoryTab] = useState<CategoryDataType[]>([]);


    const contextValue = useMemo(() => {
        return {
            cartItemCount, setCartItemCount,
            orderDetails, setOrderDetails, isOrderUpdate,
            setIsOrderUpdate, lineItems, setLineItems,
            catalogCategoryAndItem, setCatalogCategoryAndItem,
            catalogCategory, setCatalogCategory,
            updateLineItem, setUpdateLineItem,
            fieldToRemove, setFieldToRemove, amount, setAmount,
            catalogCategoryTab, setCatalogCategoryTab,
            isOrdered, setIsOrdered
        }
    }, [cartItemCount, isOrderUpdate, orderDetails, fieldToRemove,
        updateLineItem, lineItems, catalogCategoryAndItem, catalogCategory,
        amount, catalogCategoryTab, isOrdered])

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}



export default GlobalContext
export { GlobalProvider };