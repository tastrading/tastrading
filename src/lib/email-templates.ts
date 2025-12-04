// Beautiful HTML email templates for TAS Trading Corporation

import { siteConfig } from "./seo";

// Common styles for all emails
const styles = {
  container: `
    max-width: 600px;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #ffffff;
  `,
  header: `
    background: linear-gradient(135deg, #064e3b 0%, #10b981 100%);
    padding: 32px;
    text-align: center;
  `,
  logo: `
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    margin: 0;
  `,
  tagline: `
    font-size: 12px;
    color: #a7f3d0;
    margin-top: 8px;
  `,
  body: `
    padding: 32px;
    background-color: #ffffff;
  `,
  footer: `
    background-color: #f3f4f6;
    padding: 24px 32px;
    text-align: center;
    border-top: 1px solid #e5e7eb;
  `,
  button: `
    display: inline-block;
    padding: 14px 28px;
    background-color: #10b981;
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 16px 0;
  `,
  infoBox: `
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  `,
  label: `
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  `,
  value: `
    font-size: 16px;
    color: #111827;
    font-weight: 500;
  `,
};

// Email header component
const emailHeader = `
  <div style="${styles.header}">
    <h1 style="${styles.logo}">TAS TRADING</h1>
    <p style="${styles.tagline}">CORPORATION • SINCE 1968</p>
  </div>
`;

// Email footer component
const emailFooter = `
  <div style="${styles.footer}">
    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
      TAS Trading Corporation
    </p>
    <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
      Industrial Tools & Equipment Supplier Since 1968
    </p>
    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
      Secunderabad, Telangana, India | +91 9052772942
    </p>
    <div style="margin-top: 16px;">
      <a href="${siteConfig.url}" style="color: #10b981; text-decoration: none; font-size: 12px;">
        Visit our website →
      </a>
    </div>
  </div>
`;

// Quote Request - Admin Notification Email
export function quoteRequestAdminEmail(data: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productName: string;
  productId: string;
  message?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <div style="${styles.container}">
    ${emailHeader}
    
    <div style="${styles.body}">
      <h2 style="margin: 0 0 8px 0; color: #111827; font-size: 24px;">
        📋 New Quote Request
      </h2>
      <p style="margin: 0 0 24px 0; color: #6b7280;">
        A customer is interested in one of your products.
      </p>
      
      <!-- Product Info -->
      <div style="${styles.infoBox}">
        <p style="${styles.label}">Product</p>
        <p style="${styles.value}">${data.productName}</p>
        <a href="${siteConfig.url}/products/${data.productId}" 
           style="color: #10b981; font-size: 14px; text-decoration: none;">
          View Product →
        </a>
      </div>
      
      <!-- Customer Details -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 16px;">
          👤 Customer Details
        </h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Name</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${
              data.customerName
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${
                data.customerEmail
              }" style="color: #10b981; text-decoration: none;">${
    data.customerEmail
  }</a>
            </td>
          </tr>
          ${
            data.customerPhone
              ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
            <td style="padding: 8px 0;">
              <a href="tel:${data.customerPhone}" style="color: #10b981; text-decoration: none;">${data.customerPhone}</a>
            </td>
          </tr>
          `
              : ""
          }
        </table>
      </div>
      
      ${
        data.message
          ? `
      <!-- Customer Message -->
      <div style="background-color: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="${styles.label}">💬 Customer Message</p>
        <p style="margin: 8px 0 0 0; color: #374151; font-size: 14px; line-height: 1.6;">
          "${data.message}"
        </p>
      </div>
      `
          : ""
      }
      
      <!-- Action Buttons -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="mailto:${
          data.customerEmail
        }?subject=Re: Quote Request for ${encodeURIComponent(
    data.productName
  )}" 
           style="${styles.button}">
          Reply to Customer
        </a>
        <a href="https://wa.me/91${data.customerPhone?.replace(/\D/g, "")}" 
           style="${styles.button} background-color: #25d366;"
           target="_blank">
          WhatsApp
        </a>
      </div>
    </div>
    
    ${emailFooter}
  </div>
</body>
</html>
  `;
}

// Quote Request - Customer Thank You Email
export function quoteRequestCustomerEmail(data: {
  customerName: string;
  productName: string;
  productId: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Quote Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <div style="${styles.container}">
    ${emailHeader}
    
    <div style="${styles.body}">
      <h2 style="margin: 0 0 8px 0; color: #111827; font-size: 24px;">
        Thank you, ${data.customerName}! 🎉
      </h2>
      <p style="margin: 0 0 24px 0; color: #6b7280; line-height: 1.6;">
        We've received your quote request and our team will get back to you within 24 hours with pricing and availability details.
      </p>
      
      <!-- Product Requested -->
      <div style="${styles.infoBox}">
        <p style="${styles.label}">Product Requested</p>
        <p style="${styles.value}">${data.productName}</p>
        <a href="${siteConfig.url}/products/${data.productId}" 
           style="color: #10b981; font-size: 14px; text-decoration: none;">
          View Product Details →
        </a>
      </div>
      
      <!-- What's Next -->
      <div style="margin: 32px 0;">
        <h3 style="color: #374151; font-size: 16px; margin-bottom: 16px;">What happens next?</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 12px 0; vertical-align: top; width: 40px;">
              <div style="width: 28px; height: 28px; background-color: #d1fae5; border-radius: 50%; text-align: center; line-height: 28px; color: #059669; font-weight: bold;">1</div>
            </td>
            <td style="padding: 12px 0; color: #374151; font-size: 14px;">
              Our team reviews your request and checks availability
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; vertical-align: top;">
              <div style="width: 28px; height: 28px; background-color: #d1fae5; border-radius: 50%; text-align: center; line-height: 28px; color: #059669; font-weight: bold;">2</div>
            </td>
            <td style="padding: 12px 0; color: #374151; font-size: 14px;">
              We'll send you a detailed quote with best pricing
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; vertical-align: top;">
              <div style="width: 28px; height: 28px; background-color: #d1fae5; border-radius: 50%; text-align: center; line-height: 28px; color: #059669; font-weight: bold;">3</div>
            </td>
            <td style="padding: 12px 0; color: #374151; font-size: 14px;">
              Confirm your order and we'll arrange delivery
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Contact Info -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; text-align: center;">
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
          Need immediate assistance?
        </p>
        <p style="margin: 0; font-size: 18px;">
          <a href="tel:+919052772942" style="color: #10b981; text-decoration: none; font-weight: 600;">
            📞 +91 9052772942
          </a>
        </p>
        <p style="margin: 8px 0 0 0; font-size: 14px;">
          <a href="https://wa.me/919052772942" style="color: #25d366; text-decoration: none;">
            WhatsApp us →
          </a>
        </p>
      </div>
      
      <!-- Browse More -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="${siteConfig.url}/products" style="${styles.button}">
          Browse More Products
        </a>
      </div>
    </div>
    
    ${emailFooter}
  </div>
</body>
</html>
  `;
}

// Contact Form - Admin Notification Email
export function contactFormAdminEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <div style="${styles.container}">
    ${emailHeader}
    
    <div style="${styles.body}">
      <h2 style="margin: 0 0 8px 0; color: #111827; font-size: 24px;">
        📩 New Contact Message
      </h2>
      <p style="margin: 0 0 24px 0; color: #6b7280;">
        Someone reached out through your website contact form.
      </p>
      
      <!-- Subject -->
      <div style="${styles.infoBox}">
        <p style="${styles.label}">Subject</p>
        <p style="${styles.value}">${data.subject}</p>
      </div>
      
      <!-- Message -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="${styles.label}">💬 Message</p>
        <p style="margin: 8px 0 0 0; color: #374151; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">
${data.message}
        </p>
      </div>
      
      <!-- Sender Details -->
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 16px 0; color: #1e40af; font-size: 14px;">
          👤 Sender Details
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 80px;">Name</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${
              data.name
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${
                data.email
              }" style="color: #2563eb; text-decoration: none;">${
    data.email
  }</a>
            </td>
          </tr>
          ${
            data.phone
              ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
            <td style="padding: 8px 0;">
              <a href="tel:${data.phone}" style="color: #2563eb; text-decoration: none;">${data.phone}</a>
            </td>
          </tr>
          `
              : ""
          }
        </table>
      </div>
      
      <!-- Reply Button -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(
    data.subject
  )}" 
           style="${styles.button}">
          Reply to Message
        </a>
      </div>
    </div>
    
    ${emailFooter}
  </div>
</body>
</html>
  `;
}

// Contact Form - Auto-reply to Customer
export function contactFormAutoReply(data: { name: string }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Received Your Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <div style="${styles.container}">
    ${emailHeader}
    
    <div style="${styles.body}">
      <h2 style="margin: 0 0 8px 0; color: #111827; font-size: 24px;">
        Hello ${data.name}! 👋
      </h2>
      <p style="margin: 0 0 24px 0; color: #6b7280; line-height: 1.6;">
        Thank you for contacting TAS Trading Corporation. We've received your message and will respond within 24 business hours.
      </p>
      
      <div style="${styles.infoBox}">
        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">
          In the meantime, feel free to explore our products or reach out directly if your inquiry is urgent.
        </p>
      </div>
      
      <!-- Quick Actions -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${siteConfig.url}/products" style="${styles.button}">
          Browse Products
        </a>
        <a href="https://wa.me/919052772942" 
           style="${styles.button} background-color: #25d366;">
          WhatsApp Us
        </a>
      </div>
      
      <!-- Office Locations -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 32px;">
        <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 16px;">📍 Visit Our Offices</h3>
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
          <strong>Head Office:</strong> Secunderabad | <a href="tel:+919052772942" style="color: #10b981;">+91 9052772942</a>
        </p>
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
          <strong>Branch Office:</strong> Hyderabad | <a href="tel:+918008252786" style="color: #10b981;">+91 8008252786</a>
        </p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          <strong>Balanagar Branch:</strong> Balanagar | <a href="tel:+919885216310" style="color: #10b981;">+91 9885216310</a>
        </p>
      </div>
    </div>
    
    ${emailFooter}
  </div>
</body>
</html>
  `;
}
