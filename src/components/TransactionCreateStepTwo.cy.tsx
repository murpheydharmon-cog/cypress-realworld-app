import TransactionCreateStepTwo from "./TransactionCreateStepTwo";
import { User, DefaultPrivacyLevel } from "../models";

describe("TransactionCreateStepTwo", () => {
  const sender: User = {
    id: "sender-1",
    uuid: "uuid-sender",
    firstName: "Alice",
    lastName: "Smith",
    username: "alice",
    password: "hashed",
    email: "alice@example.com",
    phoneNumber: "555-000-0001",
    balance: 50000,
    avatar: "https://example.com/alice.png",
    defaultPrivacyLevel: DefaultPrivacyLevel.public,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  const receiver: User = {
    id: "receiver-1",
    uuid: "uuid-receiver",
    firstName: "Bob",
    lastName: "Jones",
    username: "bob",
    password: "hashed",
    email: "bob@example.com",
    phoneNumber: "555-000-0002",
    balance: 30000,
    avatar: "https://example.com/bob.png",
    defaultPrivacyLevel: DefaultPrivacyLevel.public,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  it("renders the transaction form with receiver info", () => {
    const createTransaction = cy.stub();
    const showSnackbar = cy.stub();
    cy.mount(
      <TransactionCreateStepTwo
        receiver={receiver}
        sender={sender}
        createTransaction={createTransaction}
        showSnackbar={showSnackbar}
      />
    );
    cy.get("[data-test=transaction-create-form]").should("be.visible");
    cy.contains("Bob Jones").should("be.visible");
  });

  it("disables submit buttons when form is empty", () => {
    const createTransaction = cy.stub();
    const showSnackbar = cy.stub();
    cy.mount(
      <TransactionCreateStepTwo
        receiver={receiver}
        sender={sender}
        createTransaction={createTransaction}
        showSnackbar={showSnackbar}
      />
    );
    cy.get("[data-test=transaction-create-submit-request]").should("be.disabled");
    cy.get("[data-test=transaction-create-submit-payment]").should("be.disabled");
  });

  it("validates amount is required", () => {
    const createTransaction = cy.stub();
    const showSnackbar = cy.stub();
    cy.mount(
      <TransactionCreateStepTwo
        receiver={receiver}
        sender={sender}
        createTransaction={createTransaction}
        showSnackbar={showSnackbar}
      />
    );
    cy.get("[data-test=transaction-create-description-input]").type("Test note").blur();
    cy.get("[data-test=transaction-create-submit-payment]").should("be.disabled");
  });

  it("enables submit and calls createTransaction when payment is clicked", () => {
    const createTransaction = cy.stub();
    const showSnackbar = cy.stub();
    cy.mount(
      <TransactionCreateStepTwo
        receiver={receiver}
        sender={sender}
        createTransaction={createTransaction}
        showSnackbar={showSnackbar}
      />
    );
    cy.get("#amount").type("50");
    cy.get("[data-test=transaction-create-description-input]").type("Test payment");
    cy.get("[data-test=transaction-create-submit-payment]").should("not.be.disabled").click();
    cy.wrap(createTransaction).should("have.been.calledOnce");
    cy.wrap(showSnackbar).should("have.been.calledOnce");
  });

  it("enables submit and calls createTransaction when request is clicked", () => {
    const createTransaction = cy.stub();
    const showSnackbar = cy.stub();
    cy.mount(
      <TransactionCreateStepTwo
        receiver={receiver}
        sender={sender}
        createTransaction={createTransaction}
        showSnackbar={showSnackbar}
      />
    );
    cy.get("#amount").type("25");
    cy.get("[data-test=transaction-create-description-input]").type("Test request");
    cy.get("[data-test=transaction-create-submit-request]").should("not.be.disabled").click();
    cy.wrap(createTransaction).should("have.been.calledOnce");
  });
});
