export type ActivityWebhookPayload = {
	canApprove?: boolean;
	canReject?: boolean;
	createdAt?: unknown;
	fingerprint: string;
	id: string;
	intent?: Record<string, unknown>;
	organizationId: string;
	result?: Record<string, unknown>;
	status: string;
	type: string;
	updatedAt?: unknown;
	votes?: unknown[];
};

export type ActivityEventEnvelope = {
	approved?: boolean;
	id: string;
	payload: ActivityWebhookPayload;
	receivedAt: string;
};

export type ActivitySseMessage =
	| {
			type: "connected";
			connectedAt: string;
			recentEvents: ActivityEventEnvelope[];
	  }
	| {
			type: "activity-update";
			event: ActivityEventEnvelope;
	  }
	| {
			type: "heartbeat";
			sentAt: string;
	  };
