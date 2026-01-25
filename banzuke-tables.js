"use strict";

export const banzuke1Config = [
  { prefix: "Y", range: [1] },
  { prefix: "O", range: [1] },
  { prefix: "S", range: [1] },
  { prefix: "K", range: [1] },
  { prefix: "M", range: Array.from({ length: 17 }, (_, i) => i + 1) },
  { divider: true },
  { prefix: "J", range: Array.from({ length: 14 }, (_, i) => i + 1) },
  { divider: true },
  { prefix: "Ms", range: Array.from({ length: 60 }, (_, i) => i + 1) },
  { prefix: "TD", range: [1] },
  { divider: true },
  { prefix: "Sd23", range: [1] },
];

export const banzuke2Config = [
  { prefix: "Y", range: [1, 2] },
  { prefix: "O", range: [1, 2, 3] },
  { prefix: "S", range: [1, 2] },
  { prefix: "K", range: [1, 2] },
  { prefix: "M", range: Array.from({ length: 18 }, (_, i) => i + 1) },
  {
    divider: {
      text: "Juryo Guess - ",
      spanId: "juRik",
      spanText: "0",
      suffix: "/28",
    },
  },
  { prefix: "J", range: Array.from({ length: 14 }, (_, i) => i + 1) },
  {
    divider: {
      text: "Makushita Joi Guess - ",
      spanId: "msRik",
      spanText: "0",
      suffix: "/30",
    },
  },
  { prefix: "Ms", range: Array.from({ length: 15 }, (_, i) => i + 1) },
];

export function populateBanzukeTable(tableId, config, createRow) {
  const tableBody = document.getElementById(tableId);
  config.forEach((item) => {
    if (item.divider) {
      const dividerRow = createDividerRow(item.divider);
      tableBody.appendChild(dividerRow);
    } else {
      item.range.forEach((num) => {
        const rank = item.prefix.startsWith("Sd") ? item.prefix : item.prefix + num;
        const row = createRow(rank);
        tableBody.appendChild(row);
      });
    }
  });
}

export function createRowBanzuke1(rank) {
  const row = document.createElement("tr");

  if (rank == "TD") {
    const resultCell = document.createElement("td");
    resultCell.className = "rs1";

    const rikishiCell = document.createElement("td");
    rikishiCell.className = `redips-only Ms60${rank}`;

    const newRankCell = document.createElement("td");
    newRankCell.className = "new hid";

    const changeCell = document.createElement("td");
    changeCell.className = "ch1 hid";

    const rankHeader = document.createElement("th");
    rankHeader.textContent = rank;

    row.appendChild(resultCell);
    row.appendChild(rikishiCell);
    row.appendChild(newRankCell);
    row.appendChild(changeCell);
    row.appendChild(rankHeader);
  } else {
    const eastResultCell = document.createElement("td");
    eastResultCell.className = "rs1";

    const eastRikishiCell = document.createElement("td");
    eastRikishiCell.className = `redips-only ${rank}e`;

    const eastNewRankCell = document.createElement("td");
    eastNewRankCell.className = "new hid";

    const eastChangeCell = document.createElement("td");
    eastChangeCell.className = "ch1 hid";

    const rankHeader = document.createElement("th");
    rankHeader.textContent = rank;

    const westRikishiCell = document.createElement("td");
    westRikishiCell.className = `redips-only ${rank}w`;

    const westResultCell = document.createElement("td");
    westResultCell.className = "rs1";

    const westNewRankCell = document.createElement("td");
    westNewRankCell.className = "new hid";

    const westChangeCell = document.createElement("td");
    westChangeCell.className = "ch1 hid";

    row.appendChild(eastResultCell);
    row.appendChild(eastRikishiCell);
    row.appendChild(eastNewRankCell);
    row.appendChild(eastChangeCell);
    row.appendChild(rankHeader);
    row.appendChild(westRikishiCell);
    row.appendChild(westResultCell);
    row.appendChild(westNewRankCell);
    row.appendChild(westChangeCell);
  }

  if (["Y", "O", "S", "K"].includes(rank.charAt(0)))
    row.className = rank.charAt(0).toLowerCase() + "Row";
  return row;
}

export function createRowBanzuke2(rank) {
  const row = document.createElement("tr");

  const eastNoteCell = document.createElement("td");
  eastNoteCell.className = "nte hid";
  const eastNoteDiv = document.createElement("div");
  eastNoteCell.appendChild(eastNoteDiv);

  const eastCurrentRankCell = document.createElement("td");
  eastCurrentRankCell.className = "cur";

  const eastRikishiCell = document.createElement("td");
  eastRikishiCell.setAttribute("data-r", `${rank}e`);
  eastRikishiCell.className = "redips-only b2";

  const eastResultCell = document.createElement("td");
  eastResultCell.className = "rs2";

  const eastChangeCell = document.createElement("td");
  eastChangeCell.className = "ch2";

  const rankHeader = document.createElement("th");
  rankHeader.textContent = rank;

  const westCurrentRankCell = document.createElement("td");
  westCurrentRankCell.className = "cur";

  const westRikishiCell = document.createElement("td");
  westRikishiCell.setAttribute("data-r", `${rank}w`);
  westRikishiCell.className = "redips-only b2";

  const westResultCell = document.createElement("td");
  westResultCell.className = "rs2";

  const westChangeCell = document.createElement("td");
  westChangeCell.className = "ch2";

  const westNoteCell = document.createElement("td");
  westNoteCell.className = "nte hid";
  const westNoteDiv = document.createElement("div");
  westNoteCell.appendChild(westNoteDiv);

  row.appendChild(eastNoteCell);
  row.appendChild(eastCurrentRankCell);
  row.appendChild(eastRikishiCell);
  row.appendChild(eastResultCell);
  row.appendChild(eastChangeCell);
  row.appendChild(rankHeader);
  row.appendChild(westCurrentRankCell);
  row.appendChild(westRikishiCell);
  row.appendChild(westResultCell);
  row.appendChild(westChangeCell);
  row.appendChild(westNoteCell);

  if (["Y", "O", "S", "K"].includes(rank.charAt(0)))
    row.className = rank.charAt(0).toLowerCase() + "Row";
  return row;
}

export function createDividerRow(title) {
  const row = document.createElement("tr");

  if (title) {
    const headerCell = document.createElement("th");
    headerCell.colSpan = 11;
    headerCell.className = "tableTitle";

    if (typeof title === "string") {
      // Simple string title
      headerCell.textContent = title;
    } else if (typeof title === "object") {
      // Complex title with span elements
      if (title.text) {
        headerCell.appendChild(document.createTextNode(title.text));
      }
      if (title.spanId) {
        const span = document.createElement("span");
        span.id = title.spanId;
        span.textContent = title.spanText || "";
        headerCell.appendChild(span);
      }
      if (title.suffix) {
        headerCell.appendChild(document.createTextNode(title.suffix));
      }
    }

    row.appendChild(headerCell);
  } else {
    // No title provided, just a divider row
    row.classList.add("divider");
  }

  return row;
}

export function writeTableTitles(basho) {
  const bashoYear = parseInt(basho.substring(0, 4));
  let bashoMonth = parseInt(basho.slice(-2));
  const tableTitle = document.getElementsByClassName("tableTitle");

  const bashoMonthLookup = {
    1: "Hatsu",
    3: "Haru",
    5: "Natsu",
    7: "Nagoya",
    9: "Aki",
    11: "Kyushu",
  };

  const getBashoName = (bMonth) => bashoMonthLookup[bMonth];

  // For first title - preserve existing content
  const existingContent0 = tableTitle[0].textContent;
  tableTitle[0].textContent = `${getBashoName(bashoMonth)} ${bashoYear}${existingContent0} Result`;

  let nextYear = bashoYear;
  if (bashoMonth > 9) {
    nextYear++;
    bashoMonth = -1;
  }

  // For second title - need to preserve the span element
  const existingSpan = tableTitle[4].querySelector("span");
  tableTitle[4].textContent = `${getBashoName(bashoMonth + 2)} ${nextYear} Makuuchi Guess - `;
  if (existingSpan) {
    tableTitle[4].appendChild(existingSpan);
    tableTitle[4].appendChild(
      document.createTextNode("/42"),
    );
  }

  tableTitle[0].colSpan = "9";
  tableTitle[4].colSpan = "11";
}
