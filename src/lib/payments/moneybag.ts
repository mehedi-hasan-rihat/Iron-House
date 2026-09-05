/**
 * Moneybag payment gateway helper.
 * All requests are server-side only — the merchant key never leaves the server.
 */

const BASE_URL = process.env.MONEYBAG_BASE_URL ?? "https://api.sandbox.moneybag.com.bd";
const API_KEY  = process.env.MONEYBAG_MERCHANT_KEY ?? "";

export interface MoneybagCustomer {
  name:     string;
  email:    string;
  phone:    string;
  address?: string;
  city?:    string;
  postcode?: string;
  country?: string;
}

export interface CreateCheckoutParams {
  orderId:          string;   // your internal invoice / order ID
  amount:           number;   // in BDT, two-decimal string sent to API
  description:      string;
  successUrl:       string;
  cancelUrl:        string;
  failUrl:          string;
  ipnUrl:           string;
  customer:         MoneybagCustomer;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id:   string;
  expires_at:   string;
}

export interface VerifyResponse {
  transaction_id: string;
  order_id:       string;
  status:         "SUCCESS" | "FAILED" | "CANCELLED" | "PENDING";
  amount:         string;
  currency:       string;
  payment_method: string;
  paid_at:        string | null;
  [key: string]: unknown;
}

/** POST /api/v2/payments/checkout */
export async function createCheckout(params: CreateCheckoutParams): Promise<CheckoutResponse> {
  const res = await fetch(`${BASE_URL}/api/v2/payments/checkout`, {
    method:  "POST",
    headers: {
      "Content-Type":       "application/json",
      "X-Merchant-API-Key": API_KEY,
    },
    body: JSON.stringify({
      order_id:          params.orderId,
      order_amount:      params.amount.toFixed(2),
      currency:          "BDT",
      order_description: params.description,
      success_url:       params.successUrl,
      cancel_url:        params.cancelUrl,
      fail_url:          params.failUrl,
      ipn_url:           params.ipnUrl,
      customer: {
        name:     params.customer.name,
        email:    params.customer.email,
        phone:    params.customer.phone,
        address:  params.customer.address  ?? "Dhaka",
        city:     params.customer.city     ?? "Dhaka",
        postcode: params.customer.postcode ?? "1000",
        country:  params.customer.country  ?? "Bangladesh",
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Moneybag checkout failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  console.log("[moneybag] checkout raw response:", JSON.stringify(json));
  // Response is wrapped: { success, message, data: { checkout_url, session_id, expires_at } }
  return (json.data ?? json) as CheckoutResponse;
}

/** GET /api/v2/payments/verify/{transaction_id} */
export async function verifyPayment(transactionId: string): Promise<VerifyResponse> {
  const res = await fetch(`${BASE_URL}/api/v2/payments/verify/${encodeURIComponent(transactionId)}`, {
    headers: { "X-Merchant-API-Key": API_KEY },
    // Never cache verification — always hit the origin
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Moneybag verify failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  console.log("[moneybag] verify raw response:", JSON.stringify(json));
  // Response may be wrapped: { success, data: { ... } }
  return (json.data ?? json) as VerifyResponse;
}
