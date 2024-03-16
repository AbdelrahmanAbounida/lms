"use server";
import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const handlePayment = async ({ courseId }: { courseId: string }) => {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return { error: "Unauthenticated" };
    }

    const course = await prismadb.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    const purchase = await prismadb.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (purchase) {
      return { error: "You aleady bought this course" };
    }

    // handle prisma payment
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];
    // check if the user already signed in stripe before
    let stripeCustomer = await prismadb.stripeCustomer.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
      });

      stripeCustomer = await prismadb.stripeCustomer.create({
        data: {
          userId: session.user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    // create a stripe session
    const stripe_session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/course/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/course/${course.id}?cancel=1`,
      metadata: {
        userId: session.user.id,
        courseId,
      },
    });

    return { url: stripe_session.url };
  } catch (error) {
    console.log({ stripe_error: error });
    return { error: "Something went wrong" };
  }
};
