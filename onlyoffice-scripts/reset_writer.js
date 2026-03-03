// Script for OnlyOffice to reset paragraph styles based on an input recipe.
// Matches styles by name and updates their text properties accordingly.

(function () {
  const MM_TO_PT = 72 / 25.4; // ≈ 2.834645669291339
  const CM_TO_PT = 72 / 2.54; // ≈ 28.346456692913385 (or MM_TO_PT * 10)

  // base64 -i "/Organisation/Branding/Vorlagen/signets/crop/Team-Ensemble-Logo--crop.png" | pbcopy
  const logo =
    "data:image/png;base64,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";
  var doc = Api.GetDocument();

  const INPUT = {
    page: {
      paddingTop: "27.4mm",
      paddingBottom: "24.5mm",
      paddingLeft: "48.5mm",
      paddingRight: "10mm",
      headers: {
        default: {
          childrenDeleteBeforeCreate: true,
          children: [
            {
              type: "line",
              position: "absolute",
              left: "17.5mm",
              top: "16mm",
              width: "27.5mm",
              borderWidth: "1pt",
              borderColor: { r: 0, g: 0, b: 0, a: 255 },
            },
            {
              type: "textbox",
              position: "absolute",
              left: "17.5mm",
              top: "18.1mm",
              width: "100mm",
              height: "20mm",
              color: { r: 0, g: 0, b: 0 },
              children: [
                {
                  type: "paragraph",
                  text: "Januar 202x",
                  fontFamily: "Liberation Mono",
                  fontSize: "7pt",
                  textTransform: "uppercase",
                  lineHeight: 1,
                },
              ],
            },
          ],
        },
        first: {
          childrenDeleteBeforeCreate: true,
          children: [
            {
              type: "line",
              position: "absolute",
              left: "17.5mm",
              top: "16mm",
              width: "27.5mm",
              borderWidth: "1pt",
              borderColor: { r: 0, g: 0, b: 0, a: 255 },
            },
            {
              type: "textbox",
              position: "absolute",
              left: "17.5mm",
              top: "18.1mm",
              width: "100mm",
              height: "20mm",
              color: { r: 0, g: 0, b: 0 },
              children: [
                {
                  type: "paragraph",
                  text: "Januar 202x",
                  fontFamily: "Liberation Mono",
                  fontSize: "7pt",
                  textTransform: "uppercase",
                  lineHeight: 1,
                },
              ],
            },
          ],
        },
      },
      footers: {
        default: {
          childrenDeleteBeforeCreate: true,
          children: [
            {
              type: "line",
              position: "absolute",
              left: "17.5mm",
              top: "277.5mm",
              width: "182.5mm",
              borderWidth: "1pt",
              borderColor: { r: 0, g: 0, b: 0, a: 255 },
            },
            {
              type: "image",
              position: "absolute",
              left: "17.5mm",
              top: "281 mm",
              height: "8mm",
              width: "auto",
              src: logo,
            },
            {
              type: "textbox",
              position: "absolute",
              left: "31.25mm",
              top: "281mm",
              width: "168.75mm",
              height: "8mm",
              color: { r: 0, g: 0, b: 0 },
              padding: 0,
              alignItems: "center",
              children: [
                {
                  type: "paragraph",
                  text: "Stiftung Team Ensemble · team-ensemble.ch",
                  fontFamily: "Geist",
                  fontSize: "8pt",
                  lineHeight: 1,
                  paddingBottom: 0,
                },
              ],
            },
          ],
        },
      },
    },
    styles: [
      {
        styleId: "1077",
        name: "Normal",
        type: "paragraph",
        fontFamily: "Merriweather",
        fontSize: "9pt",
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 1.15,
        paddingBottom: "1.5mm",
        basedOnId: "",
      },
      {
        styleId: "900",
        name: "Heading 1",
        type: "paragraph",
        fontFamily: "Geist",
        fontSize: "20pt",
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 0.925,
        textIndent: "-31mm",
        paddingTop: "0cm",
        paddingBottom: "16.4mm",
        basedOnId: "1077",
      },
      {
        styleId: "901",
        name: "Heading 2",
        type: "paragraph",
        fontFamily: "Geist",
        fontSize: "15pt",
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 1.1,
        paddingTop: "6.5mm",
        paddingBottom: "2mm",
        basedOnId: "1077",
      },
      {
        styleId: "903",
        name: "Heading 3",
        type: "paragraph",
        fontFamily: "Merriweather",
        fontSize: "10pt",
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 1.33,
        paddingTop: "6mm",
        paddingBottom: "3.5mm",
        basedOnId: "1077",
        letterSpacing: "0.02em",
      },
      {
        styleId: "1062",
        name: "List Paragraph",
        type: "paragraph",
        paddingBottom: "1.5mm",
      },
      // {
      //   styleId: "905",
      //   name: "Heading 4",
      //   type: "paragraph",
      //   fontFamily: "Geist",
      //   fontSize: "13pt",
      //   fontWeight: "bold",
      //   fontStyle: "normal",
      //   lineHeight: 1,
      //   paddingTop: "0.3cm",
      //   paddingBottom: "0.15cm",
      //   basedOnId: "1077",
      // },
      // {
      //   styleId: "907",
      //   name: "Heading 5",
      //   type: "paragraph",
      //   fontFamily: "Geist",
      //   fontSize: "10pt",
      //   fontWeight: "bold",
      //   fontStyle: "normal",
      //   lineHeight: 1,
      //   paddingTop: "0.15cm",
      //   paddingBottom: "0.07cm",
      //   basedOnId: "1077",
      // },
      // {
      //   styleId: "739",
      //   name: "Caption",
      //   type: "paragraph",
      //   fontFamily: "Geist",
      //   fontSize: "9pt",
      //   fontWeight: "normal",
      //   color: {
      //     r: 0,
      //     g: 0,
      //     b: 0,
      //     a: 255,
      //   },
      //   fontStyle: "normal",
      //   lineHeight: 1.2,
      //   paddingTop: "0.15cm",
      //   paddingBottom: "0.07cm",
      //   basedOnId: "885",
      // },
    ],
  };

  // ==================================================

  // Build a quick lookup by style name (name is what we’ll match on)
  var byName = Object.create(null);
  if (INPUT && INPUT.styles && INPUT.styles.length) {
    for (var i = 0; i < INPUT.styles.length; i++) {
      var it = INPUT.styles[i] || {};
      if (it && typeof it.name === "string" && it.name.length)
        byName[it.name] = it;
    }
  }

  function toHalfPoints(fontSizePt) {
    // OnlyOffice stores font sizes in half-points (e.g., 20pt -> 40)
    var pts = toPoints(fontSizePt);
    if (pts == null) return null;
    return Math.round(pts * 2);
  }

  function toPoints(length) {
    // Accept numbers (points) or strings with pt/cm suffixes (CSS-like convenience)
    if (typeof length === "number") {
      if (!isFinite(length)) return null;
      return length;
    }
    if (typeof length !== "string") return null;
    var raw = length.replaceAll(" ", "").trim().toLowerCase();
    if (!raw.length) return null;

    var factor = 1; // default assume pt
    if (raw.endsWith("mm")) {
      factor = MM_TO_PT; // 1 mm in points
      raw = raw.slice(0, -2);
    } else if (raw.endsWith("cm")) {
      factor = CM_TO_PT; // 1 cm in points
      raw = raw.slice(0, -2);
    } else if (raw.endsWith("pt")) {
      raw = raw.slice(0, -2);
    }

    var n = parseFloat(raw);
    if (!isFinite(n)) return null;
    return n * factor;
  }

  function toTwips(length) {
    // Word/OnlyOffice spacing measures use twentieths of a point (twips)
    var pts = toPoints(length);
    if (pts == null) return null;
    return Math.round(pts * 20);
  }

  function toEmu(length) {
    // English Metric Units: 1 pt = 12700 EMU
    var pts = toPoints(length);
    if (pts == null) return null;
    return Math.round(pts * 12700);
  }

  function toLineSpacing(lineHeight) {
    // CSS-like: if number => multiple, if length => absolute
    if (lineHeight == null || lineHeight === "") return null;

    if (typeof lineHeight === "number") {
      if (!isFinite(lineHeight)) return null;
      return { mode: "multiple", value: Math.round(lineHeight * 240) };
    }

    var tw = toTwips(lineHeight);
    if (tw != null) return { mode: "exact", value: tw };
    return null;
  }

  function setTextPrFromRecipe(style, recipe) {
    // Get current text properties object and mutate it
    var tp = style.GetTextPr && style.GetTextPr();
    if (!tp) return;

    // fontFamily
    if (recipe.fontFamily && typeof recipe.fontFamily === "string") {
      try {
        tp.SetFontFamily(recipe.fontFamily);
      } catch (e) {
        console.error("Failed to set fontFamily for style", style, e);
      }
    }

    // fontSize (points -> half-points)
    if (recipe.fontSize != null && recipe.fontSize !== "") {
      var szHps = toHalfPoints(recipe.fontSize);
      if (szHps != null) {
        try {
          tp.SetFontSize(szHps);
        } catch (e) {
          console.error("Failed to set fontSize for style", style, e);
        }
      }
    }

    // fontWeight
    if (recipe.fontWeight === "bold" || recipe.fontWeight === "normal") {
      try {
        tp.SetBold(recipe.fontWeight === "bold");
      } catch (e) {
        console.error("Failed to set fontWeight for style", style, e);
      }
    }

    // fontStyle
    if (recipe.fontStyle === "italic" || recipe.fontStyle === "normal") {
      try {
        tp.SetItalic(recipe.fontStyle === "italic");
      } catch (e) {
        console.error("Failed to set fontStyle for style", style, e);
      }
    }

    // color
    if (
      recipe.color &&
      typeof recipe.color === "object" &&
      typeof recipe.color.r === "number" &&
      typeof recipe.color.g === "number" &&
      typeof recipe.color.b === "number"
    ) {
      try {
        tp.SetColor(recipe.color.r, recipe.color.g, recipe.color.b);
        console.log("Set color for style", style.GetName(), recipe.color);
      } catch (e) {
        console.error("Failed to set color for style", style, e);
      }
    }

    // text-transform: CSS casing — "uppercase" → AllCaps, "none"/"normal" → off
    if (recipe.textTransform != null && recipe.textTransform !== "") {
      try {
        tp.SetCaps(recipe.textTransform === "uppercase");
      } catch (e) {
        console.error("Failed to set textTransform for style", style, e);
      }
    }

    // letterSpacing – supports "em" (relative to fontSize) or absolute lengths (pt/cm)
    if (recipe.letterSpacing != null && recipe.letterSpacing !== "") {
      var spacingTwips = null;
      if (
        typeof recipe.letterSpacing === "string" &&
        recipe.letterSpacing.trim().toLowerCase().endsWith("em")
      ) {
        var emVal = parseFloat(recipe.letterSpacing.trim().slice(0, -2));
        var baseSizePt =
          typeof recipe.fontSize === "number"
            ? recipe.fontSize
            : parseFloat(recipe.fontSize);
        if (isFinite(emVal) && isFinite(baseSizePt)) {
          // em × fontSizePt → points; points × 20 → twips
          spacingTwips = Math.round(emVal * baseSizePt * 20);
        }
      } else {
        // Absolute length (pt / cm)
        spacingTwips = toTwips(recipe.letterSpacing);
      }
      if (spacingTwips != null) {
        try {
          tp.SetSpacing(spacingTwips);
          console.log(
            "Set letterSpacing",
            spacingTwips,
            "twips for style",
            style.GetName && style.GetName(),
          );
        } catch (e) {
          console.error("Failed to set letterSpacing for style", style, e);
        }
      }
    }
  }

  function setParaPrFromRecipe(style, recipe) {
    var styleName = style && style.GetName ? style.GetName() : "<unknown>";
    console.log("setParaPrFromRecipe: entering for", styleName);

    var hasParagraphPr = !!(style.GetParagraphPr);
    var hasParaPr = !!(style.GetParaPr);
    console.log(
      "setParaPrFromRecipe:",
      styleName,
      "has GetParagraphPr:",
      hasParagraphPr,
      "has GetParaPr:",
      hasParaPr
    );

    var pp =
      (style.GetParagraphPr && style.GetParagraphPr()) ||
      (style.GetParaPr && style.GetParaPr());

    if (!pp) {
      console.warn(
        "setParaPrFromRecipe: no paragraph properties object (pp) for style",
        styleName,
        "— skipping para spacing"
      );
      return;
    }

    var ls = toLineSpacing(recipe.lineHeight);
    if (ls && ls.value != null) {
      try {
        pp.SetSpacingLine(ls.value, ls.mode === "exact" ? "exact" : "auto");
        console.log("Applied lineHeight", ls, "for", styleName);
      } catch (e) {
        console.error("setParaPrFromRecipe: SetSpacingLine failed for", styleName, e);
      }
    }

    if (recipe.paddingTop != null && recipe.paddingTop !== "") {
      var before = toTwips(recipe.paddingTop);
      if (before != null) {
        try {
          pp.SetSpacingBefore(before);
          console.log("Applied paddingTop", before, "twips for", styleName);
        } catch (e) {
          console.error("setParaPrFromRecipe: SetSpacingBefore failed for", styleName, e);
        }
      }
    }

    if (recipe.paddingBottom != null && recipe.paddingBottom !== "") {
      var after = toTwips(recipe.paddingBottom);
      console.log(
        "setParaPrFromRecipe: toTwips(",
        recipe.paddingBottom,
        ") =>",
        after,
        "for",
        styleName
      );
      if (after != null) {
        try {
          pp.SetSpacingAfter(after);
          console.log("Applied paddingBottom", after, "twips for", styleName);
        } catch (e) {
          console.error("setParaPrFromRecipe: SetSpacingAfter failed for", styleName, e);
        }
      }
    }

    // textIndent (first-line indent, in twips)
    if (recipe.textIndent != null && recipe.textIndent !== "") {
      var indent = toTwips(recipe.textIndent);
      if (indent != null) {
        try {
          pp.SetIndLeft(indent);
          console.log("Applied textIndent", indent, "twips for", styleName);
        } catch (e) {
          console.error("Failed to set textIndent for style", styleName, e);
        }
      }
    }
  }

  function createLineShape(recipe) {
    console.log("createLineShape: recipe =", JSON.stringify(recipe));
    var widthEmu = toEmu(recipe.width) || 0;
    console.log("createLineShape: widthEmu =", widthEmu);

    var strokeWidth = toEmu(recipe.borderWidth || "0.5pt") || 6350;
    var strokeColor = recipe.borderColor || { r: 0, g: 0, b: 0 };
    console.log(
      "createLineShape: strokeWidth =",
      strokeWidth,
      "strokeColor =",
      JSON.stringify(strokeColor),
    );

    var rgbColor = Api.CreateRGBColor(
      strokeColor.r,
      strokeColor.g,
      strokeColor.b,
    );
    console.log(
      "createLineShape: rgbColor =",
      rgbColor,
      "type =",
      typeof rgbColor,
    );
    var solidFill = Api.CreateSolidFill(rgbColor);
    console.log(
      "createLineShape: solidFill =",
      solidFill,
      "type =",
      typeof solidFill,
    );
    var stroke = Api.CreateStroke(strokeWidth, solidFill);
    console.log("createLineShape: stroke =", stroke, "type =", typeof stroke);
    var fill = Api.CreateNoFill();
    console.log("createLineShape: fill =", fill, "type =", typeof fill);

    var shape = Api.CreateShape("line", widthEmu, 1, fill, stroke);
    console.log("createLineShape: shape =", shape, "type =", typeof shape);
    if (!shape) {
      console.error("createLineShape: Api.CreateShape returned falsy!");
      return null;
    }

    try {
      shape.SetWrappingStyle("inFront");
    } catch (e) {
      console.error("createLineShape: SetWrappingStyle failed", e);
    }
    var leftEmu = toEmu(recipe.left) || 0;
    var topEmu = toEmu(recipe.top) || 0;
    var isAbsolute = recipe.position === "absolute";
    var horRef = isAbsolute ? "page" : "column";
    var verRef = isAbsolute ? "page" : "paragraph";
    console.log(
      "createLineShape: position leftEmu =",
      leftEmu,
      "topEmu =",
      topEmu,
      "horRef =",
      horRef,
      "verRef =",
      verRef,
    );
    try {
      shape.SetHorPosition(horRef, leftEmu);
    } catch (e) {
      console.error("createLineShape: SetHorPosition failed", e);
    }
    try {
      shape.SetVerPosition(verRef, topEmu);
    } catch (e) {
      console.error("createLineShape: SetVerPosition failed", e);
    }

    console.log("createLineShape: done");
    return shape;
  }

  function createTextboxShape(recipe) {
    console.log("createTextboxShape: recipe =", JSON.stringify(recipe));
    var widthEmu = toEmu(recipe.width) || 0;
    var heightEmu = toEmu(recipe.height) || 0;
    console.log(
      "createTextboxShape: widthEmu =",
      widthEmu,
      "heightEmu =",
      heightEmu,
    );

    var fill = Api.CreateNoFill();
    var stroke = Api.CreateStroke(0, Api.CreateNoFill());
    console.log("createTextboxShape: fill =", fill, "stroke =", stroke);

    // var shape = Api.CreateShape("rect", widthEmu, heightEmu, fill, stroke);
    var shape = Api.CreateShape("rect", widthEmu, heightEmu);
    console.log("createTextboxShape: shape =", shape, "type =", typeof shape);
    if (!shape) {
      console.error("createTextboxShape: Api.CreateShape returned falsy!");
      return null;
    }

    try {
      shape.SetWrappingStyle("inFront");
    } catch (e) {
      console.error("createTextboxShape: SetWrappingStyle failed", e);
    }
    var leftEmu = toEmu(recipe.left) || 0;
    var topEmu = toEmu(recipe.top) || 0;
    var isAbsolute = recipe.position === "absolute";
    var horRef = isAbsolute ? "page" : "column";
    var verRef = isAbsolute ? "page" : "paragraph";
    console.log(
      "createTextboxShape: position leftEmu =",
      leftEmu,
      "topEmu =",
      topEmu,
      "horRef =",
      horRef,
      "verRef =",
      verRef,
    );
    try {
      shape.SetHorPosition(horRef, leftEmu);
    } catch (e) {
      console.error("createTextboxShape: SetHorPosition failed", e);
    }
    try {
      shape.SetVerPosition(verRef, topEmu);
    } catch (e) {
      console.error("createTextboxShape: SetVerPosition failed", e);
    }

    // Textbox inner padding — supports CSS shorthand or per-side values.
    // `padding: "2mm"` sets all four sides.
    // `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` set individual sides.
    // Per-side values take precedence over the shorthand. Default is 0 on all sides.
    var padShorthand = recipe.padding != null ? toEmu(recipe.padding) || 0 : 0;
    var padTop =
      recipe.paddingTop != null ? toEmu(recipe.paddingTop) || 0 : padShorthand;
    var padRight =
      recipe.paddingRight != null
        ? toEmu(recipe.paddingRight) || 0
        : padShorthand;
    var padBottom =
      recipe.paddingBottom != null
        ? toEmu(recipe.paddingBottom) || 0
        : padShorthand;
    var padLeft =
      recipe.paddingLeft != null
        ? toEmu(recipe.paddingLeft) || 0
        : padShorthand;
    try {
      shape.SetPaddings(padLeft, padTop, padRight, padBottom);
      console.log(
        "createTextboxShape: SetPaddings",
        padLeft,
        padTop,
        padRight,
        padBottom,
      );
    } catch (e) {
      console.error("createTextboxShape: SetPaddings failed", e);
    }

    // Vertical text alignment via CSS align-items terms
    // flex-start → top, center → center, flex-end → bottom
    var alignItemsMap = {
      "flex-start": "top",
      start: "top",
      center: "center",
      "flex-end": "bottom",
      end: "bottom",
    };
    var vertAlign =
      (recipe.alignItems && alignItemsMap[recipe.alignItems]) || "top";
    try {
      shape.SetVerticalTextAlign(vertAlign);
    } catch (e) {
      console.error("createTextboxShape: SetVerticalTextAlign failed", e);
    }

    console.log(
      "createTextboxShape: done (content will be populated after adding to document)",
    );
    return shape;
  }

  function getImageNaturalDimensionsFromDataURL(dataURL) {
    // Parse PNG natural dims from an inline base64 data URL (no XHR).
    // data:image/png;base64,<b64>
    try {
      var marker = ";base64,";
      var idx = dataURL.indexOf(marker);
      if (idx === -1) return null;
      // 24 bytes → 32 base64 chars (padded to multiple of 4)
      var b64slice = dataURL.substring(
        idx + marker.length,
        idx + marker.length + 32,
      );
      var bin = atob(b64slice);
      function b(i) {
        return bin.charCodeAt(i) & 0xff;
      }
      // PNG signature check: bytes 1-3 = 'PNG'
      if (b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47) {
        var w = ((b(16) << 24) | (b(17) << 16) | (b(18) << 8) | b(19)) >>> 0;
        var h = ((b(20) << 24) | (b(21) << 16) | (b(22) << 8) | b(23)) >>> 0;
        if (w > 0 && h > 0) return { width: w, height: h };
      }
    } catch (e) {
      console.log("getImageNaturalDimensionsFromDataURL: failed", e);
    }
    return null;
  }

  function createImageShape(recipe) {
    console.log(
      "createImageShape: recipe (src omitted) =",
      JSON.stringify({
        ...recipe,
        src: recipe.src ? recipe.src.substring(0, 40) + "…" : "",
      }),
    );

    // src must be an inline base64 data URL (e.g. "data:image/png;base64,...")
    var dataURL = recipe.src || "";
    var natW = null,
      natH = null;

    var dims = getImageNaturalDimensionsFromDataURL(dataURL);
    if (dims) {
      natW = dims.width;
      natH = dims.height;
    }

    var widthIsAuto = recipe.width === "auto";
    var heightIsAuto = recipe.height === "auto";
    var widthEmu = widthIsAuto ? null : toEmu(recipe.width) || 0;
    var heightEmu = heightIsAuto ? null : toEmu(recipe.height) || 0;

    // Proportional scaling when either dimension is "auto"
    if (widthIsAuto || heightIsAuto) {
      if (natW && natH && natW > 0 && natH > 0) {
        var ratio = natW / natH;
        if (widthIsAuto && heightIsAuto) {
          // Natural size at 96 DPI (1 px = 9525 EMU)
          widthEmu = Math.round(natW * 9525);
          heightEmu = Math.round(natH * 9525);
        } else if (widthIsAuto) {
          widthEmu = Math.round(heightEmu * ratio);
        } else {
          heightEmu = Math.round(widthEmu / ratio);
        }
        console.log(
          "createImageShape: auto-scaled widthEmu =",
          widthEmu,
          "heightEmu =",
          heightEmu,
          "(ratio =",
          ratio.toFixed(4) + ")",
        );
      } else {
        console.log(
          "createImageShape: natural dims unavailable, falling back to square",
        );
        if (widthIsAuto && heightIsAuto) {
          widthEmu = heightEmu = toEmu("20mm") || 0;
        } else if (widthIsAuto) {
          widthEmu = heightEmu;
        } else {
          heightEmu = widthEmu;
        }
      }
    }

    console.log(
      "createImageShape: widthEmu =",
      widthEmu,
      "heightEmu =",
      heightEmu,
    );

    var shape = null;
    try {
      shape = Api.CreateImage(dataURL, widthEmu, heightEmu);
    } catch (e) {
      console.error("createImageShape: Api.CreateImage failed", e);
      return null;
    }
    console.log("createImageShape: shape =", shape, "type =", typeof shape);
    if (!shape) {
      console.error("createImageShape: Api.CreateImage returned falsy!");
      return null;
    }

    try {
      shape.SetWrappingStyle("inFront");
    } catch (e) {
      console.error("createImageShape: SetWrappingStyle failed", e);
    }

    var leftEmu = toEmu(recipe.left) || 0;
    var topEmu = toEmu(recipe.top) || 0;
    var isAbsolute = recipe.position === "absolute";
    var horRef = isAbsolute ? "page" : "column";
    var verRef = isAbsolute ? "page" : "paragraph";
    console.log(
      "createImageShape: position leftEmu =",
      leftEmu,
      "topEmu =",
      topEmu,
      "horRef =",
      horRef,
      "verRef =",
      verRef,
    );
    try {
      shape.SetHorPosition(horRef, leftEmu);
    } catch (e) {
      console.error("createImageShape: SetHorPosition failed", e);
    }
    try {
      shape.SetVerPosition(verRef, topEmu);
    } catch (e) {
      console.error("createImageShape: SetVerPosition failed", e);
    }

    console.log("createImageShape: done");
    return shape;
  }

  function populateTextboxContent(doc, shape, recipe) {
    // Must be called AFTER the shape has been added to the document (via AddDrawing + Push)
    if (!recipe.children || !recipe.children.length) return;

    var docContent = shape.GetDocContent();
    console.log(
      "populateTextboxContent: docContent =",
      docContent,
      "type =",
      typeof docContent,
    );
    if (!docContent) {
      console.error("populateTextboxContent: GetDocContent() returned falsy");
      return;
    }

    // OnlyOffice always keeps at least one paragraph in a content area;
    // RemoveElement cannot delete the last element.  We push clean new
    // paragraphs first, then remove the original default paragraph so no
    // stale formatting leaks through.

    var elCount = docContent.GetElementsCount
      ? docContent.GetElementsCount()
      : 0;
    console.log("populateTextboxContent: existing elements =", elCount);

    // Remove all existing elements except the very first (can't be removed yet)
    for (var i = elCount - 1; i >= 1; i--) {
      try {
        docContent.RemoveElement(i);
      } catch (e) {
        console.error("populateTextboxContent: RemoveElement failed at", i, e);
      }
    }

    // Push all new paragraphs (created fresh, so they carry no old formatting)
    for (var c = 0; c < recipe.children.length; c++) {
      var child = recipe.children[c];
      if (child.type !== "paragraph") continue;

      var para = Api.CreateParagraph();

      // Apply paragraph style by className (style name in the document)
      if (child.className) {
        try {
          var style = doc.GetStyle(child.className);
          if (style) {
            para.SetStyle(style);
            console.log("populateTextboxContent: set style", child.className);
          } else {
            console.error(
              "populateTextboxContent: style not found:",
              child.className,
            );
          }
        } catch (e) {
          console.error(
            "populateTextboxContent: SetStyle failed for",
            child.className,
            e,
          );
        }
      }

      // Inline paragraph spacing — child values override textbox recipe defaults
      var inlineLineHeight =
        child.lineHeight != null ? child.lineHeight : recipe.lineHeight;
      if (inlineLineHeight != null) {
        var ls = toLineSpacing(inlineLineHeight);
        if (ls && ls.value != null) {
          try {
            para.SetSpacingLine(
              ls.value,
              ls.mode === "exact" ? "exact" : "auto",
            );
          } catch (e) {
            console.error("populateTextboxContent: SetSpacingLine failed", e);
          }
        }
      }
      var inlineParaPaddingTop =
        child.paddingTop != null
          ? child.paddingTop
          : recipe.paragraphPaddingTop;
      if (inlineParaPaddingTop != null) {
        var beforeTw = toTwips(inlineParaPaddingTop);
        if (beforeTw != null) {
          try {
            para.SetSpacingBefore(beforeTw);
          } catch (e) {}
        }
      }
      var inlineParaPaddingBottom =
        child.paddingBottom != null
          ? child.paddingBottom
          : recipe.paragraphPaddingBottom;
      if (inlineParaPaddingBottom != null) {
        var afterTw = toTwips(inlineParaPaddingBottom);
        if (afterTw != null) {
          try {
            para.SetSpacingAfter(afterTw);
          } catch (e) {}
        }
      }

      if (child.text) {
        var run = para.AddText(child.text);

        // Resolve inline text properties: child values override textbox recipe defaults
        var inlineFontFamily =
          child.fontFamily != null ? child.fontFamily : recipe.fontFamily;
        var inlineFontSize =
          child.fontSize != null ? child.fontSize : recipe.fontSize;
        var inlineFontWeight =
          child.fontWeight != null ? child.fontWeight : recipe.fontWeight;
        var inlineFontStyle =
          child.fontStyle != null ? child.fontStyle : recipe.fontStyle;
        var inlineColor = child.color != null ? child.color : recipe.color;
        var inlineTextTransform =
          child.textTransform != null
            ? child.textTransform
            : recipe.textTransform;

        if (run) {
          if (inlineFontFamily) {
            try {
              run.SetFontFamily(inlineFontFamily);
            } catch (e) {
              console.error("populateTextboxContent: SetFontFamily failed", e);
            }
          }
          if (inlineFontSize != null) {
            var szHps = toHalfPoints(inlineFontSize);
            if (szHps != null) {
              try {
                run.SetFontSize(szHps);
              } catch (e) {
                console.error("populateTextboxContent: SetFontSize failed", e);
              }
            }
          }
          if (inlineFontWeight === "bold" || inlineFontWeight === "normal") {
            try {
              run.SetBold(inlineFontWeight === "bold");
            } catch (e) {
              console.error("populateTextboxContent: SetBold failed", e);
            }
          }
          if (inlineFontStyle === "italic" || inlineFontStyle === "normal") {
            try {
              run.SetItalic(inlineFontStyle === "italic");
            } catch (e) {
              console.error("populateTextboxContent: SetItalic failed", e);
            }
          }
          if (inlineColor && typeof inlineColor === "object") {
            try {
              run.SetColor(inlineColor.r, inlineColor.g, inlineColor.b);
            } catch (e) {
              console.error("populateTextboxContent: run.SetColor failed", e);
            }
          }
          if (inlineTextTransform != null) {
            try {
              run.SetCaps(inlineTextTransform === "uppercase");
            } catch (e) {
              console.error("populateTextboxContent: SetCaps failed", e);
            }
          }
        } else {
          // Fallback if AddText doesn't return a run
          if (inlineColor && typeof inlineColor === "object") {
            para.SetColor(inlineColor.r, inlineColor.g, inlineColor.b);
          }
        }
      }

      try {
        docContent.Push(para);
        console.log(
          "populateTextboxContent: pushed paragraph with text:",
          child.text,
        );
      } catch (e) {
        console.error("populateTextboxContent: Push paragraph failed", e);
      }
    }

    // Now remove the original default paragraph (index 0) — this is safe
    // because we just pushed at least one new paragraph above.
    try {
      docContent.RemoveElement(0);
      console.log("populateTextboxContent: removed original default paragraph");
    } catch (e) {
      console.error(
        "populateTextboxContent: failed to remove original paragraph",
        e,
      );
    }
  }

  function setHeadersFromRecipe(doc, section, headersRecipe) {
    console.log("setHeadersFromRecipe: called");
    console.log(
      "setHeadersFromRecipe: section =",
      section,
      "type =",
      typeof section,
    );
    console.log(
      "setHeadersFromRecipe: headersRecipe keys =",
      headersRecipe ? Object.keys(headersRecipe) : "null",
    );
    if (!headersRecipe || !section) {
      console.error(
        "setHeadersFromRecipe: bailing — headersRecipe or section is falsy",
      );
      return;
    }

    // Log available section methods for debugging
    var sectionMethods = [];
    for (var key in section) {
      if (typeof section[key] === "function") sectionMethods.push(key);
    }
    console.log(
      "setHeadersFromRecipe: section methods =",
      sectionMethods.join(", "),
    );

    var headerTypes = ["default", "first"];

    for (var h = 0; h < headerTypes.length; h++) {
      var hType = headerTypes[h];
      var hRecipe = headersRecipe[hType];
      if (!hRecipe) {
        console.log("setHeadersFromRecipe: no recipe for header type:", hType);
        continue;
      }

      console.log("setHeadersFromRecipe: processing header type:", hType);

      // Map recipe header type names to OnlyOffice API header type names
      // OnlyOffice uses: "default", "title" (first page), "even"
      var apiHeaderType = hType === "first" ? "title" : hType;

      // Enable different first-page header/footer when "first" is specified
      if (hType === "first") {
        if (section.SetTitlePage) {
          try {
            section.SetTitlePage(true);
            console.log("setHeadersFromRecipe: SetTitlePage(true) called");
          } catch (e) {
            console.error("setHeadersFromRecipe: SetTitlePage failed", e);
          }
        } else {
          console.log(
            "setHeadersFromRecipe: section has no SetTitlePage method",
          );
        }
      }

      console.log(
        "setHeadersFromRecipe: calling section.GetHeader(",
        apiHeaderType,
        ", true)",
      );
      var header = null;
      try {
        header = section.GetHeader(apiHeaderType, true);
      } catch (e) {
        console.error("setHeadersFromRecipe: section.GetHeader threw", e);
      }
      console.log(
        "setHeadersFromRecipe: header =",
        header,
        "type =",
        typeof header,
      );
      if (!header) {
        console.error(
          "setHeadersFromRecipe: Could not get/create header for type:",
          hType,
        );
        continue;
      }

      // Log header methods
      var headerMethods = [];
      for (var hk in header) {
        if (typeof header[hk] === "function") headerMethods.push(hk);
      }
      console.log(
        "setHeadersFromRecipe: header methods =",
        headerMethods.join(", "),
      );

      // Clear existing content if requested
      if (hRecipe.childrenDeleteBeforeCreate) {
        var count = header.GetElementsCount ? header.GetElementsCount() : 0;
        console.log(
          "setHeadersFromRecipe: clearing",
          count,
          "existing elements from",
          hType,
          "header",
        );
        for (var r = count - 1; r >= 0; r--) {
          try {
            header.RemoveElement(r);
          } catch (e) {
            console.error(
              "setHeadersFromRecipe: RemoveElement(",
              r,
              ") failed",
              e,
            );
          }
        }
      }

      // Create children (line / textbox)
      var children = hRecipe.children || [];
      console.log(
        "setHeadersFromRecipe: creating",
        children.length,
        "children for",
        hType,
      );
      for (var c = 0; c < children.length; c++) {
        var childRecipe = children[c];
        console.log(
          "setHeadersFromRecipe: child[",
          c,
          "] type =",
          childRecipe.type,
        );
        var shape = null;

        try {
          if (childRecipe.type === "line") {
            shape = createLineShape(childRecipe);
          } else if (childRecipe.type === "textbox") {
            shape = createTextboxShape(childRecipe);
          } else if (childRecipe.type === "image") {
            shape = createImageShape(childRecipe);
          } else {
            console.log(
              "setHeadersFromRecipe: unknown child type:",
              childRecipe.type,
            );
          }
        } catch (e) {
          console.error(
            "setHeadersFromRecipe: shape creation failed for child[",
            c,
            "]",
            e,
          );
        }

        console.log(
          "setHeadersFromRecipe: shape =",
          shape,
          "type =",
          typeof shape,
        );
        if (shape) {
          try {
            var para = Api.CreateParagraph();
            para.AddDrawing(shape);
            header.Push(para);
            console.log(
              "setHeadersFromRecipe: Added",
              childRecipe.type,
              "to",
              hType,
              "header",
            );

            // Populate textbox content AFTER it's been added to the document
            if (childRecipe.type === "textbox" && childRecipe.children) {
              try {
                populateTextboxContent(doc, shape, childRecipe);
              } catch (e) {
                console.error(
                  "setHeadersFromRecipe: populateTextboxContent failed",
                  e,
                );
              }
            }
          } catch (e) {
            console.error(
              "setHeadersFromRecipe: failed to add shape to header",
              e,
            );
          }
        } else {
          console.error(
            "setHeadersFromRecipe: shape is falsy for child[",
            c,
            "], skipping",
          );
        }
      }

      console.log(
        "setHeadersFromRecipe: done with header type:",
        hType,
        "— added",
        children.length,
        "children",
      );
    }
    console.log("setHeadersFromRecipe: complete");
  }

  function setFootersFromRecipe(doc, section, footersRecipe) {
    console.log("setFootersFromRecipe: called");
    console.log(
      "setFootersFromRecipe: section =",
      section,
      "type =",
      typeof section,
    );
    console.log(
      "setFootersFromRecipe: footersRecipe keys =",
      footersRecipe ? Object.keys(footersRecipe) : "null",
    );
    if (!footersRecipe || !section) {
      console.error(
        "setFootersFromRecipe: bailing — footersRecipe or section is falsy",
      );
      return;
    }

    var footerTypes = ["default", "first"];

    for (var h = 0; h < footerTypes.length; h++) {
      var hType = footerTypes[h];
      var hRecipe = footersRecipe[hType];
      if (!hRecipe) {
        console.log("setFootersFromRecipe: no recipe for footer type:", hType);
        continue;
      }

      console.log("setFootersFromRecipe: processing footer type:", hType);

      // Map recipe footer type names to OnlyOffice API footer type names
      // OnlyOffice uses: "default", "title" (first page), "even"
      var apiFooterType = hType === "first" ? "title" : hType;

      // Enable different first-page header/footer when "first" is specified
      if (hType === "first") {
        if (section.SetTitlePage) {
          try {
            section.SetTitlePage(true);
            console.log("setFootersFromRecipe: SetTitlePage(true) called");
          } catch (e) {
            console.error("setFootersFromRecipe: SetTitlePage failed", e);
          }
        } else {
          console.log(
            "setFootersFromRecipe: section has no SetTitlePage method",
          );
        }
      }

      console.log(
        "setFootersFromRecipe: calling section.GetFooter(",
        apiFooterType,
        ", true)",
      );
      var footer = null;
      try {
        footer = section.GetFooter(apiFooterType, true);
      } catch (e) {
        console.error("setFootersFromRecipe: section.GetFooter threw", e);
      }
      console.log(
        "setFootersFromRecipe: footer =",
        footer,
        "type =",
        typeof footer,
      );
      if (!footer) {
        console.error(
          "setFootersFromRecipe: Could not get/create footer for type:",
          hType,
        );
        continue;
      }

      // Clear existing content if requested
      if (hRecipe.childrenDeleteBeforeCreate) {
        var count = footer.GetElementsCount ? footer.GetElementsCount() : 0;
        console.log(
          "setFootersFromRecipe: clearing",
          count,
          "existing elements from",
          hType,
          "footer",
        );
        for (var r = count - 1; r >= 0; r--) {
          try {
            footer.RemoveElement(r);
          } catch (e) {
            console.error(
              "setFootersFromRecipe: RemoveElement(",
              r,
              ") failed",
              e,
            );
          }
        }
      }

      // Create children (line / textbox / image)
      var children = hRecipe.children || [];
      console.log(
        "setFootersFromRecipe: creating",
        children.length,
        "children for",
        hType,
      );
      for (var c = 0; c < children.length; c++) {
        var childRecipe = children[c];
        console.log(
          "setFootersFromRecipe: child[",
          c,
          "] type =",
          childRecipe.type,
        );
        var shape = null;

        try {
          if (childRecipe.type === "line") {
            shape = createLineShape(childRecipe);
          } else if (childRecipe.type === "textbox") {
            shape = createTextboxShape(childRecipe);
          } else if (childRecipe.type === "image") {
            shape = createImageShape(childRecipe);
          } else {
            console.log(
              "setFootersFromRecipe: unknown child type:",
              childRecipe.type,
            );
          }
        } catch (e) {
          console.error(
            "setFootersFromRecipe: shape creation failed for child[",
            c,
            "]",
            e,
          );
        }

        console.log(
          "setFootersFromRecipe: shape =",
          shape,
          "type =",
          typeof shape,
        );
        if (shape) {
          try {
            var para = Api.CreateParagraph();
            para.AddDrawing(shape);
            footer.Push(para);
            console.log(
              "setFootersFromRecipe: Added",
              childRecipe.type,
              "to",
              hType,
              "footer",
            );

            // Populate textbox content AFTER it's been added to the document
            if (childRecipe.type === "textbox" && childRecipe.children) {
              try {
                populateTextboxContent(doc, shape, childRecipe);
              } catch (e) {
                console.error(
                  "setFootersFromRecipe: populateTextboxContent failed",
                  e,
                );
              }
            }
          } catch (e) {
            console.error(
              "setFootersFromRecipe: failed to add shape to footer",
              e,
            );
          }
        } else {
          console.error(
            "setFootersFromRecipe: shape is falsy for child[",
            c,
            "], skipping",
          );
        }
      }

      console.log(
        "setFootersFromRecipe: done with footer type:",
        hType,
        "— added",
        children.length,
        "children",
      );
    }
    console.log("setFootersFromRecipe: complete");
  }

  function setPageFromRecipe(doc, pageRecipe) {
    if (!pageRecipe) return;

    // Prefer final section (matches working minimal sample)
    var section = (doc.GetFinalSection && doc.GetFinalSection()) || null;
    if (!section) {
      var sections = doc.GetSections ? doc.GetSections() : [];
      if (sections && sections.length) section = sections[0];
    }

    if (!section) {
      console.log("No section found for page settings");
      return;
    }

    var top = toTwips(pageRecipe.paddingTop);
    var bottom = toTwips(pageRecipe.paddingBottom);
    var left = toTwips(pageRecipe.paddingLeft);
    var right = toTwips(pageRecipe.paddingRight);
    console.log("Computed margins (twips)", {
      top: top,
      bottom: bottom,
      left: left,
      right: right,
    });

    var marginsApplied = false;
    try {
      if (section.SetPageMargins) {
        section.SetPageMargins(left || 0, top || 0, right || 0, bottom || 0);
        console.log("SetPageMargins applied on section");
        marginsApplied = true;
      } else if (section.SetMargins) {
        section.SetMargins(left || 0, top || 0, right || 0, bottom || 0);
        console.log("SetMargins applied on section");
        marginsApplied = true;
      }
      if (!marginsApplied) {
        // Per-side fallbacks
        if (section.SetMarginTop) section.SetMarginTop(top || 0);
        if (section.SetMarginBottom) section.SetMarginBottom(bottom || 0);
        if (section.SetMarginLeft) section.SetMarginLeft(left || 0);
        if (section.SetMarginRight) section.SetMarginRight(right || 0);
        console.log(
          "Per-side margin setters applied on section (if available)",
        );
      }
    } catch (e) {
      console.error("Failed to apply margins", e);
    }

    // If first-page differentiation is active on either side, ensure both headers
    // and footers have a "first" entry — falling back to their own "default" if missing.
    var headersHaveFirst = !!(pageRecipe.headers && pageRecipe.headers.first);
    var footersHaveFirst = !!(pageRecipe.footers && pageRecipe.footers.first);
    var firstPageActive = headersHaveFirst || footersHaveFirst;
    if (firstPageActive) {
      if (
        pageRecipe.headers &&
        !pageRecipe.headers.first &&
        pageRecipe.headers.default
      ) {
        console.log(
          "setPageFromRecipe: filling headers.first from headers.default",
        );
        pageRecipe.headers.first = pageRecipe.headers.default;
      }
      if (
        pageRecipe.footers &&
        !pageRecipe.footers.first &&
        pageRecipe.footers.default
      ) {
        console.log(
          "setPageFromRecipe: filling footers.first from footers.default",
        );
        pageRecipe.footers.first = pageRecipe.footers.default;
      }
    }

    // Apply headers if provided
    console.log(
      "setPageFromRecipe: headers recipe present =",
      !!pageRecipe.headers,
    );
    if (pageRecipe.headers) {
      try {
        setHeadersFromRecipe(doc, section, pageRecipe.headers);
      } catch (e) {
        console.error("setPageFromRecipe: Failed to apply headers", e);
      }
    }

    // Apply footers if provided
    console.log(
      "setPageFromRecipe: footers recipe present =",
      !!pageRecipe.footers,
    );
    if (pageRecipe.footers) {
      try {
        setFootersFromRecipe(doc, section, pageRecipe.footers);
      } catch (e) {
        console.error("setPageFromRecipe: Failed to apply footers", e);
      }
    }
  }

  // Get all styles, filter to paragraph styles, and apply updates where names match
  var allStyles = (doc.GetAllStyles && doc.GetAllStyles()) || [];
  var updated = 0,
    seen = 0;

  for (var s = 0; s < allStyles.length; s++) {
    var st = allStyles[s];
    var t = st && st.GetType ? st.GetType() : "";
    if (t !== "paragraph") continue; // only paragraph styles per your pipeline

    var name = st && st.GetName ? st.GetName() : "";
    if (!name || !(name in byName)) {
      if (name) console.log("Main loop: style not in recipe, skipping:", JSON.stringify(name));
      continue;
    }

    seen++;
    console.log("Main loop: processing style", JSON.stringify(name), "type:", t);
    try {
      setTextPrFromRecipe(st, byName[name]);
      setParaPrFromRecipe(st, byName[name]);
      updated++;
    } catch (e) {
      console.error("Main loop: error processing style", JSON.stringify(name), e);
    }
  }

  // Apply page paddings (margins) if provided
  console.log("Main: applying page recipe...");
  try {
    setPageFromRecipe(doc, INPUT.page);
    console.log("Main: setPageFromRecipe completed");
  } catch (e) {
    console.error("Main: setPageFromRecipe threw", e);
  }

  // Leave a small comment summary so you see what happened
  var report = {
    matchedStylesByName: seen,
    updatedStyles: updated,
    note: "Matched by style name; sizes interpreted as points and written in half-points.",
  };
  //   var p = Api.CreateParagraph();
  //   p.AddText(" "); // anchor
  //   doc.Push(p);
  //   Api.AddComment(p, JSON.stringify(report, null, 2), "Macro");

  console.log("Style reset report:", report);
})();
