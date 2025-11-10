console.clear();

(function () {
  var doc = Api.GetDocument();

  // --- helpers -------------------------------------------------------------
  function readFontSizePts(style) {
    // Try official getters
    try {
      var tp = style && style.GetTextPr && style.GetTextPr();
      var hps = tp && tp.GetFontSize && tp.GetFontSize(); // half-points
      if (typeof hps === "number") return hps / 2;
    } catch (e) {}
    return null; // not explicitly set on this style
  }

  function getRgba(textProperties) {
    var color = textProperties.GetColor && textProperties.GetColor();

    // var color = textProperties.GetColor && textProperties.GetColor();
    //   color: color?.mza?.color?.RGBA || null,

    if (!color) return null;

    // Extract RGBA components
    var rgba = {
      r: color.mza?.color?.RGBA?.rb,
      g: color.mza?.color?.RGBA?.Sc,
      b: color.mza?.color?.RGBA?.Lb,
      a: color.mza?.color?.RGBA?.Dg,
    };
    return rgba;
  }

  // --- load all styles -----------------------------------------------------
  var allStyles = (doc.GetAllStyles && doc.GetAllStyles()) || [];

  // Filter using GetType() === "paragraph"
  var paragraphStyles = allStyles.filter(function (s) {
    try {
      return s && s.GetType && s.GetType() === "paragraph";
    } catch (e) {
      return false;
    }
  });

  var out = { styles: [] };

  paragraphStyles.forEach(function (style) {
    var raw =
      (style.ToJSON && (style.ToJSON(true) || style.ToJSON(false))) || {};
    const attributes = typeof raw === "string" ? JSON.parse(raw) : {};

    var name = style && style.GetName ? style.GetName() : "";
    var type = style && style.GetType ? style.GetType() : "";

    // Returns the text properties of the current style.
    var textProperties = style.GetTextPr();
    // Returns the paragraph properties of the current style.
    var paragraphProperties = style.GetParaPr();

    // currently inactive:
    // var lineSpacing =
    //   paragraphProperties.GetSpacingLineValue &&
    //   paragraphProperties.GetSpacingLineValue(); // twips | "line240" | undefined
    // var textAlign = paragraphProperties.GetJc && paragraphProperties.GetJc();

    // var temp = paragraphProperties.GetSpacingLineValue();

    out.styles.push({
      styleId: attributes.styleId,
      name: name,
      type: type,
      fontFamily: textProperties.GetFontFamily() || null,
      fontSize: readFontSizePts(style),
      fontWeight: textProperties.GetBold() ? "bold" : "normal",
      fontStyle: textProperties.GetItalic() ? "italic" : "normal",
      color: getRgba(textProperties) || null,
      basedOnId: attributes.basedOn || "",
      //   rawAttributes: attributes,
    });
  });

  // --- emit as a single comment -------------------------------------------
  // var commentText = JSON.stringify(out, null, 2);
  // var p = Api.CreateParagraph();
  // p.AddText(" "); // anchor
  // doc.Push(p);
  // Api.AddComment(p, commentText, "Macro");
  console.log("Extracted styles:", JSON.stringify(out, null, 2));
})();
// EOF
