import fetch from 'node-fetch'
import { parse } from 'node-html-parser'

export const fetchLinkPreview = async (req, res) => {
    const url = req.query.url
    if (!url) return res.status(400).json({ success: 0 })

    try {
        const html = await fetch(url).then(r => r.text())
        const root = parse(html)

        const getMeta = (name) =>
            root.querySelector(`meta[property="${name}"]`)?.getAttribute('content') ||
            root.querySelector(`meta[name="${name}"]`)?.getAttribute('content')

        const getFavicon = () => {
            const iconLink = root.querySelector('link[rel="icon"]')?.getAttribute('href') ||
                root.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
                '/favicon.ico'

            try {
                return new URL(iconLink, url).href
            } catch {
                return ''
            }
        }

        res.json({
            success: 1,
            meta: {
                title: getMeta('og:title') || root.querySelector('title')?.text || url,
                // description: getMeta('og:description') || '',
                image: {
                    url: getMeta('og:image') || '',
                },
                favicon: getFavicon()
            },
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ success: 0 })
    }
}
