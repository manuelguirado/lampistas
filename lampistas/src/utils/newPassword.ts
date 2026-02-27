import api from '../api/intercepttors'
export async function setNewPassword(
    newPassword: string,
    email: string,
) {
    
    const response = await api.post('/auth/forgotPassword', { newPassword, email });
    return response.data;
}