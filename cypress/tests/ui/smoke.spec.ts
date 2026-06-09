import { User } from "../../../src/models";

describe("Smoke Tests", { tags: ["@smoke"] }, function () {
  beforeEach(function () {
    cy.task("db:seed");

    cy.intercept("POST", "/transactions").as("createTransaction");
    cy.intercept("GET", "/transactions/public*").as("getPublicTransactions");
    cy.intercept("GET", "/notifications*").as("getNotifications");

    cy.database("filter", "users").then((users: User[]) => {
      this.sender = users[0];
      this.receiver = users[1];
    });
  });

  it("login → create transaction → verify in feed", function () {
    cy.loginByXstate(this.sender.username);
    cy.wait("@getPublicTransactions");

    cy.getBySel("nav-top-new-transaction").click();
    cy.wait("@getNotifications");

    cy.getBySelLike("user-list-item").first().click({ force: true });

    cy.get("#amount").type("10");
    cy.get("[data-test=transaction-create-description-input]").type("Smoke test payment");
    cy.get("[data-test=transaction-create-submit-payment]").click();
    cy.wait("@createTransaction");

    cy.getBySel("alert-bar-success")
      .should("be.visible")
      .and("have.text", "Transaction Submitted!");

    cy.getBySel("return-to-transactions").click();
    cy.wait("@getPublicTransactions");

    cy.getBySelLike("transaction-item").first().should("contain", "Smoke test payment");
  });
});
