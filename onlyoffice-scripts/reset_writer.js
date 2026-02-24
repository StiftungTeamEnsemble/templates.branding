// Script for OnlyOffice to reset paragraph styles based on an input recipe.
// Matches styles by name and updates their text properties accordingly.

const { Children } = require("react");

(function () {
  const MM_TO_PT = 72 / 25.4; // ≈ 2.834645669291339
  const CM_TO_PT = 72 / 2.54; // ≈ 28.346456692913385 (or MM_TO_PT * 10)

  var doc = Api.GetDocument();

  const INPUT = {
    page: {
      paddingTop: "26mm",
      paddingBottom: "24.5mm",
      paddingLeft: "48.5mm",
      paddingRight: "10mm",
      headers: {
        default: {
          childrenDeleteBeforeCreate: true,
          children: [
            {
              type: "line",
              left: "0mm",
              top: "0mm",
              width: "100mm",
              borderWidth: "0.5pt",
              borderColor: { r: 0, g: 0, b: 0, a: 255 },
            },
            {
              type: "textbox",
              left: "0mm",
              top: "0mm",
              width: "100mm",
              height: "20mm",
              children: [
                {
                  type: "paragraph",
                  text: "Page 1 Header",
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
              left: "0mm",
              top: "0mm",
              width: "100mm",
              borderWidth: "0.5pt",
              borderColor: { r: 0, g: 0, b: 0, a: 255 },
            },
            {
              type: "textbox",
              left: "0mm",
              top: "0mm",
              width: "100mm",
              height: "20mm",
              children: [
                {
                  type: "paragraph",
                  text: "Other Page Header",
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
        lineHeight: 1.44,
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
        lineHeight: 1.1,
        textIndent: "-31mm",
        paddingTop: "0cm",
        paddingBottom: "1mm",
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
    var raw = length.trim().toLowerCase();
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
    var pp =
      (style.GetParagraphPr && style.GetParagraphPr()) ||
      (style.GetParaPr && style.GetParaPr());
    if (!pp) return;

    var styleName = style && style.GetName ? style.GetName() : "<unknown>";

    var ls = toLineSpacing(recipe.lineHeight);
    if (ls && ls.value != null) {
      try {
        pp.SetSpacingLine(ls.value, ls.mode === "exact" ? "exact" : "auto");
        console.log("Applied lineHeight", ls, "for", styleName);
      } catch (e) {}
    }

    if (recipe.paddingTop != null && recipe.paddingTop !== "") {
      var before = toTwips(recipe.paddingTop);
      if (before != null) {
        try {
          pp.SetSpacingBefore(before);
          console.log("Applied paddingTop", before, "twips for", styleName);
        } catch (e) {}
      }
    }

    if (recipe.paddingBottom != null && recipe.paddingBottom !== "") {
      var after = toTwips(recipe.paddingBottom);
      if (after != null) {
        try {
          pp.SetSpacingAfter(after);
          console.log("Applied paddingBottom", after, "twips for", styleName);
        } catch (e) {}
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

    try {
      if (section.SetPageMargins) {
        section.SetPageMargins(left || 0, top || 0, right || 0, bottom || 0);
        console.log("SetPageMargins applied on section");
        return;
      }
      if (section.SetMargins) {
        section.SetMargins(left || 0, top || 0, right || 0, bottom || 0);
        console.log("SetMargins applied on section");
        return;
      }
      // Per-side fallbacks
      if (section.SetMarginTop) section.SetMarginTop(top || 0);
      if (section.SetMarginBottom) section.SetMarginBottom(bottom || 0);
      if (section.SetMarginLeft) section.SetMarginLeft(left || 0);
      if (section.SetMarginRight) section.SetMarginRight(right || 0);
      console.log("Per-side margin setters applied on section (if available)");
    } catch (e) {
      console.log("Failed to apply margins", e);
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
    if (!name || !(name in byName)) continue;

    seen++;
    try {
      setTextPrFromRecipe(st, byName[name]);
      setParaPrFromRecipe(st, byName[name]);
      updated++;
    } catch (e) {
      // swallow; continue with the next style
    }
  }

  // Apply page paddings (margins) if provided
  try {
    setPageFromRecipe(doc, INPUT.page);
  } catch (e) {}

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
