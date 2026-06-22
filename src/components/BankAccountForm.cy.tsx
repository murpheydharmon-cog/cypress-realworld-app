import { MemoryRouter } from "react-router-dom";
import BankAccountForm from "./BankAccountForm";

describe("BankAccountForm", () => {
  const userId = "test-user-id";
  let createBankAccount: ReturnType<typeof cy.stub>;

  beforeEach(() => {
    createBankAccount = cy.stub();
  });

  it("renders the form with empty fields", () => {
    cy.mount(
      <MemoryRouter>
        <BankAccountForm userId={userId} createBankAccount={createBankAccount} />
      </MemoryRouter>
    );
    cy.get("[data-test=bankaccount-form]").should("be.visible");
    cy.get("[data-test=bankaccount-bankName-input]").should("have.value", "");
    cy.get("[data-test=bankaccount-routingNumber-input]").should("have.value", "");
    cy.get("[data-test=bankaccount-accountNumber-input]").should("have.value", "");
    cy.get("[data-test=bankaccount-submit]").should("be.disabled");
  });

  it("validates bank name minimum length", () => {
    cy.mount(
      <MemoryRouter>
        <BankAccountForm userId={userId} createBankAccount={createBankAccount} />
      </MemoryRouter>
    );
    cy.get("#bankaccount-bankName-input").type("ab").blur();
    cy.contains("Must contain at least 5 characters").should("be.visible");
  });

  it("validates routing number length", () => {
    cy.mount(
      <MemoryRouter>
        <BankAccountForm userId={userId} createBankAccount={createBankAccount} />
      </MemoryRouter>
    );
    cy.get("#bankaccount-routingNumber-input").type("12345").blur();
    cy.contains("Must contain a valid routing number").should("be.visible");
  });

  it("validates account number length", () => {
    cy.mount(
      <MemoryRouter>
        <BankAccountForm userId={userId} createBankAccount={createBankAccount} />
      </MemoryRouter>
    );
    cy.get("#bankaccount-accountNumber-input").type("1234").blur();
    cy.contains("Must contain at least 9 digits").should("be.visible");
  });

  it("enables submit when all fields are valid and calls createBankAccount", () => {
    cy.mount(
      <MemoryRouter>
        <BankAccountForm userId={userId} createBankAccount={createBankAccount} />
      </MemoryRouter>
    );
    cy.get("#bankaccount-bankName-input").type("Test Bank Name");
    cy.get("#bankaccount-routingNumber-input").type("123456789");
    cy.get("#bankaccount-accountNumber-input").type("987654321");
    cy.get("[data-test=bankaccount-submit]").should("not.be.disabled").click();
    cy.wrap(createBankAccount).should("have.been.calledOnce");
  });
});
