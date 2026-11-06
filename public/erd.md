# ERD — منظومة إدارة الدورات التدريبية (النسخة النهائية المعتمدة)

> [!NOTE]
> **أبرز القرارات التصميمية المعتمدة والتكامل مع الواجهات (UI Alignment):**
> - **فصل كورس الكتالوج (`Courses`) عن دورة الانعقاد الفعلية (`CourseRounds`):** الشؤون تنشئ كتالوج الدورة وأسعارها وساعاتها ومجالها التخصصي، ثم تفتح دورات انعقاد (دفعات تشغيلية) متعددة بتواريخ وقاعات ومحاضرين وأكواد دفعات مستقلة.
> - **كود فريد للطلب (`ApplicationCode`):** كود فريد ومختصر للطلب مكس حروف وأرقام عشوائية (مثال: `APP-7X9K2`) لتسهيل متابعة المتدرب واستعلام موظف الشؤون والخزينة عنه هاتفياً وبشكل مباشر، إلى جانب الـ `QRToken` المخصص لتصاريح البوابة.
> - **إلغاء تعقيدات استبيانات الجودة وتوثيق السجل الأكاديمي:** تم تبسيط نموذج المحاضرين (`Instructors`) للتركيز على البيانات العملية (الاسم، التخصص، الهاتف، البريد، النشاط) وإلغاء جداول وحقول استبيانات الجودة والتقييمات للدارسين والمحاضرين.
> - **دورة حياة الطلب والسداد والشهادة (`Applications`):** توثيق سبب الرفض (`RejectionReason`)، تاريخ السداد الفعلي (`PaymentDate`)، صورة إيصال الخزينة (`ReceiptPhotoPath`)، كود الشهادة المعتمدة (`CertificateCode`)، والدرجة النهائية (`FinalGrade`).
> - **الحضور والأمن:** يُحسب مباشرة من `GateLogs` باستخدام `COUNT(DISTINCT Date)` بدون تكرار في نفس اليوم.

---

## مخطط العلاقات الكامل (Entity Relationship Diagram)

```mermaid
erDiagram
    Users ||--o| TraineeProfiles : "has profile (for trainees)"
    Users ||--o{ Applications : "trainee applies"
    Users ||--o{ AuditLogs : "action by user"
    Users ||--o{ GateLogs : "scanned by security"

    Courses ||--o{ CoursePricings : "pricing per category"
    Courses ||--o{ CourseRounds : "has cohorts/rounds"

    Instructors ||--o{ CourseRounds : "teaches round"
    Halls ||--o{ CourseRounds : "hosts round"
    CourseRounds ||--o{ CourseLectureDays : "lecture days of week"
    CourseRounds ||--o{ Applications : "applications to round"

    Applications ||--o{ AuditLogs : "lifecycle tracking"
    Applications ||--o{ GateLogs : "gate scan attempts"

    Users {
        int Id PK
        string Email UK
        string PasswordHash
        string FullName
        string Phone
        string Role "Admin|Trainee|Affairs|Security|Commander"
        string ProfilePhotoPath "nullable"
        bool IsActive
        datetime CreatedAt
    }

    TraineeProfiles {
        int Id PK
        int UserId FK UK
        string NationalId UK "14 digits"
        string NationalIdFrontPhotoPath "صورة وش البطاقة"
        string NationalIdBackPhotoPath "صورة ظهر البطاقة"
        date DateOfBirth "تاريخ الميلاد"
        string Gender "Male|Female"
        string Religion "Muslim|Christian|Other"
        string MaritalStatus "Single|Married|Divorced|Widowed"
        string Occupation "المهنة المدونة بالبطاقة"
        string Address "العنوان المدون بالبطاقة"
        string Governorate "المحافظة"
        date NationalIdExpiryDate "تاريخ انتهاء سريان البطاقة"
        string Category "Civilian|MilitaryOfficer|MilitaryFamily|PoliceOfficerOrFamily"
        string CategoryProofPhotoPath "nullable - كارنيه إثبات الفئة"
    }

    Halls {
        int Id PK
        string Name UK
        string Type "Hall|Lab"
        int MaxCapacity
        string Location "المبنى والدور"
        string Equipment "التجهيزات الفنية"
        string MapPositionJson
        bool IsActive
    }

    Instructors {
        int Id PK
        string Name "اسم المحاضر"
        string Specialty "التخصص العلمي"
        string Phone "رقم الهاتف"
        string Email "nullable"
        bool IsActive "حالة النشاط والاعتماد"
    }

    Courses {
        int Id PK
        string Code "nullable UK كود الكورس"
        string Name "اسم الدورة بالكتالوج"
        string Domain "المجال التخصصي"
        string Description "الوصف والمحتوى"
        int TotalHours "الساعات التدريبية المعتمدة"
        int PassingGrade "نسبة النجاح الدنيا"
        bool IsActive
        datetime CreatedAt
    }

    CoursePricings {
        int Id PK
        int CourseId FK
        string TraineeCategory "Civilian|MilitaryOfficer|MilitaryFamily|PoliceOfficerOrFamily"
        decimal Price "السعر المعتمد للفئة"
    }

    CourseRounds {
        int Id PK
        int CourseId FK
        int RoundNumber "رقم الدفعة"
        string RoundCode "UK كود الدفعة مثل CR-1-14"
        int InstructorId FK
        int HallId FK
        int Capacity "السعة القصوى للدفعة"
        date StartDate "تاريخ البداية"
        date EndDate "تاريخ النهاية"
        date LastApplicationDate "آخر موعد للتقديم"
        time StartTime "وقت بدء المحاضرة"
        time EndTime "وقت انتهاء المحاضرة"
        decimal InstructorCost "تكلفة المحاضر للأثر المالي"
        int TotalLectures "إجمالي المحاضرات"
        string Status "Available|Full|Ongoing|Ended"
        datetime CreatedAt
    }

    CourseLectureDays {
        int Id PK
        int CourseRoundId FK
        string DayOfWeek "Sat|Sun|Mon|Tue|Wed|Thu|Fri"
    }

    Applications {
        int Id PK
        int TraineeId FK "Users.Id"
        int CourseRoundId FK "CourseRounds.Id"
        string ApplicationCode UK "كود فريد مكس حروف وأرقام مثل APP-7X9K2"
        string Status "UnderReview|PendingPayment|PaymentMissed|Enrolled|CourseEnded|Rejected"
        string QRToken UK "Random GUID Token"
        string QualificationPhotoPath "صورة شهادة المؤهل"
        string RejectionReason "nullable سبب الرفض"
        date PaymentDueDate "nullable مهلة السداد"
        datetime PaymentDate "nullable تاريخ السداد الفعلي"
        string ReceiptNumber UK "nullable رقم الإيصال"
        string ReceiptPhotoPath "nullable صورة إيصال السداد"
        decimal PaidAmount "nullable المبلغ المسدد"
        string CertificateCode "nullable UK كود الشهادة"
        decimal FinalGrade "nullable النسبة المئوية للتقييم"
        bool IsCertificateIssued "إصدار الشهادة"
        int ExtensionCount "مرات تمديد المهلة"
        datetime CreatedAt
        datetime UpdatedAt
    }

    AuditLogs {
        int Id PK
        int ApplicationId FK
        string FromStatus
        string ToStatus
        int ChangedByUserId FK "nullable - null = النظام"
        datetime ChangedAt
        string Note "nullable"
    }

    GateLogs {
        int Id PK
        string QRToken
        int ApplicationId FK "nullable"
        int ScannedByUserId FK "فرد الأمن"
        datetime ScannedAt
        string Decision "Allowed|Denied"
        string Reason "سبب القرار"
    }
```

---

## تفاصيل الجداول والحقول (Schema Definitions)

### 1. `Users` (المستخدمون والحسابات)
| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `Email` | `nvarchar(255)` | Unique, Not Null |
| `PasswordHash` | `nvarchar(max)` | Not Null (BCrypt/Argon2) |
| `FullName` | `nvarchar(255)` | الاسم الرباعي |
| `Phone` | `nvarchar(20)` | رقم الهاتف للتواصل |
| `Role` | `nvarchar(50)` | `Admin`, `Trainee`, `Affairs`, `Security`, `Commander` |
| `ProfilePhotoPath` | `nvarchar(500)` | Nullable — صورة شخصية لأي مستخدم (تظهر للأمن عند المسح وفي بروفايل المتدرب) |
| `IsActive` | `bit` | Default `1` (لا يوجد حذف نهائي، فقط تعطيل) |
| `CreatedAt` | `datetime2` | تاريخ إنشاء الحساب |

---

### 2. `TraineeProfiles` (ملف المتدرب وبيانات البطاقة)
*(علاقة 1-to-1 مع جدول `Users` خاصة برتبة المتدرب)*

| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `UserId` | `int` FK | Unique, Not Null -> `Users.Id` |
| `NationalId` | `nvarchar(14)` | Unique, Not Null (14 رقم قومي مصري) |
| `NationalIdFrontPhotoPath` | `nvarchar(500)` | مسار صورة وجه البطاقة الشخصية |
| `NationalIdBackPhotoPath` | `nvarchar(500)` | مسار صورة ظهر البطاقة الشخصية |
| `DateOfBirth` | `date` | تاريخ الميلاد (مستخرج من الرقم القومي / البطاقة) |
| `Gender` | `nvarchar(10)` | `Male`, `Female` (مستخرج) |
| `Religion` | `nvarchar(20)` | `Muslim`, `Christian`, `Other` (مستخرج من ظهر البطاقة) |
| `MaritalStatus` | `nvarchar(20)` | `Single`, `Married`, `Divorced`, `Widowed` (مستخرج من ظهر البطاقة) |
| `Occupation` | `nvarchar(150)` | المهنة والوظيفة المدونة في البطاقة |
| `Address` | `nvarchar(300)` | العنوان المدون بالبطاقة |
| `Governorate` | `nvarchar(100)` | المحافظة (تُستخدم لخريطة توزيع المتدربين في لوحة القائد وتفاصيل المتدرب) |
| `NationalIdExpiryDate` | `date` | تاريخ انتهاء سريان البطاقة المدون بالظهر |
| `Category` | `nvarchar(50)` | `Civilian`, `MilitaryOfficer`, `MilitaryFamily`, `PoliceOfficerOrFamily` |
| `CategoryProofPhotoPath` | `nvarchar(500)` | مسار صورة كارنيه إثبات الفئة / صلة القرابة (إلزامي للخصومات) |

---

### 3. `Halls` (القاعات والمعامل)
| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `Name` | `nvarchar(100)` | Unique, Not Null — اسم القاعة أو المعمل (مثلاً: معمل الأمن السيبراني 1) |
| `Type` | `nvarchar(50)` | `Hall` (قاعة محاضرات كبرى)، `Lab` (معمل حواسب تخصصي) |
| `MaxCapacity` | `int` | أقصى سعة استيعابية مقعدية |
| `Location` | `nvarchar(150)` | Nullable — الموقع الجغرافي داخل المعهد (المبنى، الطابق) |
| `Equipment` | `nvarchar(max)` | Nullable — وصف التجهيزات المتوفرة (أجهزة كمبيوتر، شاشات تفاعلية، أجهزة شبكات) |
| `MapPositionJson` | `nvarchar(max)` | إحداثيات القاعة على المخطط التخطيطي للمعهد `{x, y, w, h}` |
| `IsActive` | `bit` | Default `1` |

---

### 4. `Instructors` (المحاضرون وهيئة التدريس)
| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `Name` | `nvarchar(255)` | Not Null — اسم المحاضر ثلاثي أو رباعي |
| `Specialty` | `nvarchar(150)` | Not Null — التخصص العلمي والأكاديمي |
| `Phone` | `nvarchar(20)` | Not Null — رقم هاتف التواصل المعتمد (11 رقماً مصرياً) |
| `Email` | `nvarchar(255)` | Nullable — البريد الإلكتروني المهني للتواصل وإرسال التكليفات |
| `IsActive` | `bit` | Default `1` — حالة الاعتماد والنشاط (محمي من الحذف النهائي عند وجود دورات مسندة) |

---

### 5. `Courses` (كتالوج الدورات الأساسي)
| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `Code` | `nvarchar(50)` | Unique, Nullable — كود الدورة المرجعي بالكتالوج (مثلاً `CRS-CYBER-01`) |
| `Name` | `nvarchar(255)` | Not Null — اسم الدورة في الكتالوج المعتمد |
| `Domain` | `nvarchar(100)` | Nullable — المجال التخصصي (أمن سيبراني، تحليل بيانات، إدارة مشروعات، شبكات، ويب...) |
| `Description` | `nvarchar(max)` | توصيف الدورة ومحتواها والمهارات المكتسبة |
| `TotalHours` | `int` | Default `40` — إجمالي الساعات التدريبية المعتمدة للدورة (أساسي لإصدار الشهادات) |
| `PassingGrade` | `int` | Default `60` — النسبة المئوية الصغرى للنجاح واجتياز الدورة والحصول على الشهادة |
| `IsActive` | `bit` | Default `1` |
| `CreatedAt` | `datetime2` | تاريخ الإضافة |

---

### 6. `CoursePricings` (أسعار الدورة حسب فئة المتدرب)
| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `CourseId` | `int` FK | -> `Courses.Id` |
| `TraineeCategory` | `nvarchar(50)` | `Civilian`, `MilitaryOfficer`, `MilitaryFamily`, `PoliceOfficerOrFamily` |
| `Price` | `decimal(18,2)` | السعر بالجنيه المصري (قيد فريد على `CourseId` + `TraineeCategory`) |

---

### 7. `CourseRounds` (دورات الانعقاد / الدفعات التشغيلية)
| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `CourseId` | `int` FK | -> `Courses.Id` |
| `RoundNumber` | `int` | رقم الدفعة التلقائي المتصاعد لكورس معين (الدفعة 1، 2، 3...) |
| `RoundCode` | `nvarchar(50)` | Unique, Nullable — كود الدفعة الرسمي المرجعي بالمنظومة (مثلاً `CR-1-14`) |
| `InstructorId` | `int` FK | -> `Instructors.Id` |
| `HallId` | `int` FK | -> `Halls.Id` |
| `Capacity` | `int` | سعة الدفعة (شرط: لا تتعدى `Hall.MaxCapacity`) |
| `StartDate` | `date` | تاريخ البداية الفعلي للدورة |
| `EndDate` | `date` | تاريخ النهاية الفعلي للدورة |
| `LastApplicationDate` | `date` | آخر موعد لاستقبال طلبات التقديم الإلكتروني |
| `StartTime` | `time` | موعد بدء المحاضرة اليومية (مثلاً `09:00:00`) |
| `EndTime` | `time` | موعد انتهاء المحاضرة اليومية (مثلاً `13:00:00`) |
| `InstructorCost` | `decimal(18,2)` | Nullable — أتعاب وتكلفة المحاضر المعتمدة للدفعة (لحساب الأثر المالي وصافي الربح) |
| `TotalLectures` | `int` | Nullable — إجمالي عدد المحاضرات المجدولة المنفذة بالدفعة |
| `Notes` | `nvarchar(max)` | Nullable — تعليمات وملاحظات تشغيلية خاصة بالقاعة أو الدفعة |
| `Status` | `nvarchar(50)` | `Available`, `Full`, `Ongoing`, `Ended` (تحديث دوري بالـ Job أو الشؤون) |
| `CreatedAt` | `datetime2` | تاريخ فتح الدفعة |

---

### 8. `CourseLectureDays` (أيام محاضرات الدفعة)
| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `CourseRoundId` | `int` FK | -> `CourseRounds.Id` |
| `DayOfWeek` | `nvarchar(20)` | `Sat`, `Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri` |

---

### 9. `Applications` (طلبات الالتحاق وتصاريح QR والشهادات)
| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `TraineeId` | `int` FK | -> `Users.Id` |
| `CourseRoundId` | `int` FK | -> `CourseRounds.Id` |
| `ApplicationCode` | `nvarchar(20)` | Unique, Not Null — كود فريد ومختصر للطلب، مزيج عشوائي من الحروف والأرقام (مثال: `APP-7X9K2` أو `APP-9B4M8`) لتسهيل متابعة المتدرب واستعلام موظف الشؤون والخزينة |
| `Status` | `nvarchar(50)` | `UnderReview`, `PendingPayment`, `PaymentMissed`, `Enrolled`, `CourseEnded`, `Rejected` |
| `QRToken` | `nvarchar(100)` | Unique, Not Null — رمز عشوائي GUID لإصدار كود الـ QR المشفر للتصريح الأمني عند البوابة |
| `QualificationPhotoPath` | `nvarchar(500)` | صورة شهادة المؤهل الدراسي الخاصة بالتقديم الحالي |
| `RejectionReason` | `nvarchar(500)` | Nullable — سبب الرفض المعتمد من موظف الشؤون في حال رفض الطلب |
| `PaymentDueDate` | `date` | Nullable — مهلة السداد المحددة من الشؤون (ساري فيها QR للسداد بالخزينة) |
| `PaymentDate` | `datetime2` | Nullable — تاريخ وتوقيت السداد الفعلي بالخزينة |
| `ReceiptNumber` | `nvarchar(100)` | Unique, Nullable — رقم إيصال سداد الخزينة المسجل |
| `ReceiptPhotoPath` | `nvarchar(500)` | Nullable — مسار صورة إيصال السداد الورقي الصادر من الخزينة |
| `PaidAmount` | `decimal(18,2)` | Nullable — المبلغ المالي المسدد فعلياً (يساوي سعر فئة المتدرب المعتمد) |
| `CertificateCode` | `nvarchar(100)` | Unique, Nullable — كود الشهادة المعتمدة الممنوحة بعد التخرج (مثل `CERT-2026-0812`) |
| `FinalGrade` | `decimal(5,2)` | Nullable — الدرجة النهائية أو النسبة المئوية للتقييم الأكاديمي للمتدرب بالدورة |
| `IsCertificateIssued` | `bit` | Default `0` — حالة إصدار وطباعة الشهادة الرسمية للخريج |
| `ExtensionCount` | `int` | Default `0` — عدد مرات تمديد مهلة السداد الاستثنائية بطلب الشؤون |
| `CreatedAt` | `datetime2` | وقت التقديم الإلكتروني |
| `UpdatedAt` | `datetime2` | آخر تحديث لسجل الطلب |

---

### 10. `AuditLogs` (سجل التدقيق والحركات)
| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `ApplicationId` | `int` FK | -> `Applications.Id` |
| `FromStatus` | `nvarchar(50)` | الحالة السابقة للطلب |
| `ToStatus` | `nvarchar(50)` | الحالة الجديدة المعتمدة |
| `ChangedByUserId` | `int` FK | Nullable -> `Users.Id` (`null` = النظام تلقائياً عبر Background Job) |
| `ChangedAt` | `datetime2` | التوقيت الدقيق للحركة |
| `Note` | `nvarchar(500)` | ملاحظات الإجراء أو سبب التغيير |

*(جدول Append-Only لا يقبل التعديل أو الحذف نهائياً)*

---

### 11. `GateLogs` (سجل حركات البوابة والحضور)
| الحقل | النوع | القيود والملاحظات |
|---|---|---|
| `Id` | `int` PK | Identity |
| `QRToken` | `nvarchar(100)` | الكود الممسوح بالكاميرا أو المدخل يدوياً بواسطة الأمن |
| `ApplicationId` | `int` FK | Nullable -> `Applications.Id` (يُربط إذا كان الكود معروفاً بالمنظومة) |
| `ScannedByUserId` | `int` FK | -> `Users.Id` (فرد الأمن القائم بالمسح على البوابة) |
| `ScannedAt` | `datetime2` | توقيت المسح (بتوقيت القاهرة) |
| `Decision` | `nvarchar(20)` | `Allowed`, `Denied` |
| `Reason` | `nvarchar(300)` | السبب المسجل في القرار الأمني |

---

> [!TIP]
> **معادلة حساب الحضور الإحصائية:**
> ```sql
> -- نسبة الحضور = (عدد الأيام الفريدة المنقضية التي سُجل فيها حضور Allowed) ÷ (عدد أيام المحاضرات المجدولة حتى تاريخ اليوم)
> SELECT COUNT(DISTINCT CAST(ScannedAt AS DATE)) 
> FROM GateLogs 
> WHERE ApplicationId = @AppId AND Decision = 'Allowed' AND CAST(ScannedAt AS DATE) <= @Today;
> ```
