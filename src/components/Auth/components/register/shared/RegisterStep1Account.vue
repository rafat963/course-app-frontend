<template>
  <div class="space-y-3">
    <!-- Step Header -->
    <div class="border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2">
      <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
        <User class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
        البيانات الأساسية لإنشاء الحساب
      </h2>
      <p class="text-[10.5px] text-slate-400 dark:text-slate-500">أدخل الاسم الرباعي وبيانات الاتصال وكلمة المرور</p>
    </div>

    <!-- Full Name (Arabic 4 names) -->
    <div class="space-y-1 text-right">
      <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
        <span>الاسم الرباعي باللغة العربية <span class="text-rose-500">*</span></span>
        <span class="text-[10px] font-normal text-slate-400 dark:text-slate-500">مطابق للشهادة / البطاقة</span>
      </label>
      <input
        v-model="form.fullName"
        type="text"
        placeholder="محمد أحمد إبراهيم علي"
        class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
               focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
      />
    </div>

    <!-- Email & Phone Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <!-- Email -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          البريد الإلكتروني <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Mail class="w-3.5 h-3.5" />
          </div>
          <input
            v-model="form.email"
            type="email"
            placeholder="name@example.com"
            dir="ltr"
            class="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                   focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
          />
        </div>
      </div>

      <!-- Phone -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          رقم الهاتف للتواصل <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Phone class="w-3.5 h-3.5" />
          </div>
          <input
            v-model="form.phone"
            type="tel"
            maxlength="11"
            placeholder="01012345678"
            dir="ltr"
            class="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                   focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
          />
        </div>
      </div>
    </div>

    <!-- Password & Confirm Password Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <!-- Password -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          كلمة المرور <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Lock class="w-3.5 h-3.5" />
          </div>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••"
            dir="ltr"
            class="w-full pr-9 pl-9 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                   focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
          />
          <button
            type="button"
            class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors cursor-pointer"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" class="w-3.5 h-3.5" />
            <Eye v-else class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Confirm Password -->
      <div class="space-y-1 text-right">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
          تأكيد كلمة المرور <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Lock class="w-3.5 h-3.5" />
          </div>
          <input
            v-model="form.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••"
            dir="ltr"
            class="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all
                   focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:shadow-xs"
          />
        </div>
      </div>
    </div>

    <!-- Profile Photo Upload (Optional - Compact Strip) -->
    <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
          <img
            v-if="profilePhotoPreview"
            :src="profilePhotoPreview"
            alt="صورة المتدرب"
            class="w-full h-full object-cover"
          />
          <User v-else class="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
        <div>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block leading-tight">الصورة الشخصية (اختيارية)</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 block">تظهر للأمن عند البوابة</span>
        </div>
      </div>

      <div>
        <input
          id="profile-photo-input"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onProfilePhotoChange"
        />
        <label
          for="profile-photo-input"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-300 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer shadow-2xs transition-all"
        >
          <Upload class="w-3 h-3" />
          <span>{{ profilePhotoPreview ? 'تغيير' : 'اختيار صورة' }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { User, Mail, Phone, Lock, Eye, EyeOff, Upload } from 'lucide-vue-next';

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  profilePhotoPreview: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['profilePhotoUpload']);
const showPassword = ref(false);

function onProfilePhotoChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  emit('profilePhotoUpload', { file, previewUrl: url });
}
</script>
