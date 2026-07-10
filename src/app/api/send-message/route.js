import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { WebClient } from '@slack/web-api';

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    let message = '';
    let visitorName = '';
    let sessionId = '';
    let isSystemMessage = false;
    let sender = 'visitor';
    let replyToMsg = null;
    
    let isFileUpload = false;
    let fileObj = null;
    let fileName = null;
    let fileBuffer = null;
    let fileTypePrefix = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      fileObj = formData.get('file');
      fileTypePrefix = formData.get('type') || '__FILE__';
      visitorName = formData.get('visitorName') || '';
      sessionId = formData.get('sessionId') || '';
      
      const replyStr = formData.get('replyToMsg');
      if (replyStr) {
        try { replyToMsg = JSON.parse(replyStr); } catch (e) {}
      }
      
      if (fileObj) {
        isFileUpload = true;
        fileName = fileObj.name;
        const arrayBuffer = await fileObj.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
        
        let dataUrl = '';
        const filePath = `${sessionId}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        
        const { error: storageError } = await supabase.storage
          .from('chat-uploads')
          .upload(filePath, fileBuffer, {
            contentType: fileObj.type,
            upsert: false
          });

        if (storageError) {
          console.error('Supabase storage upload error:', storageError);
          const base64Data = fileBuffer.toString('base64');
          dataUrl = `data:${fileObj.type};base64,${base64Data}`;
        } else {
          const { data: publicUrlData } = supabase.storage.from('chat-uploads').getPublicUrl(filePath);
          dataUrl = publicUrlData.publicUrl;
        }

        message = `${fileTypePrefix}::${fileName}::${dataUrl}`;
      }
    } else {
      const body = await req.json();
      message = body.message;
      visitorName = body.visitorName || '';
      sessionId = body.sessionId || '';
      isSystemMessage = body.isSystemMessage || false;
      sender = body.sender || 'visitor';
      replyToMsg = body.replyToMsg;
      
      if (message && (message.startsWith('__IMAGE__::') || message.startsWith('__FILE__::'))) {
        isFileUpload = true;
        const parts = message.split('::');
        fileName = parts[1];
        const fileDataUrl = parts[2] || parts.slice(2).join('::');
        if (fileDataUrl && fileDataUrl.includes(',')) {
          const base64Str = fileDataUrl.split(',')[1];
          fileBuffer = Buffer.from(base64Str, 'base64');
        }
      }
    }

    if (isSystemMessage) {
      return NextResponse.json({ success: true, note: 'System message skipped' });
    }

    let channelId = null;
    if (sessionId) {
      const { data: existingChannel } = await supabase
        .from('messages')
        .select('slack_channel_id')
        .eq('session_id', sessionId)
        .not('slack_channel_id', 'is', null)
        .limit(1);

      if (existingChannel && existingChannel.length > 0) {
        channelId = existingChannel[0].slack_channel_id;
      }
    }

    const slackToken = process.env.SLACK_BOT_TOKEN;
    if (!slackToken) {
      return NextResponse.json({ success: false, error: 'Missing Slack SLACK_BOT_TOKEN.' }, { status: 500 });
    }

    const slackClient = new WebClient(slackToken);
    const displayName = visitorName || 'Anonymous Visitor';

    if (!channelId) {
      console.log(`[Send Message] Creating dedicated Slack channel for ${displayName}...`);
      const cleanName = visitorName ? visitorName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'visitor';
      const channelName = `chat-${cleanName.substring(0, 60)}-${sessionId.substring(0, 4)}`.toLowerCase();

      try {
        const createData = await slackClient.conversations.create({ name: channelName });
        channelId = createData.channel.id;

        const slackUserId = process.env.SLACK_USER_ID || 'U0BFBSBLG1Z';
        await slackClient.conversations.invite({ channel: channelId, users: slackUserId });
        await slackClient.chat.postMessage({
          channel: channelId,
          text: `*New Chat started by ${displayName}*\nSession: \`${sessionId}\``
        });
      } catch (err) {
        console.error('Slack channel creation error:', err);
      }
    }

    let dbBody = message;
    if (replyToMsg) {
      dbBody = `__REPLY__::${replyToMsg.id}::${replyToMsg.text}::__BODY__::${message}`;
    }

    // Save to DB asynchronously to avoid blocking the response if it takes a while
    supabase.from('messages').insert({
      sender: sender,
      body: dbBody,
      visitor_name: visitorName,
      session_id: sessionId,
      slack_channel_id: channelId
    }).then(({ error }) => {
      if (error) console.error('Supabase insert error:', error);
    });

    if (channelId) {
      let textForSlack = message;
      if (isFileUpload) {
        textForSlack = `Uploaded: ${fileName}`;
      }

      let slackText = `*${displayName}*: ${textForSlack}`;
      if (replyToMsg) {
        let snippet = replyToMsg.text;
        if (snippet.startsWith('__IMAGE__::')) snippet = '[Image]';
        else if (snippet.startsWith('__FILE__::')) snippet = '[File]';
        else snippet = snippet.length > 80 ? snippet.substring(0, 80) + '...' : snippet;
        slackText = `> _Replying to: "${snippet}"_\n*${displayName}*: ${textForSlack}`;
      }

      if (isFileUpload && fileBuffer) {
         try {
           await slackClient.files.uploadV2({
             channel_id: channelId,
             initial_comment: slackText,
             file: fileBuffer,
             filename: fileName,
           });
         } catch (uploadError) {
           console.error('Slack file upload error:', uploadError);
           try {
             await slackClient.chat.postMessage({
               channel: channelId,
               text: `${slackText}\n_(File upload failed. Error: ${uploadError.message})_`
             });
           } catch (fallbackErr) {
             console.error('Slack fallback post error:', fallbackErr);
           }
         }
      } else {
         try {
           await slackClient.chat.postMessage({
             channel: channelId,
             text: slackText
           });
         } catch (msgError) {
           console.error('Slack postMessage error:', msgError);
         }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('send-message error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
