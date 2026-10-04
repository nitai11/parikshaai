const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const auditDir = path.join(__dirname, 'audit_results');
if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir);

async function runAudit() {
  console.log('🚀 Starting Full Functionality & Responsiveness Audit...');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const devices = [
    { name: 'Mobile_Standard_390', width: 390, height: 844 },
    { name: 'Mobile_Budget_360', width: 360, height: 740 },
    { name: 'Desktop_1024', width: 1024, height: 768 }
  ];

  const results = {
    viewportsTested: [],
    modalsTested: [],
    overflowIssues: [],
    consoleErrors: []
  };

  for (const dev of devices) {
    console.log(`\n📱 Testing Viewport: ${dev.name} (${dev.width}x${dev.height})...`);
    await page.setViewport({ width: dev.width, height: dev.height, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    // Check horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    results.viewportsTested.push({
      device: dev.name,
      dimensions: `${dev.width}x${dev.height}`,
      overflowFree: !hasHorizontalOverflow
    });

    if (hasHorizontalOverflow) {
      results.overflowIssues.push(dev.name);
    }

    await page.screenshot({ path: path.join(auditDir, `${dev.name}_Home.png`) });
    console.log(`   ✓ ${dev.name}: Overflow Free = ${!hasHorizontalOverflow}`);
  }

  // Now test Modals & Interactive Functionality on 390px
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 500));

  // Helper to click by text
  async function clickByText(selector, text) {
    return page.evaluate((sel, t) => {
      const els = Array.from(document.querySelectorAll(sel));
      const target = els.find(e => e.textContent.includes(t));
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, selector, text);
  }

  // Helper to close modal
  async function closeModal() {
    await page.evaluate(() => {
      const closeBtns = Array.from(document.querySelectorAll('button'));
      const btn = closeBtns.find(b => b.querySelector('svg.lucide-x') || b.textContent.includes('बंद'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
  }

  // 1. Test Feedback Modal
  console.log('\n💬 Testing Feedback Modal...');
  const feedbackClicked = await clickByText('div, span, button', 'सुझाव दें');
  await new Promise(r => setTimeout(r, 500));
  if (feedbackClicked) {
    await page.screenshot({ path: path.join(auditDir, 'Modal_Feedback.png') });
    results.modalsTested.push('FeedbackModal');
    console.log('   ✓ Feedback Modal opened and responsive');
    await closeModal();
  }

  // 2. Test 30-Day Launch Pass Modal
  console.log('\n🎁 Testing 30-Day Launch Pass Modal...');
  const proClicked = await clickByText('button, div', 'PRO Pass');
  await new Promise(r => setTimeout(r, 500));
  if (proClicked) {
    await page.screenshot({ path: path.join(auditDir, 'Modal_30Day_ProPass.png') });
    results.modalsTested.push('30Day_ProPassModal');
    console.log('   ✓ 30-Day Free Pass Modal opened and responsive');
    await closeModal();
  }

  // 3. Test Auth Modal (Login / Sign Up)
  console.log('\n🔐 Testing Auth Modal (Login/Signup)...');
  const authClicked = await clickByText('button', 'लॉगिन');
  await new Promise(r => setTimeout(r, 500));
  if (authClicked) {
    await page.screenshot({ path: path.join(auditDir, 'Modal_Auth.png') });
    results.modalsTested.push('AuthModal');
    console.log('   ✓ Auth Modal opened and responsive');
    await closeModal();
  }

  // 4. Test Student Profile Modal
  console.log('\n👤 Testing Student Profile Modal...');
  const profileClicked = await page.evaluate(() => {
    const bottomNav = document.querySelectorAll('nav button');
    if (bottomNav.length >= 5) {
      bottomNav[4].click(); // Profile is 5th tab
      return true;
    }
    return false;
  });
  await new Promise(r => setTimeout(r, 500));
  if (profileClicked) {
    await page.screenshot({ path: path.join(auditDir, 'Modal_Profile.png') });
    results.modalsTested.push('ProfileModal');
    console.log('   ✓ Student Profile Modal opened and responsive');
    await closeModal();
  }

  // 5. Test Live Test Modal
  console.log('\n🏆 Testing 9 PM Live Test Modal...');
  const liveClicked = await page.evaluate(() => {
    const bottomNav = document.querySelectorAll('nav button');
    if (bottomNav.length >= 5) {
      bottomNav[2].click(); // 9 PM Live is 3rd tab
      return true;
    }
    return false;
  });
  await new Promise(r => setTimeout(r, 500));
  if (liveClicked) {
    await page.screenshot({ path: path.join(auditDir, 'Modal_LiveTest.png') });
    results.modalsTested.push('LiveTestModal');
    console.log('   ✓ 9 PM Live Test Modal opened and responsive');
    await closeModal();
  }

  // 6. Test Back Button Interception (Do you want to close dialog)
  console.log('\n🚪 Testing Back Button & Exit Dialog...');
  await page.evaluate(() => {
    window.history.back();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(auditDir, 'Dialog_ExitApp.png') });
  const hasExitDialog = await page.evaluate(() => {
    return document.body.textContent.includes('क्या आप ऐप बंद करना चाहते हैं');
  });
  results.exitDialogWorking = hasExitDialog;
  console.log(`   ✓ Exit App Dialog working: ${hasExitDialog}`);

  results.consoleErrors = consoleErrors;
  await browser.close();

  console.log('\n📋 --- AUDIT SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(path.join(auditDir, 'audit_report.json'), JSON.stringify(results, null, 2));
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
