import { interpret } from "xstate";
import { MemoryRouter } from "react-router-dom";
import NavDrawer from "./NavDrawer";
import { authMachine } from "../machines/authMachine";
import { User, DefaultPrivacyLevel } from "../models";

describe("NavDrawer", () => {
  const testUser: User = {
    id: "test-user",
    uuid: "uuid-test",
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    password: "hashed",
    email: "test@example.com",
    phoneNumber: "555-000-0000",
    balance: 15000,
    avatar: "https://example.com/avatar.png",
    defaultPrivacyLevel: DefaultPrivacyLevel.public,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  let authService: ReturnType<typeof interpret>;

  beforeEach(() => {
    authService = interpret(authMachine);
    authService.start();
    // Manually set the auth context to have a user
    authService.state.context.user = testUser;
  });

  afterEach(() => {
    authService.stop();
  });

  it("renders the sidenav with navigation items when open", () => {
    cy.mount(
      <MemoryRouter>
        <NavDrawer
          closeMobileDrawer={cy.stub()}
          toggleDrawer={cy.stub()}
          drawerOpen={true}
          authService={authService as any}
        />
      </MemoryRouter>
    );
    cy.get("[data-test=sidenav]").should("be.visible");
    cy.get("[data-test=sidenav-home]").should("be.visible");
    cy.get("[data-test=sidenav-user-settings]").should("be.visible");
    cy.get("[data-test=sidenav-bankaccounts]").should("be.visible");
    cy.get("[data-test=sidenav-notifications]").should("be.visible");
    cy.get("[data-test=sidenav-signout]").should("be.visible");
  });

  it("displays user info when drawer is open", () => {
    cy.mount(
      <MemoryRouter>
        <NavDrawer
          closeMobileDrawer={cy.stub()}
          toggleDrawer={cy.stub()}
          drawerOpen={true}
          authService={authService as any}
        />
      </MemoryRouter>
    );
    cy.get("[data-test=sidenav-user-full-name]").should("contain", "Test");
    cy.get("[data-test=sidenav-username]").should("contain", "@testuser");
  });

  it("hides user profile when drawer is closed", () => {
    cy.mount(
      <MemoryRouter>
        <NavDrawer
          closeMobileDrawer={cy.stub()}
          toggleDrawer={cy.stub()}
          drawerOpen={false}
          authService={authService as any}
        />
      </MemoryRouter>
    );
    cy.get("[data-test=sidenav-user-full-name]").should("not.be.visible");
    cy.get("[data-test=sidenav-username]").should("not.be.visible");
  });
});
