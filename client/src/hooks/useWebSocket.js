import { useState, useEffect, useRef, useCallback } from 'react';

function useWebSocket(url, { onMessage }) {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const connect = useCallback(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                console.log('✅ WebSocket connected');
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    onMessageRef.current(data);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('❌ WebSocket disconnected');
                setIsConnected(false);
                wsRef.current = null;

                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('🔄 Attempting to reconnect...');
                    connect();
                }, 3000);
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('Error creating WebSocket:', error);
        }
    }, [url]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            const ws = wsRef.current;
            if (ws) {
                ws.onclose = null;
                ws.onerror = null;
                ws.onmessage = null;
                ws.onopen = null;

                if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                    ws.close();
                }
                wsRef.current = null;
            }
        };
    }, [connect]);

    const sendMessage = useCallback((data) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket not connected');
        }
    }, []);

    return { isConnected, sendMessage };
}

export default useWebSocket;
