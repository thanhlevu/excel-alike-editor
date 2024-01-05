describe('Sheet creation', () => {
  it('should show the sheet creation form after clicking on the add button', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button[data-testid="add-new-sheet-btn"]').should('exist');
    cy.get('form[data-testid="sheet-form"]').should('not.exist');
    cy.get('button[data-testid="add-new-sheet-btn"]').click();
    cy.get('form[data-testid="sheet-form"]').should('exist');
    cy.get('input[data-testid="sheetName"]').should('exist');
    cy.get('input[data-testid="creatorName"]').should('exist');
    cy.get('input[data-testid="creatorName"]').should('exist');
    cy.get('input[data-testid="creatorEmail"]').should('exist');
    cy.get('button[data-testid="cancel-btn"]').should('exist');
  });

  it('should show error messages of input validation and not call sheet creation api', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button[data-testid="add-new-sheet-btn"]').click();
    cy.get('input[data-testid="sheetName"]').type('a');
    cy.get('input[data-testid="creatorName"]').type('b');
    cy.get('input[data-testid="creatorEmail"]').type('c');
    cy.get('p[data-testid="sheetName-error"]').should('not.exist');
    cy.get('p[data-testid="creatorName-error"]').should('not.exist');
    cy.get('p[data-testid="creatorEmail-error"]').should('not.exist');
    cy.get('button[data-testid="save-btn"]').click();
    cy.get('p[data-testid="sheetName-error"]').should('exist');
    cy.get('p[data-testid="creatorName-error"]').should('exist');
    cy.get('p[data-testid="creatorEmail-error"]').should('exist');
  });

  it('should create the new sheet of empty 4x5 table after submission and show on the sheet list ', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button[data-testid="add-new-sheet-btn"]').click();
    cy.get('input[data-testid="sheetName"]').type('The testing sheet');
    cy.get('input[data-testid="creatorName"]').type('The testing creator');
    cy.get('input[data-testid="creatorEmail"]').type('test-email123@gmail.com');
    cy.get('button[data-testid="save-btn"]').should('exist');
    cy.get('button[data-testid="save-btn"]').click();
    cy.get('button[data-testid="sheetInfoView-btn"]').should('exist');
    cy.get('button[data-testid="sheetTableView-btn"]').should('exist');
    cy.get('button[data-testid="delete-btn"]').should('exist');
    cy.get('div[data-testid="sheet-btn-list"]').should(
      'contain',
      'The testing sheet',
    );
    cy.get('button[data-testid="sheetTableView-btn"]').click();
    cy.get('div[data-testid="sheetTableView"]').should('exist');
    cy.get('.handsontable.ht_master').as('hotTable');
    cy.get('@hotTable').find('thead th').should('have.length', 6); // include index col
    cy.get('@hotTable').find('tbody tr').should('have.length', 4);
    cy.get('@hotTable').find('tbody td').should('have.text', '');

    cy.visit('http://localhost:5173/');
    cy.get('div[data-testid="sheet-btn-list"]').should(
      'contain',
      'The testing sheet',
    );
  });
});

describe('Sheet update', () => {
  it('should update the table with html and formulas but not save', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button:contains("The testing sheet")').click();
    cy.get('button[data-testid="sheetTableView-btn"]').click();
    cy.get('.handsontable.ht_master').as('hotTable');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(2)')
      .type('22');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(3)')
      .type('23');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(4)')
      .type('24');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(5)')
      .type('25');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(6)')
      .type('26');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(5)')
      .type('<strong>Total</strong>{enter}');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(6)')
      .type('=sum(A2:E2){enter}');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(5) strong')
      .should('have.text', 'Total');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(6)')
      .should('have.text', '120');
    cy.get('button[data-testid="table-close-btn"]').click();
    cy.get('div[data-testid="sheetTableView"]').should('not.exist');
    cy.get('button:contains("The testing sheet")').click();
    cy.get('button[data-testid="sheetTableView-btn"]').click();
    cy.get('@hotTable').find('tbody td').should('have.text', '');
  });
  it('should update the table with html and formulas, then save', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button:contains("The testing sheet")').click();
    cy.get('button[data-testid="sheetTableView-btn"]').click();
    cy.get('.handsontable.ht_master').as('hotTable');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(2)')
      .type('22');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(3)')
      .type('23');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(4)')
      .type('24');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(5)')
      .type('25');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(6)')
      .type('26');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(5)')
      .type('<strong>Total</strong>{enter}');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(6)')
      .type('=sum(A2:E2){enter}');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(5) strong')
      .should('have.text', 'Total');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(6)')
      .should('have.text', '120');
    cy.get('button[data-testid="table-save-btn"]').click();
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(6)')
      .should('have.text', '120');
    cy.visit('http://localhost:5173/');
    cy.get('button:contains("The testing sheet")').click();
    cy.get('button[data-testid="sheetTableView-btn"]').click();
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(6)')
      .should('have.text', '120');
  });

  it('should update the table by merging cells, then save', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button:contains("The testing sheet")').click();
    cy.get('button[data-testid="sheetTableView-btn"]').click();
    cy.get('.handsontable.ht_master').as('hotTable');
    cy.get('@hotTable').find('tbody tr:nth-child(2) td:nth-child(2)').click();
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(3)')
      .click({ shiftKey: true })
      .rightclick();
    cy.get('td[aria-label="Merge cells"]').click();
    cy.get('@hotTable').find('tbody tr:nth-child(2) td:nth-child(6)').click();

    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(3)')
      .should('have.css', 'display', 'none');
    cy.get('button[data-testid="table-save-btn"]').click();
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(6)')
      .should('have.text', '97');
  });

  it('should update the table by adding new column, then save', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button:contains("The testing sheet")').click();
    cy.get('button[data-testid="sheetTableView-btn"]').click();
    cy.get('.handsontable.ht_master').as('hotTable');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(2)')
      .should('have.text', '22');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(2)')
      .rightclick();
    cy.get('td[aria-label="Insert column left"]').click();
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(2)')
      .should('have.text', '');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(3)')
      .should('have.text', '22');
    cy.get('button[data-testid="table-save-btn"]').click();
    cy.get('@hotTable').find('thead th').should('have.length', 7);
  });

  it('should update the table by removing a column', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button:contains("The testing sheet")').click();
    cy.get('button[data-testid="sheetTableView-btn"]').click();
    cy.get('.handsontable.ht_master').as('hotTable');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(5)')
      .rightclick();
    cy.get('td[aria-label="Remove column"]').click();
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(5)')
      .should('have.text', '25');
    cy.get('button[data-testid="table-save-btn"]').click();
    cy.get('@hotTable').find('thead th').should('have.length', 6);
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(6)')
      .should('have.text', '73');
  });

  it('should update the table by adding a new row', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button:contains("The testing sheet")').click();
    cy.get('button[data-testid="sheetTableView-btn"]').click();
    cy.get('.handsontable.ht_master').as('hotTable');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(2) td:nth-child(5)')
      .rightclick();
    cy.get('td[aria-label="Insert row below"]').click();
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td')
      .should('have.text', '');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(2)')
      .type('32');
    cy.get('button[data-testid="table-save-btn"]').click();
    cy.get('@hotTable').find('tbody tr').should('have.length', 5);
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(2)')
      .should('have.text', '32');
  });

  it('should update the table by removing a row', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button:contains("The testing sheet")').click();
    cy.get('button[data-testid="sheetTableView-btn"]').click();
    cy.get('.handsontable.ht_master').as('hotTable');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(2)')
      .should('have.text', '32');
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(5)')
      .rightclick();
    cy.get('td[aria-label="Remove row"]').click();
    cy.get('@hotTable')
      .find('tbody tr:nth-child(3) td:nth-child(2)')
      .should('have.text', '');
    cy.get('button[data-testid="table-save-btn"]').click();
    cy.get('@hotTable').find('tbody tr').should('have.length', 4);
  });
});

describe('Sheet deletion', () => {
  it('should delete the sheet after clicking on the delete button', () => {
    cy.visit('http://localhost:5173/');
    cy.get('button:contains("The testing sheet")').click();
    cy.get('button[data-testid="delete-btn"]').click();
    cy.get('div[data-testid="sheet-btn-list"]').should(
      'not.contain',
      'The testing sheet',
    );
    cy.visit('http://localhost:5173/');
    cy.get('div[data-testid="sheet-btn-list"]').should(
      'not.contain',
      'The testing sheet',
    );
  });
});
