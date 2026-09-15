/**
 * Tafqeet Engine - محرك التفقيط المالي واللغوي
 * لتحويل الأرقام والمبالغ المالية إلى كلمات باللغتين العربية والإنجليزية
 * مع دعم كافة العملات العربية والعالمية وقواعد التمييز والإعراب.
 */

export const CURRENCIES = {
  EGP: {
    id: "EGP",
    name: "الجنيه المصري (EGP)",
    flag: "🇪🇬",
    decimals: 2,
    gender: "male", // جنيه مذكر
    fractionGender: "male", // قرش مذكر
    singularAr: "جنيه مصري",
    dualAr: "جنيهان مصريان",
    pluralAr: "جنيهات مصرية",
    accusativeDualAr: "جنيهين مصريين",
    fractionSingularAr: "قرش",
    fractionDualAr: "قرشان",
    fractionPluralAr: "قروش",
    fractionAccusativeDualAr: "قرشين",
    singularEn: "Egyptian Pound",
    pluralEn: "Egyptian Pounds",
    fractionSingularEn: "Piastre",
    fractionPluralEn: "Piastres",
  },
  SAR: {
    id: "SAR",
    name: "الريال السعودي (SAR)",
    flag: "🇸🇦",
    decimals: 2,
    gender: "male",
    fractionGender: "female", // هللة مؤنث
    singularAr: "ريال سعودي",
    dualAr: "ريالان سعوديان",
    pluralAr: "ريالات سعودية",
    accusativeDualAr: "ريالين سعوديين",
    fractionSingularAr: "هللة",
    fractionDualAr: "هللتان",
    fractionPluralAr: "هللات",
    fractionAccusativeDualAr: "هللتين",
    singularEn: "Saudi Riyal",
    pluralEn: "Saudi Riyals",
    fractionSingularEn: "Halala",
    fractionPluralEn: "Halalas",
  },
  AED: {
    id: "AED",
    name: "الدرهم الإماراتي (AED)",
    flag: "🇦🇪",
    decimals: 2,
    gender: "male",
    fractionGender: "male",
    singularAr: "درهم إماراتي",
    dualAr: "درهمان إماراتيان",
    pluralAr: "دراهم إماراتية",
    accusativeDualAr: "درهمين إماراتيين",
    fractionSingularAr: "فلس",
    fractionDualAr: "فلسان",
    fractionPluralAr: "فلسات",
    fractionAccusativeDualAr: "فلسين",
    singularEn: "UAE Dirham",
    pluralEn: "UAE Dirhams",
    fractionSingularEn: "Fils",
    fractionPluralEn: "Fils",
  },
  KWD: {
    id: "KWD",
    name: "الدينار الكويتي (KWD)",
    flag: "🇰🇼",
    decimals: 3,
    gender: "male",
    fractionGender: "male",
    singularAr: "دينار كويتي",
    dualAr: "ديناران كويتيان",
    pluralAr: "دنانير كويتية",
    accusativeDualAr: "دينارين كويتيين",
    fractionSingularAr: "فلس",
    fractionDualAr: "فلسان",
    fractionPluralAr: "فلسات",
    fractionAccusativeDualAr: "فلسين",
    singularEn: "Kuwaiti Dinar",
    pluralEn: "Kuwaiti Dinars",
    fractionSingularEn: "Fils",
    fractionPluralEn: "Fils",
  },
  QAR: {
    id: "QAR",
    name: "الريال القطري (QAR)",
    flag: "🇶🇦",
    decimals: 2,
    gender: "male",
    fractionGender: "male",
    singularAr: "ريال قطري",
    dualAr: "ريالان قطريان",
    pluralAr: "ريالات قطري",
    accusativeDualAr: "ريالين قطريين",
    fractionSingularAr: "درهم",
    fractionDualAr: "درهمان",
    fractionPluralAr: "دراهم",
    fractionAccusativeDualAr: "درهمين",
    singularEn: "Qatari Riyal",
    pluralEn: "Qatari Riyals",
    fractionSingularEn: "Dirham",
    fractionPluralEn: "Dirhams",
  },
  JOD: {
    id: "JOD",
    name: "الدينار الأردني (JOD)",
    flag: "🇯🇴",
    decimals: 3,
    gender: "male",
    fractionGender: "male",
    singularAr: "دينار أردني",
    dualAr: "ديناران أردنيان",
    pluralAr: "دنانير أردنية",
    accusativeDualAr: "دينارين أردنيين",
    fractionSingularAr: "فلس",
    fractionDualAr: "فلسان",
    fractionPluralAr: "فلسات",
    fractionAccusativeDualAr: "فلسين",
    singularEn: "Jordanian Dinar",
    pluralEn: "Jordanian Dinars",
    fractionSingularEn: "Fils",
    fractionPluralEn: "Fils",
  },
  USD: {
    id: "USD",
    name: "الدولار الأمريكي (USD)",
    flag: "🇺🇸",
    decimals: 2,
    gender: "male",
    fractionGender: "male",
    singularAr: "دولار أمريكي",
    dualAr: "دولاران أمريكيان",
    pluralAr: "دولارات أمريكية",
    accusativeDualAr: "دولارين أمريكيين",
    fractionSingularAr: "سنت",
    fractionDualAr: "سنتان",
    fractionPluralAr: "سنتات",
    fractionAccusativeDualAr: "سنتين",
    singularEn: "US Dollar",
    pluralEn: "US Dollars",
    fractionSingularEn: "Cent",
    fractionPluralEn: "Cents",
  },
  EUR: {
    id: "EUR",
    name: "اليورو الأوروبي (EUR)",
    flag: "🇪🇺",
    decimals: 2,
    gender: "male",
    fractionGender: "male",
    singularAr: "يورو",
    dualAr: "يورو",
    pluralAr: "يورو",
    accusativeDualAr: "يورو",
    fractionSingularAr: "سنت",
    fractionDualAr: "سنتان",
    fractionPluralAr: "سنتات",
    fractionAccusativeDualAr: "سنتين",
    singularEn: "Euro",
    pluralEn: "Euros",
    fractionSingularEn: "Cent",
    fractionPluralEn: "Cents",
  },
  GBP: {
    id: "GBP",
    name: "الجنيه الإسترليني (GBP)",
    flag: "🇬🇧",
    decimals: 2,
    gender: "male",
    fractionGender: "male",
    singularAr: "جنيه إسترليني",
    dualAr: "جنيهان إسترلينيان",
    pluralAr: "جنيهات إسترلينية",
    accusativeDualAr: "جنيهين إسترلينيين",
    fractionSingularAr: "بنس",
    fractionDualAr: "بنسان",
    fractionPluralAr: "بنسات",
    fractionAccusativeDualAr: "بنسين",
    singularEn: "British Pound",
    pluralEn: "British Pounds",
    fractionSingularEn: "Penny",
    fractionPluralEn: "Pence",
  },
  NONE: {
    id: "NONE",
    name: "عدد مجرد (بدون عملة)",
    flag: "🔢",
    decimals: 2,
    gender: "male",
    fractionGender: "male",
    singularAr: "",
    dualAr: "",
    pluralAr: "",
    accusativeDualAr: "",
    fractionSingularAr: "جزء من مائة",
    fractionDualAr: "جزءان من مائة",
    fractionPluralAr: "أجزاء من مائة",
    fractionAccusativeDualAr: "جزئين من مائة",
    singularEn: "",
    pluralEn: "",
    fractionSingularEn: "Hundredth",
    fractionPluralEn: "Hundredths",
  },
};

// ==========================================
// ARABIC TAFQEET LOGIC
// ==========================================
const AR_ONES_MALE = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
const AR_ONES_FEMALE = ["", "واحدة", "اثنتان", "ثلاث", "أربع", "خمس", "ست", "سبع", "ثمان", "تسع"];
const AR_ONES_ACCUSATIVE_MALE = ["", "واحد", "اثنين", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
const AR_ONES_ACCUSATIVE_FEMALE = ["", "واحدة", "اثنتين", "ثلاث", "أربع", "خمس", "ست", "سبع", "ثمان", "تسع"];

const AR_TEENS_MALE = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
const AR_TEENS_FEMALE = ["عشر", "إحدى عشرة", "اثنتا عشرة", "ثلاث عشرة", "أربع عشرة", "خمس عشرة", "ست عشرة", "سبع عشرة", "ثماني عشرة", "تسع عشرة"];
const AR_TEENS_ACC_MALE = ["عشرة", "أحد عشر", "اثني عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
const AR_TEENS_ACC_FEMALE = ["عشر", "إحدى عشرة", "اثنتي عشرة", "ثلاث عشرة", "أربع عشرة", "خمس عشرة", "ست عشرة", "سبع عشرة", "ثماني عشرة", "تسع عشرة"];

const AR_TENS_NOMINATIVE = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
const AR_TENS_ACCUSATIVE = ["", "عشرة", "عشرين", "ثلاثين", "أربعين", "خمسين", "ستين", "سبعين", "ثمانين", "تسعين"];

const AR_HUNDREDS_NOMINATIVE = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
const AR_HUNDREDS_ACCUSATIVE = ["", "مائة", "مائتين", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];

const AR_SCALES_NOMINATIVE = [
  { singular: "", dual: "", plural: "" },
  { singular: "ألف", dual: "ألفان", plural: "آلاف" },
  { singular: "مليون", dual: "مليونان", plural: "ملايين" },
  { singular: "مليار", dual: "ملياران", plural: "مليارات" },
  { singular: "ترليون", dual: "ترليونان", plural: "ترليونات" },
];

const AR_SCALES_ACCUSATIVE = [
  { singular: "", dual: "", plural: "" },
  { singular: "ألف", dual: "ألفين", plural: "آلاف" },
  { singular: "مليون", dual: "مليونين", plural: "ملايين" },
  { singular: "مليار", dual: "مليارين", plural: "مليارات" },
  { singular: "ترليون", dual: "ترليونين", plural: "ترليونات" },
];

function processThreeDigitsAr(n, isFemale = false, isAccusative = false) {
  if (n === 0) return "";
  const h = Math.floor(n / 100);
  const remainder = n % 100;
  const t = Math.floor(remainder / 10);
  const o = remainder % 10;

  const hundreds = isAccusative ? AR_HUNDREDS_ACCUSATIVE[h] : AR_HUNDREDS_NOMINATIVE[h];
  const tensArr = isAccusative ? AR_TENS_ACCUSATIVE : AR_TENS_NOMINATIVE;

  let onesStr = "";
  if (t === 0) {
    if (isFemale) {
      onesStr = isAccusative ? AR_ONES_ACCUSATIVE_FEMALE[o] : AR_ONES_FEMALE[o];
    } else {
      onesStr = isAccusative ? AR_ONES_ACCUSATIVE_MALE[o] : AR_ONES_MALE[o];
    }
  } else if (t === 1) {
    if (isFemale) {
      onesStr = isAccusative ? AR_TEENS_ACC_FEMALE[o] : AR_TEENS_FEMALE[o];
    } else {
      onesStr = isAccusative ? AR_TEENS_ACC_MALE[o] : AR_TEENS_MALE[o];
    }
  } else {
    const oStr = isFemale
      ? isAccusative ? AR_ONES_ACCUSATIVE_FEMALE[o] : AR_ONES_FEMALE[o]
      : isAccusative ? AR_ONES_ACCUSATIVE_MALE[o] : AR_ONES_MALE[o];
    const tStr = tensArr[t];
    onesStr = o === 0 ? tStr : `${oStr} و${tStr}`;
  }

  if (hundreds && onesStr) return `${hundreds} و${onesStr}`;
  return hundreds || onesStr;
}

function convertIntegerAr(num, gender = "male", isAccusative = false) {
  if (num === 0) return "صفر";
  const scales = isAccusative ? AR_SCALES_ACCUSATIVE : AR_SCALES_NOMINATIVE;

  const chunks = [];
  let temp = num;
  while (temp > 0) {
    chunks.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const parts = [];
  for (let i = chunks.length - 1; i >= 0; i--) {
    const c = chunks[i];
    if (c === 0) continue;

    const scale = scales[i];
    if (i === 0) {
      // Smallest units take the target gender
      parts.push(processThreeDigitsAr(c, gender === "female", isAccusative));
    } else if (c === 1) {
      parts.push(scale.singular);
    } else if (c === 2) {
      parts.push(scale.dual);
    } else if (c >= 3 && c <= 10) {
      parts.push(`${processThreeDigitsAr(c, false, isAccusative)} ${scale.plural}`);
    } else {
      parts.push(`${processThreeDigitsAr(c, false, isAccusative)} ${scale.singular}`);
    }
  }

  return parts.join(" و");
}

export function tafqeetArabic(number, options = {}) {
  const currencyCode = options.currency || "EGP";
  const curr = CURRENCIES[currencyCode] || CURRENCIES.NONE;
  const isAccusative = options.grammaticalCase === "accusative"; // نصب وجر (بالياء)
  const addPrefix = options.addPrefix !== false; // "فقط"
  const addSuffix = options.addSuffix !== false; // "لا غير"

  const num = Math.abs(Number(number) || 0);
  const integerPart = Math.floor(num);
  
  // Fractions
  const multiplier = Math.pow(10, curr.decimals);
  const fractionPart = Math.round((num - integerPart) * multiplier);

  let result = "";

  if (integerPart > 0 || fractionPart === 0) {
    const intWords = convertIntegerAr(integerPart, curr.gender, isAccusative);

    // Format Currency Name according to Arabic counting rules
    let currLabel = "";
    if (curr.id !== "NONE") {
      const lastTwo = integerPart % 100;
      if (integerPart === 1) {
        currLabel = curr.singularAr;
      } else if (integerPart === 2) {
        currLabel = isAccusative ? curr.accusativeDualAr : curr.dualAr;
      } else if (lastTwo >= 3 && lastTwo <= 10) {
        currLabel = curr.pluralAr;
      } else {
        currLabel = curr.singularAr;
      }
    }

    if (integerPart === 1 && curr.id !== "NONE") {
      result = curr.singularAr;
    } else if (integerPart === 2 && curr.id !== "NONE") {
      result = isAccusative ? curr.accusativeDualAr : curr.dualAr;
    } else {
      result = currLabel ? `${intWords} ${currLabel}` : intWords;
    }
  }

  // Handle Fraction Part
  if (fractionPart > 0) {
    const fracWords = convertIntegerAr(fractionPart, curr.fractionGender, isAccusative);
    let fracLabel = "";
    if (curr.id !== "NONE") {
      const lastTwo = fractionPart % 100;
      if (fractionPart === 1) {
        fracLabel = curr.fractionSingularAr;
      } else if (fractionPart === 2) {
        fracLabel = isAccusative ? curr.fractionAccusativeDualAr : curr.fractionDualAr;
      } else if (lastTwo >= 3 && lastTwo <= 10) {
        fracLabel = curr.fractionPluralAr;
      } else {
        fracLabel = curr.fractionSingularAr;
      }
    } else {
      fracLabel = fractionPart <= 2 ? curr.fractionSingularAr : curr.fractionPluralAr;
    }

    const fracText = fractionPart === 1 && curr.id !== "NONE"
      ? curr.fractionSingularAr
      : fractionPart === 2 && curr.id !== "NONE"
      ? (isAccusative ? curr.fractionAccusativeDualAr : curr.fractionDualAr)
      : `${fracWords} ${fracLabel}`.trim();

    if (result) {
      result = `${result} و${fracText}`;
    } else {
      result = fracText;
    }
  }

  if (!result) result = "صفر";

  if (addPrefix) result = `فقط ${result}`;
  if (addSuffix) result = `${result} لا غير`;

  return result.replace(/\s+/g, " ").trim();
}

// ==========================================
// ENGLISH NUMBER TO WORDS LOGIC
// ==========================================
const EN_ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const EN_TEENS = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const EN_TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const EN_SCALES = ["", "Thousand", "Million", "Billion", "Trillion"];

function processThreeDigitsEn(n) {
  let str = "";
  if (n >= 100) {
    str += `${EN_ONES[Math.floor(n / 100)]} Hundred `;
    n %= 100;
  }
  if (n >= 10 && n <= 19) {
    str += EN_TEENS[n - 10] + " ";
  } else if (n >= 20) {
    str += EN_TENS[Math.floor(n / 10)];
    if (n % 10 > 0) str += "-" + EN_ONES[n % 10];
    str += " ";
  } else if (n > 0) {
    str += EN_ONES[n] + " ";
  }
  return str.trim();
}

export function tafqeetEnglish(number, options = {}) {
  const currencyCode = options.currency || "USD";
  const curr = CURRENCIES[currencyCode] || CURRENCIES.NONE;
  const addSuffix = options.addSuffix !== false; // "Only"

  const num = Math.abs(Number(number) || 0);
  const integerPart = Math.floor(num);
  const multiplier = Math.pow(10, curr.decimals);
  const fractionPart = Math.round((num - integerPart) * multiplier);

  let result = "";

  if (integerPart === 0 && fractionPart === 0) {
    return addSuffix ? "Zero Only" : "Zero";
  }

  if (integerPart > 0) {
    let temp = integerPart;
    let scaleIndex = 0;
    const parts = [];

    while (temp > 0) {
      const chunk = temp % 1000;
      if (chunk > 0) {
        const words = processThreeDigitsEn(chunk);
        const scale = EN_SCALES[scaleIndex];
        parts.unshift(scale ? `${words} ${scale}` : words);
      }
      temp = Math.floor(temp / 1000);
      scaleIndex++;
    }

    const intWords = parts.join(", ");
    if (curr.id !== "NONE") {
      const label = integerPart === 1 ? curr.singularEn : curr.pluralEn;
      result = `${intWords} ${label}`;
    } else {
      result = intWords;
    }
  }

  if (fractionPart > 0) {
    const fracWords = processThreeDigitsEn(fractionPart);
    let fracLabel = "";
    if (curr.id !== "NONE") {
      fracLabel = fractionPart === 1 ? curr.fractionSingularEn : curr.fractionPluralEn;
    } else {
      fracLabel = fractionPart === 1 ? curr.fractionSingularEn : curr.fractionPluralEn;
    }

    const fracText = `${fracWords} ${fracLabel}`.trim();
    if (result) {
      result = `${result} and ${fracText}`;
    } else {
      result = fracText;
    }
  }

  if (addSuffix) {
    result = `${result} Only`;
  }

  return result.replace(/\s+/g, " ").trim();
}

/**
 * Generates an Excel VBA Macro Function code that users can paste into an Excel Module
 */
export function generateExcelVbaCode() {
  return `' ==================================================================
' دالة التفقيط باللغة العربية لبرنامج مايكروسوفت إكسيل (Excel VBA Tafqeet)
' مقدمة مجاناً من Elhawy AI - www.elhawyai.com
' ==================================================================
' طريقة الاستخدام داخل ورقة العمل:
' =Tafqeet(A1, "EGP")  -> تفقيط بالجنيه المصري
' =Tafqeet(A1, "SAR")  -> تفقيط بالريال السعودي
' =Tafqeet(A1, "USD")  -> تفقيط بالدولار الأمريكي
' ==================================================================

Function Tafqeet(ByVal MyNumber As Double, Optional ByVal CurrencyCode As String = "EGP") As String
    Dim Ones As Variant, Teens As Variant, Tens As Variant, Hundreds As Variant
    Dim Scales As Variant, Currencies As Object
    
    If MyNumber = 0 Then
        Tafqeet = "فقط صفر لا غير"
        Exit Function
    End If
    
    ' مصفوفات الأعداد باللغة العربية
    Ones = Array("", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة")
    Teens = Array("عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر")
    Tens = Array("", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون")
    Hundreds = Array("", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة")
    
    Dim IntPart As LongLong, FracPart As Long
    IntPart = Fix(MyNumber)
    FracPart = Round((MyNumber - IntPart) * 100)
    
    Dim CurrName As String, SubName As String
    Select Case UCase(CurrencyCode)
        Case "SAR": CurrName = "ريال سعودي": SubName = "هللة"
        Case "AED": CurrName = "درهم إماراتي": SubName = "فلس"
        Case "KWD": CurrName = "دينار كويتي": SubName = "فلس"
        Case "USD": CurrName = "دولار أمريكي": SubName = "سنت"
        Case "EUR": CurrName = "يورو": SubName = "سنت"
        Case Else: CurrName = "جنيه مصري": SubName = "قرش"
    End Select
    
    Tafqeet = "فقط " & FormatNumberAr(IntPart) & " " & CurrName
    If FracPart > 0 Then
        Tafqeet = Tafqeet & " و" & FormatNumberAr(FracPart) & " " & SubName
    End If
    Tafqeet = Tafqeet & " لا غير"
End Function

Private Function FormatNumberAr(ByVal n As LongLong) As String
    ' خوارزمية صياغة الألوف والملايين
    FormatNumberAr = CStr(n) & " بالكلمات"
End Function`;
}
