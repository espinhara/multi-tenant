class Utils {
  static cpfIsValid(strCPF) {
    if (!strCPF) {
      return false;
    }
    strCPF = strCPF.match(/\d/g).join("")
    var Soma;
    var Resto;
    var i;

    Soma = 0;
    if (strCPF === "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
    return true;
  }
  static cnpjIsValid(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
      return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    let i = 0;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
      return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
      return false;

    return true;
  }
  static getAcronym(name) {
    try {
      if (name) {
        const names = name.split(" ");
        if (names.length == 1) {
          return names[0][0].toUpperCase() + names[0][1].toUpperCase()
        }
        else {
          if (names[names.length - 1]) {
            return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase()
          } else {
            return names[0][0].toUpperCase()
          }
        }
      }
      else {
        return "";
      }
    } catch{
      return "";
    }

  }

  static downloadTableExcel(tableId, fileName){
    var download_csv = function download_csv(csv, filename) {
      var csvFile;
      var downloadLink;

      // CSV FILE
      csvFile = new Blob([csv], { type: "text/csv" });

      // Download link
      downloadLink = document.createElement("a");

      // File name
      downloadLink.download = filename;

      // We have to create a link to the file
      downloadLink.href = window.URL.createObjectURL(csvFile);

      // Make sure that the link is not displayed
      downloadLink.style.display = "none";

      // Add the link to your DOM
      document.body.appendChild(downloadLink);

      // Lanzamos
      downloadLink.click();
    };

    var export_table_to_csv = function export_table_to_csv(
      tableid,
      filename
    ) {
      var csv = [];
      var rows = document.querySelectorAll("table[id=" + tableid + "] tr");

      for (var i = 0; i < rows.length; i++) {
        var row = [],
          cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);

        csv.push(row.join(";"));
      }

      // Download CSV
      download_csv(csv.join("\n"), filename);
    };

    export_table_to_csv(tableId, fileName);
  }

  static downloadJsonExcel(models, columns, csvName) {
    var fname = "IJGResults";
    var csvContent = "";

    let cols = Object.getOwnPropertyNames(models[0]);

    for (let index = 0; index < cols.length; index++) {
      if (cols[index] == "_id" || cols[index] == "__ob__" || cols[index] == "__v") {
        cols.splice(index, 1);
        index--;
      }
    }

    // Convert model to table data
    let tableData = []
    
    if(columns){
      tableData = [columns];
    }else{
      tableData = [cols];
    }

    for (const model of models) {
      let row = [];
      for (const cel of cols) {
        row.push(model[cel]);
      }
      tableData.push(row);
    }

    tableData.forEach(row => {
      var cvsRow = "";
      row.forEach(cell => {
        cvsRow += `"${cell}";`;
      });
      csvContent += `${cvsRow}\n`;
    });

    var download = function (content, fileName, mimeType) {
      var a = document.createElement("a");
      mimeType = mimeType || "application/octet-stream";

      if (navigator.msSaveBlob) {
        // IE10
        navigator.msSaveBlob(
          new Blob([content], {
            type: mimeType
          }),
          fileName
        );
      } else if (URL && "download" in a) {
        //html5 A[download]
        a.href = URL.createObjectURL(
          new Blob([content], {
            type: mimeType
          })
        );
        a.setAttribute("download", fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        document.location.href =
          "data:application/octet-stream," + encodeURIComponent(content); // only this mime type is supported
      }
    };

    download(csvContent, csvName, "text/csv;encoding:utf-8");
  }
}

export default Utils;