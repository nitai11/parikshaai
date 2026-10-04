const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Home Screen
  console.log('1. Capturing Home Screen...');
  await page.screenshot({ path: path.join(screenshotsDir, '01_Home_Dashboard.png') });

  // 2. Upload / AI Notes Scan Modal (with Voice Mic)
  console.log('2. Capturing Upload Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const scanBtn = btns.find(b => b.textContent.includes('Scan Notes'));
    if (scanBtn) scanBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotsDir, '02_AI_Notes_Scan_Modal.png') });

  // Close modal
  await page.evaluate(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const closeBtn = closeBtns.find(b => b.querySelector('svg.lucide-x'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 3. 1v1 Chai Challenge Modal
  console.log('3. Capturing 1v1 Chai Challenge Modal...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div'));
    const battleCard = cards.find(c => c.textContent.includes('1v1 Chai Challenge'));
    if (battleCard) battleCard.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotsDir, '03_1v1_Chai_Challenge_Modal.png') });

  // Close modal
  await page.evaluate(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const closeBtn = closeBtns.find(b => b.querySelector('svg.lucide-x'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 4. Mistake Locker Modal
  console.log('4. Capturing Mistake Locker Modal...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div'));
    const mistakeCard = cards.find(c => c.textContent.includes('मेरी गलतियाँ'));
    if (mistakeCard) mistakeCard.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotsDir, '04_Mistake_Locker_Modal.png') });

  // Close modal
  await page.evaluate(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const closeBtn = closeBtns.find(b => b.querySelector('svg.lucide-x'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 5. Pro Paywall Modal (UPI ₹49 Unlock)
  console.log('5. Capturing Pro Paywall Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const proBtn = btns.find(b => b.textContent.includes('₹49 Pass') || b.textContent.includes('Unlock'));
    if (proBtn) proBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotsDir, '05_Pro_Paywall_UPI_Modal.png') });

  // Close modal
  await page.evaluate(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const closeBtn = closeBtns.find(b => b.querySelector('svg.lucide-x'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 6. Legal Policies Modal (Refund Policy)
  console.log('6. Capturing Legal Policies Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const refundBtn = btns.find(b => b.textContent.includes('रिफंड नीति'));
    if (refundBtn) refundBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotsDir, '06_Legal_Refund_Policy_Modal.png') });

  // Close modal
  await page.evaluate(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const closeBtn = closeBtns.find(b => b.textContent.includes('बंद करें') || b.querySelector('svg.lucide-x'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 7. Start Quiz from Popular Topic
  console.log('7. Starting Quiz from 1857 Kranti...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const topicBtn = btns.find(b => b.textContent.includes('1857 Kranti'));
    if (topicBtn) topicBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Submit in upload modal to start
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });

  // Wait for quiz to generate and appear
  console.log('Waiting for quiz generation...');
  await page.waitForSelector('button[type="button"]', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  // 8. Quiz Question Screen
  console.log('8. Capturing Quiz Screen...');
  await page.screenshot({ path: path.join(screenshotsDir, '07_Quiz_Player_Screen.png') });

  // Select an option to show Answered state + AI Explanation
  console.log('Answering question to reveal AI explanation...');
  await page.evaluate(() => {
    const optionBtns = Array.from(document.querySelectorAll('button')).filter(b => 
      b.querySelector('span') && ['A', 'B', 'C', 'D'].includes(b.querySelector('span').textContent.trim())
    );
    if (optionBtns.length > 0) optionBtns[0].click();
  });
  await new Promise(r => setTimeout(r, 600));
  console.log('9. Capturing AI Explanation Screen...');
  await page.screenshot({ path: path.join(screenshotsDir, '08_AI_Explanation_Screen.png') });

  // Finish quiz through all questions to reach Scorecard
  console.log('Answering remaining questions to reach Scorecard...');
  for (let q = 0; q < 6; q++) {
    const nextBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const n = btns.find(b => b.textContent.includes('Next Question') || b.textContent.includes('अगला सवाल') || b.textContent.includes('Submit Test') || b.textContent.includes('टेस्ट समाप्त करें'));
      if (n) {
        n.click();
        return true;
      }
      return false;
    });

    if (!nextBtn) break;
    await new Promise(r => setTimeout(r, 600));

    // Select an option if present
    await page.evaluate(() => {
      const optionBtns = Array.from(document.querySelectorAll('button')).filter(b => 
        b.querySelector('span') && ['A', 'B', 'C', 'D'].includes(b.querySelector('span').textContent.trim())
      );
      if (optionBtns.length > 0) optionBtns[0].click();
    });
    await new Promise(r => setTimeout(r, 400));
  }

  await new Promise(r => setTimeout(r, 1500));
  console.log('10. Capturing Result Scorecard Screen...');
  await page.screenshot({ path: path.join(screenshotsDir, '09_Result_Scorecard_Screen.png') });

  console.log('All screenshots captured successfully in /screenshots folder!');
  await browser.close();
}

capture().catch(console.error);
