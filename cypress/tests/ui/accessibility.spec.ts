import { User } from "../../../src/models";

describe("Accessibility", function () {
  beforeEach(function () {
    cy.task("db:seed");

    cy.database("find", "users").then((user: User) => {
      cy.loginByXstate(user.username);
    });
  });

  it("home page has no detectable a11y violations", function () {
    cy.visit("/");
    cy.getBySel("transaction-list").should("be.visible");
    cy.injectAxe();
    cy.checkA11y();
  });

  it("user settings page has no detectable a11y violations", function () {
    cy.visit("/user/settings");
    cy.getBySel("user-settings-form").should("be.visible");
    cy.injectAxe();
    cy.checkA11y();
  });

  it("bank accounts page has no detectable a11y violations", function () {
    cy.visit("/bankaccounts");
    cy.getBySel("bankaccount-list").should("be.visible");
    cy.injectAxe();
    cy.checkA11y();
  });

  it("notifications page has no detectable a11y violations", function () {
    cy.visit("/notifications");
    cy.getBySelLike("notification-list").should("be.visible");
    cy.injectAxe();
    cy.checkA11y();
  });

  it("new transaction page has no detectable a11y violations", function () {
    cy.visit("/transaction/new");
    cy.getBySel("user-list-search-input").should("be.visible");
    cy.injectAxe();
    cy.checkA11y();
  });

  it("signin page has no detectable a11y violations", function () {
    cy.visit("/signin");
    cy.getBySel("signin-submit").should("be.visible");
    cy.injectAxe();
    cy.checkA11y();
  });
});
