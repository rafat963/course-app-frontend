<template>
  <div
    v-if="isOpen && round"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. الترويسة -->
      <div class="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 shadow-2xs">
            <Users class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
                متابعة تسجيل ودارسي الدفعة
              </h3>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                الدفعة {{ round.roundNumber }} ({{ round.roundCode }})
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>مفتوحة للتسجيل</span>
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
              {{ round.courseName }} — {{ round.hall?.name }} — {{ round.instructor?.name }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- زر طباعة الكشف -->
          <button
            type="button"
            class="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            @click="handlePrintReport"
          >
            <Printer class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span class="hidden sm:inline">طباعة التقرير</span>
          </button>

          <!-- زر الإغلاق -->
          <button
            type="button"
            class="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- 2. محتوى النافذة المنبثقة -->
      <div class="p-6 space-y-5 max-h-[calc(88vh-110px)] overflow-y-auto">
        <!-- أ. بطاقات الإحصائيات الأربعة السريعة (كام واحد قدم، كام واحد دفع، مين قدم ومدفعش، والمقاعد المتبقية) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- 1. إجمالي من قدم بالدفعة -->
          <div class="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-blue-700 dark:text-blue-300 block mb-1">
                إجمالي من قدّم بالدفعة
              </span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl font-black font-mono text-blue-900 dark:text-blue-100">
                  {{ totalApplicantsCount }}
                </span>
                <span class="text-xs font-bold text-blue-700 dark:text-blue-400">متقدماً</span>
              </div>
              <span class="text-[11px] text-blue-600 dark:text-blue-400 mt-1 block">
                سددوا + في مهلة السداد
              </span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
              <Users class="w-5 h-5" />
            </div>
          </div>

          <!-- 2. من دفع خلاص (سددوا وقيدوا) -->
          <div class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                دفعوا وقُيّدوا رسمياً
              </span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl font-black font-mono text-emerald-900 dark:text-emerald-100">
                  {{ round.enrolledTrainees?.length || 0 }}
                </span>
                <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">دارساً</span>
              </div>
              <span class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-mono font-bold">
                محصل: {{ formatEgyptianCurrency(totalPaidRevenue) }}
              </span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shrink-0">
              <CheckCircle2 class="w-5 h-5" />
            </div>
          </div>

          <!-- 3. من قدم ومدفعش (بانتظار السداد) -->
          <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-amber-700 dark:text-amber-300 block mb-1">
                قدّموا ولم يسددوا بعد
              </span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl font-black font-mono text-amber-900 dark:text-amber-100">
                  {{ round.pendingPaymentApplicants?.length || 0 }}
                </span>
                <span class="text-xs font-bold text-amber-700 dark:text-amber-400">متقدماً</span>
              </div>
              <span class="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block font-mono font-bold">
                منتظر: {{ formatEgyptianCurrency(totalPendingRevenue) }}
              </span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0">
              <Clock class="w-5 h-5" />
            </div>
          </div>

          <!-- 4. المقاعد الشاغرة المتبقية -->
          <div class="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-purple-700 dark:text-purple-300 block mb-1">
                المقاعد الشاغرة المتبقية
              </span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl font-black font-mono text-purple-900 dark:text-purple-100">
                  {{ remainingSeatsCount }}
                </span>
                <span class="text-xs font-bold text-purple-700 dark:text-purple-400">مقعد متاح</span>
              </div>
              <span class="text-[11px] text-purple-600 dark:text-purple-400 mt-1 block font-mono font-bold">
                سعة القاعة: {{ round.capacity }} مقعد ({{ occupancyRate }}%)
              </span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
              <Layers class="w-5 h-5" />
            </div>
          </div>
        </div>

        <!-- ب. شريط التبويبات الثلاثة (مين دفع خلاص، مين قدم ومدفعش، بيانات ومواعيد الدفعة) -->
        <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <!-- تبويب المسددين -->
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
            :class="
              currentTab === 'enrolled'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            "
            @click="currentTab = 'enrolled'"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>من سدد وقُيّد رسمياً</span>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-mono font-bold"
              :class="currentTab === 'enrolled' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'"
            >
              {{ round.enrolledTrainees?.length || 0 }}
            </span>
          </button>

          <!-- تبويب في انتظار السداد -->
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
            :class="
              currentTab === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            "
            @click="currentTab = 'pending'"
          >
            <Clock class="w-4 h-4" />
            <span>قدّموا وبانتظار السداد</span>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-mono font-bold"
              :class="currentTab === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'"
            >
              {{ round.pendingPaymentApplicants?.length || 0 }}
            </span>
          </button>

          <!-- تبويب بيانات ومواعيد الدفعة -->
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
            :class="
              currentTab === 'info'
                ? 'bg-primary-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            "
            @click="currentTab = 'info'"
          >
            <Info class="w-4 h-4" />
            <span>بيانات ومواعيد الدفعة</span>
          </button>
        </div>

        <!-- =================== 1. محتوى تبويب: من سدد وقيد رسمياً (مين دفع خلاص) =================== -->
        <div v-if="currentTab === 'enrolled'" class="space-y-3.5">
          <!-- شريط بحث سريع داخل قائمة المسددين -->
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="relative flex-1 min-w-[240px]">
              <input
                v-model="enrolledSearchQuery"
                type="text"
                placeholder="ابحث بالاسم، الرقم القومي، رقم الإيصال، أو رقم الهاتف..."
                class="w-full h-9 pr-8 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
              <Search class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div class="text-xs text-slate-500 font-bold">
              عرض {{ filteredEnrolledList.length }} من أصل {{ round.enrolledTrainees?.length || 0 }} دارساً مسدداً
            </div>
          </div>

          <!-- جدول المسددين -->
          <div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <table class="w-full text-right text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold select-none">
                <tr>
                  <th class="py-3 px-3.5 text-center">#</th>
                  <th class="py-3 px-3.5">اسم المتدرب والرقم القومي</th>
                  <th class="py-3 px-3.5">الفئة التدريبية</th>
                  <th class="py-3 px-3.5">رقم الهاتف</th>
                  <th class="py-3 px-3.5">رقم الإيصال</th>
                  <th class="py-3 px-3.5">المبلغ المسدد</th>
                  <th class="py-3 px-3.5">تاريخ وساعة السداد</th>
                  <th class="py-3 px-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                <tr v-if="filteredEnrolledList.length === 0">
                  <td colspan="8" class="py-8 text-center text-slate-400">
                    لا يوجد دارسون مسددون مطابقون للبحث
                  </td>
                </tr>
                <tr
                  v-for="(trainee, idx) in filteredEnrolledList"
                  :key="trainee.id"
                  class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td class="py-3 px-3.5 text-center font-mono text-slate-400">
                    {{ idx + 1 }}
                  </td>
                  <td class="py-3 px-3.5">
                    <div class="space-y-0.5">
                      <strong class="font-bold text-slate-800 dark:text-slate-100 block">
                        {{ trainee.fullName }}
                      </strong>
                      <span class="font-mono text-slate-400 text-[11px] block">
                        {{ trainee.nationalId }}
                      </span>
                    </div>
                  </td>
                  <td class="py-3 px-3.5">
                    <span
                      class="px-2.5 py-0.5 rounded-md text-[11px] font-bold border"
                      :class="getCategoryBadgeClass(trainee.category)"
                    >
                      {{ getCategoryLabel(trainee.category) }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 font-mono text-slate-700 dark:text-slate-300">
                    {{ trainee.phone }}
                  </td>
                  <td class="py-3 px-3.5">
                    <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] font-bold border border-slate-200 dark:border-slate-700">
                      {{ trainee.receiptNumber }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {{ formatEgyptianCurrency(trainee.paidAmount) }}
                  </td>
                  <td class="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                    {{ formatDateTime(trainee.paymentDate) }}
                  </td>
                  <td class="py-3 px-3.5 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <!-- زر عرض الملف الشخصي -->
                      <button
                        type="button"
                        class="h-7 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="عرض الملف الكامل للمتدرب"
                        @click="$emit('open-trainee-profile', trainee)"
                      >
                        <User class="w-3 h-3 text-primary-600" />
                        <span>الملف</span>
                      </button>

                      <!-- زر معاينة إيصال السداد -->
                      <button
                        type="button"
                        class="h-7 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
                        title="معاينة إيصال الخزينة"
                        @click="$emit('open-receipt', trainee)"
                      >
                        <FileCheck class="w-3 h-3" />
                        <span>الإيصال</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- =================== 2. محتوى تبويب: مين قدم ومدفعش (بانتظار السداد) =================== -->
        <div v-if="currentTab === 'pending'" class="space-y-3.5">
          <!-- بانر تنبيهي عن مهلة السداد -->
          <div class="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
            <AlertCircle class="w-5 h-5 text-amber-600 shrink-0" />
            <p class="text-xs text-amber-800 dark:text-amber-200 font-medium">
              هؤلاء المتقدمون تم اعتماد طلباتهم ومتاح لهم السداد خلال مهلة السداد المحددة لحجز مقعدهم رسمياً. يمكنك تمديد المهلة أو تسجيل سداد الرسوم فورياً.
            </p>
          </div>

          <!-- شريط بحث سريع داخل المتقدمين بانتظار السداد -->
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="relative flex-1 min-w-[240px]">
              <input
                v-model="pendingSearchQuery"
                type="text"
                placeholder="ابحث بالاسم، الرقم القومي، كود الطلب، أو الهاتف..."
                class="w-full h-9 pr-8 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-amber-500"
              />
              <Search class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div class="text-xs text-slate-500 font-bold">
              عرض {{ filteredPendingList.length }} من أصل {{ round.pendingPaymentApplicants?.length || 0 }} متقدماً
            </div>
          </div>

          <!-- جدول بانتظار السداد -->
          <div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <table class="w-full text-right text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold select-none">
                <tr>
                  <th class="py-3 px-3.5 text-center">#</th>
                  <th class="py-3 px-3.5">اسم المتقدم والرقم القومي</th>
                  <th class="py-3 px-3.5">الفئة التدريبية</th>
                  <th class="py-3 px-3.5">رقم الهاتف</th>
                  <th class="py-3 px-3.5">تاريخ التقديم</th>
                  <th class="py-3 px-3.5">مهلة السداد (يدفع قبله)</th>
                  <th class="py-3 px-3.5">المبلغ المطلوب</th>
                  <th class="py-3 px-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                <tr v-if="filteredPendingList.length === 0">
                  <td colspan="8" class="py-8 text-center text-slate-400">
                    لا يوجد متقدمون بانتظار السداد مطابقون للبحث
                  </td>
                </tr>
                <tr
                  v-for="(applicant, idx) in filteredPendingList"
                  :key="applicant.id"
                  class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td class="py-3 px-3.5 text-center font-mono text-slate-400">
                    {{ idx + 1 }}
                  </td>
                  <td class="py-3 px-3.5">
                    <div class="space-y-0.5">
                      <strong class="font-bold text-slate-800 dark:text-slate-100 block">
                        {{ applicant.fullName }}
                      </strong>
                      <span class="font-mono text-slate-400 text-[11px] block">
                        {{ applicant.nationalId }} ({{ applicant.applicationCode }})
                      </span>
                    </div>
                  </td>
                  <td class="py-3 px-3.5">
                    <span
                      class="px-2.5 py-0.5 rounded-md text-[11px] font-bold border"
                      :class="getCategoryBadgeClass(applicant.category)"
                    >
                      {{ getCategoryLabel(applicant.category) }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 font-mono text-slate-700 dark:text-slate-300">
                    {{ applicant.phone }}
                  </td>
                  <td class="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                    {{ formatDate(applicant.appliedAt) }}
                  </td>
                  <td class="py-3 px-3.5">
                    <div class="space-y-1">
                      <span class="font-mono font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                        {{ formatDate(applicant.paymentDueDate) }}
                      </span>
                      <span
                        class="px-2 py-0.2 rounded text-[10px] font-bold border inline-block"
                        :class="
                          applicant.gracePeriodDaysRemaining <= 2
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                        "
                      >
                        متبقي {{ applicant.gracePeriodDaysRemaining }} أيام
                      </span>
                    </div>
                  </td>
                  <td class="py-3 px-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {{ formatEgyptianCurrency(applicant.requiredAmount) }}
                  </td>
                  <td class="py-3 px-3.5 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <!-- زر سداد الرسوم الفوري -->
                      <button
                        type="button"
                        class="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        title="تسجيل سداد الرسوم واستخراج الإيصال"
                        @click="$emit('record-payment', applicant)"
                      >
                        <CreditCard class="w-3 h-3" />
                        <span>سداد</span>
                      </button>

                      <!-- زر تمديد مهلة السداد -->
                      <button
                        type="button"
                        class="h-7 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-amber-200 dark:border-amber-800"
                        title="تمديد مهلة السداد"
                        @click="$emit('extend-deadline', applicant)"
                      >
                        <CalendarPlus class="w-3 h-3" />
                        <span>تمديد</span>
                      </button>

                      <!-- زر الملف -->
                      <button
                        type="button"
                        class="h-7 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="تفاصيل المتقدم"
                        @click="$emit('open-trainee-profile', applicant)"
                      >
                        <Eye class="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- =================== 3. محتوى تبويب: بيانات ومواعيد الدفعة =================== -->
        <div v-if="currentTab === 'info'" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 1. المكان والقاعة والمحاضر -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
                <MapPin class="w-4 h-4 text-primary-600" />
                <span>المكان والمحاضر المشرف</span>
              </h4>
              <div class="space-y-2 text-xs">
                <div>
                  <span class="text-slate-500 block text-[11px]">القاعة التدريبية:</span>
                  <strong class="text-slate-800 dark:text-slate-200 font-bold">{{ round.hall?.name }}</strong>
                </div>
                <div>
                  <span class="text-slate-500 block text-[11px]">طبيعة المكان وسعته:</span>
                  <span class="text-slate-700 dark:text-slate-300 font-bold">
                    {{ round.hall?.type === 'Lab' ? 'معمل حواسيب وتطبيقات عملية' : 'قاعة محاضرات نظرية' }}
                    ({{ round.capacity }} مقعداً)
                  </span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[11px]">المحاضر المسؤول:</span>
                  <strong class="text-slate-800 dark:text-slate-200 font-bold">{{ round.instructor?.name }}</strong>
                </div>
                <div>
                  <span class="text-slate-500 block text-[11px]">التخصص ورقم الهاتف:</span>
                  <span class="text-slate-700 dark:text-slate-300 font-mono">
                    {{ round.instructor?.specialty }} — {{ round.instructor?.phone }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 2. جدول المواعيد والأوقات -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
                <Clock class="w-4 h-4 text-amber-500" />
                <span>جدول المحاضرات والتواريخ</span>
              </h4>
              <div class="space-y-2 text-xs">
                <div>
                  <span class="text-slate-500 block text-[11px]">أيام الانعقاد:</span>
                  <strong class="text-slate-800 dark:text-slate-200 font-bold">
                    {{ formatLectureDays(round.lectureDays) }}
                  </strong>
                </div>
                <div>
                  <span class="text-slate-500 block text-[11px]">توقيت المحاضرات:</span>
                  <strong class="font-mono text-slate-700 dark:text-slate-300">
                    من {{ formatLectureTime(round.startTime) }} إلى {{ formatLectureTime(round.endTime) }}
                  </strong>
                </div>
                <div>
                  <span class="text-slate-500 block text-[11px]">آخر موعد لتلقي الطلبات:</span>
                  <strong class="font-mono text-rose-600 dark:text-rose-400 font-bold">
                    {{ formatDate(round.lastApplicationDate) }}
                  </strong>
                </div>
                <div>
                  <span class="text-slate-500 block text-[11px]">تاريخ الانطلاق والانتهاء:</span>
                  <span class="font-mono text-slate-700 dark:text-slate-300 font-bold">
                    {{ formatDate(round.startDate) }} إلى {{ formatDate(round.endDate) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 3. لائحة أسعار الدورة للفئات -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
                <CreditCard class="w-4 h-4 text-emerald-600" />
                <span>لائحة الرسوم المعتمدة للفئات</span>
              </h4>
              <div class="space-y-1.5 text-xs">
                <div class="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span class="text-slate-600 dark:text-slate-400">مدني:</span>
                  <strong class="font-mono text-slate-800 dark:text-slate-100 font-bold">
                    {{ formatEgyptianCurrency(round.pricings?.Civilian) }}
                  </strong>
                </div>
                <div class="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span class="text-slate-600 dark:text-slate-400">ضابط ق.م:</span>
                  <strong class="font-mono text-primary-600 dark:text-primary-400 font-bold">
                    {{ formatEgyptianCurrency(round.pricings?.MilitaryOfficer) }}
                  </strong>
                </div>
                <div class="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span class="text-slate-600 dark:text-slate-400">أسرة ق.م:</span>
                  <strong class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {{ formatEgyptianCurrency(round.pricings?.MilitaryFamily) }}
                  </strong>
                </div>
                <div class="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span class="text-slate-600 dark:text-slate-400">شرطة / أسرهم:</span>
                  <strong class="font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {{ formatEgyptianCurrency(round.pricings?.PoliceOfficerOrFamily) }}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. التذييل -->
      <div class="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
        <div class="text-xs text-slate-500 font-bold flex items-center gap-1.5">
          <CheckCircle2 class="w-4 h-4 text-emerald-500" />
          <span>يتم تحديث نسب الإشغال وحجز المقاعد لحظياً بمجرد إتمام السداد بالخزينة</span>
        </div>
        <button
          type="button"
          class="h-9 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          @click="handleClose"
        >
          إغلاق النافذة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Users,
  CheckCircle2,
  Clock,
  Layers,
  Info,
  Search,
  Printer,
  X,
  User,
  FileCheck,
  AlertCircle,
  CreditCard,
  CalendarPlus,
  Eye,
  MapPin,
} from 'lucide-vue-next';
import {
  APPLICANT_CATEGORIES,
  formatEgyptianCurrency,
  formatDate,
  formatDateTime,
  formatLectureDays,
  formatLectureTime,
} from '../helpers/openRegistrationConstants';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  'close',
  'open-trainee-profile',
  'open-receipt',
  'record-payment',
  'extend-deadline',
]);

const currentTab = ref('enrolled');
const enrolledSearchQuery = ref('');
const pendingSearchQuery = ref('');

function handleClose() {
  emit('close');
}

function handlePrintReport() {
  window.print();
}

const totalApplicantsCount = computed(() => {
  if (!props.round) return 0;
  const enrolled = props.round.enrolledTrainees?.length || 0;
  const pending = props.round.pendingPaymentApplicants?.length || 0;
  return enrolled + pending;
});

const remainingSeatsCount = computed(() => {
  if (!props.round) return 0;
  const enrolled = props.round.enrolledTrainees?.length || 0;
  return Math.max(0, (props.round.capacity || 0) - enrolled);
});

const occupancyRate = computed(() => {
  if (!props.round || !props.round.capacity) return 0;
  const enrolled = props.round.enrolledTrainees?.length || 0;
  return Math.min(100, Math.round((enrolled / props.round.capacity) * 100));
});

const totalPaidRevenue = computed(() => {
  if (!props.round?.enrolledTrainees) return 0;
  return props.round.enrolledTrainees.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
});

const totalPendingRevenue = computed(() => {
  if (!props.round?.pendingPaymentApplicants) return 0;
  return props.round.pendingPaymentApplicants.reduce((acc, curr) => acc + (curr.requiredAmount || 0), 0);
});

const filteredEnrolledList = computed(() => {
  if (!props.round?.enrolledTrainees) return [];
  const q = enrolledSearchQuery.value.trim().toLowerCase();
  if (!q) return props.round.enrolledTrainees;
  return props.round.enrolledTrainees.filter((t) => {
    return (
      (t.fullName && t.fullName.toLowerCase().includes(q)) ||
      (t.nationalId && t.nationalId.includes(q)) ||
      (t.receiptNumber && t.receiptNumber.toLowerCase().includes(q)) ||
      (t.phone && t.phone.includes(q))
    );
  });
});

const filteredPendingList = computed(() => {
  if (!props.round?.pendingPaymentApplicants) return [];
  const q = pendingSearchQuery.value.trim().toLowerCase();
  if (!q) return props.round.pendingPaymentApplicants;
  return props.round.pendingPaymentApplicants.filter((p) => {
    return (
      (p.fullName && p.fullName.toLowerCase().includes(q)) ||
      (p.nationalId && p.nationalId.includes(q)) ||
      (p.applicationCode && p.applicationCode.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q))
    );
  });
});

function getCategoryLabel(cat) {
  return APPLICANT_CATEGORIES[cat]?.label || cat || '—';
}

function getCategoryBadgeClass(cat) {
  return (
    APPLICANT_CATEGORIES[cat]?.class ||
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  );
}
</script>
