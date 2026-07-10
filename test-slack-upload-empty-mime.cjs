const { WebClient } = require('@slack/web-api');
const slackToken = "YOUR_SLACK_TOKEN_HERE";
const slackClient = new WebClient(slackToken);
const channelId = "C0BFL2GQ0FK";

async function run() {
  try {
    const uploadResult = await slackClient.files.uploadV2({
      channel_id: channelId,
      initial_comment: "Test unknown file",
      file: Buffer.from("Hello World text file content", "utf-8"),
      filename: "unknownfile",
    });
    console.log("Success:", uploadResult.ok);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();
