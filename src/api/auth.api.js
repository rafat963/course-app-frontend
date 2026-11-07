import axiosInstance from './axiosInstance';

export const authApi = {
  /**
   * تسجيل الدخول
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<any>}
   */
  async login(credentials) {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * تسجيل متدرب بالغ (16 سنة فما فوق)
   * @param {FormData} formData
   * @returns {Promise<any>}
   */
  async registerAdult(formData) {
    const response = await axiosInstance.post('/auth/register-adult', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * تسجيل متدرب قاصر (أقل من 16 سنة مع ولي الأمر)
   * @param {FormData} formData
   * @returns {Promise<any>}
   */
  async registerMinor(formData) {
    const response = await axiosInstance.post('/auth/register-minor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default authApi;
