import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";

interface UserActivityMessage {
  userId: number;
  userName: string;
  userEmail: string;
  isOnline: boolean;
  lastSeen: string;
  lastActivity: string;
}

interface UseWebSocketOptions {
  onUserActivity?: (message: UserActivityMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  enabled?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { onUserActivity, onConnect, onDisconnect, enabled = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Store callbacks in refs to avoid recreating connect function
  const onUserActivityRef = useRef(onUserActivity);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  useEffect(() => {
    onUserActivityRef.current = onUserActivity;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
  }, [onUserActivity, onConnect, onDisconnect]);

  const connect = useCallback(() => {
    if (!enabled || isConnectingRef.current || clientRef.current?.connected) {
      return;
    }

    isConnectingRef.current = true;

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, cannot connect WebSocket");
        isConnectingRef.current = false;
        return;
      }

      const wsUrl = `${
        import.meta.env.VITE_API_URL || "http://localhost:8080"
      }/ws${token ? `?token=${token}` : ""}`;

      // Clean up existing connection
      if (clientRef.current) {
        try {
          clientRef.current.deactivate();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }

      const socket = new SockJS(wsUrl);
      const stompClient = new Client({
        webSocketFactory: () => socket as any,
        reconnectDelay: 0, // Disable automatic reconnection, we'll handle it manually
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          isConnectingRef.current = false;
          reconnectAttemptsRef.current = 0;
          setIsConnected(true);

          // Subscribe to user activity topic (admin only)
          try {
            subscriptionRef.current = stompClient.subscribe(
              "/topic/user-activity",
              (message: IMessage) => {
                try {
                  const data: UserActivityMessage = JSON.parse(message.body);
                  onUserActivityRef.current?.(data);
                } catch (error) {
                  console.error("Error parsing user activity message:", error);
                }
              }
            );
          } catch (error) {
            console.error("Error subscribing to topic:", error);
          }

          // Send initial heartbeat immediately to mark user online
          try {
            stompClient.publish({
              destination: "/app/user/heartbeat",
              body: JSON.stringify({ timestamp: new Date().toISOString() }),
            });
          } catch (error) {
            console.error("Error sending initial heartbeat:", error);
          }

          // Start sending heartbeat periodically
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }
          heartbeatIntervalRef.current = setInterval(() => {
            if (stompClient.connected) {
              try {
                stompClient.publish({
                  destination: "/app/user/heartbeat",
                  body: JSON.stringify({ timestamp: new Date().toISOString() }),
                });
              } catch (error) {
                console.error("Error sending heartbeat:", error);
              }
            }
          }, 30000); // Send heartbeat every 30 seconds

          onConnectRef.current?.();
        },
        onStompError: (frame) => {
          isConnectingRef.current = false;
          console.error("STOMP error:", frame.headers?.["message"] || frame);
          setIsConnected(false);

          // Don't reconnect on authentication errors
          if (
            frame.headers?.["message"]?.includes("401") ||
            frame.headers?.["message"]?.includes("Unauthorized")
          ) {
            console.warn(
              "WebSocket authentication failed, stopping reconnection attempts"
            );
            return;
          }

          // Attempt reconnect for other errors
          if (enabled && reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, 5000 * reconnectAttemptsRef.current); // Exponential backoff
          }
        },
        onWebSocketClose: () => {
          isConnectingRef.current = false;
          setIsConnected(false);
          onDisconnectRef.current?.();

          // Clear heartbeat
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
          }

          // Only attempt to reconnect if we haven't exceeded max attempts
          if (enabled && reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, 5000 * reconnectAttemptsRef.current); // Exponential backoff
          } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            console.warn(
              "Max reconnection attempts reached, stopping WebSocket reconnection"
            );
          }
        },
      });

      clientRef.current = stompClient;
      stompClient.activate();
    } catch (error) {
      isConnectingRef.current = false;
      console.error("Error connecting WebSocket:", error);

      if (enabled && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000 * reconnectAttemptsRef.current);
      }
    }
  }, [enabled]);

  const disconnect = useCallback(() => {
    isConnectingRef.current = false;
    reconnectAttemptsRef.current = 0;

    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch (e) {
        // Ignore unsubscribe errors
      }
      subscriptionRef.current = null;
    }

    if (clientRef.current) {
      try {
        clientRef.current.deactivate();
      } catch (e) {
        // Ignore deactivate errors
      }
      clientRef.current = null;
    }

    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]); // Only depend on enabled, not connect/disconnect to avoid loops

  return {
    isConnected,
    connect,
    disconnect,
  };
};
