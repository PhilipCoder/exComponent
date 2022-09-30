import exElementFactory from "../ex-element/ex-element-factory";
import exInclude from "../ex-elements/ex-include.js";

customElements.define('ex-a', exElementFactory(HTMLAnchorElement), { extends: "a" });
customElements.define('ex-abbr', exElementFactory(HTMLElement), { extends: "abbr" });
customElements.define('ex-acronym', exElementFactory(HTMLElement), { extends: "acronym" });
customElements.define('ex-address', exElementFactory(HTMLElement), { extends: "address" });
customElements.define('ex-area', exElementFactory(HTMLAreaElement), { extends: "area" });
customElements.define('ex-article', exElementFactory(HTMLElement), { extends: "article" });
customElements.define('ex-aside', exElementFactory(HTMLElement), { extends: "aside" });
customElements.define('ex-audio', exElementFactory(HTMLAudioElement), { extends: "audio" });
customElements.define('ex-b', exElementFactory(HTMLElement), { extends: "b" });
customElements.define('ex-base', exElementFactory(HTMLBaseElement), { extends: "base" });
customElements.define('ex-basefont', exElementFactory(HTMLElement), { extends: "basefont" });
customElements.define('ex-bdi', exElementFactory(HTMLElement), { extends: "bdi" });
customElements.define('ex-bdo', exElementFactory(HTMLElement), { extends: "bdo" });
customElements.define('ex-big', exElementFactory(HTMLElement), { extends: "big" });
customElements.define('ex-blockquote', exElementFactory(HTMLQuoteElement), { extends: "blockquote" });
customElements.define('ex-body', exElementFactory(HTMLBodyElement), { extends: "body" });
customElements.define('ex-br', exElementFactory(HTMLBRElement), { extends: "br" });
customElements.define('ex-button', exElementFactory(HTMLButtonElement), { extends: "button" });
customElements.define('ex-canvas', exElementFactory(HTMLCanvasElement), { extends: "canvas" });
customElements.define('ex-caption', exElementFactory(HTMLTableCaptionElement), { extends: "caption" });
customElements.define('ex-center', exElementFactory(HTMLElement), { extends: "center" });
customElements.define('ex-cite', exElementFactory(HTMLElement), { extends: "cite" });
customElements.define('ex-code', exElementFactory(HTMLElement), { extends: "code" });
customElements.define('ex-col', exElementFactory(HTMLTableColElement), { extends: "col" });
customElements.define('ex-colgroup', exElementFactory(HTMLTableColElement), { extends: "colgroup" });
customElements.define('ex-data', exElementFactory(HTMLDataElement), { extends: "data" });
customElements.define('ex-datalist', exElementFactory(HTMLDataListElement), { extends: "datalist" });
customElements.define('ex-dd', exElementFactory(HTMLElement), { extends: "dd" });
customElements.define('ex-del', exElementFactory(HTMLModElement), { extends: "del" });
customElements.define('ex-details', exElementFactory(HTMLDetailsElement), { extends: "details" });
customElements.define('ex-dfn', exElementFactory(HTMLElement), { extends: "dfn" });
customElements.define('ex-dialog', exElementFactory(HTMLDialogElement), { extends: "dialog" });
customElements.define('ex-div', exElementFactory(HTMLDivElement), { extends: "div" });
customElements.define('ex-dl', exElementFactory(HTMLDListElement), { extends: "dl" });
customElements.define('ex-dt', exElementFactory(HTMLElement), { extends: "dt" });
customElements.define('ex-em', exElementFactory(HTMLElement), { extends: "em" });
customElements.define('ex-embed', exElementFactory(HTMLEmbedElement), { extends: "embed" });
customElements.define('ex-fieldset', exElementFactory(HTMLFieldSetElement), { extends: "fieldset" });
customElements.define('ex-figcaption', exElementFactory(HTMLElement), { extends: "figcaption" });
customElements.define('ex-figure', exElementFactory(HTMLElement), { extends: "figure" });
customElements.define('ex-font', exElementFactory(HTMLFontElement), { extends: "font" });
customElements.define('ex-footer', exElementFactory(HTMLElement), { extends: "footer" });
customElements.define('ex-form', exElementFactory(HTMLFormElement), { extends: "form" });
customElements.define('ex-head', exElementFactory(HTMLHeadElement), { extends: "head" });
customElements.define('ex-header', exElementFactory(HTMLElement), { extends: "header" });
customElements.define('ex-hr', exElementFactory(HTMLHRElement), { extends: "hr" });
customElements.define('ex-html', exElementFactory(HTMLHtmlElement), { extends: "html" });
customElements.define('ex-i', exElementFactory(HTMLElement), { extends: "i" });
customElements.define('ex-iframe', exElementFactory(HTMLIFrameElement), { extends: "iframe" });
customElements.define('ex-img', exElementFactory(HTMLImageElement), { extends: "img" });
customElements.define('ex-input', exElementFactory(HTMLInputElement), { extends: "input" });
customElements.define('ex-ins', exElementFactory(HTMLModElement), { extends: "ins" });
customElements.define('ex-kbd', exElementFactory(HTMLElement), { extends: "kbd" });
customElements.define('ex-label', exElementFactory(HTMLLabelElement), { extends: "label" });
customElements.define('ex-legend', exElementFactory(HTMLLegendElement), { extends: "legend" });
customElements.define('ex-li', exElementFactory(HTMLLIElement), { extends: "li" });
customElements.define('ex-link', exElementFactory(HTMLLinkElement), { extends: "link" });
customElements.define('ex-main', exElementFactory(HTMLElement), { extends: "main" });
customElements.define('ex-map', exElementFactory(HTMLMapElement), { extends: "map" });
customElements.define('ex-mark', exElementFactory(HTMLElement), { extends: "mark" });
customElements.define('ex-meta', exElementFactory(HTMLMetaElement), { extends: "meta" });
customElements.define('ex-meter', exElementFactory(HTMLMeterElement), { extends: "meter" });
customElements.define('ex-nav', exElementFactory(HTMLElement), { extends: "nav" });
customElements.define('ex-noframes', exElementFactory(HTMLElement), { extends: "noframes" });
customElements.define('ex-noscript', exElementFactory(HTMLElement), { extends: "noscript" });
customElements.define('ex-object', exElementFactory(HTMLObjectElement), { extends: "object" });
customElements.define('ex-ol', exElementFactory(HTMLOListElement), { extends: "ol" });
customElements.define('ex-optgroup', exElementFactory(HTMLOptGroupElement), { extends: "optgroup" });
customElements.define('ex-option', exElementFactory(HTMLOptionElement), { extends: "option" });
customElements.define('ex-output', exElementFactory(HTMLOutputElement), { extends: "output" });
customElements.define('ex-p', exElementFactory(HTMLParagraphElement), { extends: "p" });
customElements.define('ex-picture', exElementFactory(HTMLPictureElement), { extends: "picture" });
customElements.define('ex-pre', exElementFactory(HTMLPreElement), { extends: "pre" });
customElements.define('ex-progress', exElementFactory(HTMLProgressElement), { extends: "progress" });
customElements.define('ex-q', exElementFactory(HTMLQuoteElement), { extends: "q" });
customElements.define('ex-rp', exElementFactory(HTMLElement), { extends: "rp" });
customElements.define('ex-rt', exElementFactory(HTMLElement), { extends: "rt" });
customElements.define('ex-ruby', exElementFactory(HTMLElement), { extends: "ruby" });
customElements.define('ex-s', exElementFactory(HTMLElement), { extends: "s" });
customElements.define('ex-samp', exElementFactory(HTMLElement), { extends: "samp" });
customElements.define('ex-script', exElementFactory(HTMLScriptElement), { extends: "script" });
customElements.define('ex-section', exElementFactory(HTMLElement), { extends: "section" });
customElements.define('ex-select', exElementFactory(HTMLSelectElement), { extends: "select" });
customElements.define('ex-small', exElementFactory(HTMLElement), { extends: "small" });
customElements.define('ex-source', exElementFactory(HTMLSourceElement), { extends: "source" });
customElements.define('ex-span', exElementFactory(HTMLSpanElement), { extends: "span" });
customElements.define('ex-strike', exElementFactory(HTMLElement), { extends: "strike" });
customElements.define('ex-strong', exElementFactory(HTMLElement), { extends: "strong" });
customElements.define('ex-style', exElementFactory(HTMLStyleElement), { extends: "style" });
customElements.define('ex-sub', exElementFactory(HTMLElement), { extends: "sub" });
customElements.define('ex-summary', exElementFactory(HTMLElement), { extends: "summary" });
customElements.define('ex-sup', exElementFactory(HTMLElement), { extends: "sup" });
customElements.define('ex-table', exElementFactory(HTMLTableElement), { extends: "table" });
customElements.define('ex-tbody', exElementFactory(HTMLTableSectionElement), { extends: "tbody" });
customElements.define('ex-td', exElementFactory(HTMLTableCellElement), { extends: "td" });
customElements.define('ex-template', exElementFactory(HTMLTemplateElement), { extends: "template" });
customElements.define('ex-textarea', exElementFactory(HTMLTextAreaElement), { extends: "textarea" });
customElements.define('ex-tfoot', exElementFactory(HTMLTableSectionElement), { extends: "tfoot" });
customElements.define('ex-th', exElementFactory(HTMLTableCellElement), { extends: "th" });
customElements.define('ex-thead', exElementFactory(HTMLTableSectionElement), { extends: "thead" });
customElements.define('ex-time', exElementFactory(HTMLTimeElement), { extends: "time" });
customElements.define('ex-title', exElementFactory(HTMLTitleElement), { extends: "title" });
customElements.define('ex-tr', exElementFactory(HTMLTableRowElement), { extends: "tr" });
customElements.define('ex-track', exElementFactory(HTMLTrackElement), { extends: "track" });
customElements.define('ex-tt', exElementFactory(HTMLElement), { extends: "tt" });
customElements.define('ex-u', exElementFactory(HTMLElement), { extends: "u" });
customElements.define('ex-ul', exElementFactory(HTMLUListElement), { extends: "ul" });
customElements.define('ex-var', exElementFactory(HTMLElement), { extends: "var" });
customElements.define('ex-video', exElementFactory(HTMLVideoElement), { extends: "video" });
customElements.define('ex-wbr', exElementFactory(HTMLElement), { extends: "wbr" });

customElements.define("ex-include", exInclude, { extends: "div" });

export default null;