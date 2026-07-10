import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();

    
    if (body.type === 'url_verification') {
      return NextResponse.json({ challenge: body.challenge });
    }

    
    if (body.type === 'event_callback') {
      const event = body.event;
      console.log(`[Slack Webhook] Received event:`, event);

      
      
      if (event.type === 'message' && !event.bot_id && !event.subtype) {
        console.log(`[Slack Webhook] Processing message in channel: ${event.channel}. Text: "${event.text}"`);

        
        const { data: channelData } = await supabase
          .from('messages')
          .select('session_id')
          .eq('slack_channel_id', event.channel)
          .limit(1);

        console.log(`[Slack Webhook] Channel search result:`, channelData);

        if (channelData && channelData.length > 0) {
          const sessionId = channelData[0].session_id;

          
          const { error: dbError } = await supabase
            .from('messages')
            .insert({
              sender: 'het',
              body: event.text,
              session_id: sessionId,
              slack_channel_id: event.channel
            });

          if (dbError) {
            console.error('Slack webhook Supabase insert error:', dbError);
          } else {
            console.log(`[Slack Webhook] Successfully saved reply to session: ${sessionId}`);
          }
        } else {
          console.warn(`[Slack Webhook] No matching session_id found for slack_channel_id: ${event.channel}`);
        }
      } else {
        console.log(`[Slack Webhook] Ignoring message (channel: ${event.channel}, bot_id: ${event.bot_id})`);
      }
    }

    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('slack-webhook error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
