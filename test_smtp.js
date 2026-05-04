/**
 * Test SMTP Configuration
 * 
 * This script tests your SMTP credentials before installing the Firebase extension.
 * Run this to verify your email settings work correctly.
 * 
 * Usage:
 *   1. Update the SMTP_CONFIG below with your credentials
 *   2. Run: node test_smtp.js
 *   3. Check if test email is received
 */

const nodemailer = require('nodemailer');

// ============================================
// CONFIGURE YOUR SMTP SETTINGS HERE
// ============================================

const SMTP_CONFIG = {
  // Option 1: Gmail (use App Password, not regular password)
  // Get App Password: https://myaccount.google.com/apppasswords
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your-email@gmail.com', // Your Gmail address
    pass: 'your-app-password',     // 16-character App Password
  },
  
  // Option 2: SendGrid
  // host: 'smtp.sendgrid.net',
  // port: 587,
  // secure: false,
  // auth: {
  //   user: 'apikey',
  //   pass: 'YOUR_SENDGRID_API_KEY',
  // },
  
  // Option 3: AWS SES
  // host: 'email-smtp.us-east-1.amazonaws.com',
  // port: 587,
  // secure: false,
  // auth: {
  //   user: 'YOUR_SMTP_USERNAME',
  //   pass: 'YOUR_SMTP_PASSWORD',
  // },
};

const TEST_EMAIL = {
  from: 'noreply@cykel.app',        // Change to your verified sender
  to: 'your-test-email@example.com', // Change to your email for testing
  subject: 'CYKEL SMTP Test',
  text: 'If you received this, your SMTP configuration is working!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">✅ SMTP Test Successful!</h2>
      <p>Your SMTP configuration is working correctly.</p>
      <p>You can now install the Firebase Email Extension with these credentials.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 14px;">This is a test email from CYKEL setup.</p>
    </div>
  `,
};

// ============================================
// TEST SCRIPT (Don't modify below)
// ============================================

async function testSMTP() {
  console.log('🧪 Testing SMTP Configuration...\n');
  
  console.log('Configuration:');
  console.log(`  Host: ${SMTP_CONFIG.host}`);
  console.log(`  Port: ${SMTP_CONFIG.port}`);
  console.log(`  User: ${SMTP_CONFIG.auth.user}`);
  console.log(`  Secure: ${SMTP_CONFIG.secure}\n`);
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    
    // Verify connection
    console.log('⏳ Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');
    
    // Send test email
    console.log('📧 Sending test email...');
    console.log(`  From: ${TEST_EMAIL.from}`);
    console.log(`  To: ${TEST_EMAIL.to}`);
    
    const info = await transporter.sendMail(TEST_EMAIL);
    
    console.log('\n✅ Test email sent successfully!');
    console.log(`  Message ID: ${info.messageId}`);
    console.log(`\n🎉 Your SMTP configuration is working!`);
    console.log(`\nNext steps:`);
    console.log(`  1. Check ${TEST_EMAIL.to} for the test email`);
    console.log(`  2. If received, proceed with Firebase extension installation`);
    console.log(`  3. Use these same SMTP credentials when prompted\n`);
    
    // Generate SMTP URI for Firebase extension
    const smtpUri = `smtp://${SMTP_CONFIG.auth.user}:${SMTP_CONFIG.auth.pass}@${SMTP_CONFIG.host}:${SMTP_CONFIG.port}`;
    console.log('📋 SMTP URI for Firebase Extension:');
    console.log(`  ${smtpUri}\n`);
    
  } catch (error) {
    console.error('\n❌ SMTP Test Failed!\n');
    console.error('Error:', error.message);
    console.error('\nCommon Issues:');
    console.error('  ❌ Gmail: Use App Password, not regular password');
    console.error('  ❌ Gmail: Enable "Less secure app access" (if using regular account)');
    console.error('  ❌ SendGrid: Use "apikey" as username, API key as password');
    console.error('  ❌ AWS SES: Verify email addresses in SES console');
    console.error('  ❌ Firewall: Port 587 or 465 must be open');
    console.error('  ❌ Credentials: Double-check username and password\n');
    process.exit(1);
  }
}

// Run test
testSMTP().catch(console.error);
