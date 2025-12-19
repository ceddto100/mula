import { Request, Response } from 'express';
import stripe from '../config/stripe';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest, IOrderItem } from '../types';

// Create Stripe checkout session
export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'items.productId',
      select: 'name price images stock',
    });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
      return;
    }

    // Verify stock and calculate total
    const lineItems: any[] = [];
    const orderItems: IOrderItem[] = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.productId as any;

      if (!product || product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Product ${product?.name || 'unknown'} is out of stock`,
        });
        return;
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: product.images?.slice(0, 1) || [],
            metadata: {
              productId: product._id.toString(),
              size: item.size,
              color: item.color,
            },
          },
          unit_amount: Math.round(product.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      });

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images?.[0] || '',
      });
    }

    // Generate order number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${timestamp}-${random}`;

    // Create pending order
    const order = await Order.create({
      userId: req.user._id,
      orderNumber,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'processing',
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart?canceled=true`,
      customer_email: req.user.email,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        userId: req.user._id.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'],
      },
    });

    // Update order with session ID
    order.stripeSessionId = session.id;
    await order.save();

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating checkout session',
    });
  }
};

// Stripe webhook handler
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    res.status(400).json({
      success: false,
      message: 'Missing stripe signature',
    });
    return;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      await handleSuccessfulPayment(session);
      break;
    }
    case 'checkout.session.expired': {
      const session = event.data.object as any;
      await handleExpiredSession(session);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as any;
      await handleFailedPayment(paymentIntent);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// Handle successful payment
async function handleSuccessfulPayment(session: any): Promise<void> {
  try {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error('No order ID in session metadata');
      return;
    }

    // Update order status
    const order = await Order.findById(orderId);

    if (!order) {
      console.error('Order not found:', orderId);
      return;
    }

    order.paymentStatus = 'paid';
    order.stripePaymentIntentId = session.payment_intent;
    await order.save();

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { userId: order.userId },
      { items: [] }
    );

    console.log('Payment successful for order:', order.orderNumber);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

// Handle expired session
async function handleExpiredSession(session: any): Promise<void> {
  try {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return;
    }

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'failed',
      orderStatus: 'cancelled',
    });

    console.log('Session expired for order:', session.metadata?.orderNumber);
  } catch (error) {
    console.error('Error handling expired session:', error);
  }
}

// Handle failed payment
async function handleFailedPayment(paymentIntent: any): Promise<void> {
  try {
    // Find order by payment intent
    const order = await Order.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (order) {
      order.paymentStatus = 'failed';
      await order.save();
      console.log('Payment failed for order:', order.orderNumber);
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

// Verify payment status
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found',
      });
      return;
    }

    const order = await Order.findOne({
      stripeSessionId: sessionId,
      userId: req.user._id,
    });

    res.json({
      success: true,
      data: {
        paymentStatus: session.payment_status,
        order,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying payment',
    });
  }
};
