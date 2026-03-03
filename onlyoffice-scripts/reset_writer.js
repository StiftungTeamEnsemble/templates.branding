// Script for OnlyOffice to reset paragraph styles based on an input recipe.
// Matches styles by name and updates their text properties accordingly.

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
              position: "absolute",
              left: "17.5mm",
              top: "16mm",
              width: "27.5mm",
              borderWidth: "0.5pt",
              borderColor: { r: 0, g: 0, b: 0, a: 255 },
            },
            {
              type: "textbox",
              position: "absolute",
              left: "17.5mm",
              top: "18.5mm",
              width: "100mm",
              height: "20mm",
              color: { r: 0, g: 0, b: 0 },
              children: [
                {
                  type: "paragraph",
                  text: "Januar 202x",
                  className: "Normal",
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
              borderWidth: "0.5pt",
              borderColor: { r: 0, g: 0, b: 0, a: 255 },
            },
            {
              type: "textbox",
              position: "absolute",
              left: "17.5mm",
              top: "18.5mm",
              width: "100mm",
              height: "20mm",
              color: { r: 0, g: 0, b: 0 },
              children: [
                {
                  type: "paragraph",
                  text: "Januar 202x",
                  className: "Normal",
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

    // Set 0 internal padding (text inset) on the textbox
    try {
      shape.SetPaddings(0, 0, 0, 0);
    } catch (e) {
      console.error("createTextboxShape: SetPaddings failed", e);
    }

    // Default vertical text alignment to top
    try {
      shape.SetVerticalTextAlign("top");
    } catch (e) {
      console.error("createTextboxShape: SetVerticalTextAlign failed", e);
    }

    console.log(
      "createTextboxShape: done (content will be populated after adding to document)",
    );
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

      if (child.text) {
        para.AddText(child.text);

        // Use color from textbox recipe, child override, or default to black
        var color = child.color || recipe.color;
        if (color && typeof color === "object") {
          para.SetColor(color.r, color.g, color.b);
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
