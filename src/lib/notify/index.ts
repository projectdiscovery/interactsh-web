/* eslint-disable camelcase */
// Notify

const formatBody = (params: {[key: string]: any}) => Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

const headers = new Headers({
    'content-type': 'application/x-www-form-urlencoded'
})

export const notifyTelegram = async (msg: string, token: string, target: string, mode?: string) => {
    if (token.trim() !== '' && target.trim() !== '') {
        const params: {[key: string]: string | boolean} = {
            chat_id : target,
            text: msg,
        }
        if (mode) {
            params.parse_mode = mode
            params.disable_web_page_preview = false
        }
        const body = formatBody(params)
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {method: 'POST', body, headers})
    }
}

export const notifySlack = async (msg: string[], webhook: string, target: string) => {
    if (webhook.trim() !== '' && target.trim() !== '') {
        const params: {[key: string]: string} = {
            payload: JSON.stringify({
                "channel" : target,
                "text": '',
                "attachments": msg.map(m => ({"text": m}))
            })
        }
        const body = formatBody(params)
        await fetch(`${webhook}`, {method: 'POST', body, headers})
    }
}

export const notifyDiscord = async (msg: string[], webhook: string) => {
    if (webhook.trim() !== '') {
        const params: any = {
             embeds: msg.map(m => ({"description": m, "color":5298687}))
        }
        // const body = formatBody(params)
        await fetch(`https://discordapp.com${new URL(webhook).pathname}`, {method: 'POST', body: JSON.stringify(params), headers: {"Content-Type": "application/json"}})
    }
}
