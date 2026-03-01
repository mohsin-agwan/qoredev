/**
 * @qoredev/engine — QoreConnector
 *
 * A single connection that routes operations to whatever provider is
 * "Enabled" in the category manifest.  Auth credentials are resolved
 * automatically from environment variables when auth is set to 'managed'.
 */

export type AuthMode = "managed" | "custom";

export interface QoreConnectorOptions {
  /** Logical category, e.g. 'payments', 'storage', 'email' */
  category: string;
  /** Ordered list of provider slugs that may be activated */
  providers: string[];
  /** 'managed' lets QoreDev resolve credentials from env vars automatically */
  auth?: AuthMode;
}

export interface ExecutePayload {
  [key: string]: unknown;
}

export interface ConnectorResult {
  provider: string;
  operation: string;
  status: "success" | "error";
  data?: Record<string, unknown>;
  error?: string;
}

// ---------------------------------------------------------------------------
// Provider registry — lightweight stubs that can be swapped for real SDKs
// ---------------------------------------------------------------------------

type ProviderHandler = (
  operation: string,
  payload: ExecutePayload,
  credentials: Record<string, string | undefined>
) => Promise<Record<string, unknown>>;

const providerRegistry: Record<string, ProviderHandler> = {
  stripe: async (operation, payload, creds) => {
    if (!creds.STRIPE_SECRET_KEY)
      throw new Error("Missing STRIPE_SECRET_KEY — set it in your environment variables");
    // Real implementation would call the Stripe SDK here.
    return { provider: "stripe", operation, payload, chargeId: `ch_${Date.now()}` };
  },

  paypal: async (operation, payload, creds) => {
    if (!creds.PAYPAL_CLIENT_ID)
      throw new Error("Missing PAYPAL_CLIENT_ID — set it in your environment variables");
    if (!creds.PAYPAL_CLIENT_SECRET)
      throw new Error("Missing PAYPAL_CLIENT_SECRET — set it in your environment variables");
    return { provider: "paypal", operation, payload, orderId: `PAY-${Date.now()}` };
  },

  razorpay: async (operation, payload, creds) => {
    if (!creds.RAZORPAY_KEY_ID)
      throw new Error("Missing RAZORPAY_KEY_ID — set it in your environment variables");
    if (!creds.RAZORPAY_KEY_SECRET)
      throw new Error("Missing RAZORPAY_KEY_SECRET — set it in your environment variables");
    return { provider: "razorpay", operation, payload, paymentId: `pay_${Date.now()}` };
  },
};

// ---------------------------------------------------------------------------
// Manifest — controls which providers are currently enabled
// ---------------------------------------------------------------------------

/** Override this map at runtime to toggle providers on/off programmatically. */
const manifestOverrides: Record<string, boolean> = {};

function isProviderEnabled(category: string, provider: string): boolean {
  const key = `${category}:${provider}`;
  if (key in manifestOverrides) return manifestOverrides[key];
  // Fall back to environment variable: QORE_<CATEGORY>_<PROVIDER>_ENABLED=true
  const envKey = `QORE_${category.toUpperCase()}_${provider.toUpperCase()}_ENABLED`;
  return process.env[envKey] === "true";
}

/** Toggle a provider on/off at runtime (useful in tests or feature flags). */
export function setProviderEnabled(
  category: string,
  provider: string,
  enabled: boolean
): void {
  manifestOverrides[`${category}:${provider}`] = enabled;
}

// ---------------------------------------------------------------------------
// Credential resolution for 'managed' auth
// ---------------------------------------------------------------------------

const credentialKeys: Record<string, string[]> = {
  stripe: ["STRIPE_SECRET_KEY"],
  paypal: ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET"],
  razorpay: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"],
};

function resolveCredentials(provider: string): Record<string, string | undefined> {
  const keys = credentialKeys[provider] ?? [];
  return Object.fromEntries(keys.map((k) => [k, process.env[k]]));
}

// ---------------------------------------------------------------------------
// QoreConnector
// ---------------------------------------------------------------------------

export class QoreConnector {
  private readonly category: string;
  private readonly providers: string[];
  private readonly auth: AuthMode;

  constructor(options: QoreConnectorOptions) {
    this.category = options.category;
    this.providers = options.providers;
    this.auth = options.auth ?? "managed";
  }

  /**
   * Execute an operation against the first enabled provider in the list.
   * Falls through to the next provider if the current one throws.
   */
  async execute(operation: string, payload: ExecutePayload): Promise<ConnectorResult> {
    const enabled = this.providers.filter((p) =>
      isProviderEnabled(this.category, p)
    );

    if (enabled.length === 0) {
      return {
        provider: "none",
        operation,
        status: "error",
        error: `No enabled providers found for category '${this.category}'. Enable at least one via manifest toggles or env vars.`,
      };
    }

    for (const provider of enabled) {
      const handler = providerRegistry[provider];
      if (!handler) continue;

      try {
        const credentials =
          this.auth === "managed" ? resolveCredentials(provider) : {};
        const data = await handler(operation, payload, credentials);
        return { provider, operation, status: "success", data };
      } catch (err) {
        // Provider failed — try the next one
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[QoreConnector] ${provider} failed: ${message}. Trying next provider…`);
      }
    }

    return {
      provider: "all",
      operation,
      status: "error",
      error: `All enabled providers for '${this.category}' failed to execute '${operation}'.`,
    };
  }

  /** List of providers that are currently enabled in the manifest. */
  enabledProviders(): string[] {
    return this.providers.filter((p) =>
      isProviderEnabled(this.category, p)
    );
  }
}
