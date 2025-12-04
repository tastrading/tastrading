import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import {
  quoteRequestAdminEmail,
  quoteRequestCustomerEmail,
} from "@/lib/email-templates";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Admin email
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, productName, productId } = body;

    // Validate required fields
    if (!name || !email || !productName) {
      return NextResponse.json(
        { error: "Name, email, and product are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Save to database as contact message
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message: `[Quote Request for: ${productName}]\n\n${
          message || "Customer requested a quote."
        }`,
      },
    });

    // Send emails only if Gmail credentials are configured
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      // 1. Email to Admin
      const adminMailOptions = {
        from: process.env.GMAIL_USER,
        to: ADMIN_EMAIL,
        subject: `📋 New Quote Request: ${productName}`,
        html: quoteRequestAdminEmail({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          productName,
          productId,
          message,
        }),
      };

      // 2. Thank you email to Customer
      const customerMailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Thank you for your inquiry - TAS Trading Corporation`,
        html: quoteRequestCustomerEmail({
          customerName: name,
          productName,
          productId,
        }),
      };

      // Send emails
      try {
        await Promise.all([
          transporter.sendMail(adminMailOptions),
          transporter.sendMail(customerMailOptions),
        ]);
        console.log("Quote request emails sent successfully");
      } catch (emailError) {
        console.error("Failed to send emails:", emailError);
        // Don't fail the request, quote was still saved
      }
    } else {
      console.log("Email not configured, skipping email notifications");
    }

    return NextResponse.json(
      { success: true, message: "Quote request submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quote request error:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
