import UserSettingsForm from "./UserSettingsForm";
import { User, DefaultPrivacyLevel } from "../models";

describe("UserSettingsForm", () => {
  const userProfile: User = {
    id: "user-1",
    uuid: "uuid-1",
    firstName: "Jane",
    lastName: "Doe",
    username: "janedoe",
    password: "hashed",
    email: "jane@example.com",
    phoneNumber: "555-123-4567",
    balance: 10000,
    avatar: "https://example.com/avatar.png",
    defaultPrivacyLevel: DefaultPrivacyLevel.public,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  it("renders the form with user profile data", () => {
    const updateUser = cy.stub();
    cy.mount(<UserSettingsForm userProfile={userProfile} updateUser={updateUser} />);
    cy.get("[data-test=user-settings-form]").should("be.visible");
    cy.get("[data-test=user-settings-firstName-input]").should("have.value", "Jane");
    cy.get("[data-test=user-settings-lastName-input]").should("have.value", "Doe");
    cy.get("[data-test=user-settings-email-input]").should("have.value", "jane@example.com");
    cy.get("[data-test=user-settings-phoneNumber-input]").should("have.value", "555-123-4567");
  });

  it("validates required first name", () => {
    const updateUser = cy.stub();
    cy.mount(<UserSettingsForm userProfile={userProfile} updateUser={updateUser} />);
    cy.get("[data-test=user-settings-firstName-input]").clear().blur();
    cy.contains("Enter a first name").should("be.visible");
  });

  it("validates required last name", () => {
    const updateUser = cy.stub();
    cy.mount(<UserSettingsForm userProfile={userProfile} updateUser={updateUser} />);
    cy.get("[data-test=user-settings-lastName-input]").clear().blur();
    cy.contains("Enter a last name").should("be.visible");
  });

  it("validates email format", () => {
    const updateUser = cy.stub();
    cy.mount(<UserSettingsForm userProfile={userProfile} updateUser={updateUser} />);
    cy.get("[data-test=user-settings-email-input]").clear().type("invalid-email").blur();
    cy.contains("Must contain a valid email address").should("be.visible");
  });

  it("submits updated user data", () => {
    const updateUser = cy.stub();
    cy.mount(<UserSettingsForm userProfile={userProfile} updateUser={updateUser} />);
    cy.get("[data-test=user-settings-firstName-input]").clear().type("Updated");
    cy.get("[data-test=user-settings-submit]").should("not.be.disabled").click();
    cy.wrap(updateUser).should("have.been.calledOnce");
  });
});
