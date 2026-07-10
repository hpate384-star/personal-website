"use client";
import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { WindowCtx, TrafficLights } from './Window';
import { DocSVG } from './WindowContent';
import { supabase, getOrCreateSessionId } from '../lib/supabase';
import finderImg from '../assets/finder.png';
import photosImg from '../assets/icnsFile_9169c54cad74198883d2831f20d5a6de_Photos.png';

if (typeof window !== 'undefined' && window.AudioContext) {
  const originalClose = window.AudioContext.prototype.close;
  window.AudioContext.prototype.close = function () {
    try {
      if (this.state === 'closed') return Promise.resolve();
      const res = originalClose.apply(this, arguments);
      if (res && res.catch) return res.catch(() => { });
      return res;
    } catch (e) {
      return Promise.resolve();
    }
  };
}


const SIDEBAR_BG = 'rgba(250, 250, 253, 0.85)';
const SIDEBAR_BLUR = 'blur(30px)';
const SIDEBAR_BORDER = '1px solid #d5d5d5';
const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif';


function Avatar({ size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      backgroundColor: '#fff', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', flexShrink: 0,
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
      userSelect: 'none',
    }}>
      <svg width={size} height={size} viewBox="0 0 51.25 50.918" style={{ display: 'block' }}>
        <g>
          <path d="M50.8789 25.4492C50.8789 39.4531 39.4531 50.8789 25.4297 50.8789C11.4258 50.8789 0 39.4531 0 25.4492C0 11.4258 11.4258 0 25.4297 0C39.4531 0 50.8789 11.4258 50.8789 25.4492ZM9.64844 40.957C13.4766 45.0391 19.3359 47.6172 25.4297 47.6172C31.5039 47.6172 37.3828 45.0391 41.2109 40.957C38.4375 36.5625 32.3047 33.9453 25.4297 33.9453C18.4961 33.9453 12.3828 36.6016 9.64844 40.957ZM16.8164 20.1562C16.8164 25.5664 20.5859 29.6289 25.4297 29.668C30.2734 29.707 34.043 25.5664 34.043 20.1562C34.043 15.0781 30.2344 10.8594 25.4297 10.8594C20.625 10.8594 16.7773 15.0781 16.8164 20.1562Z" fill="#a2a7b1" />
        </g>
      </svg>
    </div>
  );
}

function Bubble({ text, isMe, tail, delivered, replyToMsg, onContextMenu, onDoubleClick }) {
  const isImage = text && text.startsWith('__IMAGE__::');
  const isFile = text && text.startsWith('__FILE__::');

  let content = text;
  let bubbleStyle = {};

  if (isImage) {
    const parts = text.split('::');
    const filename = parts[1];
    const dataUrl = parts[2] || parts.slice(2).join('::');
    content = <img src={dataUrl} alt={filename} style={{ maxWidth: 220, maxHeight: 220, borderRadius: 14, display: 'block', objectFit: 'cover' }} />;
    bubbleStyle = { background: 'transparent', padding: 0, overflow: 'hidden' };
  } else if (isFile) {
    const parts = text.split('::');
    const filename = parts[1];
    const dataUrl = parts[2] || parts.slice(2).join('::');
    const ext = (filename.split('.').pop() || '').toUpperCase().substring(0, 3);
    content = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 4px' }}>
        <div style={{ width: 32, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DocSVG ext={ext} color="#666" />
        </div>
        <span style={{ fontWeight: 500, fontSize: 13, textDecoration: 'underline', wordBreak: 'break-all' }}>{filename}</span>
      </div>
    );
  }

  const bubbleClass = `imsg-bubble ${isMe ? 'imsg-bubble-me' : 'imsg-bubble-other'} ${tail && !isImage ? 'imsg-tail' : ''}`;

  return (
    <div
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMe ? 'flex-end' : 'flex-start',
        marginBottom: 2,
        maxWidth: '70%',
        position: 'relative',
        cursor: (isImage || isFile) ? 'pointer' : 'default'
      }}>
      <div className={bubbleClass} style={bubbleStyle}>
        {replyToMsg && (
          <div style={{
            fontSize: 12, color: isMe ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
            marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500
          }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 1L0 7L6 13V9C11 9 14 11 16 15C15 10 12 5 6 5V1Z" />
            </svg>
            {replyToMsg.text && replyToMsg.text.startsWith('__IMAGE__') ? '[Image]' : replyToMsg.text && replyToMsg.text.startsWith('__FILE__') ? '[File]' : replyToMsg.text}
          </div>
        )}
        {content}
      </div>
      {delivered === true && (
        <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 3 }}>Delivered</div>
      )}
      {delivered === false && isMe && (
        <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 3 }}>Sending...</div>
      )}
    </div>
  );
}


function TimestampDivider({ label }) {
  return (
    <div style={{
      textAlign: 'center', fontSize: 11, color: '#8E8E93',
      fontWeight: 500, padding: '10px 0 6px',
      letterSpacing: '-0.01em', userSelect: 'none',
    }}>
      {label}
    </div>
  );
}


function formatAppleTimestamp(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  const timeStr = date.toLocaleTimeString('en-US', timeOptions);

  if (date.toDateString() === now.toDateString()) {
    return timeStr;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${timeStr}`;
  }

  if (diffDays < 7) {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${weekday} ${timeStr}`;
  }

  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (date.getFullYear() !== now.getFullYear()) {
    return `${dateStr}, ${date.getFullYear()} ${timeStr}`;
  }
  return `${dateStr} ${timeStr}`;
}

function getSortedMessagesWithDividers(allMsgs) {

  const msgsOnly = allMsgs.filter(m => m.type !== 'ts');


  const sorted = [...msgsOnly].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const result = [];
  let lastTimestamp = null;

  sorted.forEach((msg) => {
    const currentTimestamp = new Date(msg.timestamp);




    if (!lastTimestamp || (currentTimestamp - lastTimestamp >= 15 * 60 * 1000)) {
      result.push({
        id: `ts-${msg.id}`,
        type: 'ts',
        label: formatAppleTimestamp(currentTimestamp)
      });
    }

    result.push(msg);
    lastTimestamp = currentTimestamp;
  });

  return result;
}


function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 8 }}>
      <div style={{ background: '#E9E9EB', borderRadius: '18px 18px 18px 4px', padding: '10px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#8E8E93', animation: 'imsgDot 1.2s ' + (i * 0.2) + 's ease-in-out infinite' }} />
        ))}
      </div>
    </div>
  );
}


export function IMessageContent() {
  const [inputText, setInputText] = useState('');
  const [chatMsgs, setChatMsgs] = useState([]);
  const [uiMsgs, setUiMsgs] = useState([
    { id: 'init-0', isMe: false, text: "Hey! Thanks for visiting my portfolio. What's your name?", tail: true, timestamp: new Date(Date.now() - 5000) },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatStage, setChatStage] = useState('ASK_NAME');
  const [visitorName, setVisitorName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [contextMenu, setContextMenu] = useState({ isOpen: false, msg: null, rect: null });
  const [replyingTo, setReplyingTo] = useState(null);

  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);
  const inputRef = useRef(null);
  const ctx = useContext(WindowCtx);

  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    if (!plusMenuOpen) return;
    const handleGlobalClick = () => {
      setPlusMenuOpen(false);
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, [plusMenuOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const newId = 'local-' + Date.now();
    const text = `__FILE__::${file.name}::${objectUrl}`;
    const msgData = { id: newId, isMe: true, text, tail: true, delivered: false, replyToMsg: replyingTo, timestamp: new Date() };
    setChatMsgs(prev => [...prev, msgData]);
    const currentReply = replyingTo;
    setReplyingTo(null);
    e.target.value = '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', '__FILE__');
    formData.append('visitorName', visitorName);
    formData.append('sessionId', sessionId);
    if (currentReply) formData.append('replyToMsg', JSON.stringify(currentReply));

    fetch('/api/send-message', {
      method: 'POST',
      body: formData,
    }).then(res => {
      if (res.ok) setChatMsgs(msgs => msgs.map(m => m.id === newId ? { ...m, delivered: true } : m));
    }).catch(err => console.error('Failed to send file message:', err));
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(blob => {
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          }, 'image/jpeg', 0.8);
        }
      }
    });
  };

  const handlePhotoChange = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;
    
    // Compress image if larger than 1MB
    if (file.size > 1024 * 1024) {
      file = await compressImage(file);
    }
    
    const objectUrl = URL.createObjectURL(file);
    const newId = 'local-' + Date.now();
    const text = `__IMAGE__::${file.name}::${objectUrl}`;
    const msgData = { id: newId, isMe: true, text, tail: true, delivered: false, replyToMsg: replyingTo, timestamp: new Date() };
    setChatMsgs(prev => [...prev, msgData]);
    const currentReply = replyingTo;
    setReplyingTo(null);
    e.target.value = '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', '__IMAGE__');
    formData.append('visitorName', visitorName);
    formData.append('sessionId', sessionId);
    if (currentReply) formData.append('replyToMsg', JSON.stringify(currentReply));

    fetch('/api/send-message', {
      method: 'POST',
      body: formData,
    }).then(res => {
      if (res.ok) setChatMsgs(msgs => msgs.map(m => m.id === newId ? { ...m, delivered: true } : m));
    }).catch(err => console.error('Failed to send photo message:', err));
  };


  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const waveSurferRef = useRef(null);
  const recordPluginRef = useRef(null);
  const waveformContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setRecordingTime(0);

      transcriptRef.current = '';
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          transcriptRef.current = currentTranscript;
        };
        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      console.error("Microphone access denied or error", err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const finalTranscript = transcriptRef.current.trim();
    if (finalTranscript) {
      setInputText(prev => prev ? prev + ' ' + finalTranscript : finalTranscript);
    }
    transcriptRef.current = '';
  };

  useEffect(() => {
    if (isRecording && waveformContainerRef.current) {
      const ws = WaveSurfer.create({
        container: waveformContainerRef.current,
        waveColor: '#FF3B30',
        progressColor: '#FF3B30',
        barWidth: 3,
        barGap: 3,
        barRadius: 2,
        height: 24,
        cursorWidth: 0,
        interact: false,
      });
      waveSurferRef.current = ws;

      const record = ws.registerPlugin(RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
        scrollingWaveformWindow: 3
      }));
      recordPluginRef.current = record;

      record.on('record-progress', (time) => {
        setRecordingTime(Math.floor(time / 1000));
      });

      record.startRecording().catch(err => {
        console.error(err);
        setIsRecording(false);
      });

      return () => {
        try {
          if (recordPluginRef.current && recordPluginRef.current.isRecording()) {
            recordPluginRef.current.stopRecording();
          }
        } catch (e) {

        }
        try {
          ws.destroy();
        } catch (e) { }
      };
    }
  }, [isRecording]);


  useEffect(() => {
    const sId = getOrCreateSessionId();
    setSessionId(sId);


    supabase
      .from('messages')
      .select('*')
      .eq('session_id', sId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {

          return;
        }
        if (data && data.length > 0) {

          const visitorMsg = data.find(m => m.sender === 'visitor' && m.visitor_name);
          const savedName = visitorMsg ? visitorMsg.visitor_name : '';
          if (savedName) setVisitorName(savedName);


          const realMessages = data.filter(m => !m.is_system);


          const mapped = realMessages.map(m => {
            let bodyText = m.body;
            let replyData = null;
            if (bodyText && bodyText.startsWith('__REPLY__::')) {
              const parts = bodyText.split('::__BODY__::');
              if (parts.length === 2) {
                bodyText = parts[1];
                const replyParts = parts[0].replace('__REPLY__::', '').split('::');
                replyData = { id: replyParts[0], text: replyParts.slice(1).join('::') };
              }
            }
            return {
              id: m.id,
              isMe: m.sender === 'visitor',
              text: bodyText,
              replyToMsg: replyData,
              tail: true,
              fromDb: true,
              timestamp: new Date(m.created_at),
              read: m.read
            };
          });


          const baseTime = data[0].created_at ? new Date(data[0].created_at) : new Date();
          const reconstructed = [
            { id: 'init-0', isMe: false, text: "Hey! Thanks for visiting my portfolio. What's your name?", tail: true, timestamp: new Date(baseTime.getTime() - 10000) },
          ];
          if (savedName) {
            reconstructed.push({ id: 'init-1', isMe: true, text: savedName, tail: true, timestamp: new Date(baseTime.getTime() - 5000) });
            reconstructed.push({ id: 'init-2', isMe: false, text: `Nice to meet you, ${savedName}! What would you like to say? (Drop your email so I can reply!)`, tail: true, timestamp: new Date(baseTime.getTime()) });
          }

          setUiMsgs(reconstructed);
          setChatMsgs(mapped);
          setChatStage(savedName ? 'LIVE' : 'ASK_NAME');
        }
      });
  }, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [uiMsgs, chatMsgs, isTyping]);


  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`messages-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new;

          if (row.sender === 'visitor') return;


          setChatMsgs(msgs => {
            if (msgs.some(m => m.id === row.id)) return msgs;
            let bodyText = row.body;
            let replyData = null;
            if (bodyText && bodyText.startsWith('__REPLY__::')) {
              const parts = bodyText.split('::__BODY__::');
              if (parts.length === 2) {
                bodyText = parts[1];
                const replyParts = parts[0].replace('__REPLY__::', '').split('::');
                replyData = { id: replyParts[0], text: replyParts.slice(1).join('::') };
              }
            }
            return [...msgs, { id: row.id, isMe: false, text: bodyText, replyToMsg: replyData, tail: true, fromDb: true, timestamp: new Date(row.created_at) }];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);


  async function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    const newId = 'local-' + Date.now();
    setInputText('');


    if (chatStage === 'ASK_NAME') {

      setUiMsgs(prev => [...prev, { id: newId, isMe: true, text, tail: true, timestamp: new Date() }]);
      setVisitorName(text);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const replyText = `Nice to meet you, ${text}! What would you like to say? (Drop your email so I can reply!)`;
        setUiMsgs(prev => [
          ...prev,
          { id: newId + '-reply', isMe: false, text: replyText, tail: true, timestamp: new Date() },
        ]);
        setChatStage('ASK_MESSAGE');
      }, 1200);

    } else {

      const msgData = { id: newId, isMe: true, text, tail: true, delivered: false, replyToMsg: replyingTo, timestamp: new Date() };
      setChatMsgs(prev => [...prev, msgData]);
      const currentReply = replyingTo;
      setReplyingTo(null);

      fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, visitorName, sessionId, replyToMsg: currentReply }),
      }).then(res => {
        if (res.ok) setChatMsgs(msgs => msgs.map(m => m.id === newId ? { ...m, delivered: true } : m));
      }).catch(err => console.error('Failed to send message:', err));

      if (chatStage === 'ASK_MESSAGE') {
        setChatStage('LIVE');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const ackText = "Got it! I'll reply shortly. Keep an eye here — my replies will show up live! 👀";
          setChatMsgs(prev => [
            ...prev,
            { id: newId + '-ack', isMe: false, text: ackText, tail: true, timestamp: new Date() },
          ]);
        }, 1400);
      }

    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }


  const allMsgs = [
    ...uiMsgs,
    ...chatMsgs,
  ];
  const processedMsgs = getSortedMessagesWithDividers(allMsgs);

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: FONT, background: 'transparent', overflow: 'hidden' }}>

      { }
      <div style={{
        width: 300, flexShrink: 0,
        background: SIDEBAR_BG, backdropFilter: SIDEBAR_BLUR,
        WebkitBackdropFilter: SIDEBAR_BLUR,
        borderRight: SIDEBAR_BORDER,
        display: 'flex', flexDirection: 'column',
        height: '100%', userSelect: 'none',
      }}>
        { }
        <div
          onMouseDown={ctx?.onTitleBarMouseDown}
          style={{
            padding: '14px 16px 8px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0, cursor: 'grab', height: 52, boxSizing: 'border-box',
          }}
        >
          {ctx ? (
            <TrafficLights onClose={ctx.onClose} onMinimize={ctx.onMinimize} />
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            </div>
          )}
          <ComposeButton />
        </div>

        { }
        <div style={{ padding: '4px 12px 10px', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(0,0,0,0.08)', borderRadius: 6,
            padding: '4.5px 8px', gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#8E8E93" strokeWidth="1.6" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="7" r="4.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Search" style={{
              border: 'none', background: 'transparent', outline: 'none',
              flex: 1, fontSize: 13.5, color: '#000', fontFamily: FONT,
              padding: 0, lineHeight: '18px',
            }} />
          </div>
        </div>

        { }
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <ConversationRow
            name="+1 (647) 291-6312"
            preview={(() => {
              if (chatMsgs.length === 0) return 'Start a conversation';
              const lastMsgText = chatMsgs[chatMsgs.length - 1].text;
              if (lastMsgText && lastMsgText.startsWith('__IMAGE__::')) return '[Image]';
              if (lastMsgText && lastMsgText.startsWith('__FILE__::')) return `[File: ${lastMsgText.split('::')[1]}]`;
              return lastMsgText;
            })()}
            time="Now"
            selected={true}
          />
        </div>
      </div>

      { }
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', minWidth: 0 }}>

        { }
        <div
          onMouseDown={ctx?.onTitleBarMouseDown}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px 10px 16px', height: 52, boxSizing: 'border-box',
            borderBottom: '1px solid #d1d1d1',
            background: '#f6f6f6',
            flexShrink: 0,
            cursor: 'grab',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 8 }}>
            <span style={{ fontSize: 13.5, color: '#8E8E93', fontWeight: 400 }}>To:</span>
            <span style={{ fontSize: 13.5, color: '#1c1c1e', fontWeight: 500 }}>+1 (647) 291-6312</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 0, pointerEvents: 'auto' }}>
            <HeaderIconBtn title="FaceTime Video">
              <svg width="20" height="12.6" viewBox="0 0 65.3516 41.2695">
                <g>
                  <rect height="41.2695" opacity="0" width="65.3516" x="0" y="0" />
                  <path d="M12.832 41.2305L39.6094 41.2305C45.5859 41.2305 49.082 37.793 49.082 31.8359L49.082 9.39453C49.082 3.4375 45.5859 0 39.6094 0L12.832 0C7.08984 0 3.35938 3.4375 3.35938 9.39453L3.35938 31.8359C3.35938 37.793 6.875 41.2305 12.832 41.2305ZM13.457 37.9883C9.17969 37.9883 6.81641 35.7812 6.81641 31.3086L6.81641 9.94141C6.81641 5.44922 9.17969 3.24219 13.457 3.24219L38.9844 3.24219C43.2617 3.24219 45.625 5.44922 45.625 9.94141L45.625 31.3086C45.625 35.7812 43.2617 37.9883 38.9844 37.9883ZM48.5547 13.9062L48.5547 17.9688L60.5859 8.14453C60.8984 7.89062 61.1523 7.71484 61.4258 7.71484C61.8164 7.71484 62.0117 8.02734 62.0117 8.51562L62.0117 32.7148C62.0117 33.2227 61.8164 33.5156 61.4258 33.5156C61.1523 33.5156 60.8984 33.3203 60.5859 33.0859L48.5547 23.2617L48.5547 27.3438L58.9062 35.9961C59.9023 36.7969 60.9375 37.3438 61.9727 37.3438C64.0039 37.3438 65.3516 35.8594 65.3516 33.6328L65.3516 7.61719C65.3516 5.39062 64.0039 3.88672 61.9727 3.88672C60.9375 3.88672 59.9023 4.43359 58.9062 5.25391Z" fill="#636366" />
                </g>
              </svg>
            </HeaderIconBtn>
            <HeaderIconBtn title="Info">
              <svg width="17" height="17" viewBox="0 0 51.25 50.918">
                <g>
                  <rect height="50.918" opacity="0" width="51.25" x="0" y="0" />
                  <path d="M25.4297 50.8789C39.4727 50.8789 50.8789 39.4922 50.8789 25.4492C50.8789 11.4062 39.4727 0 25.4297 0C11.3867 0 0 11.4062 0 25.4492C0 39.4922 11.3867 50.8789 25.4297 50.8789ZM25.4297 47.2461C13.3789 47.2461 3.63281 37.5 3.63281 25.4492C3.63281 13.3984 13.3789 3.65234 25.4297 3.65234C37.4805 3.65234 47.2266 13.3984 47.2266 25.4492C47.2266 37.5 37.4805 47.2461 25.4297 47.2461Z" fill="#636366" />
                  <path d="M20.957 39.4336L31.25 39.4336C32.1484 39.4336 32.8516 38.7695 32.8516 37.8906C32.8516 37.0312 32.1484 36.3477 31.25 36.3477L27.8125 36.3477L27.8125 22.6953C27.8125 21.5625 27.2266 20.7812 26.1328 20.7812L21.3281 20.7812C20.4297 20.7812 19.7266 21.4453 19.7266 22.3047C19.7266 23.1836 20.4297 23.8477 21.3281 23.8477L24.3945 23.8477L24.3945 36.3477L20.957 36.3477C20.0586 36.3477 19.375 37.0312 19.375 37.8906C19.375 38.7695 20.0586 39.4336 20.957 39.4336ZM25.2539 16.3281C26.9141 16.3281 28.2031 15 28.2031 13.3789C28.2031 11.7188 26.9141 10.3906 25.2539 10.3906C23.6133 10.3906 22.3047 11.7188 22.3047 13.3789C22.3047 15 23.6133 16.3281 25.2539 16.3281Z" fill="#636366" />
                </g>
              </svg>
            </HeaderIconBtn>
          </div>
        </div>

        { }
        <div
          className="imessage-scroll"
          onClick={() => { if (replyingTo) setReplyingTo(null); }}
          style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '10px 12px 14px 22px', display: 'flex', flexDirection: 'column' }}
        >
          {processedMsgs.map(msg => {
            if (msg.type === 'ts') return <TimestampDivider key={msg.id} label={msg.label} />;

            const isReplying = !!replyingTo;
            const isActive = replyingTo?.id === msg.id;

            return (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: msg.isMe ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 6,
                marginBottom: msg.tail ? 6 : 1,
                filter: isReplying ? (isActive ? 'none' : 'blur(3px)') : 'none',
                opacity: isReplying ? (isActive ? 1 : 0.4) : 1,
                pointerEvents: isReplying ? (isActive ? 'auto' : 'none') : 'auto',
                transition: 'all 0.2s ease-out'
              }}>
                <Bubble
                  text={msg.text}
                  isMe={msg.isMe}
                  tail={msg.tail}
                  delivered={msg.delivered}
                  replyToMsg={msg.replyToMsg}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setContextMenu({ isOpen: true, msg, rect });
                  }}
                  onDoubleClick={() => {
                    if (msg.text && (msg.text.startsWith('__IMAGE__::') || msg.text.startsWith('__FILE__::'))) {
                      const parts = msg.text.split('::');
                      const type = parts[0];
                      const filename = parts[1];
                      const dataUrl = parts[2] || parts.slice(2).join('::');
                      if (type === '__IMAGE__') {
                        const customId = 'Preview_custom_' + msg.id;
                        sessionStorage.setItem(customId, dataUrl);
                        ctx.openWindow?.(customId);
                      } else {
                        const a = document.createElement('a');
                        a.href = dataUrl;
                        a.download = filename;
                        a.click();
                      }
                    }
                  }}
                />
              </div>
            );
          })}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        { }
        <div style={{
          padding: '8px 12px 12px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
        }}>
          <AnimatePresence mode="popLayout">
            {isRecording ? (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                style={{
                  height: 32,
                  borderRadius: 16,
                  background: '#FFF0F0',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px 0 16px',
                  gap: 8,
                  position: 'relative'
                }}
              >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden', paddingRight: 8, height: 24 }}>
                  <div ref={waveformContainerRef} style={{ width: '100%', height: 24 }} />
                </div>
                <div style={{ fontSize: 13, color: '#FF3B30', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </div>
                <button onClick={stopRecording} style={{
                  width: 24, height: 24, borderRadius: '50%', background: '#FFD6D6', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0
                }}>
                  <div style={{ width: 10, height: 10, background: '#FF3B30', borderRadius: 2 }} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPlusMenuOpen(!plusMenuOpen);
                  }}
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: '#E3E3E5', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, padding: 0, cursor: 'default'
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="#8E8E93"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                      transform: plusMenuOpen ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <path d="M7 1v12M1 7h12" />
                  </svg>
                </button>
                {plusMenuOpen && (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      bottom: 40,
                      left: 0,
                      width: 180,
                      background: 'rgba(245,245,247,0.95)',
                      borderRadius: 14,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.1)',
                      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                      animation: 'menuPop 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
                      overflow: 'hidden',
                      padding: '4px 0',
                      zIndex: 1000,
                    }}
                  >
                    <PlusMenuItem
                      label="File"
                      iconSrc={finderImg}
                      onClick={() => {
                        setPlusMenuOpen(false);
                        fileInputRef.current?.click();
                      }}
                    />
                    <PlusMenuItem
                      label="Photo"
                      iconSrc={photosImg}
                      onClick={() => {
                        setPlusMenuOpen(false);
                        photoInputRef.current?.click();
                      }}
                    />
                  </div>
                )}
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={chatStage === 'ASK_NAME' ? 'Enter your name…' : 'iMessage'}
                    className="imsg-input"
                    style={{
                      width: '100%',
                      border: '1px solid #d1d1d1',
                      borderRadius: 18,
                      padding: '5px 32px 5px 14px',
                      fontSize: 15, color: '#000', fontFamily: FONT,
                      lineHeight: '1.25',
                      outline: 'none', background: '#fff',
                      boxSizing: 'border-box',
                    }}
                  />
                  {!inputText.trim() ? (
                    <button onClick={startRecording} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                      <svg width="16" height="14" viewBox="0 0 45.3906 39.668">
                        <g>
                          <rect height="39.668" opacity="0" width="45.3906" x="0" y="0" />
                          <path d="M43.3008 24.4336C44.2773 24.4336 45.0195 23.6523 45.0195 22.6953L45.0195 17.3633C45.0195 16.4062 44.2773 15.6055 43.3008 15.6055C42.3047 15.6055 41.5625 16.4062 41.5625 17.3633L41.5625 22.6953C41.5625 23.6523 42.3047 24.4336 43.3008 24.4336Z" fill="#8E8E93" />
                          <path d="M34.9805 34.0039C35.957 34.0039 36.7188 33.2227 36.7188 32.2656L36.7188 7.40234C36.7188 6.44531 35.957 5.64453 34.9805 5.64453C33.9844 5.64453 33.2617 6.44531 33.2617 7.40234L33.2617 32.2656C33.2617 33.2227 33.9844 34.0039 34.9805 34.0039Z" fill="#8E8E93" />
                          <path d="M26.6602 26.9922C27.6562 26.9922 28.3984 26.2305 28.3984 25.2734L28.3984 14.375C28.3984 13.418 27.6562 12.6562 26.6602 12.6562C25.6641 12.6562 24.9414 13.418 24.9414 14.375L24.9414 25.2734C24.9414 26.2305 25.6641 26.9922 26.6602 26.9922Z" fill="#8E8E93" />
                          <path d="M18.3398 39.668C19.3359 39.668 20.0781 38.8867 20.0781 37.9297L20.0781 1.73828C20.0781 0.78125 19.3359 0 18.3398 0C17.3633 0 16.6211 0.78125 16.6211 1.73828L16.6211 37.9297C16.6211 38.8867 17.3633 39.668 18.3398 39.668Z" fill="#8E8E93" />
                          <path d="M10.0195 30.2344C11.0156 30.2344 11.7773 29.4531 11.7773 28.4961L11.7773 11.1719C11.7773 10.2148 11.0156 9.41406 10.0195 9.41406C9.04297 9.41406 8.32031 10.2148 8.32031 11.1719L8.32031 28.4961C8.32031 29.4531 9.04297 30.2344 10.0195 30.2344Z" fill="#8E8E93" />
                          <path d="M1.71875 24.707C2.71484 24.707 3.45703 23.9258 3.45703 22.9688L3.45703 16.6992C3.45703 15.7422 2.71484 14.9414 1.71875 14.9414C0.722656 14.9414 0 15.7422 0 16.6992L0 22.9688C0 23.9258 0.722656 24.707 1.71875 24.707Z" fill="#8E8E93" />
                        </g>
                      </svg>
                    </button>
                  ) : (
                    <button onClick={handleSend} style={{
                      position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                      width: 26, height: 26, borderRadius: '50%', border: 'none',
                      background: '#32a1fc', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: 0
                    }}>
                      <svg width="12" height="12" viewBox="0 0 15 15" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7.5 13V2M2.5 7l5-5 5 5" />
                      </svg>
                    </button>
                  )}
                </div>
                <button style={{ width: 30, height: 30, borderRadius: '50%', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8.5" fill="none" stroke="#8E8E93" strokeWidth="1.2" />
                    <circle cx="7.2" cy="8.2" r="1.1" fill="#8E8E93" />
                    <circle cx="12.8" cy="8.2" r="1.1" fill="#8E8E93" />
                    <path d="M6.5 12.5c.8 1.5 2 2.2 3.5 2.2s2.7-.7 3.5-2.2" stroke="#8E8E93" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {contextMenu.isOpen && (
        <ContextMenuOverlay
          msg={contextMenu.msg}
          rect={contextMenu.rect}
          onClose={() => setContextMenu({ isOpen: false, msg: null, rect: null })}
          onReply={(m) => {
            setReplyingTo(m);
            setContextMenu({ isOpen: false, msg: null, rect: null });
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
        />
      )}

      <style>{`
        @keyframes menuPop {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes overlayFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes imsgDot {
          0%,60%,100%{opacity:0.3;transform:translateY(0)}
          30%{opacity:1;transform:translateY(-3px)}
        }
        .imessage-scroll::-webkit-scrollbar {
          display: none;
          width: 0 !important;
          height: 0 !important;
        }
        .imessage-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .imsg-input::placeholder {
          color: #B0B0B5;
        }

        .imsg-bubble {
          position: relative;
          border-radius: 18px;
          padding: 6px 14px;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.25;
          max-width: 100%;
          word-wrap: break-word;
          white-space: pre-wrap;
          letter-spacing: -0.01em;
          text-align: left;
          z-index: 1;
        }
        .imsg-bubble-me {
          background-color: #32a1fc;
          color: #fff;
        }
        .imsg-bubble-me.imsg-tail {
          border-bottom-right-radius: 18px;
        }
        .imsg-bubble-me.imsg-tail::before {
          content: "";
          position: absolute;
          z-index: -1;
          bottom: 0;
          right: -8px;
          height: 18px;
          width: 20px;
          background-color: #32a1fc;
          border-bottom-left-radius: 16px 14px;
        }
        .imsg-bubble-me.imsg-tail::after {
          content: "";
          position: absolute;
          z-index: -1;
          bottom: -2px;
          right: -26px;
          width: 26px;
          height: 24px;
          background: #fff;
          border-bottom-left-radius: 10px;
        }

        .imsg-bubble-other {
          background: #E9E9EB;
          color: #000;
        }
        .imsg-bubble-other.imsg-tail {
          border-bottom-left-radius: 18px;
        }
        .imsg-bubble-other.imsg-tail::before {
          content: "";
          position: absolute;
          z-index: -1;
          bottom: 0;
          left: -8px;
          height: 18px;
          width: 20px;
          background: #E9E9EB;
          border-bottom-right-radius: 16px 14px;
        }
        .imsg-bubble-other.imsg-tail::after {
          content: "";
          position: absolute;
          z-index: -1;
          bottom: -2px;
          left: -26px;
          width: 26px;
          height: 24px;
          background: #fff;
          border-bottom-right-radius: 10px;
        }
      `}</style>
    </div>
  );
}


function ComposeButton() {
  const [hover, setHover] = React.useState(false);
  return (
    <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: hover ? 'rgba(0,0,0,0.07)' : 'transparent', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.12s', flexShrink: 0 }}>
      <svg width="20" height="20" viewBox="0 0 60.4884 59.0553">
        <g>
          <rect height="59.0553" opacity="0" width="60.4884" x="0" y="0" />
          <path d="M44.4335 8.57577L41.228 11.7835L18.4278 11.7835C13.9942 11.7835 11.4942 14.2835 11.4942 18.7171L11.4942 41.9788C11.4942 46.432 13.9942 48.932 18.4278 48.932L41.6895 48.932C46.1231 48.932 48.6231 46.432 48.6231 41.9788L48.6231 19.3373L51.854 16.1018C52.0067 16.9158 52.0801 17.797 52.0801 18.7367L52.0801 41.9788C52.0801 48.6585 48.3692 52.389 41.6895 52.389L18.4278 52.389C11.7481 52.389 8.03714 48.6585 8.03714 41.9788L8.03714 18.7367C8.03714 12.057 11.7481 8.3265 18.4278 8.3265L41.6895 8.3265C42.6719 8.3265 43.5901 8.4072 44.4335 8.57577Z" fill="#636366" />
          <path d="M25.2442 35.8265L29.7754 33.8148L53.2715 10.3187L50.1661 7.23275L26.6895 30.7288L24.5606 35.1234C24.3653 35.4945 24.834 36.0023 25.2442 35.8265ZM55.0489 8.58041L56.7481 6.82259C57.5684 5.98275 57.5879 4.90853 56.7871 4.10775L56.2989 3.61947C55.5567 2.87728 54.4434 2.97494 53.6621 3.75619L51.9434 5.45541Z" fill="#636366" />
        </g>
      </svg>
    </button>
  );
}

function ConversationRow({ name, preview, time, selected }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', margin: '2px 8px', borderRadius: 8,
        cursor: 'default',
        background: selected ? '#007AFF' : hover ? 'rgba(0,0,0,0.05)' : 'transparent',
        transition: 'background 0.1s',
      }}>
      <Avatar size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: selected ? '#fff' : '#1c1c1e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.2 }}>{name}</div>
          <div style={{ fontSize: 13, color: selected ? 'rgba(255,255,255,0.75)' : '#8E8E93', flexShrink: 0, marginLeft: 8 }}>{time}</div>
        </div>
        <div style={{ fontSize: 13, color: selected ? 'rgba(255,255,255,0.9)' : '#8E8E93', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.2 }}>{preview}</div>
      </div>
    </div>
  );
}

function HeaderIconBtn({ children, title }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button title={title} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: hover ? 'rgba(0,0,0,0.06)' : 'transparent', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.12s', flexShrink: 0 }}>
      {children}
    </button>
  );
}

function CircleBtn({ children, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.15)', background: hover ? 'rgba(0,0,0,0.05)' : 'transparent', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.12s' }}>
      {children}
    </button>
  );
}


function ContextMenuOverlay({ msg, rect, onClose, onReply }) {
  if (!rect || !msg) return null;

  const MENU_WIDTH = 215;
  const GAP = 6;


  const menuTop = rect.bottom + GAP;
  let menuLeft = msg.isMe ? rect.right - MENU_WIDTH : rect.left;
  menuLeft = Math.max(10, Math.min(menuLeft, window.innerWidth - MENU_WIDTH - 10));

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        zIndex: 99999,
        animation: 'overlayFade 0.18s ease-out',
      }}
      onMouseDown={onClose}
      onContextMenu={e => e.preventDefault()}
    >
      { }
      <div style={{
        position: 'absolute', inset: 0,
        background: 'transparent',
        pointerEvents: 'none',
      }} />

      { }
      <div
        onMouseDown={e => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: menuTop,
          left: menuLeft,
          width: MENU_WIDTH,
          background: 'rgba(245,245,247,0.95)',
          borderRadius: 14,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          animation: 'menuPop 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
          overflow: 'hidden',
          padding: '4px 0',
        }}
      >
        { }
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px 8px 12px' }}>
          {['❤️', '👍', '👎', '😂', '‼️', '❓'].map(emoji => (
            <button
              key={emoji}
              onClick={onClose}
              style={{
                background: 'transparent', border: 'none',
                fontSize: 22, lineHeight: 1, padding: 0, cursor: 'pointer',
                transition: 'transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {emoji}
            </button>
          ))}
        </div>

        { }
        <ContextMenuItem
          label="Reply..."
          onClick={() => onReply(msg)}
        />
        <ContextMenuItem
          label="Copy"
          onClick={() => { navigator.clipboard.writeText(msg.text); onClose(); }}
        />
      </div>
    </div>
  );
}

function ContextMenuDivider() {
  return <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', margin: '4px 12px' }} />;
}

function ContextMenuItem({ label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={onClick}
      style={{
        padding: '3px 12px',
        margin: '1px 5px',
        borderRadius: 5,
        display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
        background: hover ? '#0A84FF' : 'transparent',
        cursor: 'default',
        height: 24,
      }}
    >
      <span style={{
        fontSize: 13.5,
        fontWeight: 400,
        color: hover ? '#fff' : 'rgba(0,0,0,0.95)',
        letterSpacing: '-0.01em'
      }}>
        {label}
      </span>
    </div>
  );
}


function PlusMenuItem({ label, iconSrc, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      style={{
        padding: '5px 12px',
        margin: '2px 5px',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: hover ? '#0A84FF' : 'transparent',
        cursor: 'default',
        transition: 'background 0.1s',
        height: 28,
      }}
    >
      <img src={iconSrc?.src || iconSrc} alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
      <span style={{
        fontSize: 13.5,
        fontWeight: 400,
        color: hover ? '#fff' : 'rgba(0,0,0,0.95)',
        letterSpacing: '-0.01em',
        fontFamily: FONT,
      }}>
        {label}
      </span>
    </div>
  );
}

