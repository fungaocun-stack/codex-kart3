import { NextResponse } from "next/server";
import { Resend } from "resend";
import { inquirySchema } from "@/lib/validation";
import { isSupabaseConfigured, serviceSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const parsed = inquirySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check the required fields." }, { status: 400 });
  const inquiry = parsed.data;
  if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { error } = await serviceSupabase().from("inquiries").insert(inquiry);
    if (error) return NextResponse.json({ error: "Unable to save inquiry." }, { status: 500 });
  }
  if (process.env.RESEND_API_KEY && process.env.INQUIRY_TO_EMAIL) {
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.RESEND_FROM_EMAIL || "VORTKART <onboarding@resend.dev>",
      to: process.env.INQUIRY_TO_EMAIL,
      replyTo: inquiry.email,
      subject: `New VORTKART inquiry: ${inquiry.interest || "General project"}`,
      text: Object.entries(inquiry).map(([key, value]) => `${key}: ${value}`).join("\n")
    });
  }
  return NextResponse.json({ ok: true });
}
