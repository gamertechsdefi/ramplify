# 📧 Gmail Email Notifications Setup

Simple setup to receive transaction notifications directly to your Gmail account.

## 🚀 Quick Setup (5 minutes)

### Step 1: Enable 2-Factor Authentication on Gmail

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Under **Signing in to Google**, click **2-Step Verification**
4. Follow the steps to enable 2FA (required for app passwords)

### Step 2: Generate Gmail App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Under **Signing in to Google**, click **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "Ramplify Notifications" as the name
6. Click **Generate**
7. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 3: Add Environment Variables

Create or update your `.env.local` file in the project root:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

**Important**: 
- Use your actual Gmail address for `GMAIL_USER`
- Use the 16-character app password (not your regular Gmail password)
- Remove spaces from the app password

### Step 4: Install Nodemailer

Run this command in your project directory:

```bash
npm install nodemailer @types/nodemailer
```

## ✅ That's It!

Now when users click "I've Sent Payment":

1. **Email automatically sent** to your Gmail
2. **Contains all transaction details**:
   - Transaction ID
   - Amount sent (NGN)
   - Amount to receive (Crypto)
   - Wallet address
   - Timestamp
3. **Professional HTML formatting**
4. **No user interaction required**

## 📧 Email Preview

You'll receive emails that look like this:

```
Subject: 🚀 New Onramp Transaction - RAMP-12345678

🚀 New Onramp Transaction

Transaction Details
📋 Transaction ID: RAMP-12345678
💰 Amount Sent: ₦17,000
🪙 Amount to Receive: 9.850000 USDC
📱 Wallet Address: 0x1234...abcd
⏰ Time: 1/28/2025, 10:30:00 AM
🔄 Status: Pending Processing

⚠️ Action Required: Please process this transaction and send 9.850000 USDC to the wallet address above.
```

## 🔧 Testing

1. Fill out the onramp form on your website
2. Click "I've Sent Payment"
3. Check your Gmail inbox
4. You should receive the notification email immediately

## 🛠️ Troubleshooting

### "Invalid login" error:
- Make sure you're using the **app password**, not your regular Gmail password
- Ensure 2-Factor Authentication is enabled on your Google account

### "Authentication failed" error:
- Double-check your Gmail address in `GMAIL_USER`
- Verify the app password is correct (16 characters, no spaces)

### Email not received:
- Check your spam folder
- Verify the environment variables are set correctly
- Check the server logs for error messages

## 🔒 Security Notes

- **App passwords are safer** than using your main Gmail password
- **Environment variables** keep your credentials secure
- **Only you receive the emails** - no third-party services involved

## 📱 Alternative: Add Mobile Notifications

To get instant mobile notifications, you can:

1. **Enable Gmail push notifications** on your phone
2. **Set up email forwarding** to SMS (through your carrier)
3. **Use Gmail filters** to mark transaction emails as important

This simple setup gives you reliable, automatic email notifications without any complex integrations!
