(function () {
  let doc = Api.GetDocument();
  let range = doc.GetRangeBySelect();
  if (!range) return;

  let paragraphs = range.GetAllParagraphs();
  if (!paragraphs || !paragraphs.length) return;

  for (let i = 0; i < paragraphs.length; i++) {
    let p = paragraphs[i];
    if (!p) continue;

    let style = p.GetStyle();
    let text = p.GetText({ Numbering: false });

    // Remove trailing paragraph/newline markers
    if (text) {
      text = text.replace(/[\r\n]+$/g, "");
    } else {
      text = "";
    }

    p.RemoveAllElements();

    if (style) {
      p.SetStyle(style);
    }

    if (text.length) {
      p.AddText(text);
    }
  }
})();