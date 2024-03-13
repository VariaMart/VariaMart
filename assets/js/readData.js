$(document).ready(function () {});

async function readData(sheetId, sheetName) {
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
  //   const sheetName = "Products";

  const query = encodeURIComponent("Select *");
  const url = `${base}&sheet=${sheetName}&tq=${query}`;
  const data = [];

  console.log("ready");

  await fetch(url)
    .then((res) => res.text())
    .then((rep) => {
      const jsData = JSON.parse(rep.substring(47).slice(0, -2));
      console.log(jsData);
      const colz = [];
      jsData.table.cols.forEach((heading) => {
        if (heading.label) {
          const propName = heading.label.toLowerCase().replace(/\s/g, "_");
          colz.push(propName);
        }
      });
      jsData.table.rows.forEach((main) => {
        if (main.c[0].v == "true") {
          const row = {};
          colz.forEach((ele, index) => {
            row[ele] = main.c[index] != null ? main.c[index].v : "";
          });
          data.push(row);
        }
      });
      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  return data;
}
// Set up a timer to call checkForSheetChanges every 10 seconds
// setInterval(readData(), 10000);
