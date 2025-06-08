import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/prisma.config';

export const getPaymentDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const userPayments = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        payments: {
          include: {
            subscription: {
              select: {
                plan: true,
              },
            },
          },
          take: 5,
        },
      },
    });

    const userSubscriptions = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptions: {
          where: { status: 'active' },
          include: {
            plan: true,
          },
        },
      },
    });

    res.status(200).json({
      payments: userPayments?.payments,
      subscriptions: userSubscriptions?.subscriptions,
    });
    return;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    res.status(500).json({ error: 'Failed to fetch payments' });
    return;
  }
};

export const getPaymentDetailsByOrderId = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { order_id } = req.body;

  if (!order_id) {
    res.status(400).json({ error: 'Order id is required' });
    return;
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: order_id },
      select: {
        id: true,
        status: true,
        order_id: true,
        paymentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ payment });
    return;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    res.status(500).json({ error: 'Failed to fetch payments' });
    return;
  }
};

export const getPricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const pricingPlan = await prisma.plan.findMany();

    res.status(200).json({ pricingPlan });
    return;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    res.status(500).json({ error: 'An error occurred' });
    return;
  }
};

export const getSubscriptionDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        status: 'active',
      },
      include: {
        plan: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (!subscription) {
      res.status(400).json({ status: 'none' });
      return;
    }

    res.status(200).json({ status: subscription?.status, subscription: subscription });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    res.status(500).json({
      message: 'Failed to check subscription status',
      error: error instanceof Error ? error.message : error,
    });
    return;
  }
};
