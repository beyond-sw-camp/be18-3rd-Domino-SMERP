import http from './http';

export const getBomRequirements = async (itemId) => {
    const response = await http.get(`/api/v1/boms/items/${itemId}/requirements`);
    return response.data;
}
