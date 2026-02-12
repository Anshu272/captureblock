import { useState, useEffect, useCallback } from 'react';

import Grid from './components/Grid';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SetupScreen from './components/SetupScreen';
import useWebSocket from './hooks/useWebSocket';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [blocks, setBlocks] = useState({});
  const [userId, setUserId] = useState(null);
  const [userColor, setUserColor] = useState(null);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalBlocksClaimed: 0,
    totalUsers: 0,
    leaderboard: []
  });
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [myBlocksCount, setMyBlocksCount] = useState(0);
  const [showSetup, setShowSetup] = useState(true);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast && !toast.includes('Cooldown')) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime(prev => Math.max(0, prev - 100));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [cooldownTime]);

  useEffect(() => {
    if (cooldownTime > 0) {
      setToast(`Cooldown: ${(cooldownTime / 1000).toFixed(0)}s`);
    } else if (toast && toast.includes('Cooldown')) {
      setToast(null);
    }
  }, [cooldownTime]);

  const { isConnected, sendMessage } = useWebSocket(WS_URL, {
    onMessage: useCallback((data) => {
      switch (data.type) {
        case 'init':
          setUserId(data.userId);
          setUserColor(data.color);
          setConnectedUsers(data.connectedUsers);

          const blocksObj = {};
          data.blocks.forEach(block => {
            blocksObj[`${block.x},${block.y}`] = block;
          });
          setBlocks(blocksObj);
          setStats(data.stats);

          const myCount = data.blocks.filter(b => b.owner_id === data.userId).length;
          setMyBlocksCount(myCount);
          break;

        case 'block-claimed':
          const { block } = data;
          setBlocks(prev => ({
            ...prev,
            [`${block.x},${block.y}`]: block
          }));

          if (block.owner_id === userId) {
            setMyBlocksCount(prev => prev + 1);
          }
          break;

        case 'claim-failed':
          console.log('Block already claimed');
          break;

        case 'stats-update':
          setStats(data.stats);
          break;

        case 'user-count':
          setConnectedUsers(data.count);
          break;

        case 'name-updated':
          setUserName(data.name);
          break;

        case 'user-color-updated':
          if (data.userId === userId) {
            setUserColor(data.color);
          }
          fetch(`${API_URL}/api/grid`)
            .then(res => res.json())
            .then(gridData => {
              const blocksObj = {};
              gridData.blocks.forEach(block => {
                blocksObj[`${block.x},${block.y}`] = block;
              });
              setBlocks(blocksObj);
            });
          break;

        case 'blocks-cleared':
          setBlocks(prev => {
            const newBlocks = { ...prev };
            data.blocks.forEach(block => {
              delete newBlocks[`${block.x},${block.y}`];
            });
            return newBlocks;
          });
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    }, [userId])
  });

  const handleBlockClick = useCallback((x, y) => {
    if (!isConnected || blocks[`${x},${y}`]) return;

    if (cooldownTime > 0) {
      return;
    }

    sendMessage({
      type: 'claim-block',
      x,
      y
    });

    setCooldownTime(2000);
  }, [isConnected, blocks, sendMessage, cooldownTime]);

  const handleNameChange = useCallback((name) => {
    setUserName(name);
    if (name.trim()) {
      sendMessage({
        type: 'update-name',
        name: name.trim()
      });
    }
  }, [sendMessage]);

  const handleJoin = useCallback((name, color) => {
    setUserName(name);
    setUserColor(color);

    sendMessage({
      type: 'update-name',
      name: name
    });

    sendMessage({
      type: 'update-color',
      color: color
    });

    setShowSetup(false);
  }, [sendMessage]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-black bg-main-gradient relative text-white font-sans overflow-x-hidden">
      {showSetup && <SetupScreen onJoin={handleJoin} />}

      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-accent-primary text-black px-6 py-3 rounded-full font-bold shadow-gold animate-fade-in flex items-center gap-2 tabular-nums">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {toast}
        </div>
      )}

      <Header
        isConnected={isConnected}
        userColor={showSetup ? null : userColor}
        userName={showSetup ? '' : userName}
        onNameChange={handleNameChange}
        connectedUsers={connectedUsers}
      />

      <main className="flex-1 flex flex-col lg:flex-row gap-8 p-4 lg:p-8 w-full max-w-[1920px] mx-auto">
        <div className="flex-1 flex flex-col items-center justify-start min-w-0 w-full">
          <div className="w-full bg-bg-glass backdrop-blur-xl border border-white/5 rounded-3xl p-4 lg:p-6 shadow-2xl flex justify-center">
            <Grid
              blocks={blocks}
              userId={userId}
              onBlockClick={handleBlockClick}
            />
          </div>
        </div>

        <Sidebar
          myColor={userColor}
          myBlocksCount={myBlocksCount}
          stats={stats}
          connectedUsers={connectedUsers}
        />
      </main>
    </div>
  );
}

export default App;
