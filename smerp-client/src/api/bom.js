import http from './http';

export const getBomRequirements = async (itemId) => {
    const response = await http.get(`/boms/items/${itemId}/requirements`);
    return response.data;
}
