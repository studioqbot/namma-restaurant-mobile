import axiosInstance from "@/utils/axiosConfig"
import API_ENDPOINTS from "./apiPaths"
import { CatelogFilterBody } from "@/app/home/page";
import { OrderCreateBody, OrderUpdateBodyAdd, PaymentBodyType } from "@/constants/types";




export const nammaSpecialItems = (body: CatelogFilterBody) => {
    return axiosInstance.post(`${API_ENDPOINTS.catlogFilterItems}`, body);
}

export const catalogItems = (paramsData: { types: string, cursor?: string }) => {
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

export const retrieveOrder = (orderId: string | unknown) => {
    return axiosInstance.get(`${API_ENDPOINTS.orderRetrieve}/${orderId}`);
}

export const createPayment = (body: PaymentBodyType) => {
    return axiosInstance.post(`${API_ENDPOINTS.payment}`, body);
}




export const getCatalogObject = (objId: string | unknown) => {
    return axiosInstance.get(`${API_ENDPOINTS.catalogObject}/${objId}`);
}