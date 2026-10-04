import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

screenshots_dir = r"e:\React_project\earningsources\screenshots"
output_pdf = r"e:\React_project\earningsources\ParikshaAI_Complete_App_Screenshots.pdf"

doc = SimpleDocTemplate(
    output_pdf,
    pagesize=A4,
    rightMargin=36,
    leftMargin=36,
    topMargin=32,
    bottomMargin=32
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=colors.HexColor('#059669'),
    alignment=1
)

subtitle_style = ParagraphStyle(
    'DocSubTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=16,
    textColor=colors.HexColor('#374151'),
    alignment=1
)

h2_style = ParagraphStyle(
    'H2Style',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=15,
    leading=19,
    textColor=colors.HexColor('#111827'),
    spaceAfter=4
)

body_style = ParagraphStyle(
    'BodyStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13.5,
    textColor=colors.HexColor('#4B5563')
)

bullet_style = ParagraphStyle(
    'BulletStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=colors.HexColor('#1F2937'),
    leftIndent=12
)

story = []

# ==================== PAGE 1: TITLE & COMPLETE ARCHITECTURE ====================
story.append(Spacer(1, 15))
story.append(Paragraph("ParikshaAI — Complete 10-Screen Architecture", title_style))
story.append(Spacer(1, 6))
story.append(Paragraph("India's #1 AI Exam Prep App — Production Screenshots Portfolio", subtitle_style))
story.append(Spacer(1, 15))

overview_text = (
    "<b>Project Summary:</b> ParikshaAI is an ultra-fast, mobile-first AI educational web app engineered "
    "for 3+ Crore Indian competitive exam aspirants (SSC, UPSC, Railway, State PCS, NEET). "
    "This document contains high-resolution live screenshots of all 9 screens and modals "
    "captured from the live production app running with Google Gemini 2.5 Flash."
)
story.append(Paragraph(overview_text, body_style))
story.append(Spacer(1, 12))

table_data = [
    ["#", "Screen / Modal Name", "Core Purpose & Features"],
    ["1", "Home Dashboard", "Streak Counter, Scan Notes, Upload PDF, Popular PYQ chips, 9 PM Live Event, 1v1 Battle callout."],
    ["2", "AI Notes Scan Modal", "3-in-1 input: Voice Mic (बोलकर लिखें), Camera Photo Scan, PDF Upload, Level & Question Count."],
    ["3", "1v1 Chai Challenge", "Viral WhatsApp Group Challenge: 'हारने वाला शाम की चाय पिलाएगा!' with 1-click invite link."],
    ["4", "Mistake Locker", "Student's Revision Notebook saving all wrong questions with 1-click 'Targeted Revision Test'."],
    ["5", "Pro Paywall (UPI)", "Rs. 49/month Unlimited Pass via PhonePe, Google Pay, Paytm UPI with 7-Day Money-Back Guarantee."],
    ["6", "Legal & Compliance", "Mandatory Razorpay KYC policies: Terms & Conditions, Privacy Policy, 7-Day Refund, Contact Us."],
    ["7", "Quiz Player Screen", "Bilingual (Hindi + English) questions, Audio Speaker (बोलकर सुनाएं), Timer, 4 thumb-friendly cards."],
    ["8", "AI Explanation Box", "Instant visual feedback (Green/Red check) + Friendly Khan Sir style Desi AI Explanation."],
    ["9", "Result & Scorecard", "Confetti celebration, 8/10 Score Badge, Top 5% State Rank, Weak Topics Alert, WhatsApp Share."]
]

t = Table(table_data, colWidths=[0.3*inch, 2.1*inch, 4.8*inch])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#059669')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,0), 9),
    ('BOTTOMPADDING', (0,0), (-1,0), 6),
    ('TOPPADDING', (0,0), (-1,0), 6),
    ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#F9FAFB')),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E7EB')),
    ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,1), (-1,-1), 8),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,1), (-1,-1), 4),
    ('BOTTOMPADDING', (0,1), (-1,-1), 4),
]))
story.append(t)
story.append(PageBreak())

# Screens definitions: (filename, title, subtitle, bullets)
screens = [
    (
        "01_Home_Dashboard.png",
        "Screen 1: Home Dashboard (मुख्य होम स्क्रीन)",
        "Clean, high-trust Indian student dashboard featuring gamified streaks and 1-tap test generation.",
        [
            "<b>Streak Counter:</b> '🔥 4 Days Streak' keeps daily user engagement sticky (Duolingo effect).",
            "<b>AI se Mock Test Banao:</b> Prominent Camera Scan and PDF upload touch cards.",
            "<b>Popular Topics Chips:</b> 1-click tests for 1857 Kranti, Indian Polity, Percentage, etc.",
            "<b>All-India 9 PM Live Test:</b> High FOMO daily national competition card with registered student count."
        ]
    ),
    (
        "02_AI_Notes_Scan_Modal.png",
        "Screen 2: AI Notes Scan & Upload Modal (नोट्स अपलोड व वॉइस सर्च)",
        "Zero-friction input modal with voice microphone, camera snap, and PDF coaching material selector.",
        [
            "<b>🎙️ बोलकर लिखें (Voice Mic):</b> Tap microphone to speak topic in Hindi/Hinglish without typing.",
            "<b>📸 फोटो खींचो (Camera):</b> Snap photos of textbook pages or handwritten notes directly.",
            "<b>📄 PDF / फाइल:</b> Upload Telegram coaching PDFs for instant test extraction.",
            "<b>Customizer:</b> Select 5 or 10 questions, and Easy / Exam Level / Tough difficulty."
        ]
    ),
    (
        "03_1v1_Chai_Challenge_Modal.png",
        "Screen 3: 1v1 Chai Challenge (दोस्तों को WhatsApp पर चैलेंज)",
        "Viral peer-to-peer growth loop designed for college hostels, libraries, and coaching centers.",
        [
            "<b>☕ Chai Rule:</b> 'हारने वाला शाम की चाय पिलाएगा!' — Gamified friendly rivalry.",
            "<b>WhatsApp Group Invite:</b> 1-click sharing pre-filled invite link to WhatsApp chats.",
            "<b>Topic Presets:</b> Quick presets like 1857 Kranti, Samvidhan, Maths Speed Test.",
            "<b>Zero-Cost Virality:</b> Each student brings 5 new friends to the app via WhatsApp."
        ]
    ),
    (
        "04_Mistake_Locker_Modal.png",
        "Screen 4: मेरी गलतियाँ (Mistake Locker & Revision Notebook)",
        "Automated student mistake notebook that turns exam weaknesses into permanent strengths.",
        [
            "<b>Automatic Mistake Saving:</b> Any question answered incorrectly in a test is automatically saved.",
            "<b>Targeted Revision Test:</b> 1-click button '🚀 सिर्फ गलत सवालों का रिवीज़न टेस्ट दें'.",
            "<b>Topper Psychology:</b> Helps aspirants revise their exact weak points within 24 hours.",
            "<b>High Willingness-to-Pay:</b> Students pay for this single feature because it directly improves scores."
        ]
    ),
    (
        "05_Pro_Paywall_UPI_Modal.png",
        "Screen 5: ₹49 Pro Pass UPI Paywall (पेमेंट स्क्रीन)",
        "Friction-free micro-subscription engine powered by UPI (PhonePe, Google Pay, Paytm).",
        [
            "<b>Micro-Pricing:</b> ₹49/month (pocket money price) or ₹299/year (60% OFF).",
            "<b>1-Click UPI:</b> No credit card hassle; instant payment through GPay, PhonePe, or Paytm.",
            "<b>100% Secure & Refundable:</b> 7-Day Money Back Guarantee for total student trust.",
            "<b>High Profit Margin:</b> Over 95% net margin with Gemini 2.5 Flash infrastructure."
        ]
    ),
    (
        "06_Legal_Refund_Policy_Modal.png",
        "Screen 6: Legal & Compliance Policies (नीति और शर्तें)",
        "Mandatory RBI & Razorpay merchant onboarding policies ensuring 100% compliance.",
        [
            "<b>7-Day Refund Policy:</b> Clear, no-questions-asked refund guarantee for student trust.",
            "<b>Terms & Conditions:</b> Transparent educational platform guidelines.",
            "<b>Privacy Policy:</b> User data and uploaded notes are never sold to 3rd parties.",
            "<b>Contact Us & Support:</b> Official email and WhatsApp support hotline."
        ]
    ),
    (
        "07_Quiz_Player_Screen.png",
        "Screen 7: Interactive Quiz Player (क्विज़ स्क्रीन)",
        "Distraction-free bilingual exam simulator tailored for budget Android smartphones.",
        [
            "<b>Bilingual Typography:</b> Hindi and English questions in crisp, readable font size.",
            "<b>🔊 बोलकर सुनाएं (Audio Speaker):</b> Web Speech API reads question and options aloud.",
            "<b>Live Countdown Timer:</b> Visual progress bar and minute countdown for real exam feel.",
            "<b>Thumb-Friendly Cards:</b> Large touch targets (A, B, C, D) preventing accidental mis-clicks."
        ]
    ),
    (
        "08_AI_Explanation_Screen.png",
        "Screen 8: Answer Feedback & Desi AI Explanation (समाधान स्क्रीन)",
        "Instant visual satisfaction with friendly, relatable Khan Sir style explanations.",
        [
            "<b>Instant Feedback:</b> Soothing soft emerald green checkmark for correct, soft red cross for wrong.",
            "<b>💡 Desi AI Explanation:</b> Explains the 'Why' behind the answer in simple, conversational Hindi.",
            "<b>English Summary:</b> Sub-explanation in English for complete conceptual clarity.",
            "<b>Next Question Button:</b> Prominent bottom sticky button for fast navigation."
        ]
    ),
    (
        "09_Result_Scorecard_Screen.png",
        "Screen 9: Viral Scorecard & Result Screen (सेलिब्रेशन स्कोरकार्ड)",
        "High-dopamine celebratory scorecard engineered to be posted on WhatsApp Status.",
        [
            "<b>🎉 Confetti Celebration:</b> Colorful particle burst upon test completion.",
            "<b>Rank & Percentile Badge:</b> '8/10 (Top 5% in State)' boosts confidence.",
            "<b>⚠️ Weak Topics Alert:</b> Explicitly lists topics to revise (e.g. 1857 dates, Governor-Generals).",
            "<b>📲 WhatsApp Challenge Button:</b> 1-click share button sends score and challenge link to WhatsApp."
        ]
    )
]

for filename, title, subtitle, bullets in screens:
    img_path = os.path.join(screenshots_dir, filename)
    story.append(Paragraph(title, h2_style))
    story.append(Paragraph(subtitle, body_style))
    story.append(Spacer(1, 6))

    if os.path.exists(img_path):
        # Image scaled nicely to fit A4 page alongside bullet points
        img = Image(img_path, width=3.0*inch, height=5.5*inch)
        story.append(img)
        story.append(Spacer(1, 6))

    for b in bullets:
        story.append(Paragraph(f"• {b}", bullet_style))

    story.append(PageBreak())

doc.build(story)
print("Complete PDF successfully generated at:", output_pdf)
