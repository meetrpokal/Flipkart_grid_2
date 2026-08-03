"""multilingual.py — Multilingual Nudge & Recommendation Generator for Flipkart ML Platform"""

from __future__ import annotations
from typing import Dict, Any, Optional

SUPPORTED_LANGUAGES = {
    "English": "English",
    "Hindi": "Hindi (हिंदी)",
    "Bengali": "Bengali (বাংলা)",
    "Tamil": "Tamil (தமிழ்)",
    "Telugu": "Telugu (తెలుగు)",
    "Kannada": "Kannada (ಕನ್ನಡ)",
    "Marathi": "Marathi (मराठी)",
    "Gujarati": "Gujarati (ગુજરાતી)"
}

MULTILINGUAL_DICTIONARY: Dict[str, Dict[str, str]] = {
    "Hindi": {
        "Offer no-cost EMI options at checkout.": "चेकआउट पर नो-कॉस्ट ईएमआई (No-cost EMI) विकल्प प्रदान करें।",
        "Highlight 100% Flipkart Assured buyer protection and easy 7-day returns.": "100% फ्लिपकार्ट एश्योर्ड (Flipkart Assured) खरीदार सुरक्षा और आसान 7-दिन की वापसी का प्रदर्शन करें।",
        "Waive delivery charges dynamically for carts above threshold or offer instant free shipping.": "न्यूनतम कार्ट राशि पर तुरंत मुफ्त डिलीवरी (Free Shipping) का लाभ दें।",
        "Display a 15-minute price lock timer to create urgency without discount erosion.": "बिना छूट दिए जल्द खरीदारी के लिए 15 मिनट का प्राइस लॉक टाइमर दिखाएं।",
        "Offer a small flat ₹100 instant bank discount or UPI cashback.": "यूपीआई या कार्ड से तुरंत ₹100 की सीधी छूट या कैशबैक ऑफर प्रदान करें।",
        "Show real-time stock alert: 'Only 3 items left in stock — 45 users viewing right now'.": "स्टॉक अलर्ट दिखाएं: 'केवल 3 आइटम बचे हैं — 45 ग्राहक अभी इसे देख रहे हैं'।",
        "Highlight guaranteed express delivery by tomorrow evening.": "कल शाम तक गारंटीड एक्सप्रेस डिलीवरी की जानकारी दें।",
        "Trigger a standard cart abandonment reminder notification after 24 hours.": "24 घंटे के बाद कार्ट रीमाइंडर नोटिफिकेशन भेजें।",
    },
    "Bengali": {
        "Offer no-cost EMI options at checkout.": "চেকআউটে নো-কস্ট ইএমআই (No-cost EMI) অপশন অফার করুন।",
        "Highlight 100% Flipkart Assured buyer protection and easy 7-day returns.": "১০০% ফ্লিপকার্ট অ্যাসিওর সুরক্ষা এবং সহজ ৭ দিনের রিটার্ন গ্যারান্টি দেখান।",
        "Waive delivery charges dynamically for carts above threshold or offer instant free shipping.": "বিনামূল্যে ডেলিভারির সুবিধা দিন এবং ডেলিভারি চার্জ সম্পূর্ণ মুকুব করুন।",
        "Display a 15-minute price lock timer to create urgency without discount erosion.": "১৫ মিনিটের দাম লক টাইমার বানিয়ে দ্রুত কেনাকাটার তাগিদ তৈরি করুন।",
        "Offer a small flat ₹100 instant bank discount or UPI cashback.": "ইউপিআই বা ব্যাঙ্ক কার্ড ব্যবহারে ১০০ টাকা তাতক্ষণিক ক্যাশব্যাক দিন।",
        "Show real-time stock alert: 'Only 3 items left in stock — 45 users viewing right now'.": "লাইভ স্টক সতর্কতা: 'মাত্র ৩টি বাকি আছে — ৪৫ জন গ্রাহক এখন এটি দেখছেন'।",
        "Highlight guaranteed express delivery by tomorrow evening.": "আগামীকাল সন্ধ্যার মধ্যে নিশ্চিত এক্সপ্রেস ডেলিভারির সুবিধা নিন।",
        "Trigger a standard cart abandonment reminder notification after 24 hours.": "২৪ ঘণ্টা পরে একটি সাধারণ কার্ট রিমাইন্ডার পাঠান।",
    },
    "Tamil": {
        "Offer no-cost EMI options at checkout.": "செக்அவுட்டில் வட்டி இல்லாத EMI (No-cost EMI) தேர்வை வழங்கவும்.",
        "Highlight 100% Flipkart Assured buyer protection and easy 7-day returns.": "100% பிளிப்கார்ட் அஷ்யூர்டு பாதுகாப்பு மற்றும் 7 நாள் எளிதான ரிட்டர்ன் வசதி.",
        "Waive delivery charges dynamically for carts above threshold or offer instant free shipping.": "உடனடி இலவச டெலிவரி (Free Delivery) சலுகையை வழங்கவும்.",
        "Display a 15-minute price lock timer to create urgency without discount erosion.": "15 நிமிட விலை லாக் டைமரை காண்பித்து விரைவான ஆர்டரை தூண்டவும்.",
        "Offer a small flat ₹100 instant bank discount or UPI cashback.": "UPI அல்லது கார்டு மூலம் ₹100 உடனடி தள்ளுபடி பெறவும்.",
        "Show real-time stock alert: 'Only 3 items left in stock — 45 users viewing right now'.": "ஸ்டாக் எச்சரிக்கை: '3 பொருட்கள் மட்டுமே உள்ளன — 45 பேர் பார்க்கிறார்கள்'.",
        "Highlight guaranteed express delivery by tomorrow evening.": "நாளை மாலைக்குள் உத்தரவாதமான எக்ஸ்பிரஸ் டெலிவரி பெறுங்கள்.",
        "Trigger a standard cart abandonment reminder notification after 24 hours.": "24 மணி நேரத்திற்கு பிறகு நினைவூட்டல் அறிவிப்பை அனுப்பவும்.",
    },
    "Telugu": {
        "Offer no-cost EMI options at checkout.": "చెకౌట్ వద్ద సున్నా వడ్డీ EMI (No-cost EMI) ఎంపికను అందించండి.",
        "Highlight 100% Flipkart Assured buyer protection and easy 7-day returns.": "100% ఫ్లిప్‌కార్ట్ అస్యూర్డ్ రక్షణ మరియు 7 రోజులలో సులభమైన రిటర్న్‌లు.",
        "Waive delivery charges dynamically for carts above threshold or offer instant free shipping.": "తక్షణ ఉచిత డెలివరీ (Free Shipping) ఆఫర్‌ను ప్రదర్శించండి.",
        "Display a 15-minute price lock timer to create urgency without discount erosion.": "15 నిమిషాల ధర లాక్ టైమర్‌ను చూపించి త్వరిత కొనుగోలును ప్రోత్సహించండి.",
        "Offer a small flat ₹100 instant bank discount or UPI cashback.": "UPI లేదా కార్డ్ ద్వారా తక్షణమే ₹100 తగ్గింపు పొందండి.",
        "Show real-time stock alert: 'Only 3 items left in stock — 45 users viewing right now'.": "స్టాక్ అలర్ట్: 'కేవలం 3 వస్తువులు మాత్రమే ఉన్నాయి — 45 మంది చూస్తున్నారు'.",
        "Highlight guaranteed express delivery by tomorrow evening.": "రేపు సాయంత్రానికల్లా గ్యారెంటీడ్ ఎక్స్‌ప్రెస్ డెలివరీ పొందండి.",
        "Trigger a standard cart abandonment reminder notification after 24 hours.": "24 గంటల తర్వాత కార్ట్ రిమైండర్ నోటిఫికేషన్‌ను పంపండి.",
    },
    "Kannada": {
        "Offer no-cost EMI options at checkout.": "ಚೆಕ್‌ಔಟ್‌ನಲ್ಲಿ ಉಚಿತ ಇಎಮ್‌ಐ (No-cost EMI) ಆಯ್ಕೆಯನ್ನು ನೀಡಿ.",
        "Highlight 100% Flipkart Assured buyer protection and easy 7-day returns.": "100% ಫ್ಲಿಪ್‌ಕಾರ್ಟ್ ಅಶ್ಯೂರ್ಡ್ ಗ್ಯಾರಂಟಿ ಮತ್ತು 7 ದಿನಗಳ ಸುಲಭ ರಿಟರ್ನ್ಸ್.",
        "Waive delivery charges dynamically for carts above threshold or offer instant free shipping.": "ತಕ್ಷಣದ ಉಚಿತ ಡೆಲಿವರಿ (Free Delivery) ಆಫರ್ ನೀಡಲಾಗಿದೆ.",
        "Display a 15-minute price lock timer to create urgency without discount erosion.": "15 ನಿಮಿಷಗಳ ಬೆಲೆ ಲಾಕ್ ಟೈಮರ್ ತೋರಿಸಿ ಶೀಘ್ರ ಖರೀದಿಗೆ ಪ್ರೇರೇಪಿಸಿ.",
        "Offer a small flat ₹100 instant bank discount or UPI cashback.": "ಯುಪಿಐ ಅಥವಾ ಕಾರ್ಡ್ ಮೂಲಕ ತಕ್ಷಣದ ₹100 ರಿಯಾಯಿತಿ ಪಡೆಯಿರಿ.",
        "Show real-time stock alert: 'Only 3 items left in stock — 45 users viewing right now'.": "ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆ: 'ಕೇವಲ 3 ಐಟಂಗಳು ಲಭ್ಯವಿದೆ — 45 ಜನರು ವೀಕ್ಷಿಸುತ್ತಿದ್ದಾರೆ'.",
        "Highlight guaranteed express delivery by tomorrow evening.": "ನಾಳೆ ಸಂಜೆಯೊಳಗೆ ಖಾತರಿಯ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಡೆಲಿವರಿ ಪಡೆಯಿರಿ.",
        "Trigger a standard cart abandonment reminder notification after 24 hours.": "24 ಗಂಟೆಗಳ ನಂತರ ಕಾರ್ಟ್ ಜ್ಞಾಪನೆ ಅಧಿಸೂಚನೆ ಕಳುಹಿಸಿ.",
    },
    "Marathi": {
        "Offer no-cost EMI options at checkout.": "चेकआउटवर नो-कॉस्ट ईएमआय (No-cost EMI) पर्याय उपलब्ध करा.",
        "Highlight 100% Flipkart Assured buyer protection and easy 7-day returns.": "100% फ्लिपकार्ट अश्युअर्ड (Flipkart Assured) सुरक्षा आणि सोपे 7 दिवसांचे रिटर्न.",
        "Waive delivery charges dynamically for carts above threshold or offer instant free shipping.": "त्वरित मोफत डिलिव्हरी (Free Delivery) चा लाभ द्या.",
        "Display a 15-minute price lock timer to create urgency without discount erosion.": "15 मिनिटांचा प्राईस लॉक टाइमर दाखवून जलद खरेदी प्रोत्साहन द्या.",
        "Offer a small flat ₹100 instant bank discount or UPI cashback.": "UPI किंवा बँक कार्डद्वारे ₹100 झटपट सवलत मिळवा.",
        "Show real-time stock alert: 'Only 3 items left in stock — 45 users viewing right now'.": "स्टॉक अलर्ट: 'फक्त 3 वस्तू शिल्लक आहेत — 45 ग्राहक सध्या पाहत आहेत'.",
        "Highlight guaranteed express delivery by tomorrow evening.": "उद्या संध्याकाळपर्यंत गॅरंटीड एक्सप्रेस डिलिव्हरी मिळवा.",
        "Trigger a standard cart abandonment reminder notification after 24 hours.": "24 तासांनंतर कार्ट रिमायंडर नोटिफिकेशन पाठवा.",
    },
    "Gujarati": {
        "Offer no-cost EMI options at checkout.": "ચેકઆઉટ પર નો-કોસ્ટ ઈએમઆઈ (No-cost EMI) વિકલ્પ આપો.",
        "Highlight 100% Flipkart Assured buyer protection and easy 7-day returns.": "100% ફ્લિપકાર્ટ એશ્યોર્ડ સુરક્ષા અને સરળ 7 દિવસીય રીટર્ન નીતિ.",
        "Waive delivery charges dynamically for carts above threshold or offer instant free shipping.": "મફત ડિલિવરી (Free Delivery) નો લાભ મેળવો.",
        "Display a 15-minute price lock timer to create urgency without discount erosion.": "15 મિનિટનો પ્રાઈસ લોક ટાઈમર બતાવીને ઝડપી ખરીદી માટે પ્રોત્સાહિત કરો.",
        "Offer a small flat ₹100 instant bank discount or UPI cashback.": "UPI અથવા કાર્ડ દ્વારા ₹100 ત્વરિત કેશબેક મેળવો.",
        "Show real-time stock alert: 'Only 3 items left in stock — 45 users viewing right now'.": "સ્ટોક એલર્ટ: 'માત્ર 3 વસ્તુઓ બાકી છે — 45 ગ્રાહકો અત્યારે જોઈ રહ્યા છે'.",
        "Highlight guaranteed express delivery by tomorrow evening.": "આવતીકાલ સાંજ સુધીમાં ગેરંટીડ એક્સપ્રેસ ડિલિવરી મેળવો.",
        "Trigger a standard cart abandonment reminder notification after 24 hours.": "24 કલાક પછી કાર્ટ રીમાઇન્ડર નોટિફિકેશન મોકલો.",
    }
}

def translate_nudge(text: str, target_language: str) -> str:
    """Translate or format intervention nudge into target language."""
    if not target_language or target_language.lower() in ["english", "en"]:
        return text

    # Normalize target language name
    lang_key = target_language.split()[0] # e.g. "Hindi (हिंदी)" -> "Hindi"

    # Direct dictionary lookup
    lang_dict = MULTILINGUAL_DICTIONARY.get(lang_key, {})
    if text in lang_dict:
        return lang_dict[text]
    
    # Keyword based translation matching
    text_lower = text.lower()
    if "emi" in text_lower:
        if lang_key == "Hindi": return "चेकआउट पर नो-कॉस्ट ईएमआई (No-cost EMI) विकल्प प्रदान करें।"
        if lang_key == "Bengali": return "চেকআউটে নো-কস্ট ইএমআই (No-cost EMI) অপশন অফার করুন।"
        if lang_key == "Tamil": return "செக்அவுட்டில் வட்டி இல்லாத EMI (No-cost EMI) தேர்வை வழங்கவும்."
        if lang_key == "Telugu": return "చెకౌట్ వద్ద సున్నా వడ్డీ EMI (No-cost EMI) ఎంపికను అందించండి."
        if lang_key == "Kannada": return "ಚೆಕ್‌ಔಟ್‌ನಲ್ಲಿ ಉಚಿತ ಇಎಮ್‌ಐ (No-cost EMI) ಆಯ್ಕೆಯನ್ನು ನೀಡಿ."
        if lang_key == "Marathi": return "चेकआउटवर नो-कॉस्ट ईएमआय (No-cost EMI) पर्याय उपलब्ध करा."
        if lang_key == "Gujarati": return "ચેકઆઉટ પર નો-કોસ્ટ ઈએમઆઈ (No-cost EMI) વિકલ્પ આપો."

    if "shipping" in text_lower or "delivery" in text_lower:
        if lang_key == "Hindi": return "न्यूनतम कार्ट राशि पर तुरंत मुफ्त डिलीवरी (Free Shipping) का लाभ दें।"
        if lang_key == "Bengali": return "বিনামূল্যে ডেলিভারির সুবিধা দিন এবং ডেলিভারি চার্জ সম্পূর্ণ মুকুব করুন।"
        if lang_key == "Tamil": return "உடனடி இலவச டெலிவரி (Free Delivery) சலுகையை வழங்கவும்."
        if lang_key == "Telugu": return "తక్షణ ఉచిత డెలివరీ (Free Shipping) ఆఫర్‌ను ప్రదర్శించండి."
        if lang_key == "Kannada": return "ತಕ್ಷಣದ ಉಚಿತ ಡೆಲಿವರಿ (Free Delivery) ಆಫರ್ ನೀಡಲಾಗಿದೆ."
        if lang_key == "Marathi": return "त्वरित मोफत डिलिव्हरी (Free Delivery) चा लाभ द्या."
        if lang_key == "Gujarati": return "મફત ડિલિવરી (Free Delivery) નો લાભ મેળવો."

    if "discount" in text_lower or "cashback" in text_lower or "coupon" in text_lower or "price" in text_lower:
        if lang_key == "Hindi": return "यूपीआई या कार्ड से तुरंत ₹100 की सीधी छूट या कैशबैक ऑफर प्रदान करें।"
        if lang_key == "Bengali": return "ইউপিআই বা ব্যাঙ্ক কার্ড ব্যবহারে ১০০ টাকা তাতক্ষণিক ক্যাশব্যাক দিন।"
        if lang_key == "Tamil": return "UPI அல்லது கார்டு மூலம் ₹100 உடனடி தள்ளுபடி பெறவும்."
        if lang_key == "Telugu": return "UPI లేదా కార్డ్ ద్వారా తక్షణమే ₹100 తగ్గింపు పొందండి."
        if lang_key == "Kannada": return "ಯುಪಿಐ ಅಥವಾ ಕಾರ್ಡ್ ಮೂಲಕ ತಕ್ಷಣದ ₹100 ರಿಯಾಯಿತಿ ಪಡೆಯಿರಿ."
        if lang_key == "Marathi": return "UPI किंवा बँक कार्डद्वारे ₹100 झटपट सवलत मिळवा."
        if lang_key == "Gujarati": return "UPI અથવા કાર્ડ દ્વારા ₹100 ત્વરિત કેશબેક મેળવો."

    # Default return original text if no direct match
    return text
