import api from '../api/intercepttors'
export async function setNewPassword(
    newPassword: string,
    email: string,
) {
    console.log('Setting new password for email:', email, 'with new password:', newPassword);
    const response = await api.post('/auth/forgotPassword', { newPassword, email });
    return response.data;
}