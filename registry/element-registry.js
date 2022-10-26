import exElement from "../framework/base/ex-element.js";
import exInclude from "../implementations/ex-elements/ex-include.js";
import exRequest from "../implementations/ex-elements/ex-request.js";


customElements.define('ex-a', exElement(HTMLAnchorElement), { extends: "a" });
customElements.define('ex-abbr', exElement(HTMLElement), { extends: "abbr" });
customElements.define('ex-acronym', exElement(HTMLElement), { extends: "acronym" });
customElements.define('ex-address', exElement(HTMLElement), { extends: "address" });
customElements.define('ex-area', exElement(HTMLAreaElement), { extends: "area" });
customElements.define('ex-article', exElement(HTMLElement), { extends: "article" });
customElements.define('ex-aside', exElement(HTMLElement), { extends: "aside" });
customElements.define('ex-audio', exElement(HTMLAudioElement), { extends: "audio" });
customElements.define('ex-b', exElement(HTMLElement), { extends: "b" });
customElements.define('ex-base', exElement(HTMLBaseElement), { extends: "base" });
customElements.define('ex-basefont', exElement(HTMLElement), { extends: "basefont" });
customElements.define('ex-bdi', exElement(HTMLElement), { extends: "bdi" });
customElements.define('ex-bdo', exElement(HTMLElement), { extends: "bdo" });
customElements.define('ex-big', exElement(HTMLElement), { extends: "big" });
customElements.define('ex-blockquote', exElement(HTMLQuoteElement), { extends: "blockquote" });
customElements.define('ex-body', exElement(HTMLBodyElement), { extends: "body" });
customElements.define('ex-br', exElement(HTMLBRElement), { extends: "br" });
customElements.define('ex-button', exElement(HTMLButtonElement), { extends: "button" });
customElements.define('ex-canvas', exElement(HTMLCanvasElement), { extends: "canvas" });
customElements.define('ex-caption', exElement(HTMLTableCaptionElement), { extends: "caption" });
customElements.define('ex-center', exElement(HTMLElement), { extends: "center" });
customElements.define('ex-cite', exElement(HTMLElement), { extends: "cite" });
customElements.define('ex-code', exElement(HTMLElement), { extends: "code" });
customElements.define('ex-col', exElement(HTMLTableColElement), { extends: "col" });
customElements.define('ex-colgroup', exElement(HTMLTableColElement), { extends: "colgroup" });
customElements.define('ex-data', exElement(HTMLDataElement), { extends: "data" });
customElements.define('ex-datalist', exElement(HTMLDataListElement), { extends: "datalist" });
customElements.define('ex-dd', exElement(HTMLElement), { extends: "dd" });
customElements.define('ex-del', exElement(HTMLModElement), { extends: "del" });
customElements.define('ex-details', exElement(HTMLDetailsElement), { extends: "details" });
customElements.define('ex-dfn', exElement(HTMLElement), { extends: "dfn" });
customElements.define('ex-div', exElement(HTMLDivElement), { extends: "div" });
customElements.define('ex-dl', exElement(HTMLDListElement), { extends: "dl" });
customElements.define('ex-dt', exElement(HTMLElement), { extends: "dt" });
customElements.define('ex-em', exElement(HTMLElement), { extends: "em" });
customElements.define('ex-embed', exElement(HTMLEmbedElement), { extends: "embed" });
customElements.define('ex-fieldset', exElement(HTMLFieldSetElement), { extends: "fieldset" });
customElements.define('ex-figcaption', exElement(HTMLElement), { extends: "figcaption" });
customElements.define('ex-figure', exElement(HTMLElement), { extends: "figure" });
customElements.define('ex-font', exElement(HTMLFontElement), { extends: "font" });
customElements.define('ex-footer', exElement(HTMLElement), { extends: "footer" });
customElements.define('ex-form', exElement(HTMLFormElement), { extends: "form" });
customElements.define('ex-head', exElement(HTMLHeadElement), { extends: "head" });
customElements.define('ex-header', exElement(HTMLElement), { extends: "header" });
customElements.define('ex-hr', exElement(HTMLHRElement), { extends: "hr" });
customElements.define('ex-html', exElement(HTMLHtmlElement), { extends: "html" });
customElements.define('ex-i', exElement(HTMLElement), { extends: "i" });
customElements.define('ex-iframe', exElement(HTMLIFrameElement), { extends: "iframe" });
customElements.define('ex-img', exElement(HTMLImageElement), { extends: "img" });
customElements.define('ex-input', exElement(HTMLInputElement), { extends: "input" });
customElements.define('ex-ins', exElement(HTMLModElement), { extends: "ins" });
customElements.define('ex-kbd', exElement(HTMLElement), { extends: "kbd" });
customElements.define('ex-label', exElement(HTMLLabelElement), { extends: "label" });
customElements.define('ex-legend', exElement(HTMLLegendElement), { extends: "legend" });
customElements.define('ex-li', exElement(HTMLLIElement), { extends: "li" });
customElements.define('ex-link', exElement(HTMLLinkElement), { extends: "link" });
customElements.define('ex-main', exElement(HTMLElement), { extends: "main" });
customElements.define('ex-map', exElement(HTMLMapElement), { extends: "map" });
customElements.define('ex-mark', exElement(HTMLElement), { extends: "mark" });
customElements.define('ex-meta', exElement(HTMLMetaElement), { extends: "meta" });
customElements.define('ex-meter', exElement(HTMLMeterElement), { extends: "meter" });
customElements.define('ex-nav', exElement(HTMLElement), { extends: "nav" });
customElements.define('ex-noframes', exElement(HTMLElement), { extends: "noframes" });
customElements.define('ex-noscript', exElement(HTMLElement), { extends: "noscript" });
customElements.define('ex-object', exElement(HTMLObjectElement), { extends: "object" });
customElements.define('ex-ol', exElement(HTMLOListElement), { extends: "ol" });
customElements.define('ex-optgroup', exElement(HTMLOptGroupElement), { extends: "optgroup" });
customElements.define('ex-option', exElement(HTMLOptionElement), { extends: "option" });
customElements.define('ex-output', exElement(HTMLOutputElement), { extends: "output" });
customElements.define('ex-p', exElement(HTMLParagraphElement), { extends: "p" });
customElements.define('ex-picture', exElement(HTMLPictureElement), { extends: "picture" });
customElements.define('ex-pre', exElement(HTMLPreElement), { extends: "pre" });
customElements.define('ex-progress', exElement(HTMLProgressElement), { extends: "progress" });
customElements.define('ex-q', exElement(HTMLQuoteElement), { extends: "q" });
customElements.define('ex-rp', exElement(HTMLElement), { extends: "rp" });
customElements.define('ex-rt', exElement(HTMLElement), { extends: "rt" });
customElements.define('ex-ruby', exElement(HTMLElement), { extends: "ruby" });
customElements.define('ex-s', exElement(HTMLElement), { extends: "s" });
customElements.define('ex-samp', exElement(HTMLElement), { extends: "samp" });
customElements.define('ex-script', exElement(HTMLScriptElement), { extends: "script" });
customElements.define('ex-section', exElement(HTMLElement), { extends: "section" });
customElements.define('ex-select', exElement(HTMLSelectElement), { extends: "select" });
customElements.define('ex-small', exElement(HTMLElement), { extends: "small" });
customElements.define('ex-source', exElement(HTMLSourceElement), { extends: "source" });
customElements.define('ex-span', exElement(HTMLSpanElement), { extends: "span" });
customElements.define('ex-strike', exElement(HTMLElement), { extends: "strike" });
customElements.define('ex-strong', exElement(HTMLElement), { extends: "strong" });
customElements.define('ex-style', exElement(HTMLStyleElement), { extends: "style" });
customElements.define('ex-sub', exElement(HTMLElement), { extends: "sub" });
customElements.define('ex-summary', exElement(HTMLElement), { extends: "summary" });
customElements.define('ex-sup', exElement(HTMLElement), { extends: "sup" });
customElements.define('ex-table', exElement(HTMLTableElement), { extends: "table" });
customElements.define('ex-tbody', exElement(HTMLTableSectionElement), { extends: "tbody" });
customElements.define('ex-td', exElement(HTMLTableCellElement), { extends: "td" });
customElements.define('ex-template', exElement(HTMLTemplateElement), { extends: "template" });
customElements.define('ex-textarea', exElement(HTMLTextAreaElement), { extends: "textarea" });
customElements.define('ex-tfoot', exElement(HTMLTableSectionElement), { extends: "tfoot" });
customElements.define('ex-th', exElement(HTMLTableCellElement), { extends: "th" });
customElements.define('ex-thead', exElement(HTMLTableSectionElement), { extends: "thead" });
customElements.define('ex-time', exElement(HTMLTimeElement), { extends: "time" });
customElements.define('ex-title', exElement(HTMLTitleElement), { extends: "title" });
customElements.define('ex-tr', exElement(HTMLTableRowElement), { extends: "tr" });
customElements.define('ex-track', exElement(HTMLTrackElement), { extends: "track" });
customElements.define('ex-tt', exElement(HTMLElement), { extends: "tt" });
customElements.define('ex-u', exElement(HTMLElement), { extends: "u" });
customElements.define('ex-ul', exElement(HTMLUListElement), { extends: "ul" });
customElements.define('ex-var', exElement(HTMLElement), { extends: "var" });
customElements.define('ex-video', exElement(HTMLVideoElement), { extends: "video" });
customElements.define('ex-wbr', exElement(HTMLElement), { extends: "wbr" });

customElements.define("ex-include", exInclude, { extends: "div" });
customElements.define("ex-request", exRequest, { extends: "div" });

export default customElements;