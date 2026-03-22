import { api } from './base';
import type { ProductNodeTreeDto } from '../client';

export const getProductsTree = async (): Promise<ProductNodeTreeDto[]> => {
    const response = await api.get("/product_nodes/tree");
    return response.data;
}

export type CreateProductNodePayload = {
    name: string;
    /** Omit or null for root category */
    parent_id?: number | null;
};

export const createProductNode = async (payload: CreateProductNodePayload) => {
    const response = await api.post("/product_nodes/", {
        name: payload.name.trim(),
        parent_id: payload.parent_id ?? null,
    });
    return response.data;
};