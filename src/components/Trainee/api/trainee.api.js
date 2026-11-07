import axiosInstance from '@/api/axiosInstance';

export const traineeApi = {
  /**
   * جلب الملف الشخصي الكامل للمتدرب الحالي من قاعدة البيانات
   */
  async getMyProfile() {
    const response = await axiosInstance.get('/trainees/profile');
    return response.data;
  },

  /**
   * تحديث وتعديل بيانات ملف المتدرب
   * @param {object} profileData
   */
  async updateProfile(profileData) {
    const response = await axiosInstance.post('/trainees/profile', profileData);
    return response.data;
  },

  /**
   * رفع مستند أو صورة جديدة وحفظها في السيرفر وقاعدة البيانات مباشرة
   * @param {File} file
   * @param {string} fileType 'profile' | 'nationalIdFront' | 'nationalIdBack' | 'categoryProof' | 'birthCertificate'
   */
  async uploadDocument(file, fileType) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(
      `/trainees/profile/upload-document?fileType=${encodeURIComponent(fileType)}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * إزالة مستند أو صورة من السيرفر وقاعدة البيانات
   * @param {string} fileType 'profile' | 'nationalIdFront' | 'nationalIdBack' | 'categoryProof' | 'birthCertificate'
   */
  async removeDocument(fileType) {
    const response = await axiosInstance.post(
      `/trainees/profile/remove-document?fileType=${encodeURIComponent(fileType)}`
    );
    return response.data;
  },

  /**
   * جلب طلبات المتدرب الحالي من قاعدة البيانات
   */
  async getMyApplications() {
    const response = await axiosInstance.get('/applications/my');
    return response.data;
  },

  /**
   * استعلام الدورات التدريبية المتاحة
   */
  async getCourses(params) {
    const response = await axiosInstance.get('/courses', { params });
    return response.data;
  },

  /**
   * تغيير كلمة المرور
   * @param {{ currentPassword: string, newPassword: string }} data
   */
  async changePassword(data) {
    const response = await axiosInstance.post('/auth/change-password', data);
    return response.data;
  },
};

export default traineeApi;
