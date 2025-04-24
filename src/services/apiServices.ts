import axiosInstance from "@/utils/axiosConfig"
import API_ENDPOINTS from "./apiPaths"
import { CatalogSearchBody, OrderCreateBody, OrderUpdateBodyAdd, PaymentBodyType } from "@/constants/types";
import { CatelogFilterBody } from "@/app/home/components/nammaSpecial";

export const nammaSpecialItems = (body: CatelogFilterBody) => {
    return axiosInstance.post(`${API_ENDPOINTS.catlogFilterItems}`, body);
}

export const catalogItems = (paramsData: { types: string }) => {
    return axiosInstance.get(`${API_ENDPOINTS.catlogList}`, { params: paramsData });
}

export const orderCreateApi = (body: OrderCreateBody) => {
    return axiosInstance.post(`${API_ENDPOINTS.order}`, body);
}

export const orderUpdateApi = (body: OrderUpdateBodyAdd, orderId: string) => {
    return axiosInstance.put(`${API_ENDPOINTS.orderUpdate}/${orderId}`, body);
}

export const catalogItemsFilter = (body: { category_ids: string[] }) => {
    return axiosInstance.post(`${API_ENDPOINTS.catlogFilterItems}`, body);
}

export const retrieveOrder = (orderId: string|unknown) => {
    return axiosInstance.get(`${API_ENDPOINTS.orderRetrieve}/${orderId}`);
}

export const createPayment = (body: PaymentBodyType) => {
    return axiosInstance.post(`${API_ENDPOINTS.payment}`, body);
}

export const catalogSearchApi = (body: CatalogSearchBody) => {
    return axiosInstance.post(`${API_ENDPOINTS.catalogSearch}`, body);
}


export const getCatalogObject = (objId: string|unknown) => {
    return axiosInstance.get(`${API_ENDPOINTS.catalogObject}/${objId}`);
}