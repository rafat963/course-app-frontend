<template>
  <div class="space-y-5 select-none pb-8">
    <!-- =========================================================
         1. رأس الصفحة: بوابة المتدرب وتصاريح الدخول (شاشة فقط)
         ========================================================= -->
    <div class="gate-pass-no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl overflow-hidden">
      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <QrCode class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                تصريح الدخول الأمني الموحد (Gate QR Pass)
              </h1>
              <span
                v-if="hasPasses"
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                القرار: مصرح بالدخول (Allowed)
              </span>
              <span
                v-else
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1"
              >
                <AlertCircle class="w-3.5 h-3.5 text-amber-600" />
                القرار: لا يوجد تصريح نشط
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {{ hasPasses ? 'رمز QR يومي موحد وشامل لجميع محاضراتك ودوراتك المعتمدة — يُبرز لفرد الأمن عند بوابات المعهد' : 'يتم إصدار وتفعيل رمز الـ QR تلقائياً فور اعتماد طلبك وسداد رسوم الدورة التدريبية' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <!-- زر تجربة الحالة (المعاينة التفاعلية بين الحالتين) -->
          <button
            type="button"
            class="px-3 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            :class="simulateEmpty
              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-100 shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
            title="تبديل معاينة الصفحة بين وجود تصريح نشط وعدم وجود دورات"
            @click="simulateEmpty = !simulateEmpty"
          >
            <SlidersHorizontal class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span>{{ simulateEmpty ? 'إلغاء المعاينة (عرض التصريح)' : 'معاينة: بدون دورات' }}</span>
          </button>

          <!-- بطاقة المتدرب السريعة -->
          <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs shrink-0">
            <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-black text-sm">
              {{ userInitials }}
            </div>
            <div>
              <div class="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">{{ traineeProfile.fullName }}</div>
              <div class="text-[11px] text-slate-400 font-mono">الرقم القومي: {{ traineeProfile.nationalId }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
         2. في حال عدم وجود أي دورات متقدم عليها (لا يوجد تصريح QR)
         ========================================================= -->
    <div
      v-if="!hasPasses"
      class="gate-pass-no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-8 sm:p-12 text-center space-y-6 animate-fade-in"
    >
      <!-- الأيقونة التعبيرية الدائرية -->
      <div class="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div class="absolute inset-0 rounded-full bg-amber-500/10 dark:bg-amber-500/20 blur-xl animate-pulse" />
        <div class="relative w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-inner">
          <QrCode class="w-10 h-10 text-slate-400 dark:text-slate-500 opacity-60" />
          <div class="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
            <AlertCircle class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- النصوص التوضيحية -->
      <div class="max-w-lg mx-auto space-y-2.5">
        <h2 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-heading">
          لا يوجد تصريح دخول أمني (QR Code) مفعل حالياً
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          عفواً، لم يتم العثور على أي دورة تدريبية مقيد بها حالياً لاستخراج تصريح دخول للبوابات.
        </p>

        <!-- التنبيه المطلوب نصاً -->
        <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
          <AlertCircle class="w-4.5 h-4.5 text-amber-600 shrink-0" />
          <span>برجاء الذهاب لصفحة الطلبات والتقديم علي دورة جديدة</span>
        </div>
      </div>

      <!-- أزرار الإجراءات الفورية -->
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <RouterLink
          to="/trainee/applications"
          class="px-6 py-3 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-primary-700/20 hover:shadow-primary-700/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <ClipboardList class="w-4.5 h-4.5" />
          <span>الذهاب لصفحة متابعة الطلبات</span>
        </RouterLink>

        <RouterLink
          to="/trainee/courses"
          class="px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
        >
          <BookOpen class="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
          <span>تصفح والتقديم على دورة جديدة</span>
        </RouterLink>
      </div>

      <!-- كروت خطوات استخراج التصريح الثلاثة -->
      <div class="max-w-2xl mx-auto pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-right">
        <div class="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span class="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center text-[10px] font-black shrink-0">1</span>
            <span>التقديم على الدورة</span>
          </div>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
            اختيار البرنامج التدريبي المناسب وإرسال طلب الالتحاق إلكترونياً.
          </p>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span class="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center text-[10px] font-black shrink-0">2</span>
            <span>اعتماد الشؤون والسداد</span>
          </div>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
            مراجعة بياناتك واعتماد الطلب وتحديد مهلة سداد الرسوم بخزينة المعهد.
          </p>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span class="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center text-[10px] font-black shrink-0">3</span>
            <span>صدور تصريح الـ QR</span>
          </div>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
            توليد كود الـ QR الموحد وتصريح الدخول للبوابات الذكية فور تقييدك.
          </p>
        </div>
      </div>
    </div>

    <!-- =========================================================
         3. كارت التصريح اليومي الموحد (Single Consolidated Daily Pass) على الشاشة
         ========================================================= -->
    <div v-else class="space-y-5">
      <!-- البطاقة المركزية الكبرى للتصريح الأمني الموحد -->
      <article class="gate-pass-screen-card gate-pass-no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-2xl overflow-hidden">

        <!-- ===== الترويسة: قناة أمنية داكنة ===== -->
        <div class="px-6 py-4 bg-gradient-to-l from-primary-950 via-primary-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck class="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div class="text-sm font-black font-heading leading-tight">
                تصريح دخول معهد نظم المعلومات — القوات المسلحة
              </div>
              <div class="text-[11px] text-primary-200 font-mono mt-0.5 flex items-center gap-2">
                <span>كود التصريح: {{ unifiedPassData.passCode }}</span>
                <span>•</span>
                <span class="text-emerald-300 font-bold">القرار: مصرح بالدخول (Allowed)</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 self-start sm:self-auto">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/15 text-primary-100 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-amber-300" />
              <span>{{ todayFormattedAr }}</span>
            </span>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-black font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {{ todayIso }}
            </span>
          </div>
        </div>

        <!-- ===== جسم التصريح: QR كمحور رئيسي + البيانات على الجانبين ===== -->
        <div class="p-6 md:p-8 flex flex-col items-center gap-8">

          <!-- ---- الصف الأول: بيانات المتدرب ---- -->
          <div class="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div class="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-black text-sm shrink-0">
                {{ userInitials }}
              </div>
              <div class="min-w-0">
                <div class="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <User class="w-3 h-3 text-primary-500" /> اسم المتدرب
                </div>
                <div class="font-bold text-slate-800 dark:text-slate-100 truncate">{{ traineeProfile.fullName }}</div>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                <Fingerprint class="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <div class="text-[10px] text-slate-400 mb-0.5">الرقم القومي</div>
                <div class="font-mono font-bold text-slate-800 dark:text-slate-100 tracking-wider">{{ traineeProfile.nationalId }}</div>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
              <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div class="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mb-0.5">القرار الأمني</div>
                <div class="font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                  مصرح بالدخول
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <!-- ---- الصف الثاني: QR كبطل الصفحة ---- -->
          <div class="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">

            <!-- عنوان QR -->
            <div class="text-center space-y-1">
              <h2 class="text-base font-black text-slate-800 dark:text-slate-100 font-heading tracking-tight">
                الرمز الأمني الموحد لليوم
              </h2>
              <p class="text-xs text-slate-400">امسح الرمز ضوئياً عبر أجهزة البوابة الإلكترونية</p>
            </div>

            <!-- حاوية QR الرئيسية — مركز الصفحة -->
            <div
              class="qr-hero-wrapper relative cursor-pointer group/qr"
              title="انقر لتكبير الرمز للشاشات وأجهزة البوابات"
              @click="openZoomUnified"
            >
              <!-- إطار المسح الأمني (scanner frame glow) -->
              <div class="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary-500/20 via-transparent to-emerald-500/20 blur-xl pointer-events-none opacity-70 group-hover/qr:opacity-100 transition-opacity" />

              <!-- البطاقة البيضاء الداخلية -->
              <div class="relative p-5 bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col items-center gap-3 transition-transform group-hover/qr:scale-[1.015]">

                <!-- زوايا الماسح -->
                <span class="absolute top-2.5 right-2.5 w-5 h-5 border-t-[3px] border-r-[3px] border-primary-600 rounded-tr-lg" />
                <span class="absolute top-2.5 left-2.5 w-5 h-5 border-t-[3px] border-l-[3px] border-primary-600 rounded-tl-lg" />
                <span class="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-[3px] border-r-[3px] border-primary-600 rounded-br-lg" />
                <span class="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-[3px] border-l-[3px] border-primary-600 rounded-bl-lg" />

                <!-- رمز QR الكبير -->
                <QrcodeVue
                  :value="unifiedPassData.qrToken"
                  :size="240"
                  level="H"
                  render-as="svg"
                  foreground="#0b1e42"
                  background="#ffffff"
                />

                <!-- hover overlay -->
                <div class="absolute inset-0 rounded-3xl bg-primary-900/8 opacity-0 group-hover/qr:opacity-100 flex items-end justify-center pb-4 transition-opacity">
                  <span class="px-3 py-1.5 rounded-xl bg-primary-900/95 text-white text-xs font-bold shadow-lg backdrop-blur-sm">
                    🔍 انقر للتكبير
                  </span>
                </div>
              </div>
            </div>

            <!-- شريط الرمز المشفر -->
            <div class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span class="truncate text-[10px] text-slate-500 dark:text-slate-400 font-mono" :title="unifiedPassData.qrToken">
                {{ unifiedPassData.qrToken }}
              </span>
              <button
                type="button"
                class="w-7 h-7 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors shrink-0 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                title="نسخ رمز التصريح"
                @click.stop="copyToken(unifiedPassData.qrToken)"
              >
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- أزرار الإجراءات الرئيسية -->
            <div class="w-full grid grid-cols-2 gap-2.5">
              <button
                type="button"
                class="h-10 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 active:scale-95"
                @click="openZoomUnified"
              >
                <Maximize2 class="w-4 h-4" />
                <span>تكبير الرمز</span>
              </button>
              <button
                type="button"
                class="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                @click="handlePrintPass"
              >
                <Printer class="w-4 h-4 text-slate-500" />
                <span>طباعة التصريح</span>
              </button>
            </div>

            <!-- شريط نافذة العبور -->
            <div class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs">
              <Clock class="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span class="font-bold text-amber-800 dark:text-amber-300">نافذة العبور اليومية:</span>
              <span class="font-mono font-bold text-amber-900 dark:text-amber-200">07:00 ص — 22:00 م</span>
            </div>
          </div>

          <!-- ---- الصف الثالث: جلسات اليوم وسجل البوابة ---- -->
          <div class="w-full space-y-4">

            <!-- 3. المحاضرات والجلسات المصرح بدخولها اليوم (Active Daily Sessions) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
                  <CalendarClock class="w-4 h-4 text-primary-600" />
                  <span>المحاضرات والجلسات المقررة لليوم ({{ todayDayName }})</span>
                </h3>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                  :class="todaySessions.length
                    ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/60 dark:text-primary-300 dark:border-primary-800'
                    : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'"
                >
                  {{ todaySessions.length ? `${todaySessions.length} جلسة مجدولة اليوم` : 'لا توجد جلسات اليوم' }}
                </span>
              </div>

              <!-- في حال وجود جلسات مقررة اليوم -->
              <div v-if="todaySessions.length" class="space-y-2.5">
                <div
                  v-for="session in todaySessions"
                  :key="session.id"
                  class="p-3.5 rounded-2xl border border-primary-200 dark:border-primary-800/80 bg-primary-50/40 dark:bg-primary-950/20 space-y-2"
                >
                  <div class="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div class="font-black text-xs text-slate-800 dark:text-slate-100">
                        {{ session.round.courseName }}
                      </div>
                      <div class="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                        <span class="text-primary-700 dark:text-primary-300 font-bold">{{ session.round.roundCode }}</span>
                        <span>•</span>
                        <span>الدفعة {{ session.round.roundNumber }}</span>
                        <span>•</span>
                        <span>{{ session.round.courseDomain }}</span>
                      </div>
                    </div>

                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                      محاضرة نشطة اليوم
                    </span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-primary-100 dark:border-primary-900/60">
                    <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <MapPin class="w-3.5 h-3.5 text-primary-600 shrink-0" />
                      <span class="truncate">
                        <strong>{{ session.round.hall.name }}</strong> ({{ session.round.hall.location }})
                      </span>
                    </div>

                    <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono">
                      <Clock class="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>
                        الموعد: <strong>{{ session.round.startTime }} — {{ session.round.endTime }}</strong>
                      </span>
                    </div>

                    <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 sm:col-span-2">
                      <User class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>المحاضر المسؤول: <strong>{{ session.round.instructor.name }}</strong> ({{ session.round.instructor.specialty }})</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- في حال عدم وجود جلسات اليوم (مثلاً عطلة أسبوعية أو أيام بدون محاضرات) -->
              <div
                v-else
                class="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 text-xs text-slate-500 dark:text-slate-400 space-y-1"
              >
                <div class="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CalendarX class="w-4 h-4 text-slate-400" />
                  لا توجد محاضرات مجدولة لهذا اليوم ({{ todayDayName }})
                </div>
                <p class="text-[11px] text-slate-400 leading-relaxed">
                  التصريح الأمني الموحد يظل صالحاً لدخول مقر المعهد للمراجعات الإدارية، شؤون الدارسين، واستخدام المعامل والمكتبة المركزية بتصديق أمن البوابة.
                </p>
              </div>
            </div>

            <!-- 4. شريط الإجراءات وسجل البوابة -->
            <div class="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                class="font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 cursor-pointer"
                @click="openGateLogs"
              >
                <History class="w-3.5 h-3.5" />
                <span>عرض سجل حركات الدخول الأمنية (GateLogs)</span>
              </button>

              <span class="text-[10px] text-slate-400 font-mono">
                آخر تحديث أمني: اليوم {{ todayIso }}
              </span>
            </div>
          </div><!-- /space-y-4 row3 -->
        </div><!-- /flex flex-col items-center -->
      </article>

      <!-- =========================================================
           4. قسم الدورات التدريبية المقيد بها حالياً (بيانات مرجعية ملخصة للشاشة فقط)
           ========================================================= -->
      <div class="gate-pass-no-print space-y-3">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-black text-slate-700 dark:text-slate-300 font-heading flex items-center gap-1.5">
            <BookOpen class="w-4 h-4 text-slate-500" />
            <span>بيانات الدورات المقيد بها المشمولة في هذا التصريح</span>
          </h3>
          <span class="text-[11px] text-slate-400">{{ passes.length }} دورات نشطة</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div
            v-for="pass in passes"
            :key="pass.id"
            class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3 text-xs"
          >
            <div>
              <div class="flex items-center justify-between gap-2 flex-wrap mb-1">
                <span class="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  {{ pass.round.roundCode }}
                </span>
                <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  إيصال: {{ pass.receiptNumber }}
                </span>
              </div>
              <h4 class="font-bold text-slate-800 dark:text-slate-100 text-xs line-clamp-1">
                {{ pass.round.courseName }}
              </h4>
              <p class="text-[11px] text-slate-400 mt-1">
                {{ pass.round.hall.name }} • {{ formatTimeRange(pass.round.startTime, pass.round.endTime) }}
              </p>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <span class="text-slate-500 dark:text-slate-400">
                أيام المحاضرات: <strong class="text-slate-700 dark:text-slate-200">{{ formatLectureDays(pass.round.lectureDays) }}</strong>
              </span>
              <span class="font-mono text-slate-400 text-[10px]">
                {{ formatDateDmy(pass.round.startDate) }} → {{ formatDateDmy(pass.round.endDate) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
         5. قالب الطباعة المتخصص النظيف (Clean Professional Print Layout)
         يظهر فقط عند أمر الطباعة (window.print / Ctrl+P) ويخفي كافة القوائم والأزرار
         ========================================================= -->
    <div v-if="hasPasses" id="daily-gate-pass-print-target" class="hidden print:block font-sans select-text" dir="rtl">
      <!-- الترويسة العسكرية الرسمية للطباعة -->
      <div class="print-header flex items-center justify-between pb-3 border-b-2 border-[#0b1e42] mb-3">
        <div class="text-right space-y-0.5 text-slate-900 leading-tight">
          <div class="text-[12pt] font-black text-[#0b1e42] font-heading">جمهورية مصر العربية</div>
          <div class="text-[10pt] font-bold text-slate-800">وزارة الدفاع — هيئة التدريب</div>
          <div class="text-[11pt] font-black text-[#0b1e42] font-heading">معهد نظم المعلومات للقوات المسلحة</div>
          <div class="text-[9pt] font-bold text-slate-600">إدارة الأمن والحراسة وبوابات الدخول</div>
        </div>

        <div class="text-center px-4">
          <img :src="instituteLogo" alt="Institute Logo" class="w-16 h-16 object-contain mx-auto" />
          <div class="text-[7pt] font-black tracking-widest text-[#0b1e42] font-mono mt-0.5">ARMED FORCES ISI</div>
        </div>

        <div class="text-left font-mono text-[9pt] text-slate-800 space-y-0.5 leading-tight">
          <div>كود التصريح: <strong class="text-[#0b1e42]">{{ unifiedPassData.passCode }}</strong></div>
          <div>تاريخ الإصدار: <strong>{{ todayIso }}</strong></div>
          <div>فترة السريان: <strong>07:00 ص — 22:00 م</strong></div>
          <div class="mt-1 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-900 font-bold border border-emerald-500 text-center font-sans text-[8.5pt]">
            القرار الأمني: مصرح بالدخول (Allowed) ✓
          </div>
        </div>
      </div>

      <!-- عنوان وثيقة التصريح الأمني -->
      <div class="text-center my-2">
        <h2 class="text-[15pt] font-black text-[#0b1e42] font-heading leading-tight">
          تصريح الدخول الأمني اليومي الموحد (Daily Security Gate Pass)
        </h2>
        <div class="text-[9pt] text-slate-600 font-medium mt-0.5">
          وثيقة أمنية إلكترونية معتمدة تمنح حاملها حق الدخول لمقر المعهد وكافة القاعات والمعامل المجدولة لليوم
        </div>
      </div>

      <!-- شبكة الرمز الموحد وبيانات المتدرب -->
      <div class="grid grid-cols-12 gap-4 items-center my-3 border border-slate-300 rounded-xl p-3 bg-slate-50/50">
        <!-- رمز الـ QR الموحد -->
        <div class="col-span-4 flex flex-col items-center justify-center border-l border-slate-300 pl-3">
          <div class="p-2 bg-white rounded-lg border-2 border-[#0b1e42] shadow-xs inline-block">
            <QrcodeVue
              :value="unifiedPassData.qrToken"
              :size="135"
              level="H"
              render-as="svg"
              foreground="#0b1e42"
              background="#ffffff"
            />
          </div>
          <div class="text-[7.5pt] font-mono font-bold text-slate-700 mt-1 text-center truncate max-w-full">
            {{ unifiedPassData.qrToken }}
          </div>
        </div>

        <!-- البيانات الوصفية للمتدرب -->
        <div class="col-span-8 space-y-2 text-[9.5pt] pr-2">
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <span class="text-slate-500 text-[8.5pt] block">اسم المتدرب الرباعي:</span>
              <strong class="text-slate-900 text-[11pt]">{{ traineeProfile.fullName }}</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[8.5pt] block">الرقم القومي (14 رقماً):</span>
              <strong class="font-mono text-slate-900 text-[10.5pt]">{{ traineeProfile.nationalId }}</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[8.5pt] block">الفئة المعتمدة:</span>
              <strong class="text-slate-800">{{ CATEGORY_CONFIG[traineeProfile.category]?.labelFull || traineeProfile.category }}</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[8.5pt] block">حالة السداد والرسوم:</span>
              <strong class="text-emerald-800 font-bold">مسدد بالكامل ومقيد بالدورات ✓</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[8.5pt] block">تاريخ السريان:</span>
              <strong class="text-slate-900">{{ todayFormattedAr }}</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[8.5pt] block">بوابات الدخول المصرح بها:</span>
              <strong class="text-slate-900">البوابة الرئيسية + بوابة المشاة التقنية</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- جدول المحاضرات والقاعات والمحاضرين المصرح بها اليوم -->
      <div class="my-3">
        <div class="text-[9.5pt] font-black text-slate-900 font-heading mb-1 flex items-center justify-between">
          <span>المحاضرات والجلسات والقاعات المصرح بدخولها اليوم ({{ todayDayName }}):</span>
          <span class="text-[8.5pt] text-slate-500 font-mono font-normal">{{ todaySessions.length }} جلسة معتمدة</span>
        </div>

        <table v-if="todaySessions.length" class="w-full text-right text-[8.5pt] border border-slate-300 rounded-lg overflow-hidden">
          <thead class="bg-slate-200 text-slate-900 font-bold border-b border-slate-300">
            <tr>
              <th class="p-1.5 border-l border-slate-300">الدورة التدريبية</th>
              <th class="p-1.5 border-l border-slate-300">كود الدفعة</th>
              <th class="p-1.5 border-l border-slate-300">القاعة التدريبية والمقر</th>
              <th class="p-1.5 border-l border-slate-300">الموعد والتوقيت</th>
              <th class="p-1.5">المحاضر المشرف</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in todaySessions" :key="session.id" class="border-b border-slate-200">
              <td class="p-1.5 border-l border-slate-200 font-bold">{{ session.round.courseName }}</td>
              <td class="p-1.5 border-l border-slate-200 font-mono font-bold">{{ session.round.roundCode }}</td>
              <td class="p-1.5 border-l border-slate-200">{{ session.round.hall.name }} ({{ session.round.hall.location }})</td>
              <td class="p-1.5 border-l border-slate-200 font-mono font-bold">{{ session.round.startTime }} — {{ session.round.endTime }}</td>
              <td class="p-1.5">{{ session.round.instructor.name }}</td>
            </tr>
          </tbody>
        </table>

        <div v-else class="p-2.5 border border-dashed border-slate-300 rounded-lg text-[8.5pt] text-slate-600 bg-slate-50 text-center">
          لا توجد محاضرات مجدولة لهذا اليوم (يوم غير دراسي) — يُصرح لحامل التصريح بالدخول لإنجاز المراجعات الإدارية والمكتبة المركزية والمعامل بتنسيق الأمن.
        </div>
      </div>

      <!-- خانات التوقيع والأختام الرسمية للطباعة -->
      <div class="grid grid-cols-3 gap-3 pt-3 mt-3 border-t-2 border-slate-300 text-center text-[8.5pt]">
        <div>
          <div class="font-bold text-slate-800">مسؤول أمن البوابات</div>
          <div class="h-8 border-b border-slate-400 w-32 mx-auto my-1"></div>
          <div class="text-[7.5pt] text-slate-500 font-mono">التوقيع / المسح</div>
        </div>
        <div>
          <div class="font-bold text-slate-800">خاتم أمن معهد نظم المعلومات</div>
          <div class="w-14 h-14 rounded-full border-2 border-double border-slate-700 mx-auto my-0.5 flex items-center justify-center text-[6.5pt] text-slate-600 font-bold">
            خاتم الأمن
          </div>
        </div>
        <div>
          <div class="font-bold text-slate-800">ضابط نوبتجي المعهد</div>
          <div class="h-8 border-b border-slate-400 w-32 mx-auto my-1"></div>
          <div class="text-[7.5pt] text-slate-500 font-mono">الاعتماد والتصديق</div>
        </div>
      </div>

      <!-- إشعار أمني إلزامي في الفوتر -->
      <div class="text-center text-[7.5pt] text-slate-500 mt-3 pt-1.5 border-t border-slate-200">
        يُسجل كل مسح إلكترونياً وبصورة فورية في سجل حركات البوابة (GateLogs) مع قرار فرد الأمن — التصريح صالح لحامله فقط.
      </div>
    </div>

    <!-- مودال تكبير رمز التصريح الموحد للبوابة -->
    <TraineePassZoomModal
      :is-open="isZoomOpen"
      :pass="selectedZoomPass"
      :trainee-profile="traineeProfile"
      @close="isZoomOpen = false"
    />

    <!-- مودال سجل حركات الدخول الأمنية (GateLogs) -->
    <TraineeGateLogsModal
      :is-open="isLogsOpen"
      :pass="passes[0] || null"
      @close="isLogsOpen = false"
    />

    <!-- Toast Notification -->
    <Transition name="slide-up">
      <div
        v-if="toast.text"
        class="gate-pass-no-print fixed bottom-6 left-6 z-[60] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold max-w-sm bg-emerald-50 dark:bg-emerald-950/95 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
      >
        <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-600" />
        <span>{{ toast.text }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import QrcodeVue from 'qrcode.vue';
import {
  QrCode,
  ShieldCheck,
  Copy,
  User,
  MapPin,
  CalendarClock,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Maximize2,
  History,
  Printer,
  Clock,
  CalendarX,
  BookOpen,
  Fingerprint,
  BadgeCheck,
  AlertCircle,
  SlidersHorizontal,
  ClipboardList,
} from 'lucide-vue-next';
import TraineePassZoomModal from './TraineePassZoomModal.vue';
import TraineeGateLogsModal from './TraineeGateLogsModal.vue';
import { useAuthStore } from '@/components/Auth/stores/authStore';
import { TRAINEE_MOCK_PROFILE } from '../../helpers/availableCoursesMockData';
import { ONGOING_APPLICATIONS } from '../../helpers/traineePortalMockData';
import { formatDateDmy, formatTimeRange } from '../../helpers/traineePortalHelpers';
import { formatLectureDays, CATEGORY_CONFIG, DAY_LABELS } from '../../helpers/availableCoursesHelpers';
import instituteLogo from '@/assets/logo.png';

const route = useRoute();
const authStore = useAuthStore();

// وضع تجربة تفاعلي يسمح بتبديل الحالة بين وجود تصريح نشط وحالة عدم وجود دورات (Empty State)
const simulateEmpty = ref(false);

const traineeProfile = {
  ...TRAINEE_MOCK_PROFILE,
  fullName: authStore.user?.fullName || TRAINEE_MOCK_PROFILE.fullName,
  userId: authStore.user?.id || TRAINEE_MOCK_PROFILE.userId,
};

const userInitials = computed(() => {
  const parts = (traineeProfile.fullName || 'م').trim().split(/\s+/);
  return parts.length >= 2 ? `${parts[0][0]} ${parts[1][0]}` : traineeProfile.fullName.slice(0, 2);
});

/** تصاريح الدورات المقيد بها فقط (Status = Enrolled) */
const passes = computed(() => ONGOING_APPLICATIONS);

/** التحقق من وجود تصاريح فعّالة للمتدرب */
const hasPasses = computed(() => {
  if (simulateEmpty.value) return false;
  if (route.query.empty === 'true' || route.query.no_courses === 'true') return false;
  return passes.value && passes.value.length > 0;
});

// ============================================================
// حساب بيانات اليوم والجلسات المقررة اليوم
// ============================================================
const todayIso = '2026-11-05';
const todayFormattedAr = 'الخميس، 5 نوفمبر 2026';
const todayDayCode = 'Thu';
const todayDayName = DAY_LABELS[todayDayCode] || 'الخميس';

/** المحاضرات والجلسات المقررة لليوم الحالي من واقع الدورات المقيد بها */
const todaySessions = computed(() => {
  return passes.value.filter((p) => {
    const days = p.round?.lectureDays || [];
    return days.includes(todayDayCode);
  });
});

/** بيانات التصريح الأمني اليومي الموحد المركزي */
const unifiedPassData = computed(() => {
  const sessionCodes = todaySessions.value.map((s) => s.round.roundCode).join('-') || 'GENERAL-ACCESS';
  const qrToken = `ISI-GATE-${todayIso}-TR${traineeProfile.userId}-${sessionCodes}-CLEARED`;
  return {
    isUnified: true,
    passCode: `PASS-${todayIso.replace(/-/g, '')}-TR${traineeProfile.userId}`,
    qrToken,
    title: 'تصريح الدخول الأمني اليومي الموحد',
    courseName: todaySessions.value.length
      ? todaySessions.value.map((s) => s.round.courseName).join(' + ')
      : 'تصريح دخول عام لمرافق المعهد',
    locationInfo: todaySessions.value.length
      ? todaySessions.value.map((s) => `${s.round.hall.name} (${s.round.startTime}—${s.round.endTime})`).join(' | ')
      : 'بوابات ومرافق معهد نظم المعلومات',
    validityLabel: 'القرار: مصرح بالدخول (Allowed) — ساري المفعول اليوم (07:00 ص — 22:00 م)',
  };
});

// ============================================================
// المودالات والتكبير والطباعة
// ============================================================
const isZoomOpen = ref(false);
const isLogsOpen = ref(false);
const selectedZoomPass = ref(null);

function openZoomUnified() {
  selectedZoomPass.value = {
    ...unifiedPassData.value,
    round: todaySessions.value[0]?.round || passes.value[0]?.round,
  };
  isZoomOpen.value = true;
}

function openGateLogs() {
  isLogsOpen.value = true;
}

function handlePrintPass() {
  window.print();
}

// ============================================================
// Toast & النسخ
// ============================================================
const toast = ref({ text: '' });
let toastTimer = null;

function showToast(text) {
  toast.value = { text };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = { text: '' };
  }, 3000);
}

async function copyToken(token) {
  try {
    await navigator.clipboard.writeText(token);
    showToast('تم نسخ رمز التصريح الأمني الموحد (Unified QR Token)');
  } catch {
    showToast('تعذّر النسخ التلقائي — يمكنك تحديد الرمز يدوياً');
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

/* =========================================================
   QR Hero — الرمز كبطل الصفحة
   ========================================================= */
.qr-hero-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* =========================================================
   قواعد الطباعة الاحترافية لتصريح البوابة (Gate Pass Print Rules)
   ========================================================= */
@page {
  size: portrait;
  margin: 8mm;
}

@media print {
  *,
  *::before,
  *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html,
  body {
    background: #ffffff !important;
    color: #0b1e42 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* إخفاء كافة عناصر الموقع والأزرار والسايدبارات والصفحات الأخرى */
  body * {
    visibility: hidden !important;
  }

  /* إظهار ورقة التصريح الأمني الموحد فقط */
  #daily-gate-pass-print-target,
  #daily-gate-pass-print-target * {
    visibility: visible !important;
  }

  #daily-gate-pass-print-target {
    display: block !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    max-width: 195mm !important;
    margin: 0 auto !important;
    padding: 6mm 8mm !important;
    box-sizing: border-box !important;
    border: 2px solid #0b1e42 !important;
    border-radius: 12px !important;
    background: #ffffff !important;
    color: #0b1e42 !important;
    box-shadow: none !important;
    z-index: 2147483647 !important;
    page-break-inside: avoid !important;
    page-break-after: avoid !important;
  }

  .gate-pass-no-print {
    display: none !important;
  }
}
</style>
