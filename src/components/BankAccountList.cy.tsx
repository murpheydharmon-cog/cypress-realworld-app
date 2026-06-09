import BankAccountList from "./BankAccountList";
import { BankAccount } from "../models";

describe("BankAccountList", () => {
  const bankAccounts: BankAccount[] = [
    {
      id: "ba-1",
      uuid: "uuid-1",
      userId: "user-1",
      bankName: "First National Bank",
      accountNumber: "1234567890",
      routingNumber: "987654321",
      isDeleted: false,
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
    {
      id: "ba-2",
      uuid: "uuid-2",
      userId: "user-1",
      bankName: "Second Federal Bank",
      accountNumber: "0987654321",
      routingNumber: "123456789",
      isDeleted: true,
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
  ];

  it("renders a list of bank accounts", () => {
    const deleteBankAccount = cy.stub();
    cy.mount(
      <BankAccountList bankAccounts={bankAccounts} deleteBankAccount={deleteBankAccount} />
    );
    cy.get("[data-test=bankaccount-list]").should("be.visible");
    cy.get("[data-test^=bankaccount-list-item]").should("have.length", 2);
    cy.contains("First National Bank").should("be.visible");
    cy.contains("Second Federal Bank").should("be.visible");
  });

  it("shows delete button only for active accounts", () => {
    const deleteBankAccount = cy.stub();
    cy.mount(
      <BankAccountList bankAccounts={bankAccounts} deleteBankAccount={deleteBankAccount} />
    );
    cy.get("[data-test=bankaccount-delete]").should("have.length", 1);
  });

  it("calls deleteBankAccount when delete is clicked", () => {
    const deleteBankAccount = cy.stub();
    cy.mount(
      <BankAccountList bankAccounts={bankAccounts} deleteBankAccount={deleteBankAccount} />
    );
    cy.get("[data-test=bankaccount-delete]").click();
    cy.wrap(deleteBankAccount).should("have.been.calledOnce");
  });

  it("renders empty state when no bank accounts", () => {
    const deleteBankAccount = cy.stub();
    cy.mount(<BankAccountList bankAccounts={[]} deleteBankAccount={deleteBankAccount} />);
    cy.get("[data-test=empty-list-header]").should("contain", "No Bank Accounts");
  });
});
