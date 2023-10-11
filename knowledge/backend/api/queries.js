module.exports = {
    categoryWithChildren: `
    WITH RECURSIVE subcategories (id) AS (
        SELECT id FROM categories WHERE id = ?
        UNION ALL
        SELECT c.id FROM subcategories, categories c
            WHERE "parentId" = subcategories.id
    )
    SELECT id FROM subcategories
    `
}

//A expressão subcategories é usada como uma tabela temporária.
//Seleciona a categoria principal com base no id fornecido.
//Combina o resultado da consulta anterior com o resultado da proxima consulta recursiva.
//Está é a parte recursiva da consulta. Ela seleciona todas as subcategorias cujo 'parentId' corresponde ao ID das categorias que foram selecionadas nas interações anteriores.
//Seleciona todos os ids das subcategorias encontradas durante a recursão.