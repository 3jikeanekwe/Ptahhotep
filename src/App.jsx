import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Minimize2, Maximize2, Bot, Globe, FileText, Terminal, Settings, Grip } from 'lucide-react';

// FloatingWindow Component
const FloatingWindow = ({ id, title, icon: Icon, children, position, size, onClose, onPositionChange, onSizeChange, isActive, onActivate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, initialW: 0, initialH: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-header') && !e.target.closest('button')) {
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: position.x,
        initialY: position.y
      };
      onActivate();
    }
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.window-header') && !e.target.closest('button')) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        initialX: position.x,
        initialY: position.y
      };
      onActivate();
    }
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    resizeRef.current = {
      startX: clientX,
      startY: clientY,
      initialW: size.width,
      initialH: size.height
    };
    onActivate();
  };

  useEffect(() => {
    const handleMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (isDragging) {
        const deltaX = clientX - dragRef.current.startX;
        const deltaY = clientY - dragRef.current.startY;
        onPositionChange({
          x: Math.max(0, dragRef.current.initialX + deltaX),
          y: Math.max(0, dragRef.current.initialY + deltaY)
        });
      } else if (isResizing) {
        const deltaX = clientX - resizeRef.current.startX;
        const deltaY = clientY - resizeRef.current.startY;
        onSizeChange({
          width: Math.max(300, resizeRef.current.initialW + deltaX),
          height: Math.max(200, resizeRef.current.initialH + deltaY)
        });
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, isResizing, onPositionChange, onSizeChange]);

  return (
    <div
      className={`absolute bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden transition-all ${
        isActive ? 'ring-2 ring-blue-500' : ''
      } ${isMinimized ? 'h-12' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`,
        zIndex: isActive ? 1000 : 900
      }}
      onMouseDown={() => onActivate()}
      onTouchStart={() => onActivate()}
    >
      <div
        className="window-header flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-purple-600 cursor-move select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-white" />
          <span className="text-white font-medium text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 size={14} className="text-white" /> : <Minimize2 size={14} className="text-white" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-500 rounded transition-colors"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      </div>
      {!isMinimized && (
        <>
          <div className="p-4 overflow-auto" style={{ height: `${size.height - 48}px` }}>
            {children}
          </div>
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize hover:bg-white/10 flex items-center justify-center"
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
          >
            <Grip size={16} className="text-gray-400 rotate-45" />
          </div>
        </>
      )}
    </div>
  );
};

// Chainer Panel Component
const ChainerPanel = () => {
  const [automations, setAutomations] = useState([
    { id: 1, name: 'Web Scraper', status: 'running', url: 'example.com', progress: 75 },
    { id: 2, name: 'Form Filler', status: 'paused', url: 'forms.io', progress: 40 },
    { id: 3, name: 'Data Extractor', status: 'running', url: 'data.site', progress: 90 }
  ]);

  const addAutomation = () => {
    const newAuto = {
      id: automations.length + 1,
      name: `Automation ${automations.length + 1}`,
      status: 'idle',
      url: 'new-site.com',
      progress: 0
    };
    setAutomations([...automations, newAuto]);
  };

  return (
    <div className="text-white space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">Active Automations</h3>
        <span className="text-xs bg-blue-500/20 px-2 py-1 rounded">{automations.length} running</span>
      </div>
      <div className="space-y-3 max-h-64 overflow-auto">
        {automations.map(auto => (
          <div key={auto.id} className="bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">{auto.name}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                auto.status === 'running' ? 'bg-green-500' : 
                auto.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}>
                {auto.status}
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
              <Globe size={12} />
              {auto.url}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${auto.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={addAutomation}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        + New Automation
      </button>
    </div>
  );
};

// Razor Panel Component
const RazorPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([
    { domain: 'wikipedia.org', status: 'indexed', links: 1247, tlds: 5 },
    { domain: 'github.com', status: 'crawling', links: 892, tlds: 3 },
    { domain: 'stackoverflow.com', status: 'indexed', links: 2103, tlds: 7 },
    { domain: 'medium.com', status: 'pending', links: 0, tlds: 4 }
  ]);

  const startScan = () => {
    if (searchQuery.trim()) {
      const newResult = {
        domain: searchQuery.includes('.') ? searchQuery : `${searchQuery}.com`,
        status: 'scanning',
        links: 0,
        tlds: 0
      };
      setResults([newResult, ...results]);
      setSearchQuery('');
    }
  };

  return (
    <div className="text-white space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">Razor Aggregator</h3>
        <span className="text-xs bg-purple-500/20 px-2 py-1 rounded">{results.length} domains</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter concept or domain..."
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && startScan()}
        />
        <button 
          onClick={startScan}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Scan
        </button>
      </div>
      <div className="space-y-2 max-h-64 overflow-auto">
        {results.map((result, idx) => (
          <div key={idx} className="bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm">{result.domain}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                result.status === 'indexed' ? 'bg-green-500/20 text-green-400' :
                result.status === 'crawling' ? 'bg-blue-500/20 text-blue-400' :
                result.status === 'scanning' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {result.status}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{result.links} links indexed</span>
              <span>{result.tlds} TLDs scanned</span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors text-sm font-medium">
        Start Predictive Scan
      </button>
    </div>
  );
};

// NotePad Component
const NotePad = () => {
  const [notes, setNotes] = useState(`# Welcome to Ptahhotep! 

✨ This is your collaborative workspace
📝 Share notes with your team
🔗 Link to automations
⚡ Build workflows

## Quick Start:
1. Create automation workflows in Chainer
2. Aggregate web data with Razor
3. Add mini-browsers for monitoring
4. Collaborate in real-time

---
Start typing your notes below...
`);

  return (
    <div className="h-full">
      <textarea
        className="w-full h-full bg-gray-800 text-white p-4 rounded-lg outline-none resize-none font-mono text-sm leading-relaxed"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type your notes here..."
      />
    </div>
  );
};

// MiniBrowser Component
const MiniBrowser = ({ url: initialUrl }) => {
  const [url, setUrl] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

  const navigate = () => {
    setCurrentUrl(url);
  };

  return (
    <div className="text-white h-full flex flex-col">
      <div className="bg-gray-800 px-3 py-2 rounded-t-lg flex items-center gap-2">
        <Globe size={14} className="text-gray-400" />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && navigate()}
          className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter URL..."
        />
        <button 
          onClick={navigate}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs transition-colors"
        >
          Go
        </button>
      </div>
      <div className="flex-1 bg-gray-800 p-4 rounded-b-lg overflow-auto">
        <div className="text-sm text-gray-400 space-y-2">
          <p className="font-medium text-white">Mini-Browser: {currentUrl}</p>
          <div className="border-l-2 border-blue-500 pl-3 space-y-1">
            <p>🔍 Scanning page structure...</p>
            <p>📊 Analyzing content...</p>
            <p>🤖 Automation ready</p>
          </div>
          <div className="mt-4 p-3 bg-gray-900 rounded">
            <p className="text-xs text-gray-500">This window shows live automation activity and page monitoring.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Terminal Component
const Terminal = () => {
  const [commands, setCommands] = useState([
    { type: 'output', text: 'Ptahhotep Terminal v1.0.0' },
    { type: 'output', text: 'Type "help" for available commands' }
  ]);
  const [input, setInput] = useState('');

  const executeCommand = () => {
    if (!input.trim()) return;

    const newCommands = [...commands, { type: 'input', text: `$ ${input}` }];

    if (input === 'help') {
      newCommands.push({ type: 'output', text: 'Available commands: help, clear, status, version' });
    } else if (input === 'clear') {
      setCommands([]);
      setInput('');
      return;
    } else if (input === 'status') {
      newCommands.push({ type: 'output', text: 'System: Online | Automations: 3 active | Domains: 4 indexed' });
    } else if (input === 'version') {
      newCommands.push({ type: 'output', text: 'Ptahhotep v1.0.0 - Automation & Aggregation Platform' });
    } else {
      newCommands.push({ type: 'output', text: `Command not found: ${input}` });
    }

    setCommands(newCommands);
    setInput('');
  };

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm p-3 flex flex-col">
      <div className="flex-1 overflow-auto space-y-1">
        {commands.map((cmd, idx) => (
          <div key={idx} className={cmd.type === 'input' ? 'text-white' : 'text-green-400'}>
            {cmd.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 border-t border-green-900 pt-2">
        <span className="text-green-400">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
          className="flex-1 bg-transparent outline-none text-white"
          placeholder="Enter command..."
          autoFocus
        />
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [windows, setWindows] = useState([
    {
      id: 'chainer',
      title: 'Chainer Automation',
      icon: Bot,
      component: ChainerPanel,
      position: { x: 50, y: 100 },
      size: { width: 400, height: 450 }
    },
    {
      id: 'razor',
      title: 'Razor Aggregator',
      icon: Globe,
      component: RazorPanel,
      position: { x: 480, y: 100 },
      size: { width: 400, height: 450 }
    },
    {
      id: 'notepad',
      title: 'Collaborative Notes',
      icon: FileText,
      component: NotePad,
      position: { x: 50, y: 580 },
      size: { width: 500, height: 300 }
    }
  ]);

  const [activeWindow, setActiveWindow] = useState('chainer');
  const [nextId, setNextId] = useState(4);

  const addWindow = (type) => {
    const templates = {
      browser: {
        title: 'Mini Browser',
        icon: Globe,
        component: () => <MiniBrowser url="https://example.com" />,
        size: { width: 450, height: 500 }
      },
      terminal: {
        title: 'Terminal',
        icon: Terminal,
        component: Terminal,
        size: { width: 500, height: 350 }
      }
    };

    const template = templates[type];
    if (template) {
      const newWindow = {
        id: `window-${nextId}`,
        ...template,
        position: { x: 100 + (nextId * 20), y: 100 + (nextId * 20) }
      };
      setWindows([...windows, newWindow]);
      setNextId(nextId + 1);
      setActiveWindow(`window-${nextId}`);
    }
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const updateWindowPosition = (id, position) => {
    setWindows(windows.map(w => w.id === id ? { ...w, position } : w));
  };

  const updateWindowSize = (id, size) => {
    setWindows(windows.map(w => w.id === id ? { ...w, size } : w));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Branding */}
      <div className="absolute top-4 left-4 z-40">
        <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-lg px-4 py-2 rounded-full">
          <Bot size={20} className="text-blue-400" />
          <span className="text-white font-bold text-lg">Ptahhotep</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-full px-6 py-3 shadow-2xl flex items-center gap-4">
          <button
            onClick={() => addWindow('browser')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors text-white text-sm font-medium"
          >
            <Plus size={16} />
            Browser
          </button>
          <button
            onClick={() => addWindow('terminal')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors text-white text-sm font-medium"
          >
            <Plus size={16} />
            Terminal
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <Settings size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Floating Windows */}
      {windows.map(window => (
        <FloatingWindow
          key={window.id}
          id={window.id}
          title={window.title}
          icon={window.icon}
          position={window.position}
          size={window.size}
          isActive={activeWindow === window.id}
          onActivate={() => setActiveWindow(window.id)}
          onClose={() => closeWindow(window.id)}
          onPositionChange={(pos) => updateWindowPosition(window.id, pos)}
          onSizeChange={(size) => updateWindowSize(window.id, size)}
        >
          <window.component />
        </FloatingWindow>
      ))}

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 right-4 z-40">
        <div className="bg-gray-900/80 backdrop-blur-lg px-4 py-2 rounded-full text-white text-xs flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Online</span>
          </div>
          <span className="text-gray-500">|</span>
          <span>{windows.length} windows</span>
        </div>
      </div>
    </div>
  );
            }
