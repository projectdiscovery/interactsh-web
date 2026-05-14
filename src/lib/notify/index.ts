const formatBody = (params: { [key: string]: unknown }): string =>
  Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(String(params[key]))}`)
    .join('&');

const headers = new Headers({
  'content-type': 'application/x-www-form-urlencoded',
});

export const notifyTelegram = async (
  msg: string,
  token: string,
  target: string,
  mode?: string
): Promise<void> => {
  if (token.trim() !== '' && target.trim() !== '') {
    const params: { [key: string]: string | boolean } = {
      chat_id: target,
      text: msg,
    };
    if (mode) {
      params.parse_mode = mode;
      params.disable_web_page_preview = true;
    }
    const body = formatBody(params);
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      body,
      headers,
    });
  }
};

export const notifySlack = async (
  msg: { slack: string; discord: string }[],
  webhook: string,
  target: string
): Promise<void> => {
  if (webhook.trim() !== '' && target.trim() !== '') {
    const params: { [key: string]: string } = {
      payload: JSON.stringify({
        channel: target,
        text: '',
        attachments: msg.map((m) => ({ text: m.slack })),
      }),
    };
    const body = formatBody(params);
    await fetch(`${webhook}`, { method: 'POST', body, headers });
  }
};

export const notifyDiscord = async (
  msg: { slack: string; discord: string }[],
  webhook: string
): Promise<void> => {
  if (webhook.trim() !== '') {
    const chunkSize = 10;
    const chunkedData: { slack: string; discord: string }[][] = msg.reduce(
      (all: { slack: string; discord: string }[][], one, i) => {
        const ch = Math.floor(i / chunkSize);
        // eslint-disable-next-line no-param-reassign
        all[ch] = (all[ch] || []).concat(one);
        return all;
      },
      []
    );
    
    await Promise.all(
      chunkedData.map(async (chunk) => {
        const embeds = chunk.map((m) => ({ description: m.discord, color: 5298687 }));
        await fetch('/api/discord-proxy', {
          method: 'POST',
          body: JSON.stringify({ webhook, embeds }),
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
  }
};
