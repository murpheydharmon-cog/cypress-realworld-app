import NotificationList from "./NotificationList";
import { NotificationResponseItem, PaymentNotificationStatus } from "../models";

describe("NotificationList", () => {
  const notifications: NotificationResponseItem[] = [
    {
      id: "notif-1",
      uuid: "uuid-1",
      userId: "user-1",
      transactionId: "tx-1",
      status: PaymentNotificationStatus.received,
      isRead: false,
      createdAt: new Date(),
      modifiedAt: new Date(),
      userFullName: "Jane Doe",
    },
    {
      id: "notif-2",
      uuid: "uuid-2",
      userId: "user-1",
      transactionId: "tx-2",
      likeId: "like-1",
      isRead: false,
      createdAt: new Date(),
      modifiedAt: new Date(),
      userFullName: "John Smith",
    },
  ];

  it("renders a list of notifications", () => {
    const updateNotification = cy.stub();
    cy.mount(
      <NotificationList notifications={notifications} updateNotification={updateNotification} />
    );
    cy.get("[data-test=notifications-list]").should("be.visible");
    cy.get("[data-test^=notification-list-item]").should("have.length", 2);
  });

  it("displays notification text with user names", () => {
    const updateNotification = cy.stub();
    cy.mount(
      <NotificationList notifications={notifications} updateNotification={updateNotification} />
    );
    cy.contains("Jane Doe").should("be.visible");
    cy.contains("John Smith").should("be.visible");
  });

  it("calls updateNotification when dismiss is clicked", () => {
    const updateNotification = cy.stub();
    cy.mount(
      <NotificationList notifications={notifications} updateNotification={updateNotification} />
    );
    cy.get("[data-test^=notification-mark-read]").first().click();
    cy.wrap(updateNotification).should("have.been.calledOnce");
  });

  it("renders empty state when no notifications", () => {
    const updateNotification = cy.stub();
    cy.mount(<NotificationList notifications={[]} updateNotification={updateNotification} />);
    cy.get("[data-test=empty-list-header]").should("contain", "No Notifications");
  });
});
