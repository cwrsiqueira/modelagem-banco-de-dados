$(document).ready(function () {
  let editingTable = null;

  // Abrir o modal para criar a tabela
  $("#createTableBtn").click(function () {
    $("#createTableModal").modal("show");
    $("#modalTitle").text("Criar Nova Tabela");
    $("#columnsContainer").html(`
        <div class="form-group column-container">
          <div class="row align-items-end justify-content-between w-full">
              <div class="col-3">
                  <label for="column-name">Nome da Coluna:</label>
                  <input type="text" class="form-control mb-2 column-name" value="ID" required>
              </div>
              <div class="col-2">
                  <label for="column-type">Tipo:</label>
                  <select class="form-control mb-2 column-type">
                      <option value="int" selected>Int</option>
                      <option value="varchar">Varchar</option>
                      <option value="text">Text</option>
                      <option value="date">Date</option>
                      <option value="tinyint">TinyInt</option>
                      <option value="bigint">BigInt</option>
                      <option value="decimal">Decimal</option>
                      <option value="float">Float</option>
                      <option value="boolean">Boolean</option>
                      <option value="datetime">Datetime</option>
                      <option value="timestamp">Timestamp</option>
                  </select>
                  <input type="text" class="form-control mb-2 column-size" placeholder="Tamanho (ex: 255, 10,2)">
              </div>
              <div class="col-1">
                  <label><input type="checkbox" class="primary-key" checked> Chave Primária</label>
              </div>
              <div class="col-1">
                  <label><input type="checkbox" class="nullable"> Nulo</label>
              </div>
              <div class="col-1">
                  <label><input type="checkbox" class="foreign-key"> Chave Estrangeira</label>
              </div>
                <div class="col-2">
                    <div class="foreign-key-options" style="display: none;">
                      <label>Tabela Referenciada:</label>
                      <select class="form-control mb-2 foreign-table">
                          <!-- Tabelas serão preenchidas dinamicamente -->
                      </select>
                      <label>Coluna Referenciada:</label>
                      <select class="form-control mb-2 foreign-column">
                          <!-- Colunas serão preenchidas dinamicamente -->
                      </select>
                    </div>
                </div>
              <div class="col-2">
                <div class="d-flex">
                  <span title="Excluir coluna" class="btn btn-danger delete-column">&times;</span>
                  <div class="move-area">
                      <span title="Mover coluna para cima" class="move-up">&#x25B2;</span>
                  </div>
                  <div class="move-area">
                      <span title="Mover coluna para baixo" class="move-down">&#x25BC;</span>
                  </div>
                  </div>
              </div>
          </div>
        </div>
      `);
    $("#tableForm")[0].reset(); // Resetar o formulário
    editingTable = null;
    updateForeignKeyOptions();
  });

  // Adicionar nova coluna ao formulário
  $("#addColumnBtn").click(function () {
    const columnTemplate = `
        <div class="form-group column-container">
          <div class="row align-items-end justify-content-between w-full">
              <div class="col-3">
                  <label for="column-name">Nome da Coluna:</label>
                  <input type="text" class="form-control mb-2 column-name" required>
              </div>
              <div class="col-2">
                  <label for="column-type">Tipo:</label>
                  <select class="form-control mb-2 column-type">
                      <option value="int">Int</option>
                      <option value="varchar">Varchar</option>
                      <option value="text">Text</option>
                      <option value="date">Date</option>
                      <option value="tinyint">TinyInt</option>
                      <option value="bigint">BigInt</option>
                      <option value="decimal">Decimal</option>
                      <option value="float">Float</option>
                      <option value="boolean">Boolean</option>
                      <option value="datetime">Datetime</option>
                      <option value="timestamp">Timestamp</option>
                  </select>
                  <input type="text" class="form-control mb-2 column-size" placeholder="Tamanho (ex: 255, 10,2)">
              </div>
              <div class="col-1">
                  <label><input type="checkbox" class="primary-key"> Chave Primária</label>
              </div>
              <div class="col-1">
                  <label><input type="checkbox" class="nullable"> Nulo</label>
              </div>
              <div class="col-1">
                  <label><input type="checkbox" class="foreign-key"> Chave Estrangeira</label>
              </div>
                <div class="col-2">
                    <div class="foreign-key-options" style="display: none;">
                      <label>Tabela Referenciada:</label>
                      <select class="form-control mb-2 foreign-table">
                          <!-- Tabelas serão preenchidas dinamicamente -->
                      </select>
                      <label>Coluna Referenciada:</label>
                      <select class="form-control mb-2 foreign-column">
                          <!-- Colunas serão preenchidas dinamicamente -->
                      </select>
                    </div>
                </div>
              <div class="col-2">
              <div class="d-flex">
                  <span title="Excluir coluna" class="btn btn-danger delete-column">&times;</span>
                  <div class="move-area">
                      <span title="Mover coluna para cima" class="move-up">&#x25B2;</span>
                  </div>
                  <div class="move-area">
                      <span title="Mover coluna para baixo" class="move-down">&#x25BC;</span>
                  </div>
                  </div>
              </div>
          </div>
        </div>
      `;
    $("#columnsContainer").append(columnTemplate);
    updateForeignKeyOptions();
  });

  // Mostrar/ocultar opções de chave estrangeira
  $(document).on("change", ".foreign-key", function () {
    const foreignKeyOptions = $(this)
      .closest(".column-container")
      .find(".foreign-key-options");
    if ($(this).is(":checked")) {
      foreignKeyOptions.show();
    } else {
      foreignKeyOptions.hide();
    }
  });

  // Atualizar opções de chave estrangeira ao adicionar/editar tabelas
  function updateForeignKeyOptions() {
    const tableNames = [];
    $("#tablesContainer .table-box h5").each(function () {
      tableNames.push($(this).text());
    });

    $(".foreign-table").each(function () {
      const currentVal = $(this).val();
      $(this).html('<option value="">Selecione a Tabela</option>');
      tableNames.forEach(
        function (tableName) {
          const selected = tableName === currentVal ? "selected" : "";
          $(this).append(
            `<option value="${tableName}" ${selected}>${tableName}</option>`
          );
        }.bind(this)
      );
    });
  }

  // Imprimir a modelagem, ocultando os botões
  document.getElementById("printBtn").addEventListener("click", function () {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => (button.style.display = "none"));
    window.print();
    buttons.forEach((button) => (button.style.display = ""));
  });

  // Gerar código SQL para SQLite e fazer download
  function generateSQLiteSQL() {
    let sql = "";
    document
      .querySelectorAll("#tablesContainer .table-box")
      .forEach(function (table) {
        const tableName = table.querySelector("h5").innerText;
        sql += `CREATE TABLE ${tableName} (\n`;
        const columns = table.querySelectorAll(".columns p");
        columns.forEach(function (col, index) {
          const isLast = index === columns.length - 1;
          const columnName = col.innerText.split(" ")[0];
          const columnType = col.innerText.match(/\(([^)]+)\)/)[1];
          const primaryKey = col.innerText.includes("[PK]")
            ? " PRIMARY KEY AUTO_INCREMENT"
            : "";
          const nullable = col.innerText.includes("NULL")
            ? " NULL"
            : " NOT NULL";
          sql += `  ${columnName} ${columnType}${primaryKey}${nullable}${
            isLast ? "" : ","
          }\n`;
        });
        sql += `);\n\n`;
      });
    downloadFile("modeling.sqlite.sql", sql);
  }

  // Gerar código SQL para MySQL e fazer download
  function generateMySQLSQL() {
    let sql = "";
    document
      .querySelectorAll("#tablesContainer .table-box")
      .forEach(function (table) {
        const tableName = table.querySelector("h5").innerText;
        sql += `CREATE TABLE ${tableName} (\n`;
        const columns = table.querySelectorAll(".columns p");
        columns.forEach(function (col, index) {
          const isLast = index === columns.length - 1;
          const columnName = col.innerText.split(" ")[0];
          const columnType = col.innerText.match(/\(([^)]+)\)/)[1];
          const primaryKey = col.innerText.includes("[PK]")
            ? " PRIMARY KEY AUTO_INCREMENT"
            : "";
          const nullable = col.innerText.includes("NULL")
            ? " NULL"
            : " NOT NULL";
          sql += `  ${columnName} ${columnType}${primaryKey}${nullable}${
            isLast ? "" : ","
          }\n`;
        });
        sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8;\n\n`;
      });
    downloadFile("modeling.mysql.sql", sql);
  }

  // Função para fazer download do arquivo
  function downloadFile(filename, content) {
    const element = document.createElement("a");
    const blob = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // Associar eventos aos botões
  document
    .getElementById("generateSQLiteBtn")
    .addEventListener("click", generateSQLiteSQL);
  document
    .getElementById("generateMySQLBtn")
    .addEventListener("click", generateMySQLSQL);

  // Atualizar colunas referenciadas ao selecionar uma tabela
  $(document).on("change", ".foreign-table", function () {
    const selectedTable = $(this).val();
    const foreignColumnSelect = $(this)
      .closest(".column-container")
      .find(".foreign-column");
    foreignColumnSelect.html('<option value="">Selecione a Coluna</option>');

    if (selectedTable) {
      $("#tablesContainer .table-box").each(function () {
        if ($(this).find("h5").text() === selectedTable) {
          $(this)
            .find(".columns p")
            .each(function () {
              const columnName = $(this).text().split(" (")[0];
              foreignColumnSelect.append(
                `<option value="${columnName}">${columnName}</option>`
              );
            });
        }
      });
    }
  });

  // Deletar coluna
  $(document).on("click", ".delete-column", function () {
    $(this).closest(".form-group").remove();
  });

  // Mover coluna para cima
  $(document).on("click", ".move-up", function () {
    const column = $(this).closest(".form-group");
    column.prev().before(column);
  });

  // Mover coluna para baixo
  $(document).on("click", ".move-down", function () {
    const column = $(this).closest(".form-group");
    column.next().after(column);
  });

  // Salvar tabela ao clicar no botão Salvar Tabela
  $("#tableForm").submit(function (event) {
    event.preventDefault();

    // Obter nome da tabela
    const tableName = $("#tableName").val();
    const columns = [];

    // Obter informações das colunas
    $("#columnsContainer .form-group").each(function () {
      const columnName = $(this).find(".column-name").val();
      const columnType = $(this).find(".column-type").val();
      const columnSize = $(this).find(".column-size").val();
      const primaryKey = $(this).find(".primary-key").is(":checked");
      const nullable = $(this).find(".nullable").is(":checked");
      const foreignKey = $(this).find(".foreign-key").is(":checked");
      const foreignTable = foreignKey
        ? $(this).find(".foreign-table").val()
        : null;
      const foreignColumn = foreignKey
        ? $(this).find(".foreign-column").val()
        : null;

      columns.push({
        name: columnName,
        type: columnType + (columnSize ? `(${columnSize})` : ""),
        primaryKey: primaryKey,
        nullable: nullable,
        foreignKey: foreignKey,
        foreignTable: foreignTable,
        foreignColumn: foreignColumn,
      });
    });

    if (editingTable) {
      // Editar tabela existente
      $(editingTable).find("h5").text(tableName);
      const columnsContainer = $(editingTable).find(".columns");
      columnsContainer.html("");
      columns.forEach(function (col) {
        columnsContainer.append(`
            <p>${
              col.name
            } (${col.type}) ${col.primaryKey ? " [PK]" : ""} ${col.nullable ? " NULL" : " NOT NULL"} ${col.foreignKey ? `[FK: ${col.foreignTable}.${col.foreignColumn}]` : ""}</p>
          `);
      });
    } else {
      // Criar visualização da nova tabela
      const tableBox = $('<div class="table-box"></div>');
      tableBox.append('<span class="delete-table">&times;</span>');
      tableBox.append(`<h5>${tableName}</h5>`);
      const columnsContainer = $('<div class="columns"></div>');
      columns.forEach(function (col) {
        columnsContainer.append(`
            <p>${
              col.name
            } (${col.type}) ${col.primaryKey ? " [PK]" : ""} ${col.nullable ? " NULL" : " NOT NULL"} ${col.foreignKey ? `[FK: ${col.foreignTable}.${col.foreignColumn}]` : ""}</p>
          `);
      });
      tableBox.append(columnsContainer);
      tableBox.append('<span class="edit-table">Editar</span>');

      // Adicionar a tabela ao container principal
      $("#tablesContainer").append(tableBox);
    }

    // Fechar o modal
    $("#createTableModal").modal("hide");
    updateForeignKeyOptions();
    updateRelationsList();
  });

  // Deletar tabela
  $(document).on("click", ".delete-table", function () {
    $(this).closest(".table-box").remove();
    updateForeignKeyOptions();
    updateRelationsList();
  });

  // Editar tabela
  $(document).on("click", ".edit-table", function () {
    $("#createTableModal").modal("show");
    $("#modalTitle").text("Editar Tabela");
    editingTable = $(this).closest(".table-box");

    // Preencher dados do formulário com os dados da tabela
    const tableName = $(editingTable).find("h5").text();
    $("#tableName").val(tableName);
    $("#columnsContainer").html("");

    $(editingTable)
      .find(".columns p")
      .each(function () {
        const colData = $(this).text();
        const [name, typeWithKeys] = colData.split(" (");
        const type = typeWithKeys.split(")")[0];
        const primaryKey = typeWithKeys.includes("[PK]");
        const nullable = !typeWithKeys.includes("NOT NULL");
        const foreignKey = typeWithKeys.includes("[FK]");
        let foreignTable = "";
        let foreignColumn = "";

        if (foreignKey) {
          const fkData = typeWithKeys.match(/\[FK: (.*)\.(.*)\]/);
          if (fkData) {
            foreignTable = fkData[1];
            foreignColumn = fkData[2];
          }
        }

        console.log(colData);

        const columnTemplate = `
            <div class="form-group column-container">
              <div class="row align-items-end justify-content-between w-full">
                  <div class="col-3">
                      <label for="column-name">Nome da Coluna:</label>
                      <input type="text" class="form-control mb-2 column-name" value="${name}" required>
                  </div>
                  <div class="col-2">
                      <label for="column-type">Tipo:</label>
                      <select class="form-control mb-2 column-type">
                          <option value="int" ${
                            type === "Int" ? "selected" : ""
                          }>Int</option>
                          <option value="varchar" ${
                            type === "Varchar" ? "selected" : ""
                          }>Varchar</option>
                          <option value="text" ${
                            type === "Text" ? "selected" : ""
                          }>Text</option>
                          <option value="date" ${
                            type === "Date" ? "selected" : ""
                          }>Date</option>
                          <option value="tinyint" ${
                            type === "TinyInt" ? "selected" : ""
                          }>TinyInt</option>
                          <option value="bigint" ${
                            type === "BigInt" ? "selected" : ""
                          }>BigInt</option>
                          <option value="decimal" ${
                            type === "Decimal" ? "selected" : ""
                          }>Decimal</option>
                          <option value="float" ${
                            type === "Float" ? "selected" : ""
                          }>Float</option>
                          <option value="boolean" ${
                            type === "Boolean" ? "selected" : ""
                          }>Boolean</option>
                          <option value="datetime" ${
                            type === "Datetime" ? "selected" : ""
                          }>Datetime</option>
                          <option value="timestamp" ${
                            type === "Timestamp" ? "selected" : ""
                          }>Timestamp</option>
                      </select>
                      <input type="text" class="form-control mb-2 column-size" placeholder="Tamanho (ex: 255, 10,2)">
                  </div>
                  <div class="col-1">
                      <label><input type="checkbox" class="primary-key" ${
                        primaryKey ? "checked" : ""
                      }> Chave Primária</label>
                  </div>
                  <div class="col-1">
                      <label><input type="checkbox" class="nullable" ${
                        nullable ? "checked" : ""
                      }> Nulo</label>
                  </div>
                  <div class="col-1">
                      <label><input type="checkbox" class="foreign-key" ${
                        foreignKey ? "checked" : ""
                      }> Chave Estrangeira</label>
                  </div>
                    <div class="col-2">
                        <div class="foreign-key-options" style="display: ${
                          foreignKey ? "block" : "none"
                        };">
                          <label>Tabela Referenciada:</label>
                          <select class="form-control mb-2 foreign-table">
                              <!-- Tabelas serão preenchidas dinamicamente -->
                          </select>
                          <label>Coluna Referenciada:</label>
                          <select class="form-control mb-2 foreign-column">
                              <!-- Colunas serão preenchidas dinamicamente -->
                          </select>
                        </div>
                    </div>
                  <div class="col-2">
                  <div class="d-flex">
                      <span title="Excluir coluna" class="btn btn-danger delete-column">&times;</span>
                      <div class="move-area">
                          <span title="Mover coluna para cima" class="move-up">&#x25B2;</span>
                      </div>
                      <div class="move-area">
                          <span title="Mover coluna para baixo" class="move-down">&#x25BC;</span>
                      </div>
                      </div>
                  </div>
              </div>
            </div>`;
        $("#columnsContainer").append(columnTemplate);
      });

    updateForeignKeyOptions();
  });

  // Atualizar a lista de relações
  function updateRelationsList() {
    const relations = [];
    $("#tablesContainer .table-box").each(function () {
      const tableName = $(this).find("h5").text();
      $(this)
        .find(".columns p")
        .each(function () {
          const colData = $(this).text();
          if (colData.includes("[FK:")) {
            const fkData = colData.match(/\[FK: (.*)\.(.*)\]/);
            if (fkData) {
              const relation = `${tableName}.${colData.split(" ")[0]} -> ${
                fkData[1]
              }.${fkData[2]}`;
              relations.push(relation);
            }
          }
        });
    });

    $("#relationsList").html("");
    relations.forEach(function (relation) {
      $("#relationsList").append(`<li>${relation}</li>`);
    });
  }
});
