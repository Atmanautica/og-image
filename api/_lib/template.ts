import { readFileSync } from 'fs'
import marked from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

const museo = readFileSync(
	`${__dirname}/../_fonts/museomoderno-latin-500-normal.woff2`
).toString('base64')
const inconsolata = readFileSync(
	`${__dirname}/../_fonts/inconsolata-latin-400-normal.woff2`
).toString('base64')
const museoBold = readFileSync(
	`${__dirname}/../_fonts/museomoderno-latin-700-normal.woff2`
).toString('base64')
const rglr = readFileSync(
	`${__dirname}/../_fonts/Inter-Regular.woff2`
).toString('base64')
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
	'base64'
)
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
	'base64'
)

function getCss(theme: string, fontSize: string) {
	// let background = "hsl(233, 50%, 98%) url('https://atmanaut.sirv.com/_images/waves-light.jpg')";
	let foreground = 'hsl(233, 50%, 2%)'
	let radial = 'hsla(233, 50%, 4%, 0.5)'
	let flair = 'hsla(333, 80%, 40%)'

	if (theme === 'dark') {
		// background = "hsl(172, 50%, 4%) url('https://atmanaut.sirv.com/_images/waves-pad.jpg');"
		foreground = 'white'
		radial = 'hsla(172, 50%, 96%, 0.5)'
		flair = 'hsla(292, 80%, 60%)'
	}
	return `
    @font-face {
        font-family: 'Inconsolata';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${inconsolata}) format('woff2');
    }

    @font-face {
        font-family: 'MuseoModerno';
        font-style: normal;
        font-weight: 500;
        src: url(data:font/woff2;charset=utf-8;base64,${museo}) format('woff2');
    }

    @font-face {
        font-family: 'MuseoModerno';
        font-style: normal;
        font-weight: 700;
        src: url(data:font/woff2;charset=utf-8;base64,${museoBold}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        height: 100vh;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
    }

    code {
        color: ${flair};
        font-family: 'Inconsolata';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .infinity {
        color: ${radial};
        font-family: 'Inter', serif;
        font-size: ${sanitizeHtml(fontSize)};
        margin: 0.25em;
    }

    .spacer {
        margin: ${sanitizeHtml(fontSize)};
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .heading {
        font-family: 'MuseoModerno', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.25;
        margin-top: -0.25em;
    }`
}

export function getHtml(parsedReq: ParsedRequest) {
	const { text, theme, md, fontSize, images, widths, heights } = parsedReq
	return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="container">
            <div class="logo-wrapper">
                ${images
									.map(
										(img, i) =>
											getInfinitySign(i) + getImage(img, widths[i], heights[i])
									)
									.join('')}
            </div>
            <div class="heading">${emojify(
							md ? marked(text) : sanitizeHtml(text)
						)}
            </div>
        </div>
    </body>
</html>`
}

function getImage(src: string, width = 'auto', height = '300') {
	return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getInfinitySign(i: number) {
	return i === 0 ? '' : '<div class="infinity">✧</div>'
}
