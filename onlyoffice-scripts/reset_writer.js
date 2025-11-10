(function () {
  var doc = Api.GetDocument();

  // Script for OnlyOffice to reset paragraph styles based on an input recipe.
  // Matches styles by name and updates their text properties accordingly.
  const INPUT = {
    styles: [
      {
        styleId: "1077",
        name: "Normal",
        type: "paragraph",
        fontFamily: "Open Sans",
        fontSize: null,
        fontWeight: "normal",
        fontStyle: "normal",
        basedOnId: "",
      },
      {
        styleId: "901",
        name: "Heading 1",
        type: "paragraph",
        fontFamily: "Open Sans",
        fontSize: 20,
        fontWeight: "bold",
        fontStyle: "normal",
        basedOnId: "1077",
      },
      {
        styleId: "903",
        name: "Heading 2",
        type: "paragraph",
        fontFamily: "Open Sans",
        fontSize: 15,
        fontWeight: "bold",
        fontStyle: "normal",
        basedOnId: "1077",
      },
      {
        styleId: "905",
        name: "Heading 3",
        type: "paragraph",
        fontFamily: "Open Sans",
        fontSize: 13,
        fontWeight: "bold",
        fontStyle: "normal",
        basedOnId: "1077",
      },
      {
        styleId: "907",
        name: "Heading 4",
        type: "paragraph",
        fontFamily: "Open Sans",
        fontSize: 11,
        fontWeight: "bold",
        fontStyle: "normal",
        basedOnId: "1077",
      },
      {
        styleId: "739",
        name: "Caption",
        type: "paragraph",
        fontFamily: "Open Sans",
        fontSize: 9,
        fontWeight: "normal",
        color: {
          r: 0,
          g: 0,
          b: 0,
          a: 255,
        },
        fontStyle: "normal",
        basedOnId: "885",
      },
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
    var n =
      typeof fontSizePt === "string" ? parseFloat(fontSizePt) : fontSizePt;
    if (!isFinite(n)) return null;
    return Math.round(n * 2);
  }

  function setTextPrFromRecipe(style, recipe) {
    // Get current text properties object and mutate it
    var tp = style.GetTextPr && style.GetTextPr();
    if (!tp) return;

    // fontFamily
    if (recipe.fontFamily && typeof recipe.fontFamily === "string") {
      try {
        tp.SetFontFamily(recipe.fontFamily);
      } catch (e) {}
    }

    // fontSize (points -> half-points)
    if (recipe.fontSize != null && recipe.fontSize !== "") {
      var szHps = toHalfPoints(recipe.fontSize);
      if (szHps != null) {
        try {
          tp.SetFontSize(szHps);
        } catch (e) {}
      }
    }

    // fontWeight
    if (recipe.fontWeight === "bold" || recipe.fontWeight === "normal") {
      try {
        tp.SetBold(recipe.fontWeight === "bold");
      } catch (e) {}
    }

    // fontStyle
    if (recipe.fontStyle === "italic" || recipe.fontStyle === "normal") {
      try {
        tp.SetItalic(recipe.fontStyle === "italic");
      } catch (e) {}
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
      updated++;
    } catch (e) {
      // swallow; continue with the next style
    }
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
