"use strict";

import { exportTableToCSV } from "./export.js";
import { allRikishi, RetiredRikishi } from "./rikishi.js";
import {
  banzuke1Config,
  banzuke2Config,
  populateBanzukeTable,
  createRowBanzuke1,
  createRowBanzuke2,
  writeTableTitles,
} from "./banzuke-tables.js";

/*
var shikonaCells = document.getElementsByClassName("shikona");
var theRikishi = [], rikishiID = [];
for (var i = 0; i < 100; i++) {
  theRikishi[i] = shikonaCells[i].previousElementSibling.innerHTML + ' ' + shikonaCells[i].children[0].innerHTML + ' ' + shikonaCells[i].nextElementSibling.children[0].innerHTML;
  rikishiID[i]  = shikonaCells[i].children[0].href.split('=')[1];
}
var hrefHtmlUrl;

if (window.location.href.startsWith("https://chiyo2suke"))
  hrefHtmlUrl = "https%3A%2F%2Fchiyo2suke.github.io%2Fgtbhelper";
else hrefHtmlUrl = "https%3A%2F%2Fgtbhelper.vercel.app";
*/

let redips = {},
  rd = REDIPS.drag;

$("#copyDraft").on("click", function () {
  var box = document.querySelector("#draftString");
  var slots = document.querySelectorAll(".redips-only.b2");
  var idsObj = {
    draftIds: [],
  };

  for (var i = 0; i < 54; i++) {
    if (slots[i].children.length > 0)
      idsObj.draftIds.push(
        parseInt(slots[i].children[0].children[0].href.split("=")[1]),
      );
    else idsObj.draftIds.push(-1);
    if (slots[i].dataset.r == "S2w" || slots[i].dataset.r == "K2w")
      idsObj.draftIds.push(-1, -1);
  }
  box.value = JSON.stringify(idsObj);
  box.select();
  box.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(box.value);
});
$("#openModal").on("click", function () {
  document.getElementById("insDialog").showModal();
});
$(".closeIns").on("click", function () {
  document.getElementById("insDialog").close();
});
/*
$("#copyCode").on("click", function () {
  var textBox = document.querySelector("#bookmarkletCode");

  textBox.select();
  textBox.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(textBox.value);
});
*/
addEventListener("message", async function (event) {
  var sumodbUrl = "http://sumodb.sumogames.de";

  if (event.origin != sumodbUrl) return;
  if (event.data == "Requesting data") {
    var ids = JSON.parse(this.document.cookie.split("=")[1]);

    event.source.postMessage(
      { message: "rikishi ids", ids: ids },
      event.origin,
    );
  }
});

function setCookie() {
  var slots = document.querySelectorAll(".redips-only.b2");
  var ids = [];

  for (var i = 0; i < 54; i++) {
    if (slots[i].children.length > 0)
      ids.push(parseInt(slots[i].children[0].children[0].href.split("=")[1]));
    else ids.push(-1);
    if (slots[i].dataset.r == "S2w" || slots[i].dataset.r == "K2w")
      ids.push(-1, -1);
  }
  document.cookie = "ids=" + JSON.stringify(ids) + "; SameSite=None; Secure";
}

for (let button of document.getElementsByName("onDoubleClick")) {
  button.addEventListener("click", () => {
    window.localStorage.setItem("radioButton", button.value);
  });
}

for (let button of document.getElementsByName("dropMode")) {
  button.addEventListener("click", () => {
    if (button.value == "disable") rd.dropMode = "single";
    else rd.dropMode = "multiple";
    window.localStorage.setItem("radioDrop", button.value);
  });
}

function addMakushitaTable() {
  const container = document.querySelectorAll(".banzukeContainer")[1];
  const table1 = document.createElement("table");
  const table2 = document.createElement("table");
  const table3 = document.createElement("table");
  const groups = [[], [], [], [], [], [], [], []];

  table1.className = "makushitaTable";
  table2.className = "makushitaTable";
  table3.className = "makushitaTable";

  allRikishi.forEach((rikishi) => {
    if (rikishi.rank.startsWith("Ms")) {
      const wins = parseInt(rikishi.winCount.split("-")[0], 10);
      groups[wins].push({
        rank: rikishi.rank,
        name: rikishi.name,
        id: rikishi.id,
      });
    }
  });

  const appendTableRows = (table, headerText, rows) => {
    const headerRow = document.createElement("tr");
    const header = document.createElement("th");

    header.colSpan = 2;
    header.innerText = headerText;
    headerRow.appendChild(header);
    table.children[0].appendChild(headerRow);

    rows.forEach((rikishi) => {
      const rikishiRow = document.createElement("tr");
      const rikishiCell = document.createElement("td");
      const link = document.createElement("a");

      link.href = `https://sumodb.sumogames.de/Rikishi.aspx?r=${rikishi.id}`;
      link.target = "_blank";
      link.innerText = `${rikishi.rank} ${rikishi.name}`;
      rikishiCell.appendChild(link);
      rikishiCell.id = rikishi.name.toLowerCase();
      rikishiRow.appendChild(rikishiCell);
      rikishiRow.appendChild(document.createElement("td"));
      table.children[0].appendChild(rikishiRow);
    });
  };

  table1.appendChild(document.createElement("tbody"));
  table2.appendChild(document.createElement("tbody"));
  table3.appendChild(document.createElement("tbody"));

  for (let i = 7; i >= 0; i--) {
    if (groups[i].length > 0) {
      if (i > 4) appendTableRows(table1, `${i} wins`, groups[i]);
      else if (i === 4) appendTableRows(table2, `${i} wins`, groups[i]);
      else appendTableRows(table3, `${i} wins`, groups[i]);
    }
  }

  container.appendChild(table1);
  container.appendChild(table2);
  container.appendChild(table3);
}

function loadDraft() {
  var draftDate = event.target.parentNode.previousElementSibling.innerText;

  if (confirm("Load draft from " + draftDate + "?")) {
    var draftsTable = document.getElementById("draftsTable");
    var allDrafts = JSON.parse(window.localStorage.getItem("drafts"));

    for (var i = 0; i < allDrafts.length; i++) {
      if (allDrafts[i].date == draftDate)
        document.getElementById("tableLiner").innerHTML =
          allDrafts[i].mainContent;
    }
    saveBanzuke();
    redips.init();
    if (window.localStorage.getItem("colCheck1") === null) {
      var columnCheckbox = document.querySelectorAll(".checkedByDefault");

      for (var i = 0; i < columnCheckbox.length; i++)
        columnCheckbox[i].checked = true;
    } else {
      for (var i = 1; i < 8; i++) {
        var columnCheck = document.querySelectorAll(".columnCheckbox")[i - 1];
        var check = JSON.parse(
          window.localStorage.getItem("colCheck" + String(i)),
        );

        columnCheck.checked = check;
      }
    }
    var noteCells = document.querySelectorAll(".nte");

    for (var i = 2; i < noteCells.length; i++) {
      let time = 0;
      noteCells[i].children[0].contentEditable = "true";
      noteCells[i].children[0].addEventListener("input", function () {
        // Reset the timer
        clearTimeout(time);

        time = setTimeout(function () {
          saveBanzuke();
          showSaving();
        }, 1000);
      });
    }
    columnCheckFunction();
  }
  //setCookie();
}

function deleteDraft() {
  var draftDate = event.target.parentNode.previousElementSibling.innerText;

  if (confirm("Delete draft from " + draftDate + "?")) {
    var allDrafts = JSON.parse(window.localStorage.getItem("drafts"));

    for (var i = 0; i < allDrafts.length; i++) {
      if (allDrafts[i].date == draftDate) allDrafts.splice(i, 1);
    }
    window.localStorage.setItem("drafts", JSON.stringify(allDrafts));
    event.target.parentNode.parentNode.remove();
  }
}

function saveRadio(radioButton) {
  window.localStorage.setItem("radioButton", radioButton.value);
}

function saveDropRadio(button) {
  if (button.value == "disable") rd.dropMode = "single";
  else rd.dropMode = "multiple";

  window.localStorage.setItem("radioDrop", button.value);
}

function saveBanzuke() {
  var date = new Date();

  window.localStorage.setItem(
    "savedBanzuke",
    document.getElementById("tableLiner").innerHTML,
  );
  window.localStorage.setItem("savedBanzukeTime", date.toString());
  //setCookie();
}

// *****************************************************************************

rd.animation = "off";

redips.init = function () {
  rd.init();
  rd.hover.colorTd = "chartreuse";
  //rd.hover.borderTd = "2px solid blue";
  //rd.dropMode = "multiple";
  rd.only.divClass.se = "b2";

  rd.enableDrag(false, ".intai");

  var radioDrop = document.getElementsByName("dropMode");

  if (radioDrop[2].checked) rd.dropMode = "single";
  else rd.dropMode = "multiple";

  allRikishi.forEach((rikishi) => {
    if (rikishi.rank !== "") {
      rd.only.div[rikishi.rank] = rikishi.rank;
    }
  });

  rd.hover.colorTd = "royalblue";

  var intervalID;

  rd.event.changed = function (currentCell) {
    var tooltipCheckbox = document.getElementById("tooltipCheckbox"),
      chTooltip = document.createElement("span"),
      change = currentCell.classList.contains("b2")
        ? getChange(rd.obj.id, currentCell.dataset.r)
        : "",
      prevTip = document.getElementById("chTooltip");

    if (!tooltipCheckbox.checked) {
      if (typeof prevTip != "undefined" && prevTip != null) prevTip.remove();
      chTooltip.id = "chTooltip";
      chTooltip.innerHTML = "(" + rd.obj.id + " " + rd.obj.dataset.re + ")";
      if (change != "")
        chTooltip.innerHTML = "<b>" + change + "</b> " + chTooltip.innerHTML;
      rd.obj.prepend(chTooltip);
    }
    var tip = document.getElementById("tip");

    if (typeof tip != "undefined" && tip != null) tip.remove();

    var prevShifters = document.getElementsByClassName("shifter"),
      prevShiftTo = document.getElementsByClassName("shiftTo");

    if (typeof prevShiftTo[0] != "undefined" && prevShiftTo[0] != null)
      prevShiftTo[0].classList.remove("shiftTo");
    if (typeof prevShifters[0] != "undefined" && prevShifters[0] != null) {
      while (prevShifters.length) prevShifters[0].classList.remove("shifter");
    }
    if (typeof intervalID != "undefined" && intervalID != null)
      window.clearInterval(intervalID);

    if (
      currentCell.children.length > 0 &&
      currentCell != rd.obj.parentNode &&
      window.localStorage.getItem("radioDrop") == "shift" &&
      currentCell.classList.contains("b2")
    ) {
      var b2Cell = document.querySelectorAll(".b2"),
        targetIndex = Array.prototype.slice.call(b2Cell).indexOf(currentCell),
        originIndex = Array.prototype.slice
          .call(b2Cell)
          .indexOf(rd.obj.parentNode);

      var tooltip = document.createElement("span");
      tooltip.id = "tip";
      if (originIndex > targetIndex || originIndex < 0)
        tooltip.setAttribute("data-direction", "up");
      else if (originIndex < targetIndex)
        tooltip.setAttribute("data-direction", "down");
      if (tooltipCheckbox.checked) tooltip.style.display = "none";
      currentCell.prepend(tooltip);
      shiftDirect();
      const interval = setInterval(shiftDirect, 1000);
      intervalID = interval;
      function shiftDirect() {
        var prevShifters = document.getElementsByClassName("shifter"),
          prevShiftTo = document.getElementsByClassName("shiftTo");

        if (typeof prevShiftTo[0] != "undefined" && prevShiftTo[0] != null)
          prevShiftTo[0].classList.remove("shiftTo");
        if (typeof prevShifters[0] != "undefined" && prevShifters[0] != null) {
          while (prevShifters.length)
            prevShifters[0].classList.remove("shifter");
        }
        if (tooltip.dataset.direction == "down")
          tooltip.dataset.direction = "up";
        else tooltip.dataset.direction = "down";
        if (tooltip.dataset.direction == "down") {
          tooltip.innerHTML = "⮟";
          for (var i = targetIndex; i < b2Cell.length; i++) {
            if (
              b2Cell[i].children.length == 0 ||
              targetIndex == 53 ||
              targetIndex == 81 ||
              targetIndex == 111 ||
              (b2Cell[i].children.length == 1 &&
                b2Cell[i] === rd.obj.parentNode) ||
              ((i == 53 || i == 81 || i == 111) &&
                b2Cell[i].children.length > 0)
            ) {
              //b2Cell[i].style.border = "none";
              b2Cell[i].classList.add("shiftTo");
              for (var j = i - 1; j >= targetIndex; i--, j--) {
                for (var k = 0; k < b2Cell[j].children.length; k++)
                  b2Cell[j].children[k].classList.add("shifter");
              }
              break;
            }
          }
        } else {
          tooltip.innerHTML = "⮝";
          for (var i = targetIndex; i >= 0; i--) {
            if (
              b2Cell[i].children.length == 0 ||
              targetIndex == 0 ||
              targetIndex == 54 ||
              targetIndex == 82 ||
              (b2Cell[i].children.length == 1 &&
                b2Cell[i] === rd.obj.parentNode) ||
              ((i == 0 || i == 54 || i == 82) && b2Cell[i].children.length > 0)
            ) {
              //b2Cell[i].style.border = "none";
              b2Cell[i].classList.add("shiftTo");
              for (var j = i + 1; j <= targetIndex; i++, j++) {
                for (var k = 0; k < b2Cell[j].children.length; k++)
                  b2Cell[j].children[k].classList.add("shifter");
              }
              break;
            }
          }
        }
      }
    }
  };

  rd.event.dblClicked = function () {
    var radioButton = document.getElementsByTagName("input");
    var rikishiURL = rd.obj.children[0].href;
    var thisRank = rd.obj.id,
      originCell = document.querySelectorAll("." + thisRank)[0],
      currentCell = rd.findParent("TD", rd.obj),
      currentChgCell;

    if (radioButton[1].checked) window.open(rikishiURL, "_blank").focus();
    else if (radioButton[2].checked && currentCell.classList.contains("b2")) {
      rd.moveObject({
        obj: rd.obj,
        target: originCell,
        callback: function () {
          if (currentCell.dataset.r.charAt(0) == "J")
            document.getElementById("juRik").innerHTML--;
          else if (currentCell.dataset.r.startsWith("Ms"))
            document.getElementById("msRik").innerHTML--;
          else document.getElementById("makRik").innerHTML--;
          originCell.children[0].remove();
          $("#" + rd.obj.innerText.toLowerCase())
            .next()
            .html("");
          //b1Cell[i].style.removeProperty("border");
          updateInfoCells();
          saveBanzuke();
        },
      });
      showSaving();
    }
  };

  rd.event.notMoved = function () {
    var currentCell = rd.findParent("TD", rd.obj);

    //currentCell.style.removeProperty("box-shadow");
    //rd.obj.removeChild(rd.obj.childNodes[1]);
  };

  rd.event.droppedBefore = function (targetCell) {
    var makuCounter = document.getElementById("makRik"),
      juCounter = document.getElementById("juRik"),
      msCounter = document.getElementById("msRik"),
      thisCard = rd.obj,
      currentCell = rd.findParent("TD", thisCard),
      currentChgCell,
      dropRadio = document.getElementsByName("dropMode");
    var currentCellRank,
      targetCellRank,
      curCellIsOfBanzuke2 = currentCell.classList.contains("b2"),
      tarCellIsOfBanzuke2 = targetCell.classList.contains("b2");

    //currentCell.style.removeProperty("box-shadow");

    if (curCellIsOfBanzuke2) {
      currentCellRank = currentCell.dataset.r.charAt(0);
      if (currentCellRank == "J") juCounter.innerHTML--;
      else if (currentCell.dataset.r.startsWith("Ms")) msCounter.innerHTML--;
      else makuCounter.innerHTML--;
    } else if (tarCellIsOfBanzuke2) {
      var holder = document.createElement("a");

      holder.innerHTML =
        thisCard.childNodes[thisCard.childNodes.length - 1].innerText;
      holder.href = thisCard.children[thisCard.childNodes.length - 1].href;
      holder.target = "_blank";
      //if (thisCard.id.startsWith("Ms"))
      //  holder.className = "msLink";
      currentCell.appendChild(holder);
    }

    if (tarCellIsOfBanzuke2) {
      targetCellRank = targetCell.dataset.r.charAt(0);
      if (targetCellRank == "J") juCounter.innerHTML++;
      else if (targetCell.dataset.r.startsWith("Ms")) msCounter.innerHTML++;
      else makuCounter.innerHTML++;
    } else {
      targetCell.children[0].remove();
      if (rd.obj.children.length > 1)
        $("#" + rd.obj.children[1].innerText.toLowerCase())
          .next()
          .html("");
      else
        $("#" + rd.obj.innerText.toLowerCase())
          .next()
          .html("");
    }

    if (
      dropRadio[1].checked &&
      targetCell !== currentCell &&
      tarCellIsOfBanzuke2 &&
      targetCell.children.length > 0
    ) {
      var tooltip = document.getElementById("tip");

      if (typeof tooltip != "undefined" && tooltip != null) {
        var b2Cell = document.querySelectorAll(".b2"),
          targetIndex = Array.prototype.slice.call(b2Cell).indexOf(targetCell);

        if (tooltip.dataset.direction == "down") {
          for (var i = targetIndex; i < b2Cell.length; i++) {
            if (
              b2Cell[i].children.length == 0 ||
              targetIndex == 53 ||
              targetIndex == 81 ||
              targetIndex == 111 ||
              (b2Cell[i].children.length == 1 &&
                b2Cell[i] === thisCard.parentNode) ||
              ((i == 53 || i == 81 || i == 111) &&
                b2Cell[i].children.length > 0)
            ) {
              //b2Cell[i].style.border = "none";
              for (var j = i - 1; j >= targetIndex; i--, j--)
                rd.relocate(b2Cell[j], b2Cell[i], "instant");
              redips.init();
              break;
            }
          }
        } else {
          for (var i = targetIndex; i >= 0; i--) {
            if (
              b2Cell[i].children.length == 0 ||
              targetIndex == 0 ||
              targetIndex == 54 ||
              targetIndex == 82 ||
              (b2Cell[i].children.length == 1 &&
                b2Cell[i] === thisCard.parentNode) ||
              ((i == 0 || i == 54 || i == 82) && b2Cell[i].children.length > 0)
            ) {
              //b2Cell[i].style.border = "none";
              for (var j = i + 1; j <= targetIndex; i++, j++)
                rd.relocate(b2Cell[j], b2Cell[i], "instant");
              redips.init();
              break;
            }
          }
        }
        var prevShifters = document.getElementsByClassName("shifter"),
          prevShiftTo = document.getElementsByClassName("shiftTo");

        if (typeof prevShiftTo[0] != "undefined" && prevShiftTo[0] != null)
          prevShiftTo[0].classList.remove("shiftTo");
        if (typeof prevShifters[0] != "undefined" && prevShifters[0] != null) {
          while (prevShifters.length)
            prevShifters[0].classList.remove("shifter");
        }
        if (typeof intervalID != "undefined" && intervalID != null)
          window.clearInterval(intervalID);
        tooltip.remove();
      }
    }
    if (rd.obj.childNodes.length > 1) {
      for (var i = 0; i < rd.obj.childNodes.length; i++)
        rd.obj.removeChild(rd.obj.childNodes[i]);
    }
  };
  rd.event.dropped = function (targetCell) {
    if (targetCell.style.backgroundColor != "")
      targetCell.style.backgroundColor = "";
    updateInfoCells();
    showSaving();
  };

  rd.event.finish = function () {
    saveBanzuke();
  };
};

function columnCheckFunction() {
  for (let button of document.getElementsByClassName("columnCheckbox")) {
    button.addEventListener("click", () => {
      var column = button.value;
      var colCell = document.getElementsByClassName(column);
      var colCheck = document.querySelectorAll(".columnCheckbox");

      if (button.checked) {
        for (var i = 0; i < colCell.length; i++)
          colCell[i].classList.remove("hid");
      } else {
        for (var i = 0; i < colCell.length; i++)
          colCell[i].classList.add("hid");
      }
      for (var i = 1; i < 8; i++) {
        window.localStorage.setItem(
          "colCheck" + String(i),
          colCheck[i - 1].checked,
        );
      }
      saveBanzuke();
    });
  }
}

function updateInfoCells() {
  var b2Cell = document.querySelectorAll(".b2"),
    b1Cell = document
      .getElementById("banzuke1")
      .querySelectorAll(".redips-only"),
    originCell,
    newRankCell,
    b1Chg,
    resultLink,
    resultCell,
    currRankCell,
    targetChgCell;

  for (var i = 0; i < b1Cell.length; i++) {
    if (
      b1Cell[i].children.length > 0 &&
      b1Cell[i].children[0].tagName == "DIV"
    ) {
      newRankCell = b1Cell[i].nextElementSibling;
      if (i % 2 != 0) {
        newRankCell = newRankCell.nextElementSibling;
      }
      if (newRankCell.innerHTML != "") {
        newRankCell.innerHTML = "";
        b1Chg = newRankCell.nextElementSibling;
        b1Chg.innerHTML = "";
      }
    }
  }

  for (var i = 0; i < b2Cell.length; i++) {
    resultCell = b2Cell[i].nextElementSibling;
    currRankCell = b2Cell[i].previousElementSibling;
    targetChgCell = resultCell.nextElementSibling;

    if (b2Cell[i].children.length > 0) {
      for (var j = 0; j < b2Cell[i].children.length; j++) {
        var thisRank = b2Cell[i].children[j].id,
          rikishiWins = b2Cell[i].children[j].dataset.w,
          thisChg,
          targetCellRank,
          chg;

        originCell = document.querySelectorAll("." + thisRank)[0];
        newRankCell = originCell.nextElementSibling;
        if (thisRank.endsWith("w")) {
          newRankCell = newRankCell.nextElementSibling;
          resultLink = originCell.nextElementSibling.innerHTML;
        } else resultLink = originCell.previousElementSibling.innerHTML;

        targetCellRank = b2Cell[i].dataset.r;

        thisChg = getChange(thisRank, targetCellRank);

        if (thisRank.startsWith("Ms") || thisRank.startsWith("Sd")) {
          if (thisRank.endsWith("TD")) thisRank = thisRank.slice(0, -2);
          thisChg =
            '<a href="https://sumodb.sumogames.de/Query.aspx?show_form=0&form1_rank=' +
            thisRank +
            "&form1_wins=" +
            rikishiWins / 2 +
            "&form1_year=196007-now&form2_highlight=on&form2_rank=" +
            targetCellRank +
            '" target="_blank" title="Click to run a SumoDB query">' +
            thisChg +
            "</a>";
        } else {
          thisChg =
            '<a href="https://sumodb.sumogames.de/Query.aspx?show_form=0&form1_rank=' +
            thisRank +
            "&form1_wins=" +
            rikishiWins +
            "&form1_year=193905-194401,194905-now&form2_highlight=on&form2_rank=" +
            targetCellRank +
            '" target="_blank" title="Click to run a SumoDB query">' +
            thisChg +
            "</a>";
        }

        newRankCell.innerHTML = b2Cell[i].dataset.r;

        b1Chg = newRankCell.nextElementSibling;
        b1Chg.innerHTML = thisChg;

        if (j == 0) {
          targetChgCell.innerHTML = thisChg;
          resultCell.innerHTML = resultLink;
          currRankCell.innerHTML =
            "<span>" + b2Cell[i].children[j].id + "</span>";
        } else {
          targetChgCell.innerHTML += "<br>" + thisChg;
          resultCell.innerHTML += "<br>" + resultLink;
          currRankCell.innerHTML +=
            "<br><span>" + b2Cell[i].children[j].id + "</span>";
        }
        if (thisRank.startsWith("Ms"))
          $("#" + b2Cell[i].children[j].innerText.toLowerCase())
            .next()
            .html(thisChg);

        var rikishiBgColor = window
          .getComputedStyle(b2Cell[i].children[j])
          .getPropertyValue("background-color");

        currRankCell.children[j * 2].style.background = rikishiBgColor;
        resultCell.children[j * 2].style.background = rikishiBgColor;
      }
    } else {
      resultCell.innerHTML = "";
      currRankCell.innerHTML = "";
      targetChgCell.innerHTML = "";
    }
  }
}

redips.resetBanzuke = function () {
  if (confirm("Reset the banzuke?") == true) {
    var redipsCell = document.querySelectorAll(".redips-only"),
      b2Cell = document.querySelectorAll(".b2"),
      chgCell = document.getElementsByClassName("ch");
    var c1 = document.querySelectorAll(".new"),
      c2 = document.querySelectorAll(".ch1"),
      c3 = document.querySelectorAll(".rs2"),
      c4 = document.querySelectorAll(".cur"),
      c5 = document.querySelectorAll(".ch2"),
      c6 = document.querySelectorAll(".nte");

    window.localStorage.removeItem("savedBanzuke");
    //setCookie();
    document.getElementById("makRik").innerHTML = 0;
    for (var i = 1; i < 8; i++)
      window.localStorage.removeItem("colCheck" + String(i));

    for (var i = 0; i < b2Cell.length; i++) {
      if (b2Cell[i].children.length > 0) {
        //b2Cell[i].style.border = "1px dashed dimgray";
        //chgCell[i].innerHTML = ' ';
        for (var j = b2Cell[i].children.length - 1; j >= 0; j--) {
          for (var k = 0; k < 100; k++) {
            if (redipsCell[k].classList.contains(b2Cell[i].children[j].id)) {
              rd.moveObject({
                obj: b2Cell[i].children[j],
                target: redipsCell[k],
              });
              redipsCell[k].children[0].style.display = "none";
              //b1Cell[k].style.removeProperty("border");
              break;
            }
          }
        }
      }
    }
    for (var i = 2; i < c1.length; i++) {
      if (c1[i].innerHTML != "") {
        c1[i].innerHTML = "";
        c2[i].innerHTML = "";
      }
    }
    for (var i = 2; i < c3.length; i++) {
      if (c3[i].innerHTML != "") {
        c3[i].innerHTML = "";
        c4[i].innerHTML = "";
        c5[i].innerHTML = "";
      }
      if (c6[i].children[0].innerHTML != "") c6[i].children[0].innerHTML = "";
    }
    location.reload();
  }
};

redips.arrange = function () {
  if (confirm("Confirm auto-arrange?") == true) {
    var msCounter = document.getElementById("msRik"),
      juCounter = document.getElementById("juRik"),
      makuCounter = document.getElementById("makRik");

    for (let rikishi of allRikishi) {
      const rikishiElement = document.getElementById(rikishi.rank);

      if (rikishi.rank.startsWith("Ms") && parseInt(rikishi.rank.slice(2)) > 15)
        break;
      if (rikishi instanceof RetiredRikishi) continue;

      if (!rikishiElement.parentNode.classList.contains("b2")) {
        const holder = document.createElement("a");

        holder.innerHTML = rikishiElement.innerText;
        holder.href = rikishiElement.children[0].href;
        holder.target = "_blank";
        rikishiElement.parentNode.appendChild(holder);
      } else {
        if (rikishiElement.parentNode.dataset.r.startsWith("J")) {
          juCounter.innerHTML--;
        } else if (rikishiElement.parentNode.dataset.r.startsWith("Ms")) {
          msCounter.innerHTML--;
        } else {
          makuCounter.innerHTML--;
        }
      }

      if (rikishi.rank.startsWith("J")) {
        juCounter.innerHTML++;
      } else if (rikishi.rank.startsWith("Ms")) {
        msCounter.innerHTML++;
      } else {
        makuCounter.innerHTML++;
      }

      rd.moveObject({
        obj: rikishiElement,
        target: document.querySelector(`[data-r="${rikishi.rank}"]`),
      });
    }
    updateInfoCells();
    saveBanzuke();
  }
};

function getChange(thisRank, targetCellRank) {
  var chg;

  if (thisRank == targetCellRank) chg = "─";
  else {
    const change = [
      ["calc", "!!!", "!!!", "!!!", "!!!", "!!!", "!!!", "!!!"],
      [" ↑ ", "calc", " ↓ ", "!!!", "!!!", "!!!", "!!!", "!!!"],
      ["!!!", " ↑ ", "calc", " ↓ ", " ↓ ", "!!!", "!!!", "!!!"],
      ["!!!", "!!!", " ↑ ", "calc", " ↓ ", "!!!", "!!!", "!!!"],
      ["!!!", "!!!", " ↑ ", " ↑ ", "calc", " ↓ ", "!!!", "!!!"],
      ["!!!", "!!!", "!!!", "!!!", " ↑ ", "calc", " ↓ ", "!!!"],
      ["!!!", "!!!", "!!!", "!!!", "!!!", " ↑ ", "calc", " ↓ "],
      ["!!!", "!!!", "!!!", "!!!", "!!!", "!!!", " ↑ ", "calc"],
    ];
    var r1, r2;

    switch (thisRank.charAt(0)) {
      case "Y":
        r1 = 0;
        break;
      case "O":
        r1 = 1;
        break;
      case "S":
        if (!thisRank.startsWith("Sd")) r1 = 2;
        else r1 = 7;
        break;
      case "K":
        r1 = 3;
        break;
      case "M":
        if (!thisRank.startsWith("Ms")) r1 = 4;
        else r1 = 6;
        break;
      default:
        r1 = 5;
    }
    switch (targetCellRank.charAt(0)) {
      case "Y":
        r2 = 0;
        break;
      case "O":
        r2 = 1;
        break;
      case "S":
        if (!targetCellRank.startsWith("Sd")) r2 = 2;
        else r2 = 7;
        break;
      case "K":
        r2 = 3;
        break;
      case "M":
        if (!targetCellRank.startsWith("Ms")) r2 = 4;
        else r2 = 6;
        break;
      default:
        r2 = 5;
    }

    if (change[r1][r2] != "calc") chg = change[r1][r2];
    else {
      var thisRankNum =
          r1 == 6 || r1 == 7
            ? parseInt(thisRank.slice(2, -1))
            : parseInt(thisRank.slice(1, -1)),
        targetRankNum =
          r2 == 6 || r2 == 7
            ? parseInt(targetCellRank.slice(2, -1))
            : parseInt(targetCellRank.slice(1, -1));

      if (thisRank.slice(-1) == "w") thisRankNum += 0.5;
      if (targetCellRank.slice(-1) == "w") targetRankNum += 0.5;

      chg = thisRankNum - targetRankNum;

      if (chg > 0) chg = "+" + chg;
    }
  }

  return chg;
}

function showSaving() {
  var saving = document.getElementById("progressText");
  saving.innerHTML = "Saved!";
  setTimeout(function () {
    saving.innerHTML = "";
  }, 1000);
}

if (window.addEventListener)
  window.addEventListener("load", redips.init, false);
else if (window.attachEvent) window.attachEvent("onload", redips.init);

document.addEventListener("DOMContentLoaded", async function () {
  var basho = "202603"; // The date of the basho just ended

  // This must be a hyperlink
  $("#exportToCsv1").on("click", function (event) {
    exportTableToCSV.apply(this, [$("#banzuke1"), "banzuke1.csv"]);
  });
  $("#exportToCsv2").on("click", function (event) {
    exportTableToCSV.apply(this, [$("#banzuke2"), "banzuke2.csv"]);
  });

  // removing unused local storage names of before *****************************
  if (window.localStorage.getItem("banzuke1") !== null) {
    window.localStorage.removeItem("banzuke1");
    window.localStorage.removeItem("banzuke2");
  }
  if (window.localStorage.getItem("banzuke") !== null) {
    window.localStorage.removeItem("banzuke");
  }
  if (window.localStorage.getItem("picks") !== null) {
    window.localStorage.removeItem("picks");
  }
  // ***************************************************************************
  if (window.localStorage.getItem("savedBanzuke") !== null) {
    var saveDate = Date.parse(window.localStorage.getItem("savedBanzukeTime")),
      expireDate = new Date(Date.UTC(2026, 2, 22, 9, 50)); //UTC time

    if (saveDate < expireDate) window.localStorage.removeItem("savedBanzuke");
    else {
      document.getElementById("tableLiner").innerHTML =
        window.localStorage.getItem("savedBanzuke");
      if (document.querySelectorAll(".makushitaTable").length == 0) {
        addMakushitaTable();
        updateInfoCells();
      }
    }
    //setCookie();
  }
  if (window.localStorage.getItem("savedBanzuke") === null) {
    populateBanzukeTable("banzuke1Body", banzuke1Config, createRowBanzuke1);
    populateBanzukeTable("banzuke2Body", banzuke2Config, createRowBanzuke2);
    writeTableTitles(basho);
    addRikishi();
    addMakushitaTable();
    //setCookie();
  }

  var radioButton = document.getElementsByClassName("checkbox"),
    radioLocal = window.localStorage.getItem("radioButton"),
    radioLocalDrop = window.localStorage.getItem("radioDrop");

  if (radioLocal === null || radioLocal == "openRikishiPage")
    radioButton[0].checked = true;
  else if (radioLocal == "returnToOld") radioButton[1].checked = true;
  else radioButton[2].checked = true;

  if (radioLocalDrop === null || radioLocalDrop == "multiple")
    radioButton[3].checked = true;
  else if (radioLocalDrop == "shift") radioButton[4].checked = true;
  else radioButton[5].checked = true;

  var noteCells = document.querySelectorAll(".nte");

  for (var i = 2; i < noteCells.length; i++) {
    let time = 0;
    noteCells[i].children[0].contentEditable = "true";
    noteCells[i].children[0].addEventListener("input", function () {
      // Reset the timer
      clearTimeout(time);

      time = setTimeout(function () {
        saveBanzuke();
        showSaving();
      }, 1000);
    });
  }

  var checkbox = document.getElementById("ChangeTheme"); //get the checkbox to a variable

  //check storage if dark mode was on or off
  if (localStorage.getItem("mode") == "dark") {
    darkmode(); //if dark mode was on, run this funtion
  } else {
    nodark(); //else run this funtion
  }

  checkbox.addEventListener("change", function () {
    //check if the checkbox is checked or not
    if (checkbox.checked) {
      darkmode(); //if the checkbox is checked, run this funtion
    } else {
      nodark(); //else run this funtion
    }
    updateInfoCells();
  });

  var drafts = window.localStorage.getItem("drafts");

  if (drafts !== null) {
    var draftsTable = document.getElementById("draftsTable");
    var draftsJSON = JSON.parse(drafts);

    for (var i = 0; i < draftsJSON.length; i++) {
      var draftRow = document.createElement("tr");

      draftRow.innerHTML =
        '<td title="' +
        draftsJSON[i].name +
        '" class="dname"><b>' +
        draftsJSON[i].name +
        "</b></td><td>" +
        draftsJSON[i].date +
        "</td><td><button>❌</button> <button>Load</button></td>";
      draftsTable.children[0].appendChild(draftRow);
      draftsTable.children[0].lastChild.children[2].children[0].addEventListener(
        "click",
        deleteDraft,
      );
      draftsTable.children[0].lastChild.children[2].children[1].addEventListener(
        "click",
        loadDraft,
      );
    }
  }
  if (window.localStorage.getItem("colCheck1") === null) {
    var columnCheckbox = document.querySelectorAll(".checkedByDefault");

    for (var i = 0; i < columnCheckbox.length; i++)
      columnCheckbox[i].checked = true;
  } else {
    for (var i = 1; i < 8; i++) {
      var columnCheck = document.querySelectorAll(".columnCheckbox")[i - 1];
      var check = JSON.parse(
        window.localStorage.getItem("colCheck" + String(i)),
      );

      columnCheck.checked = check;
    }
  }

  var saveDialog = document.getElementById("saveDialog");

  document.getElementById("saveDraft").addEventListener("click", function () {
    saveDialog.show();
  });
  document
    .getElementById("saveDraftButton")
    .addEventListener("click", function () {
      if (window.localStorage.getItem("savedBanzuke") !== null) {
        var draftsTable = document.getElementById("draftsTable");
        var draftName = document.getElementById("draftName").value;
        var currentDate = new Date().toLocaleString();
        var draftCount = draftsTable.children[0].children.length + 1;
        var draft = {
          name: "",
          date: "",
          mainContent: "",
        };
        var draftRow = document.createElement("tr");
        var draftsString = window.localStorage.getItem("drafts");
        var draftsJSON;

        draft.name = draftName;
        draft.date = currentDate;
        draft.mainContent = window.localStorage.getItem("savedBanzuke");
        if (draftsString !== null) draftsJSON = JSON.parse(draftsString);
        else draftsJSON = [];
        draftsJSON.unshift(draft);
        window.localStorage.setItem("drafts", JSON.stringify(draftsJSON));
        draftRow.innerHTML =
          '<td title="' +
          draftName +
          '" class="dname"><b>' +
          draftName +
          "</b></td><td>" +
          currentDate +
          "</td><td><button>❌</button> <button>Load</button></td>";
        draftsTable.children[0].appendChild(draftRow);
        draftsTable.children[0].lastChild.children[2].children[0].addEventListener(
          "click",
          deleteDraft,
        );
        draftsTable.children[0].lastChild.children[2].children[1].addEventListener(
          "click",
          loadDraft,
        );
        document.getElementById("draftName").value = "";
      }
      saveDialog.close();
    });
  document.getElementById("closeDialog").addEventListener("click", function () {
    saveDialog.close();
  });
  document
    .getElementById("draftName")
    .addEventListener("keypress", function () {
      // If the user presses the "Enter" key on the keyboard
      if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("saveDraftButton").click();
      }
    });

  document
    .getElementById("resetBanzuke")
    .addEventListener("click", redips.resetBanzuke);
  document
    .getElementById("autoArrange")
    .addEventListener("click", redips.arrange);
  columnCheckFunction();

  function darkmode() {
    document.body.classList.add("darkm"); //add a class to the body tag
    checkbox.checked = true; //set checkbox to be checked state
    localStorage.setItem("mode", "dark"); //store a name & value to know that dark mode is on
  }

  function nodark() {
    document.body.classList.remove("darkm"); //remove added class from body tag
    checkbox.checked = false; //set checkbox to be unchecked state
    localStorage.setItem("mode", "light"); //store a name & value to know that dark mode is off or light mode is on
  }

  function addRikishi() {
    const table1 = document.getElementById("banzuke1"),
      cells = table1.querySelectorAll(".redips-only");

    cells.forEach((cell) => {
      allRikishi.forEach((rikishi) => {
        if (cell.classList.contains(rikishi.rank)) {
          let card = rikishi.createCard(basho);

          cell.appendChild(card);
          cell.classList.add("initCell");

          let resCell = cell.previousElementSibling.classList.contains("rs1")
            ? cell.previousElementSibling
            : cell.nextElementSibling;
          resCell.innerHTML = rikishi.getRecordLink(basho);
        }
      });
    });
  }
});
