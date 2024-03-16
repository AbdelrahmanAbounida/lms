import { prismadb } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
      if (!userId || !courseId) {
        return NextResponse.json(
          { error: "webhook error missing userid or courseid" },
          { status: 400 }
        );
      }

      await prismadb.purchase.create({
        data: {
          userId,
          courseId,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Webhook error: unhandled event" },
        { status: 200 }
      );
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
}
