import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import {
  contactFormAdminEmail,
  contactFormAutoReply,
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
    const { name, email, phone, message, subject } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
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

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    console.log("New contact message received:", contactMessage.id);

    // Send emails if Gmail is configured
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      // 1. Admin notification email
      const adminMailOptions = {
        from: process.env.GMAIL_USER,
        to: ADMIN_EMAIL,
        subject: `📩 New Contact: ${subject || "Website Inquiry"}`,
        html: contactFormAdminEmail({
          name,
          email,
          phone,
          subject: subject || "Website Inquiry",
          message,
        }),
      };

      // 2. Auto-reply to customer
      const customerMailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `We received your message - TAS Trading Corporation`,
        html: contactFormAutoReply({ name }),
      };

      try {
        await Promise.all([
          transporter.sendMail(adminMailOptions),
          transporter.sendMail(customerMailOptions),
        ]);
        console.log("Contact form emails sent successfully");
      } catch (emailError) {
        console.error("Failed to send emails:", emailError);
        // Don't fail the request, message was still saved
      }
    } else {
      console.log("Email not configured, skipping email notifications");
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
