/**
 * QoreDev Magic Proxy Engine
 * Purpose: Connect any API in minutes by normalizing data schemas.
 */

import manifest from "./qf-manifest.json";

interface ServiceToggle {
  provider: string;
  enabled: boolean;
}

interface QfManifest {
  magic_toggles: Record<string, ServiceToggle>;
}

interface NormalizedPayload {
  qore_id: string | undefined;
  timestamp: string;
  payload: Record<string, unknown>;
}

class MagicProxy {
  private activeServices: Record<string, ServiceToggle>;

  constructor(config: QfManifest) {
    this.activeServices = config.magic_toggles; // Reads your building blocks
  }

  // Unified Request Handler
  async connect(
    serviceType: string,
    action: string,
    payload: Record<string, unknown>
  ): Promise<NormalizedPayload> {
    console.log(
      `🔮 QoreDev Proxy: Intercepting ${action} for ${serviceType}...`
    );

    // The Magic: One schema to rule them all
    const unifiedPayload = this.normalize(payload);

    // Agentic Routing: Automatically chooses the enabled provider
    const service = this.activeServices[serviceType];
    if (!service) {
      throw new Error(
        `QoreDev Proxy: Unknown service type "${serviceType}". Check qf-manifest.json.`
      );
    }
    if (!service.enabled) {
      throw new Error(
        `QoreDev Proxy: Service "${serviceType}" is disabled in qf-manifest.json.`
      );
    }

    return await this.executeMagic(service.provider, action, unifiedPayload);
  }

  normalize(data: Record<string, unknown>): NormalizedPayload {
    // Transforms diverse API responses into QoreDev World-Class Standard
    const rawId = data.id ?? data.uuid ?? data.pk;
    return {
      qore_id: rawId != null ? String(rawId) : undefined,
      timestamp: new Date().toISOString(),
      payload: data,
    };
  }

  private async executeMagic(
    provider: string,
    action: string,
    unifiedPayload: NormalizedPayload
  ): Promise<NormalizedPayload> {
    console.log(`🔮 QoreDev Proxy: Executing "${action}" via provider "${provider}"...`);
    // Provider-specific dispatch can be extended here by branching on `provider`
    // and `action`. Returns the normalised payload so callers always receive the
    // unified schema.
    return unifiedPayload;
  }
}

export const qoreProxy = new MagicProxy(manifest as QfManifest);
