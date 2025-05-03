import prisma from "../../config/client";
import { sendPaymentSuccessEmail } from "../../utils/email";
import { Request, Response } from "express";
import SSLCommerzPayment from "sslcommerz-lts";

interface RequestWithUser extends Request {
  user?: {
    id: string;
    role?: string
  };
}

export const initiatePayment = async (req: Request, res: Response) => {
  const {
    total_amount,
    tran_id,
    movieID,
    userID,
    accessType, // 'BUY' | 'RENT'
    customer,
  } = req.body;

  const fr_url = process.env.FRONTEND_URL || "";

  const sslcz = new SSLCommerzPayment(
    process.env.SSL_STORE_ID!,
    process.env.SSL_STORE_PASSWORD!,
    false
  );

  try {
    await prisma.transaction.create({
      data: {
        tranId: tran_id,
        buyerId: userID,
        movieId: movieID,
        type: accessType,
        totalAmount: total_amount,
        status: "PENDING",
      },
    });

    const paymentData = {
      total_amount,
      currency: "BDT",
      tran_id,
      ipn_url: `${fr_url}/ipn`,
      success_url: `${process.env.BACKEND_URL}/api/payments/ssl/success/${tran_id}`,
      fail_url: `${process.env.BACKEND_URL}/api/payments/ssl/fail/${tran_id}`,
      cancel_url: `${process.env.BACKEND_URL}/api/payments/ssl/cancel/${tran_id}`,
      cus_name: customer.name,
      cus_email: customer.email,
      cus_phone: customer.phone,
      cus_add1: customer.address || "N/A",
      shipping_method: "Courier",
      cus_city: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      product_name: "Movie Access",
      product_category: "Entertainment",
      product_profile: "digital-goods",
      ship_name: customer.name,
      ship_add1: customer.address || "N/A",
      ship_city: "Dhaka",
      ship_postcode: "1762",
      ship_country: "Bangladesh",
    };

    const apiResponse = await sslcz.init(paymentData);

    if (apiResponse.status === "SUCCESS" && apiResponse.GatewayPageURL) {
      res.status(200).json({ GatewayPageURL: apiResponse.GatewayPageURL });
    } else {
      res
        .status(400)
        .json({ message: "Payment initiation failed", error: apiResponse });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error during payment initiation." });
  }
};

export const initiatePaymentSuccess = async (req: Request, res: Response) => {
  const tran_id = req.params.id;

  if (!tran_id) {
    res.status(400).json({ success: false, message: "tran_id is required" });
    return;
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { tranId: tran_id },
    });

    console.log("tranaction", transaction);

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    await prisma.transaction.update({
      where: { tranId: tran_id },
      data: { status: "COMPLETED" },
    });

    const accessLink = await generateAccessLink(transaction.movieId);
    const accessExpiresAt =
      transaction.type === "RENT"
        ? new Date(Date.now() + 48 * 60 * 60 * 1000) // 48h
        : null;

    await prisma.movieAccess.create({
      data: {
        userId: transaction.buyerId,
        movieId: transaction.movieId,
        accessType: transaction.type,
        accessLink,
        expiresAt: accessExpiresAt,
      },
    });

    // Fetch user and movie details
    const user = await prisma.user.findUnique({
      where: { id: transaction.buyerId },
    });
    const movie = await prisma.movie.findUnique({
      where: { id: transaction.movieId },
    });

    if (user?.email && movie?.title) {
      await sendPaymentSuccessEmail({
        to: user.email,
        movieTitle: movie.title,
        accessLink,
        accessType: transaction.type,
        expiresAt: accessExpiresAt,
      });
    }

    res.status(200).json({
      message: "Payment successful. Access granted.",
      accessLink,
      expiresAt: accessExpiresAt,
    });
  } catch (error) {
    console.error("Success handler failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const initiatePaymentFailure = async (req: Request, res: Response) => {
  const tran_id = req.params.id;

  if (!tran_id) {
    res.status(400).json({ success: false, message: "tran_id is required" });
    return;
  }

  await prisma.transaction.updateMany({
    where: { tranId: tran_id },
    data: { status: "FAILED" },
  });

  res.status(200).json({ message: "Payment failed." });
};

export const initiatePaymentCancel = async (req: Request, res: Response) => {
  const tran_id = req.params.id;

  if (!tran_id) {
    res.status(400).json({ success: false, message: "tran_id is required" });
    return;
  }

  await prisma.transaction.updateMany({
    where: { tranId: tran_id },
    data: { status: "CANCELLED" },
  });

  res.status(200).json({ message: "Payment cancelled." });
};

const generateAccessLink = async (movieId: number): Promise<string> => {
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });

  if (!movie?.title) return "https://www.google.com/";

  const encodedTitle = encodeURIComponent(`${movie.title} full movie`);
  return `https://www.google.com/search?q=${encodedTitle}`;
};




export const getMyTransactions = async (req: RequestWithUser, res: Response) => {
  const userId = req?.user?.id

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: { buyerId: parseInt(userId) },
      include: {
        movie: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(transactions);
    return;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};


export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        user: { select: { id: true, email: true } },
        movie: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(transactions);
    return;
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};


